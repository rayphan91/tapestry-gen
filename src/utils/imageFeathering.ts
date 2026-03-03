/**
 * Canvas-based image feathering utility
 * Creates a feathered edge effect on images using canvas gradients
 */

export function createFeatheredImage(
  imageElement: HTMLImageElement,
  width: number,
  height: number,
  featherAmount: number
): string {
  if (featherAmount === 0) {
    return imageElement.src;
  }

  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return imageElement.src;
  }

  // Draw the image
  ctx.drawImage(imageElement, 0, 0, width, height);

  // Create gradient mask for feathering
  const imageData = ctx.getImageData(0, 0, width, height);
  const data = imageData.data;

  const featherPixels = Math.min(featherAmount, Math.min(width, height) / 2);

  // Apply feathering to alpha channel
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (y * width + x) * 4;

      // Calculate distance from edge
      const distFromLeft = x;
      const distFromRight = width - x - 1;
      const distFromTop = y;
      const distFromBottom = height - y - 1;

      const minDist = Math.min(
        distFromLeft,
        distFromRight,
        distFromTop,
        distFromBottom
      );

      // Apply feathering gradient
      if (minDist < featherPixels) {
        const alphaMultiplier = minDist / featherPixels;
        data[idx + 3] *= alphaMultiplier; // Modify alpha channel
      }
    }
  }

  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
}

/**
 * Creates a cached feathered image
 */
export class FeatherCache {
  private cache = new Map<string, string>();

  getCachedOrCreate(
    imageElement: HTMLImageElement,
    width: number,
    height: number,
    featherAmount: number,
    imageUrl: string
  ): string {
    const key = `${imageUrl}-${width}-${height}-${featherAmount}`;

    if (this.cache.has(key)) {
      return this.cache.get(key)!;
    }

    const featheredUrl = createFeatheredImage(imageElement, width, height, featherAmount);
    this.cache.set(key, featheredUrl);

    return featheredUrl;
  }

  clear() {
    this.cache.clear();
  }
}
