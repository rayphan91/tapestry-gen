// Procedural Noise Generator for Duotone Gradients
// Based on Perlin/Simplex noise for organic, flowing patterns

import type { NoiseParams, DuotoneColors } from '@/types';

/**
 * Simple Perlin-like noise implementation
 * Based on improved noise by Ken Perlin
 */
class PerlinNoise {
  private permutation: number[];
  private p: number[];

  constructor(seed: number = Math.random()) {
    // Initialize permutation table
    this.permutation = [];
    for (let i = 0; i < 256; i++) {
      this.permutation[i] = i;
    }

    // Shuffle based on seed
    this.shuffle(this.permutation, seed);

    // Duplicate permutation to avoid overflow
    this.p = new Array(512);
    for (let i = 0; i < 512; i++) {
      this.p[i] = this.permutation[i % 256];
    }
  }

  private shuffle(array: number[], seed: number): void {
    // Seeded shuffle using a simple LCG (Linear Congruential Generator)
    let currentSeed = seed * 0x2545f4914f6cdd1d;
    for (let i = array.length - 1; i > 0; i--) {
      currentSeed = (currentSeed * 16807) % 2147483647;
      const j = Math.floor((currentSeed / 2147483647) * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  private fade(t: number): number {
    return t * t * t * (t * (t * 6 - 15) + 10);
  }

  private lerp(t: number, a: number, b: number): number {
    return a + t * (b - a);
  }

  private grad(hash: number, x: number, y: number): number {
    const h = hash & 7;
    const u = h < 4 ? x : y;
    const v = h < 4 ? y : x;
    return ((h & 1) === 0 ? u : -u) + ((h & 2) === 0 ? v : -v);
  }

  noise2D(x: number, y: number): number {
    // Find unit square containing point
    const X = Math.floor(x) & 255;
    const Y = Math.floor(y) & 255;

    // Find relative position in square
    x -= Math.floor(x);
    y -= Math.floor(y);

    // Compute fade curves
    const u = this.fade(x);
    const v = this.fade(y);

    // Hash coordinates
    const a = this.p[X] + Y;
    const aa = this.p[a];
    const ab = this.p[a + 1];
    const b = this.p[X + 1] + Y;
    const ba = this.p[b];
    const bb = this.p[b + 1];

    // Blend results
    return this.lerp(
      v,
      this.lerp(u, this.grad(this.p[aa], x, y), this.grad(this.p[ba], x - 1, y)),
      this.lerp(
        u,
        this.grad(this.p[ab], x, y - 1),
        this.grad(this.p[bb], x - 1, y - 1)
      )
    );
  }
}

/**
 * Fractional Brownian Motion (fBm) - layered noise for more organic results
 */
export function fbm(
  x: number,
  y: number,
  noise: PerlinNoise,
  octaves: number,
  lacunarity: number,
  gain: number
): number {
  let amplitude = 1.0;
  let frequency = 1.0;
  let value = 0.0;
  let maxValue = 0.0;

  for (let i = 0; i < octaves; i++) {
    value += amplitude * noise.noise2D(x * frequency, y * frequency);
    maxValue += amplitude;
    amplitude *= gain;
    frequency *= lacunarity;
  }

  return value / maxValue;
}

/**
 * Parse hex color to RGB
 */
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Lerp between two RGB colors
 */
function lerpColor(
  colorA: { r: number; g: number; b: number },
  colorB: { r: number; g: number; b: number },
  t: number
): { r: number; g: number; b: number } {
  return {
    r: Math.round(colorA.r + (colorB.r - colorA.r) * t),
    g: Math.round(colorA.g + (colorB.g - colorA.g) * t),
    b: Math.round(colorA.b + (colorB.b - colorA.b) * t),
  };
}

/**
 * Generate duotone noise gradient
 */
export function generateDuotoneNoise(
  width: number,
  height: number,
  duotone: DuotoneColors,
  noiseParams: NoiseParams,
  time: number = 0
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const noise = new PerlinNoise(noiseParams.seed ?? Math.random());
  const colorA = hexToRgb(duotone.colorA);
  const colorB = hexToRgb(duotone.colorB);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * noiseParams.scale;
      const ny = (y / height) * noiseParams.scale;
      const nt = time * noiseParams.speed;

      // Generate noise value with fBm
      let noiseValue = fbm(
        nx + nt,
        ny + nt,
        noise,
        noiseParams.octaves,
        noiseParams.lacunarity,
        noiseParams.gain
      );

      // Normalize to 0-1
      noiseValue = (noiseValue + 1) * 0.5;

      // Apply contrast curve to control color blending
      // Higher contrast = less blending, more pure colors
      const contrast = noiseParams.contrast || 8.0;
      noiseValue = noiseValue < 0.5
        ? Math.pow(noiseValue * 2, contrast) / 2
        : 1 - Math.pow((1 - noiseValue) * 2, contrast) / 2;

      // Apply duotone mapping
      const color = lerpColor(colorA, colorB, noiseValue);

      const i = (y * width + x) * 4;
      data[i] = color.r;
      data[i + 1] = color.g;
      data[i + 2] = color.b;
      data[i + 3] = 255;
    }
  }

  return imageData;
}

/**
 * Generate single-color noise with alpha based on noise value
 * Black = transparent, White = opaque color
 */
export function generateColorNoiseLayer(
  width: number,
  height: number,
  color: string,
  noiseParams: NoiseParams,
  time: number = 0,
  invert: boolean = false
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const noise = new PerlinNoise(noiseParams.seed ?? Math.random());
  const rgb = hexToRgb(color);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * noiseParams.scale;
      const ny = (y / height) * noiseParams.scale;
      const nt = time * noiseParams.speed;

      // Generate noise value with fBm
      let noiseValue = fbm(
        nx + nt,
        ny + nt,
        noise,
        noiseParams.octaves,
        noiseParams.lacunarity,
        noiseParams.gain
      );

      // Normalize to 0-1
      noiseValue = (noiseValue + 1) * 0.5;

      // Invert if needed (for the second color)
      if (invert) {
        noiseValue = 1 - noiseValue;
      }

      // Apply very strong contrast to push towards pure colors
      const contrast = 5.0; // Much higher contrast
      noiseValue = noiseValue < 0.5
        ? Math.pow(noiseValue * 2, contrast) / 2
        : 1 - Math.pow((1 - noiseValue) * 2, contrast) / 2;

      const i = (y * width + x) * 4;
      data[i] = rgb.r;
      data[i + 1] = rgb.g;
      data[i + 2] = rgb.b;
      data[i + 3] = Math.round(noiseValue * 255); // Use noise as alpha
    }
  }

  return imageData;
}

/**
 * Generate brush/paper texture overlay
 * High-frequency noise for painted/textured look
 */
export function generateBrushTexture(
  width: number,
  height: number,
  intensity: number = 0.15,
  seed: number = Math.random()
): ImageData {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  const imageData = ctx.createImageData(width, height);
  const data = imageData.data;

  const noise = new PerlinNoise(seed);

  // Use high frequency for fine grain
  const scale = 20;
  const octaves = 3;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const nx = (x / width) * scale;
      const ny = (y / height) * scale;

      let noiseValue = fbm(nx, ny, noise, octaves, 2.0, 0.5);
      noiseValue = (noiseValue + 1) * 0.5; // Normalize to 0-1

      // Subtle variation - centered around mid-gray
      const value = 128 + (noiseValue - 0.5) * 255 * intensity;

      const i = (y * width + x) * 4;
      data[i] = value;     // R
      data[i + 1] = value; // G
      data[i + 2] = value; // B
      data[i + 3] = 255;   // Full opacity
    }
  }

  return imageData;
}

/**
 * Convert ImageData to Data URL
 */
export function imageDataToDataUrl(imageData: ImageData): string {
  const canvas = document.createElement('canvas');
  canvas.width = imageData.width;
  canvas.height = imageData.height;
  const ctx = canvas.getContext('2d')!;
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL();
}

/**
 * Generate duotone noise and return as Data URL
 */
export function generateDuotoneNoiseDataUrl(
  width: number,
  height: number,
  duotone: DuotoneColors,
  noiseParams: NoiseParams,
  time: number = 0
): string {
  const imageData = generateDuotoneNoise(width, height, duotone, noiseParams, time);
  return imageDataToDataUrl(imageData);
}
