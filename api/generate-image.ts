// Vercel Serverless Function for DALL-E Image Generation
import type { VercelRequest, VercelResponse } from '@vercel/node';

// Rate limiting configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 10; // 10 requests per minute per IP
const requestCounts = new Map<string, { count: number; resetTime: number }>();

// Simple rate limiter
function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = requestCounts.get(ip);

  if (!record || now > record.resetTime) {
    requestCounts.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count++;
  return true;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0] ||
             (req.headers['x-real-ip'] as string) ||
             'unknown';

  // Check rate limit
  if (!checkRateLimit(ip)) {
    return res.status(429).json({
      error: 'Too many requests. Please try again later.'
    });
  }

  try {
    const { prompt, size = '1024x1024' } = req.body;

    if (!prompt) {
      return res.status(400).json({ error: 'Prompt is required' });
    }

    // Get API key from environment variable
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      console.error('OPENAI_API_KEY not configured');
      return res.status(500).json({ error: 'Server configuration error' });
    }

    // Call OpenAI DALL-E API with retry logic for server errors
    let response;
    let attempts = 0;
    const maxAttempts = 3;

    while (attempts < maxAttempts) {
      attempts++;

      response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-3',
          prompt: prompt,
          n: 1,
          size: size,
          quality: 'standard',
          style: 'vivid',
          response_format: 'b64_json',
        }),
      });

      // If successful, break out of retry loop
      if (response.ok) {
        break;
      }

      // Check if it's a server error (5xx) that we should retry
      if (response.status >= 500 && attempts < maxAttempts) {
        console.log(`OpenAI server error (attempt ${attempts}/${maxAttempts}), retrying...`);
        // Wait 2 seconds before retrying
        await new Promise(resolve => setTimeout(resolve, 2000));
        continue;
      }

      // For non-retryable errors, break out
      break;
    }

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API Error:', errorText);
      console.error('Status:', response.status);
      console.error('Prompt used:', prompt);
      console.error('Attempts made:', attempts);

      // Parse error for better user feedback
      let errorMessage = 'Failed to generate image';
      try {
        const error = JSON.parse(errorText);
        errorMessage = error.error?.message || errorMessage;
        console.error('Parsed error:', error);
      } catch {
        errorMessage = errorText || errorMessage;
      }

      return res.status(response.status).json({ error: errorMessage });
    }

    const data = await response.json();

    // Return the base64 image
    if (data.data && data.data[0]) {
      return res.status(200).json({
        success: true,
        image: data.data[0].b64_json,
      });
    }

    return res.status(500).json({ error: 'No image data returned' });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      error: 'Internal server error',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
}
