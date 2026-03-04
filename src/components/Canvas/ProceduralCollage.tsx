import React, { useEffect, useRef } from 'react';

interface ProceduralCollageProps {
  width: number;
  height: number;
  images: Array<{
    id: string;
    name: string;
    url: string;
    img: HTMLImageElement;
    position?: { x: number; y: number }; // Custom position (0-1 normalized)
    scale?: number; // Custom scale multiplier
  }>;
  seed: number;
  params: {
    fog: number;
    vignette: number;
    scaleSpread: number;
    rotation: number;
    grain: number;
    saturation: number;
  };
  blendMode: string;
  animationTime?: number; // Current animation time in seconds
  animationDuration?: number; // Total animation duration in seconds
  isAnimating?: boolean;
  onImagePositionUpdate?: (id: string, position: { x: number; y: number }) => void;
}

function seededRng(seed: number) {
  let s = seed;
  return () => {
    s = (s * 1664525 + 1013904223) & 0xffffffff;
    return (s >>> 0) / 0xffffffff;
  };
}

export const ProceduralCollage: React.FC<ProceduralCollageProps> = ({
  width,
  height,
  images,
  seed,
  params,
  blendMode,
  animationTime = 0,
  animationDuration = 8,
  isAnimating = false,
  onImagePositionUpdate,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  const [dragStart, setDragStart] = React.useState<{ x: number; y: number } | null>(null);
  const [imageBounds, setImageBounds] = React.useState<Map<string, { x: number; y: number; width: number; height: number }>>(new Map());

  // Throttle animation updates for collage
  const throttledAnimationTime = React.useMemo(() => {
    if (!isAnimating) return 0;
    // Round to nearest 0.033s (30fps) to reduce re-renders
    return Math.round(animationTime * 30) / 30;
  }, [animationTime, isAnimating]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d', {
      alpha: true,
      desynchronized: true, // Better performance
    });
    if (!ctx) return;

    // Set canvas dimensions
    canvas.width = width;
    canvas.height = height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);

    if (images.length === 0) {
      setImageBounds(new Map());
      return;
    }

    const { fog, vignette, scaleSpread, rotation, grain, saturation } = params;
    const rng = seededRng(seed);
    const newBounds = new Map<string, { x: number; y: number; width: number; height: number }>();

    // Create a grid-based distribution system for better coverage
    // Favor more columns to fill horizontal space better
    const gridCols = Math.ceil(Math.sqrt(images.length * 1.5));
    const gridRows = Math.ceil(images.length / gridCols);
    const cellWidth = width / gridCols;
    const cellHeight = height / gridRows;

    // Shuffle images for random grid placement
    const shuffledImages = [...images];
    for (let i = shuffledImages.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffledImages[i], shuffledImages[j]] = [shuffledImages[j], shuffledImages[i]];
    }

    shuffledImages.forEach((item, idx) => {
      const img = item.img;
      const aspect = img.width / img.height;

      // Calculate grid position
      const gridX = idx % gridCols;
      const gridY = Math.floor(idx / gridCols);

      // Use custom position if available, otherwise use grid-based positioning
      let cellCenterX, cellCenterY, xOffset, yOffset;

      if (item.position) {
        // Use custom position (normalized 0-1, convert to pixels)
        cellCenterX = item.position.x * width;
        cellCenterY = item.position.y * height;
        xOffset = 0;
        yOffset = 0;
      } else {
        // Base position in grid cell with some randomness
        cellCenterX = gridX * cellWidth + cellWidth / 2;
        cellCenterY = gridY * cellHeight + cellHeight / 2;

        // Add variation within cell (reduced overlap)
        const offsetRange = 0.3; // 30% of cell size for variation
        xOffset = (rng() - 0.5) * cellWidth * offsetRange;
        yOffset = (rng() - 0.5) * cellHeight * offsetRange;
      }

      // Animation parameters
      let animScale = 1.0;
      let animOpacity = 1.0;
      let animAngleOffset = 0;

      if (isAnimating && animationDuration > 0) {
        // Normalize time to 0-1 within duration
        const t = (throttledAnimationTime % animationDuration) / animationDuration;

        // Each image gets a unique animation offset based on its index
        const phaseOffset = (idx / images.length);
        const phase = (t + phaseOffset) % 1.0;

        // Fade in/out cycle - each image fades in and out during the loop
        const fadeSpeed = 2; // How many fade cycles per loop
        const fadePhase = (phase * fadeSpeed) % 1.0;
        if (fadePhase < 0.3) {
          // Fade in
          animOpacity = fadePhase / 0.3;
        } else if (fadePhase > 0.7) {
          // Fade out
          animOpacity = (1.0 - fadePhase) / 0.3;
        } else {
          animOpacity = 1.0;
        }

        // Scale animation - gentle pulsing/zoom
        const scaleWave = Math.sin(phase * Math.PI * 2);
        animScale = 1.0 + scaleWave * 0.12;

        // Position drift - slow movement
        const driftAmount = 20; // pixels - reduced for performance
        xOffset += Math.sin(phase * Math.PI * 2 + idx) * driftAmount;
        yOffset += Math.cos(phase * Math.PI * 2 + idx * 0.7) * driftAmount;

        // Rotation animation
        animAngleOffset = Math.sin(phase * Math.PI * 2 + idx * 0.5) * 3; // +/- 3 degrees
      }

      // Scale images to fit better in grid cells
      // Base scale with minimal randomness for consistency
      const baseScale = 0.3 + rng() * 0.1; // Base scale 0.3-0.4
      // Scale spread now affects all images uniformly by expanding the range
      const spreadInfluence = scaleSpread * 0.8; // 0-0.8 range based on slider
      const randomFactor = rng(); // 0-1 random value per image
      let scale = (baseScale + spreadInfluence * randomFactor) * animScale;

      // Apply custom scale if available
      if (item.scale) {
        scale *= item.scale;
      }
      const iw = Math.min(width * scale, cellWidth * 1.6);
      const ih = iw / aspect;

      // Position centered in cell with offset
      const x = cellCenterX - iw / 2 + xOffset;
      const y = cellCenterY - ih / 2 + yOffset;
      const angle = (rng() - 0.5) * rotation * (Math.PI / 180) + (animAngleOffset * Math.PI / 180);

      // Store bounds for hit testing
      newBounds.set(item.id, { x, y, width: iw, height: ih });

      // Create offscreen canvas for this image
      const off = document.createElement('canvas');
      off.width = width;
      off.height = height;
      const octx = off.getContext('2d');
      if (!octx) return;

      // Draw image with rotation and filters
      octx.save();
      octx.translate(x + iw / 2, y + ih / 2);
      octx.rotate(angle);
      octx.filter = `saturate(${saturation * 100}%) brightness(1.04)`;
      octx.drawImage(img, -iw / 2, -ih / 2, iw, ih);
      octx.restore();
      octx.filter = 'none';

      // Apply vignette mask
      octx.globalCompositeOperation = 'destination-in';
      const cx = x + iw / 2;
      const cy = y + ih / 2;
      const r = Math.max(iw, ih) * vignette;
      const grad = octx.createRadialGradient(cx, cy, r * 0.05, cx, cy, r);
      grad.addColorStop(0, 'rgba(0,0,0,1)');
      grad.addColorStop(0.55, 'rgba(0,0,0,0.9)');
      grad.addColorStop(1, 'rgba(0,0,0,0)');
      octx.fillStyle = grad;
      octx.fillRect(0, 0, width, height);

      // Composite onto main canvas
      ctx.globalCompositeOperation = blendMode as GlobalCompositeOperation;
      const baseOpacity = 0.82 + rng() * 0.18;
      ctx.globalAlpha = baseOpacity * animOpacity;
      ctx.drawImage(off, 0, 0);
      ctx.globalAlpha = 1;
      ctx.globalCompositeOperation = 'source-over';
    });

    // Apply fog overlay
    if (fog > 0) {
      const fg = ctx.createRadialGradient(
        width * 0.38,
        height * 0.48,
        0,
        width * 0.5,
        height * 0.5,
        width * 0.72
      );
      fg.addColorStop(0, `rgba(255,255,255,${fog * 0.65})`);
      fg.addColorStop(0.5, `rgba(255,255,255,${fog * 0.25})`);
      fg.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = fg;
      ctx.fillRect(0, 0, width, height);

      const ef = ctx.createLinearGradient(0, 0, width * 0.28, 0);
      ef.addColorStop(0, `rgba(255,255,255,${fog * 0.95})`);
      ef.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.fillStyle = ef;
      ctx.fillRect(0, 0, width, height);
    }

    // Apply grain
    if (grain > 0) {
      const imageData = ctx.getImageData(0, 0, width, height);
      const data = imageData.data;
      const grainAmount = grain * 38;
      for (let i = 0; i < data.length; i += 4) {
        const noise = (Math.random() - 0.5) * grainAmount;
        data[i] = Math.min(255, Math.max(0, data[i] + noise));
        data[i + 1] = Math.min(255, Math.max(0, data[i + 1] + noise));
        data[i + 2] = Math.min(255, Math.max(0, data[i + 2] + noise));
      }
      ctx.putImageData(imageData, 0, 0);
    }

    // Update image bounds
    setImageBounds(newBounds);
  }, [width, height, images, seed, params, blendMode, throttledAnimationTime, animationDuration, isAnimating]);

  // Mouse event handlers for dragging
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!overlayRef.current || !onImagePositionUpdate) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    // Check which image was clicked (reverse order to match drawing order - top to bottom)
    const imagesArray = [...images].reverse();
    for (const img of imagesArray) {
      const bounds = imageBounds.get(img.id);
      if (!bounds) continue;

      if (
        mouseX >= bounds.x &&
        mouseX <= bounds.x + bounds.width &&
        mouseY >= bounds.y &&
        mouseY <= bounds.y + bounds.height
      ) {
        setDraggingId(img.id);
        setDragStart({ x: mouseX, y: mouseY });
        break;
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!draggingId || !dragStart || !overlayRef.current || !onImagePositionUpdate) return;

    const rect = overlayRef.current.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) / rect.width) * width;
    const mouseY = ((e.clientY - rect.top) / rect.height) * height;

    const deltaX = mouseX - dragStart.x;
    const deltaY = mouseY - dragStart.y;

    const img = images.find((i) => i.id === draggingId);
    if (!img) return;

    const bounds = imageBounds.get(draggingId);
    if (!bounds) return;

    // Calculate new center position (normalized 0-1)
    const newCenterX = (bounds.x + bounds.width / 2 + deltaX) / width;
    const newCenterY = (bounds.y + bounds.height / 2 + deltaY) / height;

    onImagePositionUpdate(draggingId, {
      x: Math.max(0, Math.min(1, newCenterX)),
      y: Math.max(0, Math.min(1, newCenterY)),
    });

    setDragStart({ x: mouseX, y: mouseY });
  };

  const handleMouseUp = () => {
    setDraggingId(null);
    setDragStart(null);
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 50,
          mixBlendMode: blendMode === 'source-over' ? 'normal' : (blendMode as any),
        }}
      />
      {/* Interactive overlay for dragging */}
      {onImagePositionUpdate && images.length > 0 && (
        <div
          ref={overlayRef}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            zIndex: 51,
            cursor: draggingId ? 'grabbing' : 'grab',
          }}
        />
      )}
    </>
  );
};
