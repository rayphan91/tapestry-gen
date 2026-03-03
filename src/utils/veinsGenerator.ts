/**
 * Procedural veins generation with smooth curves
 * Simplified for performance - no glow, clean lines
 */

export interface VeinsParams {
  width: number;
  height: number;
  intensity: number; // 0-1
  scale: number; // 0-1
  seed: number;
  color: string; // Color for the veins
}

interface Point {
  x: number;
  y: number;
}

// Simple seeded random number generator
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 16807) % 2147483647;
    return (this.seed - 1) / 2147483646;
  }

  range(min: number, max: number): number {
    return min + this.next() * (max - min);
  }
}

interface BranchPath {
  points: Point[];
  width: number;
  opacity: number;
}

function generateBranch(
  x: number,
  y: number,
  angle: number,
  length: number,
  depth: number,
  maxDepth: number,
  rng: SeededRandom,
  paths: BranchPath[],
  curlFactor: number,
  spreadFactor: number,
  parentWidth: number = 3.0
): void {
  if (depth > maxDepth || length < 3) return;

  // Generate smooth curved segment with more organic random walk
  const segments = Math.max(6, Math.floor(12 - depth * 1.5));
  const segLen = length / segments;
  const points: Point[] = [{ x, y }];

  let cx = x;
  let cy = y;
  let ca = angle;

  // More gradual angle changes for smoother curves
  for (let i = 0; i < segments; i++) {
    const t = i / segments;
    // Smoother curl with less jitter
    const curlAmount = (rng.next() - 0.5) * (curlFactor * 0.015);
    ca += curlAmount;

    // Add slight randomness to length for organic feel
    const segVariation = 1 + (rng.next() - 0.5) * 0.2;
    cx += Math.cos(ca) * segLen * segVariation;
    cy += Math.sin(ca) * segLen * segVariation;
    points.push({ x: cx, y: cy });
  }

  // Calculate opacity and width with better tapering
  const t = depth / maxDepth;
  const opacity = Math.max(0.3, (1 - t * 0.6) * 0.85);

  // More dramatic tapering - thicker at base, much thinner at tips
  const baseWidth = parentWidth * (0.6 + rng.next() * 0.15);
  const tipTaper = Math.pow(1 - t, 1.5); // Exponential taper for natural look
  const lineWidth = Math.max(0.3, baseWidth * tipTaper);

  paths.push({
    points,
    width: lineWidth,
    opacity,
  });

  // Create branches with more variation and detail
  if (depth < maxDepth) {
    // Adjust branching probability to create more detail
    const branchProbability = Math.pow(0.75, depth);
    let numBranches = 0;

    if (rng.next() < branchProbability) {
      // More branches at shallow depths, fewer at deep depths
      if (depth < 3) {
        numBranches = rng.next() < 0.7 ? 2 : 3;
      } else if (depth < 6) {
        numBranches = rng.next() < 0.6 ? 2 : 1;
      } else {
        numBranches = rng.next() < 0.5 ? 1 : 0;
      }
    }

    for (let b = 0; b < numBranches; b++) {
      // More varied branching angles for organic look
      const angleSpread = spreadFactor * Math.PI / 100;
      const angleVariation = (rng.next() - 0.5) * angleSpread;

      // Distribute branches more naturally
      let branchOffset = 0;
      if (numBranches === 2) {
        branchOffset = b === 0 ? -0.4 : 0.4;
      } else if (numBranches === 3) {
        branchOffset = (b - 1) * 0.4;
      }

      const branchAngle = ca + angleVariation + branchOffset;

      // More varied length - some branches shorter, some longer
      const lenFactor = 0.5 + rng.next() * 0.4;

      generateBranch(
        cx,
        cy,
        branchAngle,
        length * lenFactor,
        depth + 1,
        maxDepth,
        rng,
        paths,
        curlFactor,
        spreadFactor,
        lineWidth
      );
    }
  }
}

export function generateVeinsSVG(params: VeinsParams): string {
  const { width, height, intensity, scale, seed, color } = params;
  // Convert 0-1 seed to integer for SeededRandom
  const intSeed = Math.floor(seed * 1000000);
  const rng = new SeededRandom(intSeed);

  const paths: BranchPath[] = [];

  // Generate parameters based on intensity and scale
  const maxDepth = Math.floor(7 + scale * 5); // 7-12 depth for more detailed branching
  const curlFactor = 20 + intensity * 20; // 20-40 curl - more organic
  const spreadFactor = 25 + scale * 35; // 25-60 spread
  const veinCount = Math.floor(2 + intensity * 3); // 2-5 main veins for more coverage

  // Generate main veins from various starting points
  for (let i = 0; i < veinCount; i++) {
    // Start from edges for more natural look
    const edge = Math.floor(rng.next() * 4); // 0=top, 1=right, 2=bottom, 3=left
    let startX: number, startY: number, startAngle: number;

    switch (edge) {
      case 0: // top
        startX = rng.range(width * 0.1, width * 0.9);
        startY = rng.range(-height * 0.05, height * 0.15);
        startAngle = Math.PI * rng.range(0.35, 0.65);
        break;
      case 1: // right
        startX = rng.range(width * 0.85, width * 1.05);
        startY = rng.range(height * 0.1, height * 0.9);
        startAngle = Math.PI * rng.range(0.65, 1.15);
        break;
      case 2: // bottom
        startX = rng.range(width * 0.1, width * 0.9);
        startY = rng.range(height * 0.85, height * 1.05);
        startAngle = Math.PI * rng.range(1.35, 1.65);
        break;
      default: // left
        startX = rng.range(-width * 0.05, width * 0.15);
        startY = rng.range(height * 0.1, height * 0.9);
        startAngle = Math.PI * rng.range(-0.15, 0.35);
        break;
    }

    // Vary initial length for more organic variety
    const lengthVariation = 0.9 + rng.next() * 0.4;
    const initialLength = Math.min(width, height) * (0.3 + scale * 0.3) * lengthVariation;

    // Start with thicker base width
    const baseWidth = 2.5 + scale * 2.5;

    generateBranch(
      startX,
      startY,
      startAngle,
      initialLength,
      0,
      maxDepth,
      rng,
      paths,
      curlFactor,
      spreadFactor,
      baseWidth
    );
  }

  // Build SVG with blur filter for organic texture
  let svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`;

  // Add filter definitions for blur and texture
  svgContent += `
    <defs>
      <filter id="vein-blur" x="-50%" y="-50%" width="200%" height="200%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="0.8" />
      </filter>
      <filter id="vein-texture" x="-50%" y="-50%" width="200%" height="200%">
        <feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="3" seed="${intSeed}" />
        <feColorMatrix type="saturate" values="0" />
        <feComponentTransfer>
          <feFuncA type="discrete" tableValues="0 0 0.1 0.2" />
        </feComponentTransfer>
        <feGaussianBlur stdDeviation="0.5" />
        <feBlend in="SourceGraphic" mode="screen" />
      </filter>
    </defs>
  `;

  // Render all paths with smooth curves and texture
  paths.forEach((path) => {
    if (path.points.length < 2) return;

    const adjustedOpacity = path.opacity * intensity;

    // Create smooth curve using quadratic bezier
    let pathData = `M ${path.points[0].x} ${path.points[0].y}`;

    for (let i = 1; i < path.points.length - 1; i++) {
      const mx = (path.points[i].x + path.points[i + 1].x) / 2;
      const my = (path.points[i].y + path.points[i + 1].y) / 2;
      pathData += ` Q ${path.points[i].x} ${path.points[i].y}, ${mx} ${my}`;
    }

    // Add final point
    const lastPoint = path.points[path.points.length - 1];
    pathData += ` L ${lastPoint.x} ${lastPoint.y}`;

    // Draw path with blur and texture filter for organic feel
    svgContent += `<path d="${pathData}" stroke="${color}" stroke-width="${path.width}" stroke-linecap="round" stroke-linejoin="round" fill="none" opacity="${adjustedOpacity}" filter="url(#vein-texture)" />`;
  });

  svgContent += `</svg>`;

  return `data:image/svg+xml;base64,${btoa(svgContent)}`;
}
