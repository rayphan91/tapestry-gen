import React, { useMemo } from 'react';
import { generateSplatterSVG } from '@/utils/splatterGenerator';
import { generateVeinsSVG } from '@/utils/veinsGenerator';
import { generateBrushStrokeSVG } from '@/utils/brushStrokeGenerator';

interface EffectsLayerProps {
  width: number;
  height: number;
  showScanlines: boolean;
  showNoise: boolean;
  showVeins: boolean;
  showSplatter: boolean;
  showBrushStrokes: boolean;
  scanlinesIntensity: number;
  scanlinesOpacity: number;
  scanlinesSpacing: number;
  scanlinesThickness: number;
  scanlinesBlendMode: string;
  noiseIntensity: number;
  noiseOpacity: number;
  noiseSize: number;
  noiseBlendMode: string;
  veinsIntensity: number;
  veinsOpacity: number;
  veinsScale: number;
  veinsBlendMode: string;
  veinsColor: string;
  veinsSeed: number;
  splatterLayers: Array<{
    id: string;
    intensity: number;
    opacity: number;
    scale: number;
    blendMode: string;
    color: string;
    seed: number;
  }>;
  brushStrokesIntensity: number;
  brushStrokesOpacity: number;
  brushStrokesScale: number;
  brushStrokesBlendMode: string;
  brushStrokesColor: string;
  brushStrokesColor2: string;
  brushStrokesColor3: string;
  brushStrokesSeed: number;
  animationTime?: number;
  animationDuration?: number;
  isAnimating?: boolean;
}

export const EffectsLayer: React.FC<EffectsLayerProps> = ({
  width,
  height,
  showScanlines,
  showNoise,
  showVeins,
  showSplatter,
  showBrushStrokes,
  scanlinesIntensity,
  scanlinesOpacity,
  scanlinesSpacing,
  scanlinesThickness,
  scanlinesBlendMode,
  noiseIntensity,
  noiseOpacity,
  noiseSize,
  noiseBlendMode,
  veinsIntensity,
  veinsOpacity,
  veinsScale,
  veinsBlendMode,
  veinsColor,
  veinsSeed,
  splatterLayers,
  brushStrokesIntensity,
  brushStrokesOpacity,
  brushStrokesScale,
  brushStrokesBlendMode,
  brushStrokesColor,
  brushStrokesColor2,
  brushStrokesColor3,
  brushStrokesSeed,
  animationTime = 0,
  animationDuration = 8,
  isAnimating = false,
}) => {
  // Calculate animation transforms - memoized for performance
  const getAnimationTransform = React.useMemo(() => {
    return (index: number, type: 'veins' | 'splatter' | 'brush') => {
      if (!isAnimating || animationDuration === 0) {
        return { transform: 'translate3d(0, 0, 0) scale(1)', opacity: 1, willChange: 'auto' };
      }

      const t = (animationTime % animationDuration) / animationDuration;
      const phaseOffset = index * 0.15;
      const phase = (t + phaseOffset) % 1.0;

      // Position drift - reduced for better performance
      let xOffset = 0;
      let yOffset = 0;
      if (type === 'veins') {
        xOffset = Math.sin(phase * Math.PI * 2 + index) * 6;
        yOffset = Math.cos(phase * Math.PI * 2 + index * 0.5) * 6;
      } else if (type === 'splatter') {
        xOffset = Math.sin(phase * Math.PI * 2 + index * 0.7) * 8;
        yOffset = Math.cos(phase * Math.PI * 2 + index * 0.9) * 8;
      } else if (type === 'brush') {
        xOffset = Math.sin(phase * Math.PI * 2 + index * 1.2) * 5;
        yOffset = Math.cos(phase * Math.PI * 2 + index * 0.8) * 5;
      }

      // Scale animation - very subtle
      const scaleWave = Math.sin(phase * Math.PI * 2 + index * 0.3);
      const scale = 1.0 + scaleWave * 0.02;

      // Opacity fade - very subtle
      const opacityWave = Math.sin(phase * Math.PI * 2);
      const opacity = 0.96 + opacityWave * 0.04;

      return {
        transform: `translate3d(${xOffset.toFixed(1)}px, ${yOffset.toFixed(1)}px, 0) scale(${scale.toFixed(3)})`,
        opacity: parseFloat(opacity.toFixed(2)),
        willChange: 'transform, opacity',
      };
    };
  }, [isAnimating, animationTime, animationDuration]);
  // Generate procedural effects with memoization
  const veinsImage = useMemo(() => {
    if (!showVeins) return null;
    return generateVeinsSVG({
      width,
      height,
      intensity: veinsIntensity,
      scale: veinsScale,
      seed: veinsSeed,
      color: veinsColor,
    });
  }, [showVeins, width, height, veinsIntensity, veinsScale, veinsColor, veinsSeed]);

  // Generate images for splatter layers
  const splatterLayerImages = useMemo(() => {
    return splatterLayers.map((layer) => ({
      id: layer.id,
      image: generateSplatterSVG({
        width,
        height,
        intensity: layer.intensity,
        scale: layer.scale,
        seed: layer.seed,
        color: layer.color,
      }),
      opacity: layer.opacity,
      blendMode: layer.blendMode,
    }));
  }, [splatterLayers, width, height]);

  const brushStrokesImage = useMemo(() => {
    if (!showBrushStrokes) return null;
    return generateBrushStrokeSVG({
      width,
      height,
      intensity: brushStrokesIntensity,
      scale: brushStrokesScale,
      seed: brushStrokesSeed,
      color: brushStrokesColor,
    });
  }, [showBrushStrokes, width, height, brushStrokesIntensity, brushStrokesScale, brushStrokesColor, brushStrokesSeed]);

  return (
    <>
      {/* Veins Effect */}
      {showVeins && veinsImage && (() => {
        const animTransform = getAnimationTransform(0, 'veins');
        return (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 100,
              opacity: veinsOpacity * animTransform.opacity,
              backgroundImage: `url("${veinsImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: veinsBlendMode as any,
              transform: animTransform.transform,
              willChange: animTransform.willChange,
              transition: isAnimating ? 'none' : 'all 0.3s ease',
            }}
          />
        );
      })()}

      {/* Multiple Splatter Layers */}
      {showSplatter && splatterLayerImages.map((splatterLayer, index) => {
        const animTransform = getAnimationTransform(index, 'splatter');
        return (
          <div
            key={splatterLayer.id}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 150 + index + 1,
              opacity: splatterLayer.opacity * animTransform.opacity,
              backgroundImage: `url("${splatterLayer.image}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: splatterLayer.blendMode as any,
              transform: animTransform.transform,
              willChange: animTransform.willChange,
              transition: isAnimating ? 'none' : 'all 0.3s ease',
            }}
          />
        );
      })}

      {/* Brush Strokes Effect */}
      {showBrushStrokes && brushStrokesImage && (() => {
        const animTransform = getAnimationTransform(0, 'brush');
        return (
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              pointerEvents: 'none',
              zIndex: 175,
              opacity: brushStrokesOpacity * animTransform.opacity,
              backgroundImage: `url("${brushStrokesImage}")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              mixBlendMode: brushStrokesBlendMode as any,
              transform: animTransform.transform,
              willChange: animTransform.willChange,
              transition: isAnimating ? 'none' : 'all 0.3s ease',
            }}
          />
        );
      })()}

      {/* Film Grain Noise Effect - renders above swooshes */}
      {showNoise && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 2000,
            opacity: noiseOpacity * noiseIntensity,
            mixBlendMode: noiseBlendMode as any,
            backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='${0.5 + noiseSize * 1.5}' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
          }}
        />
      )}

      {/* Scanlines Effect - renders on top of everything */}
      {showScanlines && (
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none',
            zIndex: 3000,
            opacity: scanlinesOpacity,
            background: `repeating-linear-gradient(
              0deg,
              rgba(0, 0, 0, ${scanlinesIntensity}),
              rgba(0, 0, 0, ${scanlinesIntensity}) ${scanlinesThickness}px,
              transparent ${scanlinesThickness}px,
              transparent ${scanlinesSpacing}px
            )`,
            mixBlendMode: scanlinesBlendMode as any,
          }}
        />
      )}
    </>
  );
};
