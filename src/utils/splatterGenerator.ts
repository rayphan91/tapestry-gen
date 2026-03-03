/**
 * Procedural splatter effect - single color, densely clustered, edge-hugging
 */

export interface SplatterParams {
  width: number;
  height: number;
  intensity: number; // 0-1
  scale: number; // 0-1
  seed: number;
  color: string;
  color2?: string;
  color3?: string;
}

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

export function generateSplatterSVG(params: SplatterParams): string {
  const { width, height, intensity, scale, seed, color } = params;
  const intSeed = Math.floor(seed * 1000000);
  const rng = new SeededRandom(intSeed);

  // Build SVG
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svgContent += `<defs>`;

  // Simple blur filter only
  svgContent += `
    <filter id="splat-blur-${intSeed}">
      <feGaussianBlur stdDeviation="1.2" />
    </filter>
  `;

  svgContent += `</defs>`;

  // Create cluster centers - positioned to hug edges more
  const clusterCount = Math.floor(3 + intensity * 5);
  const clusters: Array<{x: number; y: number; density: number; radius: number}> = [];

  for (let i = 0; i < clusterCount; i++) {
    // Bias towards edges - use power curve to push positions toward boundaries
    let x: number, y: number;

    // 70% chance to place on or near an edge
    if (rng.next() < 0.7) {
      const edge = Math.floor(rng.next() * 4); // 0=top, 1=right, 2=bottom, 3=left

      switch(edge) {
        case 0: // Top edge
          x = rng.range(width * 0.05, width * 0.95);
          y = rng.range(0, height * 0.25);
          break;
        case 1: // Right edge
          x = rng.range(width * 0.75, width);
          y = rng.range(height * 0.05, height * 0.95);
          break;
        case 2: // Bottom edge
          x = rng.range(width * 0.05, width * 0.95);
          y = rng.range(height * 0.75, height);
          break;
        case 3: // Left edge
          x = rng.range(0, width * 0.25);
          y = rng.range(height * 0.05, height * 0.95);
          break;
        default:
          x = rng.range(width * 0.1, width * 0.9);
          y = rng.range(height * 0.1, height * 0.9);
      }
    } else {
      // 30% chance for corners or interior
      x = rng.range(width * 0.05, width * 0.95);
      y = rng.range(height * 0.05, height * 0.95);
    }

    clusters.push({
      x,
      y,
      density: rng.range(0.8, 1.0), // High density
      radius: rng.range(60, 120) * (0.5 + scale * 0.7), // Tighter cluster radius
    });
  }

  // LAYER 1: Dense main particles - significantly more
  const mainCount = Math.floor(200 + intensity * 400);
  for (let i = 0; i < mainCount; i++) {
    const cluster = clusters[Math.floor(rng.next() * clusters.length)];

    // Much tighter concentration - higher power for more center focus
    const angle = rng.range(0, Math.PI * 2);
    const distance = Math.pow(rng.next(), 2.5) * cluster.radius;
    const x = cluster.x + Math.cos(angle) * distance;
    const y = cluster.y + Math.sin(angle) * distance;

    const size = rng.range(3, 6) * (0.6 + scale * 0.5);
    const opacity = rng.range(0.6, 0.9) * intensity * cluster.density;

    svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity.toFixed(3)}" filter="url(#splat-blur-${intSeed})" />`;
  }

  // LAYER 2: Dense smaller dots
  const smallCount = Math.floor(300 + intensity * 500);
  for (let i = 0; i < smallCount; i++) {
    const cluster = clusters[Math.floor(rng.next() * clusters.length)];

    const angle = rng.range(0, Math.PI * 2);
    const distance = Math.pow(rng.next(), 3.0) * cluster.radius * 0.7; // Very concentrated
    const x = cluster.x + Math.cos(angle) * distance;
    const y = cluster.y + Math.sin(angle) * distance;

    const size = rng.range(1.5, 3) * (0.5 + scale * 0.4);
    const opacity = rng.range(0.5, 0.8) * intensity * cluster.density;

    svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity.toFixed(3)}" filter="url(#splat-blur-${intSeed})" />`;
  }

  // LAYER 3: Dense fine particles packed tightly
  const fineCount = Math.floor(400 + intensity * 600);
  for (let i = 0; i < fineCount; i++) {
    const cluster = clusters[Math.floor(rng.next() * clusters.length)];

    const angle = rng.range(0, Math.PI * 2);
    const distance = Math.pow(rng.next(), 3.5) * cluster.radius * 0.9; // Most concentrated layer
    const x = cluster.x + Math.cos(angle) * distance;
    const y = cluster.y + Math.sin(angle) * distance;

    const size = rng.range(0.5, 1.5) * (0.4 + scale * 0.4);
    const opacity = rng.range(0.4, 0.7) * intensity * cluster.density;

    svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity.toFixed(3)}" />`;
  }

  // LAYER 4: Minimal scattered background
  const scatteredCount = Math.floor(20 + intensity * 30);
  for (let i = 0; i < scatteredCount; i++) {
    const x = rng.range(0, width);
    const y = rng.range(0, height);
    const size = rng.range(0.8, 2) * (0.4 + scale * 0.4);
    const opacity = rng.range(0.15, 0.3) * intensity;

    svgContent += `<circle cx="${x}" cy="${y}" r="${size}" fill="${color}" opacity="${opacity.toFixed(3)}" />`;
  }

  svgContent += `</svg>`;

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}

// Helper to darken/lighten hex color
function adjustColor(hex: string, amount: number): string {
  const num = parseInt(hex.replace('#', ''), 16);
  const r = Math.max(0, Math.min(255, (num >> 16) + amount));
  const g = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) + amount));
  const b = Math.max(0, Math.min(255, (num & 0x0000FF) + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}
