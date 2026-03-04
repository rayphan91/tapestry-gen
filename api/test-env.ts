// Test endpoint to check if environment variables are loaded
import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const apiKey = process.env.OPENAI_API_KEY;

  return res.status(200).json({
    hasApiKey: !!apiKey,
    keyLength: apiKey?.length || 0,
    firstChars: apiKey ? apiKey.substring(0, 7) : 'none',
    allEnvKeys: Object.keys(process.env).filter(k => k.includes('OPENAI'))
  });
}
