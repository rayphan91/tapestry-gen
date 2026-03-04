import type { Layer } from '@/types';
import type { Swoosh } from '@/store/useSwooshStore';

interface TapestryState {
  selectedRegion: string;
  layers: Layer[];
  collageImages: Array<{
    id: string;
    name: string;
    url: string;
    img: HTMLImageElement;
  }>;
  swooshes?: Swoosh[];
  showFilmGrain: boolean;
  showScanlines: boolean;
  showVeins: boolean;
  showSplatter: boolean;
  showBrushStrokes: boolean;
}

export interface ValidationResult {
  isValid: boolean;
  issues: string[];
  warnings: string[];
  checklist: {
    hasGradient: boolean;
    hasVisibleLayers: boolean;
    hasCollageImages: boolean;
    hasSwooshes: boolean;
    hasEffects: boolean;
    allImagesLoaded: boolean;
  };
  completionPercentage: number;
}

export function validateTapestryExport(state: TapestryState): ValidationResult {
  const issues: string[] = [];
  const warnings: string[] = [];

  // Required: At least base gradient exists
  const hasGradient = !!state.selectedRegion && state.selectedRegion !== '';
  if (!hasGradient) {
    issues.push('No gradient selected');
  }

  // Check for visible layers
  const visibleLayers = state.layers.filter((l) => l.visible);
  const hasVisibleLayers = visibleLayers.length > 0;

  // Check for collage images
  const hasCollageImages = state.collageImages.length > 0;

  // Check for swooshes
  const hasSwooshes = (state.swooshes?.length || 0) > 0;

  // Check for visible effects
  const hasEffects =
    state.showFilmGrain ||
    state.showScanlines ||
    state.showVeins ||
    state.showSplatter ||
    state.showBrushStrokes;

  // Validate all images loaded (check for broken URLs)
  let allImagesLoaded = true;
  for (const layer of visibleLayers) {
    if (layer.type === 'image') {
      const imageLayer = layer as any;
      if (!imageLayer.imageUrl) {
        allImagesLoaded = false;
        break;
      }
    }
  }

  // Warnings (not blockers)
  if (!hasVisibleLayers && !hasCollageImages && !hasSwooshes && !hasEffects) {
    warnings.push('Tapestry only contains gradient - consider adding more elements');
  }

  if (hasVisibleLayers && visibleLayers.every((l: any) => l.appearance?.opacity < 10)) {
    warnings.push('All visible layers have very low opacity');
  }

  // Calculate completion percentage
  const checklistItems = [
    hasGradient,
    hasVisibleLayers,
    hasCollageImages,
    hasSwooshes,
    hasEffects,
    allImagesLoaded,
  ];
  const completedItems = checklistItems.filter(Boolean).length;
  const completionPercentage = Math.round((completedItems / checklistItems.length) * 100);

  const isValid = issues.length === 0 && hasGradient;

  return {
    isValid,
    issues,
    warnings,
    checklist: {
      hasGradient,
      hasVisibleLayers,
      hasCollageImages,
      hasSwooshes,
      hasEffects,
      allImagesLoaded,
    },
    completionPercentage,
  };
}
