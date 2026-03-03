import React, { useEffect, useRef, useState } from 'react';
import { useSwooshStore } from '@/store/useSwooshStore';
import { Swoosh2DRenderer, type Swoosh } from '@/utils/swooshRenderer2D';
import { REGIONAL_GRADIENTS } from '@/types';
import { useTapestryStore } from '@/store/useTapestryStore';

interface SwooshLayerProps {
  width: number;
  height: number;
}

export const SwooshLayer: React.FC<SwooshLayerProps> = ({ width, height }) => {
  const swooshes = useSwooshStore((state) => state.swooshes);
  const selectedSwooshId = useSwooshStore((state) => state.selectedSwooshId);
  const selectedPointIndex = useSwooshStore((state) => state.selectedPointIndex);
  const updateSwooshPoint = useSwooshStore((state) => state.updateSwooshPoint);
  const updateSwoosh = useSwooshStore((state) => state.updateSwoosh);
  const selectSwoosh = useSwooshStore((state) => state.selectSwoosh);
  const selectPoint = useSwooshStore((state) => state.selectPoint);
  const drawMode = useSwooshStore((state) => state.drawMode);
  const isDrawing = useSwooshStore((state) => state.isDrawing);
  const currentDrawingSwoosh = useSwooshStore((state) => state.currentDrawingSwoosh);
  const startDrawing = useSwooshStore((state) => state.startDrawing);
  const continueDrawing = useSwooshStore((state) => state.continueDrawing);
  const finishDrawing = useSwooshStore((state) => state.finishDrawing);
  const customDuotoneColors = useTapestryStore((state) => state.customDuotoneColors);
  const swooshOpacity = useTapestryStore((state) => state.swooshOpacity);
  const isAnimating = useTapestryStore((state) => state.isAnimating);
  const animationTime = useTapestryStore((state) => state.currentAnimationTime);
  const animationDuration = useTapestryStore((state) => state.animationDuration);

  const [isDragging, setIsDragging] = useState(false);
  const [dragType, setDragType] = useState<'point' | 'control1' | 'control2' | 'swoosh' | null>(null);
  const [dragStartPos, setDragStartPos] = useState<{ x: number; y: number } | null>(null);
  const drawCanvasRef = useRef<HTMLCanvasElement>(null);

  // Store refs for each swoosh canvas
  const canvasRefs = useRef<Map<string, {canvas: HTMLCanvasElement, renderer: Swoosh2DRenderer}>>(new Map());

  // Cleanup renderers when component unmounts
  useEffect(() => {
    return () => {
      canvasRefs.current.forEach(({ renderer }) => renderer.destroy());
      canvasRefs.current.clear();
    };
  }, []);

  // Handle mouse down for point selection/dragging
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>, swooshId: string) => {
    const ref = canvasRefs.current.get(swooshId);
    if (!ref) return;

    const rect = ref.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    const swoosh = swooshes.find(s => s.id === swooshId);
    if (!swoosh) return;

    // Check if clicking on a point (with offset applied)
    const offsetX = swoosh.offsetX || 0;
    const offsetY = swoosh.offsetY || 0;

    for (let i = 0; i < swoosh.points.length; i++) {
      const point = swoosh.points[i];
      const pointX = point.x + offsetX;
      const pointY = point.y + offsetY;
      const dist = Math.sqrt(Math.pow(pointX - x, 2) + Math.pow(pointY - y, 2));

      if (dist < 15) {
        selectSwoosh(swoosh.id);
        selectPoint(i);
        setIsDragging(true);
        setDragType('point');
        return;
      }

      // Check control points
      if (point.controlPoint1) {
        const cp1X = point.controlPoint1.x + offsetX;
        const cp1Y = point.controlPoint1.y + offsetY;
        const dist1 = Math.sqrt(
          Math.pow(cp1X - x, 2) + Math.pow(cp1Y - y, 2)
        );
        if (dist1 < 10) {
          selectSwoosh(swoosh.id);
          selectPoint(i);
          setIsDragging(true);
          setDragType('control1');
          return;
        }
      }

      if (point.controlPoint2) {
        const cp2X = point.controlPoint2.x + offsetX;
        const cp2Y = point.controlPoint2.y + offsetY;
        const dist2 = Math.sqrt(
          Math.pow(cp2X - x, 2) + Math.pow(cp2Y - y, 2)
        );
        if (dist2 < 10) {
          selectSwoosh(swoosh.id);
          selectPoint(i);
          setIsDragging(true);
          setDragType('control2');
          return;
        }
      }
    }

    // If not clicking on a specific point, enable swoosh dragging
    selectSwoosh(swoosh.id);
    selectPoint(null);
    setIsDragging(true);
    setDragType('swoosh');
    setDragStartPos({ x, y });
  };

  // Handle mouse move for dragging
  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>, swooshId: string) => {
    if (!isDragging || !selectedSwooshId) return;

    const ref = canvasRefs.current.get(swooshId);
    if (!ref) return;

    const rect = ref.canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    const selectedSwoosh = swooshes.find(s => s.id === selectedSwooshId);
    if (!selectedSwoosh) return;

    if (dragType === 'swoosh' && dragStartPos) {
      // Move entire swoosh
      const dx = x - dragStartPos.x;
      const dy = y - dragStartPos.y;

      updateSwoosh(selectedSwooshId, {
        offsetX: (selectedSwoosh.offsetX || 0) + dx,
        offsetY: (selectedSwoosh.offsetY || 0) + dy,
      });

      setDragStartPos({ x, y });
    } else if (selectedPointIndex !== null) {
      const point = selectedSwoosh.points[selectedPointIndex];
      if (!point) return;

      if (dragType === 'point') {
        // Move anchor point and both control points together
        const dx = x - point.x;
        const dy = y - point.y;

        updateSwooshPoint(selectedSwooshId, selectedPointIndex, {
          x,
          y,
          controlPoint1: point.controlPoint1 ? {
            x: point.controlPoint1.x + dx,
            y: point.controlPoint1.y + dy,
          } : undefined,
          controlPoint2: point.controlPoint2 ? {
            x: point.controlPoint2.x + dx,
            y: point.controlPoint2.y + dy,
          } : undefined,
        });
      } else if (dragType === 'control1') {
        // Move control1 and mirror to control2 (linked handles)
        const mirrorX = point.x * 2 - x;
        const mirrorY = point.y * 2 - y;

        updateSwooshPoint(selectedSwooshId, selectedPointIndex, {
          controlPoint1: { x, y },
          controlPoint2: { x: mirrorX, y: mirrorY },
        });
      } else if (dragType === 'control2') {
        // Move control2 and mirror to control1 (linked handles)
        const mirrorX = point.x * 2 - x;
        const mirrorY = point.y * 2 - y;

        updateSwooshPoint(selectedSwooshId, selectedPointIndex, {
          controlPoint2: { x, y },
          controlPoint1: { x: mirrorX, y: mirrorY },
        });
      }
    }
  };

  // Handle mouse up
  const handleMouseUp = () => {
    setIsDragging(false);
    setDragType(null);
    setDragStartPos(null);
  };

  // Handle drawing mode mouse events
  const handleDrawMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !drawCanvasRef.current) return;

    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    // Get color from duotone or use default
    const color = customDuotoneColors?.colorA || '#ffdd00';
    startDrawing({ x, y }, color);
  };

  const handleDrawMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!drawMode || !isDrawing || !drawCanvasRef.current) return;

    const rect = drawCanvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * width;
    const y = ((e.clientY - rect.top) / rect.height) * height;

    continueDrawing({ x, y });
  };

  const handleDrawMouseUp = () => {
    if (drawMode && isDrawing) {
      finishDrawing();
    }
  };

  // Render current drawing swoosh on draw canvas
  useEffect(() => {
    if (!drawCanvasRef.current || !currentDrawingSwoosh) return;

    const canvas = drawCanvasRef.current;
    const renderer = new Swoosh2DRenderer(canvas);
    renderer.clear();
    renderer.renderSwoosh(currentDrawingSwoosh);

    return () => renderer.destroy();
  }, [currentDrawingSwoosh]);

  return (
    <div
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
      }}
    >
      {swooshes.map((swoosh, index) => {
        const isSelected = swoosh.id === selectedSwooshId;
        const isVisible = swoosh.visible !== false; // default to true if not set

        // Debug log for blend mode
        if (isSelected) {
          console.log('Selected swoosh blend mode:', swoosh.blendMode);
        }

        // Calculate animation offset for this swoosh
        let animOffsetX = 0;
        let animOffsetY = 0;
        if (isAnimating && animationDuration > 0) {
          const t = (animationTime % animationDuration) / animationDuration;
          const phaseOffset = index * 0.2;
          const phase = (t + phaseOffset) % 1.0;

          // Position animation - subtle movement
          animOffsetX = Math.sin(phase * Math.PI * 2 + index * 0.5) * 15;
          animOffsetY = Math.cos(phase * Math.PI * 2 + index * 0.7) * 15;
        }

        return (
          <canvas
            key={swoosh.id}
            ref={(el) => {
              if (el && !canvasRefs.current.has(swoosh.id)) {
                el.width = width;
                el.height = height;
                const renderer = new Swoosh2DRenderer(el);
                canvasRefs.current.set(swoosh.id, { canvas: el, renderer });

                // Initial render
                renderer.clear();
                if (isVisible) {
                  // Apply global opacity and animation offset to swoosh
                  const swooshWithAnimations = {
                    ...swoosh,
                    opacity: swoosh.opacity * swooshOpacity,
                    offsetX: (swoosh.offsetX || 0) + animOffsetX,
                    offsetY: (swoosh.offsetY || 0) + animOffsetY,
                  };
                  renderer.renderSwoosh(swooshWithAnimations);
                  if (isSelected) {
                    renderer.renderControlPoints(swoosh, selectedPointIndex);
                  }
                }
              } else if (el) {
                // Update existing
                const ref = canvasRefs.current.get(swoosh.id);
                if (ref) {
                  ref.renderer.clear();
                  if (isVisible) {
                    // Apply global opacity and animation offset to swoosh
                    const swooshWithAnimations = {
                      ...swoosh,
                      opacity: swoosh.opacity * swooshOpacity,
                      offsetX: (swoosh.offsetX || 0) + animOffsetX,
                      offsetY: (swoosh.offsetY || 0) + animOffsetY,
                    };
                    ref.renderer.renderSwoosh(swooshWithAnimations);
                    if (isSelected) {
                      ref.renderer.renderControlPoints(swoosh, selectedPointIndex);
                    }
                  }
                }
              }
            }}
            className="canvas"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'auto',
              cursor: isDragging && isSelected ? 'grabbing' : 'pointer',
              zIndex: isSelected ? 100 : 10 + index,
              display: isVisible ? 'block' : 'none',
              mixBlendMode: (swoosh.blendMode || 'normal') as any,
            }}
            onMouseDown={(e) => handleMouseDown(e, swoosh.id)}
            onMouseMove={(e) => handleMouseMove(e, swoosh.id)}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          />
        );
      })}

      {/* Drawing Canvas - only active in draw mode */}
      {drawMode && (
        <canvas
          ref={drawCanvasRef}
          width={width}
          height={height}
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'auto',
            cursor: 'crosshair',
            zIndex: 200,
          }}
          onMouseDown={handleDrawMouseDown}
          onMouseMove={handleDrawMouseMove}
          onMouseUp={handleDrawMouseUp}
          onMouseLeave={handleDrawMouseUp}
        />
      )}
    </div>
  );
};
