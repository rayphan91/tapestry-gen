// DALL-E Image Generation Service
import type { RegionId } from '@/types';

export type MasterPromptTheme = 'nature' | 'cities' | 'textures' | 'culture' | 'mixed';

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
  nature: 'natural landscapes, mountains, forests, beaches, wildlife, scenic views',
  cities: 'urban architecture, city skylines, modern buildings, streets, metropolitan areas',
  textures: 'patterns, textures, surfaces, materials, abstract details, close-ups',
  culture: 'cultural landmarks, monuments, traditional architecture, iconic symbols, heritage sites',
  mixed: 'diverse mix of landscapes, architecture, culture, and urban scenes',
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

export async function generateImagesWithDALLE(
  options: GenerateImageOptions
): Promise<GeneratedImage[]> {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;

  if (!apiKey || apiKey === 'your_new_api_key_here') {
    throw new Error('OpenAI API key not configured. Please add VITE_OPENAI_API_KEY to your .env.local file');
  }

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

  let prompt = '';
  if (country) {
    prompt = `A photorealistic image focusing on ${themeModifier} from ${country}, professional photography, high quality, vibrant colors`;
  } else {
    prompt = `A photorealistic image focusing on ${themeModifier} representing ${regionContext}, professional photography, high quality, vibrant colors`;
  }

  const results: GeneratedImage[] = [];

  try {
    // Generate images (DALL-E 3 only supports n=1, so we need multiple requests for multiple images)
    for (let i = 0; i < count; i++) {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
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
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Failed to generate image');
      }

      const data = await response.json();

      if (data.data && data.data[0]) {
        results.push({
          id: `dalle-${Date.now()}-${i}`,
          url: data.data[0].url,
          name: country ? `${country}-${i + 1}` : `${region}-${i + 1}`,
        });
      }
    }

    return results;
  } catch (error) {
    console.error('DALL-E generation error:', error);
    throw error;
  }
}

export function getCountryNameFromFlag(flagEmoji: string): string {
  const countryMap: Record<string, string> = {
    '🇬🇧 UK': 'United Kingdom',
    '🇺🇸 USA': 'United States',
    '🇦🇺 AUS': 'Australia',
    '🇯🇵 JP': 'Japan',
    '🇧🇷 BR': 'Brazil',
    '🇮🇳 IN': 'India',
    '🇿🇦 ZA': 'South Africa',
    '🇩🇪 DE': 'Germany',
    '🇨🇳 CN': 'China',
    '🇳🇿 NZ': 'New Zealand',
    '🇵🇰 PK': 'Pakistan',
    '🇧🇩 BD': 'Bangladesh',
    '🇱🇰 LK': 'Sri Lanka',
    '🇳🇵 NP': 'Nepal',
    '🇫🇯 FJ': 'Fiji',
    '🇵🇬 PG': 'Papua New Guinea',
    '🇨🇦 CA': 'Canada',
    '🇰🇷 KR': 'South Korea',
    '🇹🇼 TW': 'Taiwan',
    '🇭🇰 HK': 'Hong Kong',
    '🇲🇴 MO': 'Macau',
    '🇲🇳 MN': 'Mongolia',
    '🇫🇷 FR': 'France',
    '🇹🇭 TH': 'Thailand',
    '🇻🇳 VN': 'Vietnam',
    '🇸🇬 SG': 'Singapore',
    '🇲🇾 MY': 'Malaysia',
    '🇵🇭 PH': 'Philippines',
    '🇮🇩 ID': 'Indonesia',
    '🇸🇪 SE': 'Sweden',
    '🇳🇴 NO': 'Norway',
    '🇫🇮 FI': 'Finland',
    '🇳🇬 NG': 'Nigeria',
    '🇬🇭 GH': 'Ghana',
    '🇸🇳 SN': 'Senegal',
    '🇨🇮 CI': 'Ivory Coast',
    '🇲🇱 ML': 'Mali',
    '🇧🇯 BJ': 'Benin',
    '🇲🇽 MX': 'Mexico',
    '🇦🇷 AR': 'Argentina',
    '🇨🇱 CL': 'Chile',
    '🇨🇴 CO': 'Colombia',
    '🇵🇪 PE': 'Peru',
    '🇻🇪 VE': 'Venezuela',
    '🇬🇹 GT': 'Guatemala',
    '🇪🇬 EG': 'Egypt',
    '🇲🇦 MA': 'Morocco',
    '🇹🇳 TN': 'Tunisia',
    '🇪🇸 ES': 'Spain',
    '🇮🇹 IT': 'Italy',
    '🇵🇹 PT': 'Portugal',
    '🇬🇷 GR': 'Greece',
    '🇳🇱 NL': 'Netherlands',
    '🇧🇪 BE': 'Belgium',
    '🇨🇭 CH': 'Switzerland',
    '🇦🇹 AT': 'Austria',
    '🇦🇪 UAE': 'United Arab Emirates',
    '🇸🇦 SA': 'Saudi Arabia',
    '🇶🇦 QA': 'Qatar',
    '🇮🇱 IL': 'Israel',
    '🇯🇴 JO': 'Jordan',
    '🇰🇼 KW': 'Kuwait',
    '🇴🇲 OM': 'Oman',
  };

  return countryMap[flagEmoji] || flagEmoji.split(' ')[1] || 'Unknown';
}
