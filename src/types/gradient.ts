// Regional Gradient Types - Procedural Duotone Noise

export type RegionId =
  | 'australasia_sasia'
  | 'namerica_easia_pink'
  | 'europe_seasia'
  | 'neurope_wafrica'
  | 'namerica_samerica'
  | 'namerica_easia_green'
  | 'nafrica_europe'
  | 'csamerica_europe'
  | 'middleeast_australasia'
  | 'europe_uk'
  | 'custom';

export interface NoiseParams {
  scale: number;        // Noise scale/zoom
  speed: number;        // Animation speed (for animate mode)
  octaves: number;      // Number of noise layers
  lacunarity: number;   // Frequency multiplier per octave
  gain: number;         // Amplitude multiplier per octave
  contrast: number;     // Contrast curve strength (higher = less blending)
  grainIntensity: number; // Film grain overlay intensity (0-1)
  seed?: number;        // Random seed for reproducibility
}

export interface DuotoneColors {
  colorA: string;       // Dark/shadow color
  colorB: string;       // Light/highlight color
}

export interface SwooshColors {
  primary: string;      // Primary swoosh stroke color
  secondary: string;    // Secondary swoosh stroke color
}

export interface RegionalGradient {
  id: RegionId;
  name: string;
  displayName: string;
  duotone: DuotoneColors;        // For background noise
  swoosh: SwooshColors;          // For procedural swoosh strokes
  noiseParams: NoiseParams;
  noiseParamsB?: NoiseParams;    // Optional separate params for second color
  description?: string;
  thumbnail?: string;            // Path to thumbnail image
  countries?: string[];          // List of countries in this region for AI generation
}

export const DEFAULT_NOISE_PARAMS: NoiseParams = {
  scale: 1.0,
  speed: 0.0,
  octaves: 2,
  lacunarity: 2.0,
  gain: 0.5,
  contrast: 8.0,
  grainIntensity: 0,
};

// Regional gradients matching the reference tapestries
export const REGIONAL_GRADIENTS: RegionalGradient[] = [
  {
    id: 'australasia_sasia',
    name: 'australasia_sasia',
    displayName: 'Australasia & South Asia',
    duotone: {
      colorA: '#00bcd4',  // Aqua
      colorB: '#9c27b0',  // Purple
    },
    swoosh: {
      primary: '#00bcd4',
      secondary: '#9c27b0',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.2, octaves: 3 },
    description: 'Australasia & South Asia - Aqua & Purple',
    thumbnail: '/gradients/australasia_sasia.png',
    countries: ['Australia', 'New Zealand', 'India', 'Pakistan', 'Bangladesh', 'Sri Lanka', 'Nepal', 'Fiji', 'Papua New Guinea'],
  },
  {
    id: 'namerica_easia_pink',
    name: 'namerica_easia_pink',
    displayName: 'North America & East Asia',
    duotone: {
      colorA: '#ff6090',  // Pink
      colorB: '#ff9800',  // Orange
    },
    swoosh: {
      primary: '#ff6090',
      secondary: '#ff9800',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.3, octaves: 2 },
    description: 'North America & East Asia - Pink & Orange',
    thumbnail: '/gradients/namerica_easia_pink.png',
    countries: ['United States', 'Canada', 'Japan', 'South Korea', 'China', 'Taiwan', 'Hong Kong', 'Mongolia'],
  },
  {
    id: 'europe_seasia',
    name: 'europe_seasia',
    displayName: 'Europe & Southeast Asia',
    duotone: {
      colorA: '#2196f3',  // Blue
      colorB: '#ffd600',  // Yellow
    },
    swoosh: {
      primary: '#2196f3',
      secondary: '#ffd600',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.5, octaves: 2 },
    description: 'Europe & Southeast Asia - Blue & Yellow',
    thumbnail: '/gradients/europe_seasia.png',
    countries: ['United Kingdom', 'France', 'Germany', 'Thailand', 'Vietnam', 'Singapore', 'Malaysia', 'Philippines', 'Indonesia'],
  },
  {
    id: 'neurope_wafrica',
    name: 'neurope_wafrica',
    displayName: 'Northern Europe & West Africa',
    duotone: {
      colorA: '#1b5e20',  // Dark Green
      colorB: '#4caf50',  // Green
    },
    swoosh: {
      primary: '#1b5e20',
      secondary: '#4caf50',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.2, octaves: 2 },
    description: 'Northern Europe & West Africa - Dark Green',
    thumbnail: '/gradients/neurope_wafrica.png',
    countries: ['Sweden', 'Norway', 'Finland', 'Denmark', 'Nigeria', 'Ghana', 'Senegal', 'Ivory Coast', 'Mali'],
  },
  {
    id: 'namerica_samerica',
    name: 'namerica_samerica',
    displayName: 'North & South America',
    duotone: {
      colorA: '#f44336',  // Red
      colorB: '#2196f3',  // Blue
    },
    swoosh: {
      primary: '#f44336',
      secondary: '#2196f3',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.3, octaves: 2 },
    description: 'North & South America - Red & Blue',
    thumbnail: '/gradients/namerica_samerica.png',
    countries: ['United States', 'Canada', 'Mexico', 'Brazil', 'Argentina', 'Chile', 'Colombia', 'Peru', 'Venezuela'],
  },
  {
    id: 'namerica_easia_green',
    name: 'namerica_easia_green',
    displayName: 'North America & East Asia',
    duotone: {
      colorA: '#4caf50',  // Green
      colorB: '#2196f3',  // Blue
    },
    swoosh: {
      primary: '#4caf50',
      secondary: '#2196f3',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.4, octaves: 2 },
    description: 'North America & East Asia - Green, Blue & Yellow',
    thumbnail: '/gradients/namerica_easia_green.png',
    countries: ['United States', 'Canada', 'Japan', 'South Korea', 'China'],
  },
  {
    id: 'nafrica_europe',
    name: 'nafrica_europe',
    displayName: 'North Africa & Europe',
    duotone: {
      colorA: '#66bb6a',  // Green
      colorB: '#ffa726',  // Orange
    },
    swoosh: {
      primary: '#66bb6a',
      secondary: '#ffa726',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.1, octaves: 2 },
    description: 'North Africa & Europe - Green, Yellow & Orange',
    thumbnail: '/gradients/nafrica_europe.png',
    countries: ['Egypt', 'Morocco', 'Tunisia', 'Algeria', 'Spain', 'Italy', 'Portugal', 'Greece'],
  },
  {
    id: 'csamerica_europe',
    name: 'csamerica_europe',
    displayName: 'Central & South America + Europe',
    duotone: {
      colorA: '#ff6090',  // Pink
      colorB: '#ffd600',  // Yellow
    },
    swoosh: {
      primary: '#ff6090',
      secondary: '#ffd600',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.0, octaves: 2 },
    description: 'Central & South America + Europe - Pink & Yellow',
    thumbnail: '/gradients/csamerica_europe.png',
    countries: ['Mexico', 'Brazil', 'Argentina', 'Colombia', 'Spain', 'France', 'Germany', 'Netherlands', 'Belgium'],
  },
  {
    id: 'middleeast_australasia',
    name: 'middleeast_australasia',
    displayName: 'Middle East & Australasia',
    duotone: {
      colorA: '#e91e63',  // Pink
      colorB: '#2196f3',  // Blue
    },
    swoosh: {
      primary: '#e91e63',
      secondary: '#2196f3',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.2, octaves: 2 },
    description: 'Middle East & Australasia - Pink & Blue',
    thumbnail: '/gradients/middleeast_australasia.png',
    countries: ['United Arab Emirates', 'Saudi Arabia', 'Qatar', 'Israel', 'Jordan', 'Australia', 'New Zealand'],
  },
  {
    id: 'europe_uk',
    name: 'europe_uk',
    displayName: 'Europe & UK',
    duotone: {
      colorA: '#ff6b1a',  // Orange
      colorB: '#0088ff',  // Blue
    },
    swoosh: {
      primary: '#ff6b1a',
      secondary: '#0088ff',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.5, octaves: 4, gain: 0.6 },
    description: 'Europe & UK - Orange & Blue',
    thumbnail: '/gradients/europe_uk.png',
    countries: ['United Kingdom', 'France', 'Germany', 'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria'],
  },
  {
    id: 'custom',
    name: 'custom',
    displayName: 'Custom',
    duotone: {
      colorA: '#163300',
      colorB: '#9fe870',
    },
    swoosh: {
      primary: '#9fe870',
      secondary: '#00d2d3',
    },
    noiseParams: { ...DEFAULT_NOISE_PARAMS, scale: 1.0, octaves: 2 },
    description: 'Custom',
    thumbnail: '/gradients/custom.png',
  },
];
