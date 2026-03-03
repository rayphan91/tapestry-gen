// Advanced Canvas 2D Swoosh Renderer with 3D Ribbon Effect
export interface SwooshPoint {
  x: number;
  y: number;
  controlPoint1?: { x: number; y: number };
  controlPoint2?: { x: number; y: number };
}

export interface Swoosh {
  id: string;
  points: SwooshPoint[];
  color: string;
  thickness: number;
  opacity: number;
  blendMode: string;
  blur?: number; // Blur amount in pixels (default 0)
  offsetX?: number; // X position offset for moving entire swoosh
  offsetY?: number; // Y position offset for moving entire swoosh
  visible?: boolean; // Whether the swoosh is visible
  trimStart?: number; // 0-1, percentage of path to trim from start
  trimEnd?: number; // 0-1, percentage of path to trim from end
}

interface SamplePoint {
  x: number;
  y: number;
  tx: number; // tangent x
  ty: number; // tangent y
}

// =======================
// Dynamic Swoosh Generation
// =======================

interface DynamicSwooshOptions {
  width: number;
  height: number;
  centerY?: number;      // 0-1, vertical center position (default 0.5)
  amplitude?: number;    // 0-1, vertical swing as fraction of height (default 0.22)
  anchors?: number;      // number of control points (default 6)
  turbulence?: number;   // 0-1, noise intensity (0=pure sines, 1=mostly noise, default 0.45)
  seed?: number;         // random seed (omit for random)
}

// Simple seeded random number generator
function seededRandom(seed: number): () => number {
  let state = seed;
  return () => {
    state = (state * 9301 + 49297) % 233280;
    return state / 233280;
  };
}

// 5-octave fractional Brownian motion for organic variation
function fbm(x: number, seed: number): number {
  const random = seededRandom(seed);
  let total = 0;
  let amplitude = 1;
  let frequency = 1;

  for (let i = 0; i < 5; i++) {
    // Simplified noise using seeded random
    const nx = x * frequency + seed;
    const noise = Math.sin(nx * 12.9898 + random() * 78.233) * 43758.5453;
    const value = (noise - Math.floor(noise)) * 2 - 1;

    total += value * amplitude;
    amplitude *= 0.5;
    frequency *= 2;
  }

  return total;
}

/**
 * Generate a dynamically curved swoosh with organic, multi-frequency variation.
 * Uses multiple non-harmonic sine waves combined with FBM noise for natural-looking paths.
 */
export function generateDynamicSwoosh(opts: DynamicSwooshOptions): SwooshPoint[] {
  const {
    width,
    height,
    centerY = 0.5,
    amplitude = 0.22,
    anchors = 6,
    turbulence = 0.45,
    seed = Math.random() * 10000,
  } = opts;

  const random = seededRandom(seed);
  const points: SwooshPoint[] = [];

  // Random phase offsets for each sine wave
  const phase1 = random() * Math.PI * 2;
  const phase2 = random() * Math.PI * 2;
  const phase3 = random() * Math.PI * 2;

  // Generate anchor points with organic Y displacement
  for (let i = 0; i < anchors; i++) {
    const t = i / (anchors - 1);
    const x = -width * 0.1 + width * 1.2 * t;

    // Taper envelope: eases in and out at both ends
    const taper = Math.pow(Math.sin(t * Math.PI), 0.6);

    // Multi-frequency sine waves (non-harmonic frequencies: 2.0, 3.7, 6.1)
    const wave1 = Math.sin(t * Math.PI * 2.0 + phase1) * 0.4;
    const wave2 = Math.sin(t * Math.PI * 3.7 + phase2) * 0.3;
    const wave3 = Math.sin(t * Math.PI * 6.1 + phase3) * 0.2;
    const sineSum = wave1 + wave2 + wave3;

    // FBM noise for organic micro-variation
    const noise = fbm(t, seed) * 0.1;

    // Combine: weighted mix of sines and noise
    const displacement = (sineSum * (1 - turbulence) + noise * turbulence) * taper;

    const baseY = height * centerY;
    const y = baseY + displacement * height * amplitude;

    points.push({ x, y });
  }

  // Compute tangent-aligned Bezier control points
  for (let i = 0; i < points.length; i++) {
    const curr = points[i];
    const prev = points[i - 1];
    const next = points[i + 1];

    // Finite difference tangent estimation
    let tx = 0;
    let ty = 0;

    if (i === 0 && next) {
      tx = next.x - curr.x;
      ty = next.y - curr.y;
    } else if (i === points.length - 1 && prev) {
      tx = curr.x - prev.x;
      ty = curr.y - prev.y;
    } else if (prev && next) {
      tx = (next.x - prev.x) / 2;
      ty = (next.y - prev.y) / 2;
    }

    // Scale tangent for handle distance
    const handleScale = 0.4;
    curr.controlPoint1 = { x: curr.x - tx * handleScale, y: curr.y - ty * handleScale };
    curr.controlPoint2 = { x: curr.x + tx * handleScale, y: curr.y + ty * handleScale };
  }

  return points;
}

/**
 * Generate multiple swoosh strokes spread vertically with slight jitter.
 * Each stroke gets its own seed for variation.
 */
export function generateSwooshComposition(
  count: number,
  opts: Omit<DynamicSwooshOptions, 'centerY' | 'seed'>
): SwooshPoint[][] {
  const strokes: SwooshPoint[][] = [];
  const random = seededRandom(Math.random() * 10000);

  for (let i = 0; i < count; i++) {
    const centerY = 0.2 + (i / (count - 1 || 1)) * 0.6; // Spread from 0.2 to 0.8
    const jitter = (random() - 0.5) * 0.08; // Small vertical jitter
    const seed = random() * 10000;

    const points = generateDynamicSwoosh({
      ...opts,
      centerY: centerY + jitter,
      seed,
    });

    strokes.push(points);
  }

  return strokes;
}

export class Swoosh2DRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    if (!ctx) {
      throw new Error('Canvas 2D not supported');
    }
    this.ctx = ctx;
  }

  public clear(): void {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private hexToRgb(hex: string): { r: number; g: number; b: number } {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return { r, g, b };
  }

  private rgbToHex(r: number, g: number, b: number): string {
    return '#' + [r, g, b].map(x => {
      const hex = Math.round(x).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    }).join('');
  }

  private adjustBrightness(hex: string, percent: number): string {
    const rgb = this.hexToRgb(hex);
    return this.rgbToHex(
      Math.min(255, Math.max(0, rgb.r + rgb.r * percent)),
      Math.min(255, Math.max(0, rgb.g + rgb.g * percent)),
      Math.min(255, Math.max(0, rgb.b + rgb.b * percent))
    );
  }

  private offsetPath(points: SwooshPoint[], offsetDistance: number): SwooshPoint[] {
    // Offset points perpendicular to the path direction
    const offsetPoints: SwooshPoint[] = [];

    for (let i = 0; i < points.length; i++) {
      const current = points[i];
      let tangentX = 0;
      let tangentY = 0;

      // Calculate tangent direction
      if (i === 0 && points.length > 1) {
        // First point - use direction to next point
        tangentX = points[1].x - current.x;
        tangentY = points[1].y - current.y;
      } else if (i === points.length - 1) {
        // Last point - use direction from previous point
        tangentX = current.x - points[i - 1].x;
        tangentY = current.y - points[i - 1].y;
      } else {
        // Middle point - average of both directions
        tangentX = (points[i + 1].x - points[i - 1].x) / 2;
        tangentY = (points[i + 1].y - points[i - 1].y) / 2;
      }

      // Normalize and rotate 90 degrees for perpendicular
      const length = Math.sqrt(tangentX * tangentX + tangentY * tangentY);
      if (length > 0) {
        const normalX = -tangentY / length;
        const normalY = tangentX / length;

        offsetPoints.push({
          x: current.x + normalX * offsetDistance,
          y: current.y + normalY * offsetDistance,
          controlPoint1: current.controlPoint1
            ? {
                x: current.controlPoint1.x + normalX * offsetDistance,
                y: current.controlPoint1.y + normalY * offsetDistance,
              }
            : undefined,
          controlPoint2: current.controlPoint2
            ? {
                x: current.controlPoint2.x + normalX * offsetDistance,
                y: current.controlPoint2.y + normalY * offsetDistance,
              }
            : undefined,
        });
      } else {
        offsetPoints.push({ ...current });
      }
    }

    return offsetPoints;
  }

  private renderStroke(points: SwooshPoint[], color: string, thickness: number, trimStart: number = 0, trimEnd: number = 0): void {
    if (points.length < 2) return;

    const path = new Path2D();
    path.moveTo(points[0].x, points[0].y);

    for (let i = 0; i < points.length - 1; i++) {
      const p0 = points[i];
      const p1 = points[i + 1];
      const cp1 = p0.controlPoint2 || p0;
      const cp2 = p1.controlPoint1 || p1;
      path.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p1.x, p1.y);
    }

    this.ctx.strokeStyle = color;
    this.ctx.lineWidth = thickness;

    // Apply trim path if needed
    if (trimStart > 0 || trimEnd > 0) {
      this.ctx.save();
      // Create a clipping path based on trim values
      const clipPath = new Path2D();
      const totalLength = points.length - 1;
      const startIdx = Math.floor(trimStart * totalLength);
      const endIdx = Math.ceil((1 - trimEnd) * totalLength);

      if (startIdx < endIdx && endIdx <= points.length) {
        const trimmedPoints = points.slice(startIdx, endIdx + 1);
        if (trimmedPoints.length >= 2) {
          clipPath.moveTo(trimmedPoints[0].x, trimmedPoints[0].y);
          for (let i = 0; i < trimmedPoints.length - 1; i++) {
            const p0 = trimmedPoints[i];
            const p1 = trimmedPoints[i + 1];
            const cp1 = p0.controlPoint2 || p0;
            const cp2 = p1.controlPoint1 || p1;
            clipPath.bezierCurveTo(cp1.x, cp1.y, cp2.x, cp2.y, p1.x, p1.y);
          }
          this.ctx.stroke(clipPath);
        }
      }
      this.ctx.restore();
    } else {
      this.ctx.stroke(path);
    }
  }

  public renderSwoosh(swoosh: Swoosh): void {
    if (swoosh.points.length < 2) return;

    this.ctx.save();
    this.ctx.lineCap = 'round';
    this.ctx.lineJoin = 'round';

    // Apply opacity
    this.ctx.globalAlpha = swoosh.opacity;

    // Apply blur if specified
    if (swoosh.blur && swoosh.blur > 0) {
      this.ctx.filter = `blur(${swoosh.blur}px)`;
    }

    // Apply position offset if exists
    const offsetX = swoosh.offsetX || 0;
    const offsetY = swoosh.offsetY || 0;

    if (offsetX !== 0 || offsetY !== 0) {
      this.ctx.translate(offsetX, offsetY);
    }

    // Render single stroke with trim path
    const trimStart = swoosh.trimStart || 0;
    const trimEnd = swoosh.trimEnd || 0;
    this.renderStroke(swoosh.points, swoosh.color, swoosh.thickness, trimStart, trimEnd);

    this.ctx.restore();
  }


  public renderControlPoints(swoosh: Swoosh, selectedPointIndex: number | null): void {
    this.ctx.save();

    // Apply position offset if exists
    const offsetX = swoosh.offsetX || 0;
    const offsetY = swoosh.offsetY || 0;

    if (offsetX !== 0 || offsetY !== 0) {
      this.ctx.translate(offsetX, offsetY);
    }

    // Draw dashed lines connecting anchors to control points
    this.ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.setLineDash([4, 4]);

    swoosh.points.forEach((point) => {
      if (point.controlPoint1) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.controlPoint1.x, point.controlPoint1.y);
        this.ctx.stroke();
      }

      if (point.controlPoint2) {
        this.ctx.beginPath();
        this.ctx.moveTo(point.x, point.y);
        this.ctx.lineTo(point.controlPoint2.x, point.controlPoint2.y);
        this.ctx.stroke();
      }
    });

    this.ctx.setLineDash([]);

    // Draw control point handles
    swoosh.points.forEach((point, i) => {
      const isSelected = i === selectedPointIndex;

      // Control point 1 (incoming) - cyan diamond
      if (point.controlPoint1) {
        this.ctx.save();
        this.ctx.translate(point.controlPoint1.x, point.controlPoint1.y);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillStyle = 'rgba(96,165,250,0.9)';
        this.ctx.strokeStyle = 'rgba(30,80,180,0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(-4, -4, 8, 8);
        this.ctx.strokeRect(-4, -4, 8, 8);
        this.ctx.restore();
      }

      // Control point 2 (outgoing) - magenta diamond
      if (point.controlPoint2) {
        this.ctx.save();
        this.ctx.translate(point.controlPoint2.x, point.controlPoint2.y);
        this.ctx.rotate(Math.PI / 4);
        this.ctx.fillStyle = 'rgba(250,96,165,0.9)';
        this.ctx.strokeStyle = 'rgba(180,30,80,0.6)';
        this.ctx.lineWidth = 1;
        this.ctx.fillRect(-4, -4, 8, 8);
        this.ctx.strokeRect(-4, -4, 8, 8);
        this.ctx.restore();
      }

      // Anchor point - white/green square
      this.ctx.fillStyle = isSelected ? '#00ff00' : 'rgba(255,255,255,0.95)';
      this.ctx.strokeStyle = 'rgba(0,0,0,0.7)';
      this.ctx.lineWidth = 2;
      const size = isSelected ? 8 : 6;
      this.ctx.fillRect(point.x - size, point.y - size, size * 2, size * 2);
      this.ctx.strokeRect(point.x - size, point.y - size, size * 2, size * 2);
    });

    this.ctx.restore();
  }

  public destroy(): void {
    // Cleanup if needed
  }
}
