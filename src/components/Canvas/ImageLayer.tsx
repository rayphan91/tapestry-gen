import React, { useState, useEffect } from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { FeatherCache } from '@/utils/imageFeathering';

interface ImageLayerProps {}

const featherCache = new FeatherCache();

export const ImageLayer: React.FC<ImageLayerProps> = () => {
  const layers = useTapestryStore((state) => state.layers);
  const canvasSize = useTapestryStore((state) => state.canvas.size);
  const selectedLayerId = useTapestryStore((state) => state.selectedLayerId);
  const selectLayer = useTapestryStore((state) => state.selectLayer);
  const updateLayer = useTapestryStore((state) => state.updateLayer);

  const [loadedImages, setLoadedImages] = useState<Map<string, HTMLImageElement>>(new Map());

  const [dragState, setDragState] = useState<{
    layerId: string;
    startX: number;
    startY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  const [resizeState, setResizeState] = useState<{
    layerId: string;
    handle: 'nw' | 'ne' | 'sw' | 'se' | 'rotate';
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
    startRotation: number;
    centerX: number;
    centerY: number;
  } | null>(null);

  const imageLayers = layers.filter((layer): layer is any => layer.type === 'image' && layer.visible);

  // Load images when layers change
  useEffect(() => {
    imageLayers.forEach((layer) => {
      if (!loadedImages.has(layer.id)) {
        const img = new Image();
        // Only set crossOrigin for external URLs, not data URLs
        if (!layer.imageUrl.startsWith('data:')) {
          img.crossOrigin = 'anonymous';
        }
        img.onload = () => {
          setLoadedImages((prev) => new Map(prev).set(layer.id, img));
        };
        img.onerror = (e) => {
          console.error('Failed to load image:', layer.id, e);
        };
        img.src = layer.imageUrl;
      }
    });
  }, [imageLayers]);

  const handleMouseDown = (e: React.MouseEvent, layerId: string) => {
    e.stopPropagation();
    const layer = layers.find(l => l.id === layerId) as any;
    if (!layer || layer.locked) return;

    selectLayer(layerId);
    setDragState({
      layerId,
      startX: e.clientX,
      startY: e.clientY,
      startPosX: layer.transform.position.x,
      startPosY: layer.transform.position.y,
    });
  };

  const handleResizeStart = (e: React.MouseEvent, layerId: string, handle: 'nw' | 'ne' | 'sw' | 'se' | 'rotate') => {
    e.stopPropagation();
    const layer = layers.find(l => l.id === layerId) as any;
    if (!layer || layer.locked) return;

    setResizeState({
      layerId,
      handle,
      startX: e.clientX,
      startY: e.clientY,
      startWidth: layer.transform.dimensions.width,
      startHeight: layer.transform.dimensions.height,
      startRotation: layer.transform.rotation,
      centerX: layer.transform.position.x,
      centerY: layer.transform.position.y,
    });
  };

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (dragState) {
        const dx = e.clientX - dragState.startX;
        const dy = e.clientY - dragState.startY;

        updateLayer(dragState.layerId, {
          transform: {
            ...(layers.find(l => l.id === dragState.layerId) as any).transform,
            position: {
              x: dragState.startPosX + dx,
              y: dragState.startPosY + dy,
            },
          },
        });
      }

      if (resizeState) {
        const layer = layers.find(l => l.id === resizeState.layerId) as any;
        if (!layer) return;

        if (resizeState.handle === 'rotate') {
          const dx = e.clientX - resizeState.centerX;
          const dy = e.clientY - resizeState.centerY;
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);

          updateLayer(resizeState.layerId, {
            transform: {
              ...layer.transform,
              rotation: angle + 90,
            },
          });
        } else {
          const dx = e.clientX - resizeState.startX;
          const dy = e.clientY - resizeState.startY;

          let newWidth = resizeState.startWidth;
          let newHeight = resizeState.startHeight;

          if (resizeState.handle === 'se') {
            newWidth = Math.max(50, resizeState.startWidth + dx);
            newHeight = Math.max(50, resizeState.startHeight + dy);
          } else if (resizeState.handle === 'sw') {
            newWidth = Math.max(50, resizeState.startWidth - dx);
            newHeight = Math.max(50, resizeState.startHeight + dy);
          } else if (resizeState.handle === 'ne') {
            newWidth = Math.max(50, resizeState.startWidth + dx);
            newHeight = Math.max(50, resizeState.startHeight - dy);
          } else if (resizeState.handle === 'nw') {
            newWidth = Math.max(50, resizeState.startWidth - dx);
            newHeight = Math.max(50, resizeState.startHeight - dy);
          }

          updateLayer(resizeState.layerId, {
            transform: {
              ...layer.transform,
              dimensions: {
                width: newWidth,
                height: newHeight,
              },
            },
          });
        }
      }
    };

    const handleMouseUp = () => {
      setDragState(null);
      setResizeState(null);
    };

    if (dragState || resizeState) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);

      return () => {
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [dragState, resizeState, layers, updateLayer]);

  // Create feathered image URLs
  const getFeatheredImageSrc = (layer: any): string => {
    const loadedImg = loadedImages.get(layer.id);
    if (!loadedImg || layer.appearance.feather === 0) {
      return layer.imageUrl;
    }

    try {
      return featherCache.getCachedOrCreate(
        loadedImg,
        layer.transform.dimensions.width,
        layer.transform.dimensions.height,
        layer.appearance.feather,
        layer.imageUrl
      );
    } catch (error) {
      console.error('Error creating feathered image:', error);
      return layer.imageUrl;
    }
  };

  return (
    <>
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: canvasSize.width,
          height: canvasSize.height,
          pointerEvents: 'auto',
        }}
      >
        {imageLayers.map((layer, index) => {
          const { transform, appearance } = layer;
          const isSelected = selectedLayerId === layer.id;
          const imageSrc = getFeatheredImageSrc(layer);

          return (
            <div
              key={layer.id}
              style={{
                position: 'absolute',
                left: transform.position.x - transform.dimensions.width / 2,
                top: transform.position.y - transform.dimensions.height / 2,
                width: transform.dimensions.width,
                height: transform.dimensions.height,
                cursor: layer.locked ? 'not-allowed' : 'move',
                zIndex: layer.order || index,
                pointerEvents: layer.locked ? 'none' : 'auto',
                mixBlendMode: appearance.blendMode,
              }}
              onMouseDown={(e) => handleMouseDown(e, layer.id)}
            >
              <img
                src={imageSrc}
                alt={layer.fileName}
                draggable={false}
                style={{
                  width: '100%',
                  height: '100%',
                  transform: `
                    rotate(${transform.rotation}deg)
                    scaleX(${transform.flipX ? -1 : 1})
                    scaleY(${transform.flipY ? -1 : 1})
                  `,
                  opacity: appearance.opacity / 100,
                  filter: `
                    hue-rotate(${appearance.hue}deg)
                    saturate(${100 + appearance.saturation}%)
                    brightness(${100 + appearance.brightness}%)
                    contrast(${100 + appearance.contrast}%)
                  `,
                  objectFit: 'contain',
                  pointerEvents: 'none',
                  transformOrigin: 'center center',
                }}
              />

              {/* Bounding Box */}
              {isSelected && (
                <>
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      border: '2px solid var(--color-primary)',
                      pointerEvents: 'none',
                    }}
                  />

                  {/* Corner Handles */}
                  {['nw', 'ne', 'sw', 'se'].map((handle) => (
                    <div
                      key={handle}
                      onMouseDown={(e) => handleResizeStart(e, layer.id, handle as any)}
                      style={{
                        position: 'absolute',
                        width: 12,
                        height: 12,
                        backgroundColor: 'var(--color-primary)',
                        border: '2px solid var(--color-surface)',
                        cursor: `${handle}-resize`,
                        pointerEvents: 'auto',
                        ...(handle === 'nw' && { top: -6, left: -6 }),
                        ...(handle === 'ne' && { top: -6, right: -6 }),
                        ...(handle === 'sw' && { bottom: -6, left: -6 }),
                        ...(handle === 'se' && { bottom: -6, right: -6 }),
                      }}
                    />
                  ))}

                  {/* Rotation Handle */}
                  <div
                    onMouseDown={(e) => handleResizeStart(e, layer.id, 'rotate')}
                    style={{
                      position: 'absolute',
                      width: 12,
                      height: 12,
                      backgroundColor: 'var(--color-primary)',
                      border: '2px solid var(--color-surface)',
                      borderRadius: '50%',
                      top: -30,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      cursor: 'grab',
                      pointerEvents: 'auto',
                    }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      width: 2,
                      height: 20,
                      backgroundColor: 'var(--color-primary)',
                      top: -24,
                      left: '50%',
                      transform: 'translateX(-50%)',
                      pointerEvents: 'none',
                    }}
                  />
                </>
              )}
            </div>
          );
        })}
      </div>
    </>
  );
};
