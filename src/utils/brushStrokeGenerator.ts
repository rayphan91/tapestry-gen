/**
 * Procedural brush strokes - cross-hatched patches with organic texture
 */

export interface BrushStrokeParams {
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

export function generateBrushStrokeSVG(params: BrushStrokeParams): string {
  const { width, height, intensity, scale, seed, color } = params;
  const intSeed = Math.floor(seed * 1000000);
  const rng = new SeededRandom(intSeed);

  // Build SVG
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;
  svgContent += `<defs>`;

  // Simple blur filter only
  svgContent += `
    <filter id="brush-blur-${intSeed}">
      <feGaussianBlur stdDeviation="2.0" />
    </filter>
  `;

  // Roughen edges filter with grain - balanced texture (visible but not boxy)
  svgContent += `
    <filter id="brush-roughen-${intSeed}">
      <feTurbulence type="fractalNoise" baseFrequency="0.4" numOctaves="4" seed="${intSeed}" result="turbulence" />
      <feDisplacementMap in="SourceGraphic" in2="turbulence" scale="2.5" xChannelSelector="R" yChannelSelector="G" result="displaced" />
      <feTurbulence type="fractalNoise" baseFrequency="1.8" numOctaves="3" seed="${intSeed + 1}" result="grain" />
      <feColorMatrix in="grain" type="saturate" values="0" result="grainMono" />
      <feComponentTransfer in="grainMono" result="grainAdjusted">
        <feFuncA type="linear" slope="0.25" />
      </feComponentTransfer>
      <feBlend in="displaced" in2="grainAdjusted" mode="multiply" result="textured" />
      <feGaussianBlur in="textured" stdDeviation="1.5" />
    </filter>
  `;

  svgContent += `</defs>`;

  // Determine patch centers for cross-hatch clusters
  const patchCount = Math.floor(8 + intensity * 15);
  const patches: Array<{x: number; y: number; angle: number}> = [];
  for (let i = 0; i < patchCount; i++) {
    patches.push({
      x: rng.range(width * 0.05, width * 0.95),
      y: rng.range(height * 0.05, height * 0.95),
      angle: rng.range(0, Math.PI),
    });
  }

  // Single color cross-hatch strokes - much larger
  for (const patch of patches) {
    // First direction
    const strokeCount1 = Math.floor(4 + intensity * 6);
    for (let i = 0; i < strokeCount1; i++) {
      const angle = patch.angle + rng.range(-0.1, 0.1);
      const length = rng.range(80, 250) * (0.7 + scale * 0.8);
      const width_stroke = rng.range(1.5, 4.0) * (0.4 + scale * 0.6);
      const offset = (i - strokeCount1 / 2) * rng.range(8, 15);
      const perpAngle = angle + Math.PI / 2;
      const centerX = patch.x + Math.cos(perpAngle) * offset;
      const centerY = patch.y + Math.sin(perpAngle) * offset;
      const x1 = centerX - Math.cos(angle) * length / 2;
      const y1 = centerY - Math.sin(angle) * length / 2;
      const x2 = centerX + Math.cos(angle) * length / 2;
      const y2 = centerY + Math.sin(angle) * length / 2;
      const opacity = rng.range(0.25, 0.5) * intensity;

      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width_stroke}" opacity="${opacity.toFixed(3)}" stroke-linecap="round" filter="url(#brush-roughen-${intSeed})" />`;
    }

    // Second direction (cross-hatch)
    const strokeCount2 = Math.floor(3 + intensity * 5);
    const crossAngle = patch.angle + rng.range(Math.PI / 3, Math.PI / 1.8);
    for (let i = 0; i < strokeCount2; i++) {
      const angle = crossAngle + rng.range(-0.1, 0.1);
      const length = rng.range(70, 220) * (0.7 + scale * 0.8);
      const width_stroke = rng.range(1.5, 4.0) * (0.4 + scale * 0.6);
      const offset = (i - strokeCount2 / 2) * rng.range(8, 15);
      const perpAngle = angle + Math.PI / 2;
      const centerX = patch.x + Math.cos(perpAngle) * offset;
      const centerY = patch.y + Math.sin(perpAngle) * offset;
      const x1 = centerX - Math.cos(angle) * length / 2;
      const y1 = centerY - Math.sin(angle) * length / 2;
      const x2 = centerX + Math.cos(angle) * length / 2;
      const y2 = centerY + Math.sin(angle) * length / 2;
      const opacity = rng.range(0.2, 0.45) * intensity;

      svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width_stroke}" opacity="${opacity.toFixed(3)}" stroke-linecap="round" filter="url(#brush-roughen-${intSeed})" />`;
    }
  }

  // Additional scattered strokes for more coverage - also larger
  const scatteredCount = Math.floor(15 + intensity * 30);
  for (let i = 0; i < scatteredCount; i++) {
    const x1 = rng.range(0, width);
    const y1 = rng.range(0, height);
    const angle = rng.range(0, Math.PI * 2);
    const length = rng.range(40, 120) * (0.5 + scale * 0.6);
    const width_stroke = rng.range(1.2, 3.0) * (0.4 + scale * 0.5);
    const x2 = x1 + Math.cos(angle) * length;
    const y2 = y1 + Math.sin(angle) * length;
    const opacity = rng.range(0.15, 0.35) * intensity;

    svgContent += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width_stroke}" opacity="${opacity.toFixed(3)}" stroke-linecap="round" />`;
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
