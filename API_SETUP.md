# API Setup Guide

This app uses DALL-E 3 for AI image generation. You have two options:

## Option 1: Shared API (Default - Recommended for Users)

Users can use the app without providing their own API key. The serverless function at `/api/generate-image` handles requests using your server-side API key.

**Rate Limits:**
- 10 requests per minute per IP address
- Prevents abuse and controls costs

**Setup:**
1. Create a `.env` file in the project root:
   ```bash
   cp .env.example .env
   ```

2. Add your OpenAI API key to `.env`:
   ```
   OPENAI_API_KEY=sk-your-actual-api-key-here
   ```

3. In Vercel, add the environment variable:
   - Go to your project settings
   - Navigate to "Environment Variables"
   - Add `OPENAI_API_KEY` with your key
   - Deploy or redeploy your app

**Cost Control:**
- Monitor usage at https://platform.openai.com/usage
- DALL-E 3 costs ~$0.04 per image (1024x1024)
- Consider setting usage limits in OpenAI dashboard

## Option 2: User-Provided API Key

Advanced users can provide their own OpenAI API key in the app UI:

1. Get an API key from https://platform.openai.com/api-keys
2. Paste it into the "OpenAI API Key" field in the Collage Generator
3. The app will use their key directly (client-side)

**Benefits:**
- Users pay for their own usage
- No rate limiting (beyond OpenAI's limits)
- You don't pay for their image generation

**Drawbacks:**
- Requires users to have OpenAI account
- Less convenient for casual users

## Security Notes

- Never commit `.env` file to git (it's in `.gitignore`)
- The serverless function keeps your API key secure on the server
- User-provided keys are only stored in browser memory (not persisted)
- Rate limiting prevents abuse of the shared API

## Monitoring Usage

Check your OpenAI usage regularly:
1. Visit https://platform.openai.com/usage
2. Set up usage alerts
3. Consider setting monthly spending limits

## Troubleshooting

**"Server configuration error"**
- Environment variable not set in Vercel
- Deploy after adding the environment variable

**"Too many requests"**
- User hit rate limit (10/minute)
- Wait 60 seconds or use personal API key

**"Failed to generate image"**
- Check OpenAI API status: https://status.openai.com
- Verify API key has sufficient credits
- Check Vercel function logs for details
