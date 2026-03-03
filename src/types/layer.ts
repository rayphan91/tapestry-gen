// Layer Types for Tapestry V3

export type BlendMode =
  | 'normal'
  | 'multiply'
  | 'screen'
  | 'overlay'
  | 'darken'
  | 'lighten'
  | 'color-dodge'
  | 'color-burn'
  | 'hard-light'
  | 'soft-light'
  | 'difference'
  | 'exclusion'
  | 'hue'
  | 'saturation'
  | 'color'
  | 'luminosity'
  | 'divide';

export type LayerType =
  | 'gradient'      // Regional gradient background
  | 'image'         // Uploaded image
  | 'texture'       // Procedural texture (swoosh/splatter)
  | 'effect'        // Post-processing effects (noise/scanlines)
  | 'adjustment';   // Color adjustments

export type TextureType = 'swoosh' | 'splatter';
export type EffectType = 'noise' | 'scanlines';

export interface LayerPosition {
  x: number;
  y: number;
}

export interface LayerDimensions {
  width: number;
  height: number;
}

export interface LayerTransform {
  position: LayerPosition;
  dimensions: LayerDimensions;
  rotation: number; // degrees
  scaleX: number;
  scaleY: number;
  flipX: boolean;
  flipY: boolean;
}

export interface LayerAppearance {
  blendMode: BlendMode;
  opacity: number; // 0-100
  feather: number; // 0-100
  hue: number; // -180 to 180
  saturation: number; // -100 to 100
  brightness: number; // -100 to 100
  contrast: number; // -100 to 100
}

export interface BaseLayer {
  id: string;
  name: string;
  type: LayerType;
  visible: boolean;
  locked: boolean;
  order: number; // z-index
  transform: LayerTransform;
  appearance: LayerAppearance;
}

export interface GradientLayer extends BaseLayer {
  type: 'gradient';
  gradientId: string; // Reference to regional gradient
}

export interface ImageLayer extends BaseLayer {
  type: 'image';
  imageUrl: string;
  originalWidth: number;
  originalHeight: number;
  fileName: string;
}

export interface TextureLayer extends BaseLayer {
  type: 'texture';
  textureType: TextureType;
  seed: number;
  intensity: number;
  scale: number;
}

export interface EffectLayer extends BaseLayer {
  type: 'effect';
  effectType: EffectType;
  intensity: number;
  params?: Record<string, any>; // Effect-specific parameters
}

export interface AdjustmentLayer extends BaseLayer {
  type: 'adjustment';
  adjustments: {
    hue: number;
    saturation: number;
    brightness: number;
    contrast: number;
  };
}

export type Layer =
  | GradientLayer
  | ImageLayer
  | TextureLayer
  | EffectLayer
  | AdjustmentLayer;
