// Image Generation Service using Serverless API Proxy
import type { RegionId } from '@/types';
import type { MasterPromptTheme } from './imageGeneration';

interface GenerateImageOptions {
  region: RegionId;
  country?: string;
  count?: number;
  theme?: MasterPromptTheme;
  size?: '256x256' | '512x512' | '1024x1024' | '1792x1024' | '1024x1792';
}

interface GeneratedImage {
  id: string;
  url: string;
  name: string;
}

const THEME_MODIFIERS: Record<MasterPromptTheme, string> = {
  nature: 'natural landscape, mountain, forest, or scenic view',
  cities: 'city skyline, urban street, or modern architecture',
  textures: 'architectural detail, surface pattern, or material texture',
  culture: 'landmark, monument, or recognizable cultural site',
  mixed: 'landscape, cityscape, or architectural view',
};

const REGION_PROMPTS: Record<RegionId, string> = {
  australasia_sasia: 'Australia, New Zealand, India, Pakistan, Bangladesh, and South Asia',
  namerica_easia_pink: 'North America (USA, Canada) and East Asia (Japan, South Korea, China)',
  europe_seasia: 'Europe (UK, France, Germany) and Southeast Asia (Thailand, Vietnam, Singapore)',
  neurope_wafrica: 'Northern Europe (Sweden, Norway, Finland) and West Africa (Nigeria, Ghana)',
  namerica_samerica: 'North America (USA, Canada, Mexico) and South America (Brazil, Argentina, Chile)',
  namerica_easia_green: 'North America and East Asia',
  nafrica_europe: 'North Africa (Egypt, Morocco, Tunisia) and Mediterranean Europe',
  csamerica_europe: 'Central/South America (Mexico, Brazil) and Europe',
  middleeast_australasia: 'Middle East (UAE, Saudi Arabia, Qatar) and Australasia',
  europe_uk: 'Europe and the United Kingdom',
  custom: 'diverse locations from around the world',
};

export async function generateImagesWithProxy(
  options: GenerateImageOptions
): Promise<GeneratedImage[]> {
  const {
    region,
    country,
    count = 3,
    theme = 'mixed',
    size = '1024x1024',
  } = options;

  // Create prompt based on theme, region, and optional country
  const themeModifier = THEME_MODIFIERS[theme];
  const regionContext = REGION_PROMPTS[region] || REGION_PROMPTS.custom;

  // Randomly add special effects (30% chance for holographic, 30% for money texture, 40% none)
  const effectRoll = Math.random();
  let specialEffect = '';
  if (effectRoll < 0.3) {
    specialEffect = ', with subtle holographic iridescent overlay';
  } else if (effectRoll < 0.6) {
    specialEffect = ', with delicate money texture pattern overlay';
  }

  let prompt = '';
  if (country) {
    prompt = `Professional photograph of ${themeModifier} in ${country}, photorealistic, natural lighting, sharp focus, high resolution${specialEffect}`;
  } else {
    prompt = `Professional photograph of ${themeModifier} from ${regionContext}, photorealistic, natural lighting, sharp focus, high resolution${specialEffect}`;
  }

  const results: GeneratedImage[] = [];

  try {
    console.log('Starting image generation via serverless API');
    console.log('Count:', count, 'Theme:', theme, 'Region:', region);

    // Generate images via serverless function
    for (let i = 0; i < count; i++) {
      console.log(`Generating image ${i + 1} of ${count}...`);

      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt: prompt,
          size: size,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      console.log('API Response received');

      if (data.success && data.image) {
        // Convert base64 to data URL
        const dataUrl = `data:image/png;base64,${data.image}`;

        results.push({
          id: `generated-${Date.now()}-${i}`,
          url: dataUrl,
          name: country ? `${country}-${i + 1}` : `${region}-${i + 1}`,
        });
      } else {
        throw new Error('Invalid response from server');
      }
    }

    return results;
  } catch (error) {
    console.error('Image generation error:', error);
    throw error;
  }
}
