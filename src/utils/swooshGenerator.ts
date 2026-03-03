import type { Swoosh, SwooshPoint } from './swooshRenderer2D';

// Apply smooth handles to points based on neighboring points (tension-based)
function applySmoothing(points: SwooshPoint[], tension: number = 0.6, closed: boolean = false): void {
  const n = points.length;
  for (let i = 0; i < n; i++) {
    const prev = points[(i - 1 + n) % n];
    const curr = points[i];
    const next = points[(i + 1) % n];

    const usePrev = closed || i > 0;
    const useNext = closed || i < n - 1;

    const px = usePrev ? prev.x : curr.x;
    const py = usePrev ? prev.y : curr.y;
    const nx = useNext ? next.x : curr.x;
    const ny = useNext ? next.y : curr.y;

    const dx = nx - px;
    const dy = ny - py;
    const t = tension * 0.5;

    // Set symmetric control points
    curr.controlPoint1 = { x: curr.x - dx * t, y: curr.y - dy * t };
    curr.controlPoint2 = { x: curr.x + dx * t, y: curr.y + dy * t };
  }
}

// Generate a natural-looking swoosh curve
export function generateSwoosh(
  width: number,
  height: number,
  color: string,
  preset: 'flowing' | 'wave' | 'arc' | 'spiral' | 'organic' | 'ribbon' | 'fluid' = 'flowing'
): Swoosh {
  const points: SwooshPoint[] = [];

  switch (preset) {
    case 'flowing': {
      // Smooth flowing S-curve
      points.push({ x: width * 0.2, y: height * 0.3 });
      points.push({ x: width * 0.5, y: height * 0.6 });
      points.push({ x: width * 0.8, y: height * 0.4 });
      applySmoothing(points, 0.6, false);
      break;
    }

    case 'wave': {
      // Expressive wavy swoosh with variable amplitude
      const startX = -width * 0.1;
      const endX = width * 1.1;
      const baseY = height * 0.5;
      const segments = 8;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const x = startX + (endX - startX) * t;
        // Variable amplitude wave - starts small, peaks in middle, ends smaller
        const amplitudeEnvelope = Math.sin(t * Math.PI);
        const waveY = baseY + Math.sin(t * Math.PI * 3) * height * 0.2 * amplitudeEnvelope;
        points.push({ x, y: waveY });
      }
      applySmoothing(points, 0.75, false);
      break;
    }

    case 'arc': {
      // Simple elegant arc
      points.push({ x: width * 0.2, y: height * 0.7 });
      points.push({ x: width * 0.5, y: height * 0.2 });
      points.push({ x: width * 0.8, y: height * 0.7 });
      applySmoothing(points, 0.7, false);
      break;
    }

    case 'spiral': {
      // Spiral swoosh
      const centerX = width * 0.5;
      const centerY = height * 0.5;
      const turns = 1.5;
      const segments = 8;

      for (let i = 0; i <= segments; i++) {
        const t = i / segments;
        const angle = t * Math.PI * 2 * turns;
        const radius = (width * 0.3) * (1 - t * 0.7);
        const x = centerX + Math.cos(angle) * radius;
        const y = centerY + Math.sin(angle) * radius;
        points.push({ x, y });
      }
      applySmoothing(points, 0.5, false);
      break;
    }

    case 'organic': {
      // Organic flowing shape that extends beyond canvas - inspired by reference images
      // Starts off-canvas left, flows through center with curves, exits off-canvas right
      points.push({ x: -width * 0.1, y: height * 0.6 });
      points.push({ x: width * 0.2, y: height * 0.3 });
      points.push({ x: width * 0.4, y: height * 0.7 });
      points.push({ x: width * 0.6, y: height * 0.4 });
      points.push({ x: width * 0.8, y: height * 0.8 });
      points.push({ x: width * 1.1, y: height * 0.5 });
      applySmoothing(points, 0.7, false);
      break;
    }

    case 'ribbon': {
      // Ribbon-like flowing curves extending off canvas
      // Multiple undulating curves
      points.push({ x: -width * 0.05, y: height * 0.7 });
      points.push({ x: width * 0.15, y: height * 0.4 });
      points.push({ x: width * 0.35, y: height * 0.65 });
      points.push({ x: width * 0.55, y: height * 0.35 });
      points.push({ x: width * 0.75, y: height * 0.6 });
      points.push({ x: width * 0.95, y: height * 0.3 });
      points.push({ x: width * 1.05, y: height * 0.55 });
      applySmoothing(points, 0.65, false);
      break;
    }

    case 'fluid': {
      // Fluid, paint-like swoosh with varied amplitudes
      // Creates more natural, less symmetric curves - very expressive
      const baseY = height * (0.3 + Math.random() * 0.4);
      const numPoints = 7 + Math.floor(Math.random() * 3);

      for (let i = 0; i < numPoints; i++) {
        const t = i / (numPoints - 1);
        const x = -width * 0.1 + width * 1.2 * t;
        // Create asymmetric wave with multiple frequencies
        const wave1 = Math.sin(t * Math.PI * 2) * height * 0.15;
        const wave2 = Math.sin(t * Math.PI * 3 + 1) * height * 0.08;
        const wave3 = Math.sin(t * Math.PI * 5 + 2) * height * 0.04;
        const y = baseY + wave1 + wave2 + wave3;
        points.push({ x, y });
      }
      applySmoothing(points, 0.75, false);
      break;
    }
  }

  return {
    id: `swoosh-${Date.now()}-${Math.random()}`,
    points,
    color,
    thickness: 200,
    opacity: 0.3,
    blendMode: 'soft-light',
    visible: true,
  };
}

// Generate random swoosh with variation (weighted towards expressive styles)
export function generateRandomSwoosh(width: number, height: number, color: string): Swoosh {
  // Weight towards more expressive, wave-like presets
  const presets: Array<'flowing' | 'wave' | 'arc' | 'spiral' | 'organic' | 'ribbon' | 'fluid'> =
    ['organic', 'ribbon', 'fluid', 'fluid', 'ribbon', 'organic', 'wave'];
  const preset = presets[Math.floor(Math.random() * presets.length)];

  // Generate base swoosh
  const swoosh = generateSwoosh(width, height, color, preset);

  // Add randomized variations to make it more expressive
  const points = swoosh.points;

  // Add random vertical displacement to create more wave-like motion
  for (let i = 1; i < points.length - 1; i++) {
    const t = i / (points.length - 1);
    // Add sine wave variation with random phase and amplitude
    const phase = Math.random() * Math.PI * 2;
    const amplitude = height * (0.05 + Math.random() * 0.1);
    const frequency = 2 + Math.random() * 2;
    points[i].y += Math.sin(t * Math.PI * frequency + phase) * amplitude;
  }

  // Re-apply smoothing with higher tension for more fluid curves
  applySmoothing(points, 0.7 + Math.random() * 0.15, false);

  // Randomize thickness for more expression (thicker strokes are more visible)
  swoosh.thickness = 150 + Math.random() * 150;

  // Randomize opacity
  swoosh.opacity = 0.2 + Math.random() * 0.3;

  return swoosh;
}

// Generate a random variation of an existing stroke with slight position/curve differences
export function generateStrokeVariation(
  basePoints: SwooshPoint[],
  width: number,
  height: number,
  variationAmount: number = 0.15
): SwooshPoint[] {
  const newPoints: SwooshPoint[] = [];

  for (const point of basePoints) {
    // Add random offset to each point
    const offsetX = (Math.random() - 0.5) * width * variationAmount;
    const offsetY = (Math.random() - 0.5) * height * variationAmount;

    newPoints.push({
      x: point.x + offsetX,
      y: point.y + offsetY,
    });
  }

  // Re-apply smoothing with slight variation in tension
  const tension = 0.6 + (Math.random() - 0.5) * 0.2;
  applySmoothing(newPoints, tension, false);

  return newPoints;
}

