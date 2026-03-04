import React, { useEffect, useRef, useState } from 'react';
import { useTapestryStore } from '@/store/useTapestryStore';
import { REGIONAL_GRADIENTS } from '@/types';
import { WebGLNoiseRenderer } from '@/utils/shaderNoise';
import { SwooshLayer } from './SwooshLayer';
import { ImageLayer } from './ImageLayer';
import { EffectsLayer } from './EffectsLayer';
import { ProceduralCollage } from './ProceduralCollage';
import { AnimationControls } from '../Animation/AnimationControls';
import { CanvasToolbar } from './CanvasToolbar';
import { HelpButton, HelpOverlay } from '../Help/HelpOverlay';
import './CanvasArea.css';

export const CanvasArea: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const rendererRef = useRef<WebGLNoiseRenderer | null>(null);
  const [showHelp, setShowHelp] = useState(false);

  const selectedRegion = useTapestryStore((state) => state.selectedRegion);
  const customNoiseParams = useTapestryStore((state) => state.customNoiseParams);
  const customDuotoneColors = useTapestryStore((state) => state.customDuotoneColors);
  const duotoneBlendMode = useTapestryStore((state) => state.duotoneBlendMode);
  const noiseSeed = useTapestryStore((state) => state.noiseSeed);
  const zoom = useTapestryStore((state) => state.canvas.viewport.zoom);
  const setZoom = useTapestryStore((state) => state.setZoom);
  const canvasSize = useTapestryStore((state) => state.canvas.size);
  const setCanvasSize = useTapestryStore((state) => state.setCanvasSize);
  const canvasMode = useTapestryStore((state) => state.canvas.mode);
  const showScanlines = useTapestryStore((state) => state.showScanlines);
  const showFilmGrain = useTapestryStore((state) => state.showFilmGrain);
  const showVeins = useTapestryStore((state) => state.showVeins);
  const showSplatter = useTapestryStore((state) => state.showSplatter);
  const showBrushStrokes = useTapestryStore((state) => state.showBrushStrokes);
  const scanlinesIntensity = useTapestryStore((state) => state.scanlinesIntensity);
  const scanlinesOpacity = useTapestryStore((state) => state.scanlinesOpacity);
  const scanlinesSpacing = useTapestryStore((state) => state.scanlinesSpacing);
  const scanlinesThickness = useTapestryStore((state) => state.scanlinesThickness);
  const scanlinesBlendMode = useTapestryStore((state) => state.scanlinesBlendMode);
  const filmGrainIntensity = useTapestryStore((state) => state.filmGrainIntensity);
  const filmGrainOpacity = useTapestryStore((state) => state.filmGrainOpacity);
  const filmGrainSize = useTapestryStore((state) => state.filmGrainSize);
  const filmGrainBlendMode = useTapestryStore((state) => state.filmGrainBlendMode);
  const veinsIntensity = useTapestryStore((state) => state.veinsIntensity);
  const veinsOpacity = useTapestryStore((state) => state.veinsOpacity);
  const veinsScale = useTapestryStore((state) => state.veinsScale);
  const veinsBlendMode = useTapestryStore((state) => state.veinsBlendMode);
  const veinsColor = useTapestryStore((state) => state.veinsColor);
  const veinsSeed = useTapestryStore((state) => state.veinsSeed);
  const splatterLayers = useTapestryStore((state) => state.splatterLayers);
  const brushStrokesIntensity = useTapestryStore((state) => state.brushStrokesIntensity);
  const brushStrokesOpacity = useTapestryStore((state) => state.brushStrokesOpacity);
  const brushStrokesScale = useTapestryStore((state) => state.brushStrokesScale);
  const brushStrokesBlendMode = useTapestryStore((state) => state.brushStrokesBlendMode);
  const brushStrokesColor = useTapestryStore((state) => state.brushStrokesColor);
  const brushStrokesColor2 = useTapestryStore((state) => state.brushStrokesColor2);
  const brushStrokesColor3 = useTapestryStore((state) => state.brushStrokesColor3);
  const brushStrokesSeed = useTapestryStore((state) => state.brushStrokesSeed);
  const theme = useTapestryStore((state) => state.theme);
  const toggleTheme = useTapestryStore((state) => state.toggleTheme);
  const collageImages = useTapestryStore((state) => state.collageImages);
  const collageSeed = useTapestryStore((state) => state.collageSeed);
  const collageParams = useTapestryStore((state) => state.collageParams);
  const collageBlendMode = useTapestryStore((state) => state.collageBlendMode);
  const updateCollageImagePosition = useTapestryStore((state) => state.updateCollageImagePosition);
  const addCollageImage = useTapestryStore((state) => state.addCollageImage);
  const isAnimating = useTapestryStore((state) => state.isAnimating);
  const animationDuration = useTapestryStore((state) => state.animationDuration);
  const currentAnimationTime = useTapestryStore((state) => state.currentAnimationTime);

  const [backgroundImage, setBackgroundImage] = React.useState<HTMLImageElement | null>(null);
  const [rendererReady, setRendererReady] = React.useState(false);
  const [isDragging, setIsDragging] = React.useState(false);

  // Load default background image on mount
  React.useEffect(() => {
    const img = new Image();
    img.onload = () => setBackgroundImage(img);
    img.onerror = () => console.log('No background image found');
    img.src = '/assets/default-background.jpg';
  }, []);

  // Set fit-to-canvas zoom as default on mount
  React.useEffect(() => {
    const setDefaultZoom = () => {
      const canvasArea = document.querySelector('.canvas-area');
      if (!canvasArea) return;

      const viewportWidth = canvasArea.clientWidth;
      const viewportHeight = canvasArea.clientHeight;

      // Account for toolbar height and padding
      const toolbarHeight = 80;
      const padding = 40;
      const availableWidth = viewportWidth - padding * 2;
      const availableHeight = viewportHeight - toolbarHeight - padding * 2;

      // Calculate zoom that fits both dimensions
      const zoomWidth = availableWidth / canvasSize.width;
      const zoomHeight = availableHeight / canvasSize.height;
      const fitZoom = Math.min(zoomWidth, zoomHeight, 1); // Cap at 100%

      setZoom(Math.max(0.1, fitZoom));
    };

    // Run on mount and after a short delay to ensure layout is ready
    setTimeout(setDefaultZoom, 100);
  }, []); // Only run once on mount

  // Touchpad gestures: pinch zoom and two-finger pan
  React.useEffect(() => {
    const canvasArea = document.querySelector('.canvas-area');
    if (!canvasArea) return;

    const handleWheel = (e: WheelEvent) => {
      // Detect pinch zoom (ctrl + wheel or pinch gesture)
      if (e.ctrlKey || e.metaKey) {
        e.preventDefault();

        // Calculate zoom delta
        const delta = -e.deltaY * 0.01;
        const newZoom = Math.max(0.1, Math.min(2, zoom + delta));
        setZoom(newZoom);
      }
      // Two-finger pan would be handled by default scrolling behavior
      // but since canvas is centered, we don't need to implement pan
    };

    canvasArea.addEventListener('wheel', handleWheel, { passive: false });

    return () => {
      canvasArea.removeEventListener('wheel', handleWheel);
    };
  }, [zoom, setZoom]);

  // Get current gradient and params
  const gradient = REGIONAL_GRADIENTS.find((g) => g.id === selectedRegion);
  const noiseParams = customNoiseParams || gradient?.noiseParams;
  const duotoneColors = customDuotoneColors || gradient?.duotone;

  // Initialize WebGL renderer
  useEffect(() => {
    // Skip if renderer already exists (prevents double initialization in strict mode)
    if (rendererRef.current) {
      console.log('Renderer already exists, skipping initialization');
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) {
      console.log('Canvas ref is null');
      return;
    }

    // Set initial canvas size before creating WebGL context
    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;

    // Delay WebGL context creation slightly to avoid Chrome issues
    const timeoutId = setTimeout(() => {
      try {
        rendererRef.current = new WebGLNoiseRenderer(canvas);
        console.log('WebGL renderer initialized successfully');
        setRendererReady(true);
      } catch (error) {
        console.error('Failed to initialize WebGL:', error);
        setRendererReady(false);
      }
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      // Don't destroy the renderer on every re-render in strict mode
      // Only destroy on component unmount
    };
  }, []);

  // Update canvas element dimensions when canvasSize changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = canvasSize.width;
    canvas.height = canvasSize.height;
  }, [canvasSize.width, canvasSize.height]);

  // Render when parameters change
  useEffect(() => {
    if (!rendererReady) return;
    const renderer = rendererRef.current;
    if (!renderer || !noiseParams || !duotoneColors) return;

    renderer.render({
      width: canvasSize.width,
      height: canvasSize.height,
      colorA: duotoneColors.colorA,
      colorB: duotoneColors.colorB,
      scale: noiseParams.scale,
      octaves: noiseParams.octaves,
      lacunarity: noiseParams.lacunarity,
      gain: noiseParams.gain,
      contrast: noiseParams.contrast,
      grainIntensity: noiseParams.grainIntensity,
      seed: noiseSeed,
      time: 0, // Static for now
      backgroundImage: backgroundImage || undefined,
      blendMode: duotoneBlendMode,
    });

    // Pause by default (static mode)
    renderer.pause();
  }, [rendererReady, canvasSize, duotoneColors, noiseParams, noiseSeed, backgroundImage, duotoneBlendMode]);

  const handleZoomChange = (delta: number) => {
    const newZoom = Math.max(0.1, Math.min(2, zoom + delta));
    setZoom(newZoom);
  };

  // Drag and drop handlers
  const handleDragEnter = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.currentTarget === e.target) {
      setIsDragging(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFiles = files.filter(file => file.type.startsWith('image/'));

    imageFiles.forEach(file => {
      const reader = new FileReader();
      reader.onload = (event) => {
        const url = event.target?.result as string;
        const img = new Image();
        img.onload = () => {
          addCollageImage(file.name, url, img);
        };
        img.src = url;
      };
      reader.readAsDataURL(file);
    });
  };

  return (
    <div
      className="canvas-area"
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      {/* Drag overlay */}
      {isDragging && (
        <div className="drag-overlay">
          <div className="drag-overlay-content">
            <span className="drag-overlay-icon">📸</span>
            <span className="drag-overlay-text">Drop images to add to collage</span>
          </div>
        </div>
      )}


      <div className="canvas-wrapper">
        <div
          ref={containerRef}
          className="canvas-container"
          style={{
            width: `${canvasSize.width}px`,
            height: `${canvasSize.height}px`,
            transform: `scale(${zoom})`,
            transformOrigin: 'center center',
          }}
        >
        <div style={{
          position: 'relative',
          width: '100%',
          height: '100%',
        }}>
          {collageImages.length > 0 && (
            <ProceduralCollage
              width={canvasSize.width}
              height={canvasSize.height}
              images={collageImages}
              seed={collageSeed}
              params={collageParams}
              blendMode={collageBlendMode}
              animationTime={currentAnimationTime}
              animationDuration={animationDuration}
              isAnimating={isAnimating}
              onImagePositionUpdate={updateCollageImagePosition}
            />
          )}
          <canvas ref={canvasRef} className="canvas" />
          <ImageLayer />
          <SwooshLayer width={canvasSize.width} height={canvasSize.height} />
          <EffectsLayer
            width={canvasSize.width}
            height={canvasSize.height}
            showScanlines={showScanlines}
            showNoise={showFilmGrain}
            showVeins={showVeins}
            showSplatter={showSplatter}
            showBrushStrokes={showBrushStrokes}
            scanlinesIntensity={scanlinesIntensity}
            scanlinesOpacity={scanlinesOpacity}
            scanlinesSpacing={scanlinesSpacing}
            scanlinesThickness={scanlinesThickness}
            scanlinesBlendMode={scanlinesBlendMode}
            noiseIntensity={filmGrainIntensity}
            noiseOpacity={filmGrainOpacity}
            noiseSize={filmGrainSize}
            noiseBlendMode={filmGrainBlendMode}
            veinsIntensity={veinsIntensity}
            veinsOpacity={veinsOpacity}
            veinsScale={veinsScale}
            veinsBlendMode={veinsBlendMode}
            veinsColor={veinsColor}
            veinsSeed={veinsSeed}
            splatterLayers={splatterLayers}
            brushStrokesIntensity={brushStrokesIntensity}
            brushStrokesOpacity={brushStrokesOpacity}
            brushStrokesScale={brushStrokesScale}
            brushStrokesBlendMode={brushStrokesBlendMode}
            brushStrokesColor={brushStrokesColor}
            brushStrokesColor2={brushStrokesColor2}
            brushStrokesColor3={brushStrokesColor3}
            brushStrokesSeed={brushStrokesSeed}
            animationTime={currentAnimationTime}
            animationDuration={animationDuration}
            isAnimating={isAnimating}
          />
        </div>
        </div>
      </div>

      {/* Canvas Toolbar - combines zoom, animation mode, and theme toggle */}
      <CanvasToolbar />

      {/* Animation Controls - show when animating */}
      {isAnimating && <AnimationControls />}

      {/* Help Button */}
      <HelpButton onClick={() => setShowHelp(true)} />

      {/* Help Overlay */}
      <HelpOverlay isActive={showHelp} onClose={() => setShowHelp(false)} />
    </div>
  );
};
