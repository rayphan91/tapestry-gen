import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type {
  Layer,
  CanvasState,
  CanvasMode,
  RegionId,
  ExportOptions,
  NoiseParams,
  DuotoneColors,
} from '@/types';
import { REGIONAL_GRADIENTS } from '@/types';

type SelectionType = 'region' | 'image' | 'texture' | 'effect' | null;

interface TapestryState {
  // Canvas State
  canvas: CanvasState;
  selectedRegion: RegionId;
  customNoiseParams: NoiseParams | null;
  customDuotoneColors: DuotoneColors | null;
  duotoneBlendMode: string;
  noiseSeed: number;

  // Effects
  showScanlines: boolean;
  showFilmGrain: boolean;
  showVeins: boolean;
  showSplatter: boolean;
  showBrushStrokes: boolean;
  splatterLayers: Array<{
    id: string;
    intensity: number;
    opacity: number;
    scale: number;
    blendMode: string;
    color: string;
    seed: number;
  }>;
  scanlinesIntensity: number; // 0-1
  scanlinesOpacity: number; // 0-1
  scanlinesSpacing: number; // pixels
  scanlinesThickness: number; // 0-1
  scanlinesBlendMode: string;
  filmGrainIntensity: number; // 0-1
  filmGrainOpacity: number; // 0-1
  filmGrainSize: number; // 0-1
  filmGrainBlendMode: string;
  veinsIntensity: number; // 0-1
  veinsOpacity: number; // 0-1
  veinsScale: number; // 0-1
  veinsBlendMode: string;
  veinsColor: string;
  veinsSeed: number;
  splatterIntensity: number; // 0-1
  splatterOpacity: number; // 0-1
  splatterScale: number; // 0-1
  splatterBlendMode: string;
  splatterColor: string;
  splatterColor2: string; // Second tone
  splatterColor3: string; // Third tone
  splatterSeed: number;
  swooshOpacity: number; // 0-1 global opacity for all swoosh layers
  brushStrokesIntensity: number; // 0-1
  brushStrokesOpacity: number; // 0-1
  brushStrokesScale: number; // 0-1
  brushStrokesGrain: number; // 0-1
  brushStrokesBlendMode: string;
  brushStrokesColor: string;
  brushStrokesColor2: string;
  brushStrokesColor3: string;
  brushStrokesSeed: number;

  // Procedural Collage
  collageImages: Array<{
    id: string;
    name: string;
    url: string;
    img: HTMLImageElement;
    position?: { x: number; y: number }; // Optional custom position (0-1 normalized)
    scale?: number; // Optional custom scale multiplier
  }>;
  collageSeed: number;
  collageParams: {
    fog: number; // 0-1
    vignette: number; // 0-1
    scaleSpread: number; // 0-1
    rotation: number; // 0-45 degrees
    grain: number; // 0-1
    saturation: number; // 0-1
  };
  collageBlendMode: string;
  showCollage: boolean;

  // Animation
  isAnimating: boolean;
  animationDuration: number; // seconds
  currentAnimationTime: number; // current playback time in seconds
  animationSpeed: number; // playback speed multiplier (0.5 = half speed, 2 = double speed)

  // Selection
  selectionType: SelectionType;

  // Layers
  layers: Layer[];
  selectedLayerId: string | null;

  // UI State
  leftSidebarCollapsed: boolean;
  rightSidebarCollapsed: boolean;
  theme: 'dark' | 'light';
  controlMode: 'auto' | 'manual';

  // Canvas Actions
  setCanvasMode: (mode: CanvasMode) => void;
  setZoom: (zoom: number) => void;
  setPan: (x: number, y: number) => void;
  setSelectedRegion: (regionId: RegionId) => void;
  setCustomNoiseParams: (params: NoiseParams) => void;
  setCustomDuotoneColors: (colors: DuotoneColors) => void;
  setDuotoneBlendMode: (mode: string) => void;
  setNoiseSeed: (seed: number) => void;
  randomizeNoiseSeed: () => void;
  flipDuotoneColors: () => void;
  setCanvasSize: (width: number, height: number) => void;

  // Layer Actions
  addLayer: (layer: Layer) => void;
  removeLayer: (layerId: string) => void;
  updateLayer: (layerId: string, updates: Partial<Layer>) => void;
  reorderLayers: (layerIds: string[]) => void;
  selectLayer: (layerId: string | null) => void;
  toggleLayerVisibility: (layerId: string) => void;
  toggleLayerLock: (layerId: string) => void;

  // Effects Actions
  toggleScanlines: () => void;
  toggleFilmGrain: () => void;
  toggleVeins: () => void;
  toggleSplatter: () => void;
  toggleBrushStrokes: () => void;
  setScanlinesIntensity: (intensity: number) => void;
  setScanlinesOpacity: (opacity: number) => void;
  setScanlinesSpacing: (spacing: number) => void;
  setScanlinesThickness: (thickness: number) => void;
  setScanlinesBlendMode: (mode: string) => void;
  setFilmGrainIntensity: (intensity: number) => void;
  setFilmGrainOpacity: (opacity: number) => void;
  setFilmGrainSize: (size: number) => void;
  setFilmGrainBlendMode: (mode: string) => void;
  setVeinsIntensity: (intensity: number) => void;
  setVeinsOpacity: (opacity: number) => void;
  setVeinsScale: (scale: number) => void;
  setVeinsBlendMode: (mode: string) => void;
  setVeinsColor: (color: string) => void;
  setVeinsSeed: (seed: number) => void;
  randomizeVeinsSeed: () => void;
  setSplatterIntensity: (intensity: number) => void;
  setSplatterOpacity: (opacity: number) => void;
  setSplatterScale: (scale: number) => void;
  setSplatterBlendMode: (mode: string) => void;
  setSplatterColor: (color: string) => void;
  setSplatterColor2: (color: string) => void;
  setSplatterColor3: (color: string) => void;
  setSplatterSeed: (seed: number) => void;
  randomizeSplatterSeed: () => void;
  randomizeAllEffects: () => void;
  setSwooshOpacity: (opacity: number) => void;
  setBrushStrokesIntensity: (intensity: number) => void;
  setBrushStrokesOpacity: (opacity: number) => void;
  setBrushStrokesScale: (scale: number) => void;
  setBrushStrokesGrain: (grain: number) => void;
  setBrushStrokesBlendMode: (mode: string) => void;
  setBrushStrokesColor: (color: string) => void;
  setBrushStrokesColor2: (color: string) => void;
  setBrushStrokesColor3: (color: string) => void;
  setBrushStrokesSeed: (seed: number) => void;
  randomizeBrushStrokesSeed: () => void;
  addSplatterLayer: () => void;
  removeSplatterLayer: (id: string) => void;
  updateSplatterLayer: (id: string, updates: Partial<{intensity: number; opacity: number; scale: number; blendMode: string; color: string; seed: number}>) => void;

  // Collage Actions
  addCollageImage: (name: string, url: string, img: HTMLImageElement) => void;
  removeCollageImage: (id: string) => void;
  clearAllCollageImages: () => void;
  updateCollageImagePosition: (id: string, position: { x: number; y: number }) => void;
  updateCollageImageScale: (id: string, scale: number) => void;
  setCollageSeed: (seed: number) => void;
  randomizeCollageSeed: () => void;
  setCollageParam: (key: string, value: number) => void;
  setCollageBlendMode: (mode: string) => void;
  toggleCollage: () => void;

  // Animation Actions
  toggleAnimation: () => void;
  setAnimationDuration: (duration: number) => void;
  setCurrentAnimationTime: (time: number) => void;
  setAnimationSpeed: (speed: number) => void;

  // UI Actions
  toggleLeftSidebar: () => void;
  toggleRightSidebar: () => void;
  toggleTheme: () => void;
  setControlMode: (mode: 'auto' | 'manual') => void;

  // Export
  exportCanvas: (options: ExportOptions) => Promise<Blob>;
}

const DEFAULT_CANVAS_STATE: CanvasState = {
  mode: 'static',
  size: {
    width: 1920,
    height: 1080,
  },
  viewport: {
    zoom: 1,
    pan: { x: 0, y: 0 },
  },
  backgroundColor: '#ffffff',
};

export const useTapestryStore = create<TapestryState>()(
  devtools(
    (set, get) => ({
      // Initial State
      canvas: DEFAULT_CANVAS_STATE,
      selectedRegion: 'australasia_sasia',
      customNoiseParams: null,
      customDuotoneColors: null,
      duotoneBlendMode: 'hard-light',
      noiseSeed: Math.random(),
      showScanlines: true,
      showFilmGrain: true,
      showVeins: true,
      showSplatter: true,
      showBrushStrokes: true,
      splatterLayers: [
        {
          id: `splatter-${Date.now()}-1`,
          intensity: 0.5,
          opacity: 1.0,
          scale: 0.5,
          blendMode: 'overlay',
          color: '#8852f8',
          seed: Math.random(),
        },
        {
          id: `splatter-${Date.now()}-2`,
          intensity: 0.5,
          opacity: 1.0,
          scale: 0.5,
          blendMode: 'screen',
          color: '#ec6244',
          seed: Math.random(),
        },
      ],
      scanlinesIntensity: 0.68,
      scanlinesOpacity: 1.0,
      scanlinesSpacing: 3,
      scanlinesThickness: 0.9,
      scanlinesBlendMode: 'overlay',
      filmGrainIntensity: 0.07,
      filmGrainOpacity: 1.0,
      filmGrainSize: 0.5,
      filmGrainBlendMode: 'overlay',
      veinsIntensity: 0.5,
      veinsOpacity: 1.0,
      veinsScale: 0.5,
      veinsBlendMode: 'overlay',
      veinsColor: '#ffffff',
      veinsSeed: Math.random(),
      splatterIntensity: 0.5,
      splatterOpacity: 1.0,
      splatterScale: 0.5,
      splatterBlendMode: 'normal',
      splatterColor: '#7542f8',
      splatterColor2: '#333333',
      splatterColor3: '#1a1a1a',
      splatterSeed: Math.random(),
      swooshOpacity: 1.0,
      brushStrokesIntensity: 0.3,
      brushStrokesOpacity: 1.0,
      brushStrokesScale: 0.5,
      brushStrokesGrain: 0.5,
      brushStrokesBlendMode: 'multiply',
      brushStrokesColor: '#512425',
      brushStrokesColor2: '#1a1a1a',
      brushStrokesColor3: '#1a1a1a',
      brushStrokesSeed: Math.random(),
      collageImages: [],
      collageSeed: Math.random(),
      collageParams: {
        fog: 0.55,
        vignette: 0.58,
        scaleSpread: 0.4,
        rotation: 14,
        grain: 0.28,
        saturation: 0.75,
      },
      collageBlendMode: 'soft-light',
      showCollage: false,
      isAnimating: false,
      animationDuration: 8,
      currentAnimationTime: 0,
      animationSpeed: 1.0,
      selectionType: 'region',
      layers: [],
      selectedLayerId: null,
      leftSidebarCollapsed: false,
      rightSidebarCollapsed: false,
      theme: 'dark',
      controlMode: 'manual',

      // Canvas Actions
      setCanvasMode: (mode) =>
        set((state) => ({
          canvas: { ...state.canvas, mode },
        })),

      setZoom: (zoom) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            viewport: { ...state.canvas.viewport, zoom },
          },
        })),

      setPan: (x, y) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            viewport: { ...state.canvas.viewport, pan: { x, y } },
          },
        })),

      setSelectedRegion: (regionId) =>
        set({ selectedRegion: regionId, selectionType: 'region', customDuotoneColors: null }),

      setCustomNoiseParams: (params) =>
        set({ customNoiseParams: params }),

      setCustomDuotoneColors: (colors) =>
        set({ customDuotoneColors: colors }),

      setDuotoneBlendMode: (mode) =>
        set({ duotoneBlendMode: mode }),

      setNoiseSeed: (seed) =>
        set({ noiseSeed: seed }),

      randomizeNoiseSeed: () =>
        set({ noiseSeed: Math.random() }),

      flipDuotoneColors: () =>
        set((state) => {
          const gradient = REGIONAL_GRADIENTS.find((g) => g.id === state.selectedRegion);
          const currentColors = state.customDuotoneColors || gradient?.duotone;
          if (!currentColors) return {};
          return {
            customDuotoneColors: {
              colorA: currentColors.colorB,
              colorB: currentColors.colorA,
            },
          };
        }),

      setCanvasSize: (width, height) =>
        set((state) => ({
          canvas: {
            ...state.canvas,
            size: { width, height },
          },
        })),

      // Layer Actions
      addLayer: (layer) =>
        set((state) => ({
          layers: [...state.layers, layer],
          selectedLayerId: layer.id,
        })),

      removeLayer: (layerId) =>
        set((state) => ({
          layers: state.layers.filter((l) => l.id !== layerId),
          selectedLayerId:
            state.selectedLayerId === layerId ? null : state.selectedLayerId,
        })),

      updateLayer: (layerId, updates) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, ...updates } as any : layer
          ),
        })),

      reorderLayers: (layerIds) =>
        set((state) => {
          const layerMap = new Map(state.layers.map((l) => [l.id, l]));
          return {
            layers: layerIds
              .map((id) => layerMap.get(id))
              .filter((l): l is Layer => l !== undefined),
          };
        }),

      selectLayer: (layerId) =>
        set({ selectedLayerId: layerId }),

      toggleLayerVisibility: (layerId) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId
              ? { ...layer, visible: !layer.visible }
              : layer
          ),
        })),

      toggleLayerLock: (layerId) =>
        set((state) => ({
          layers: state.layers.map((layer) =>
            layer.id === layerId ? { ...layer, locked: !layer.locked } : layer
          ),
        })),

      // Effects Actions
      toggleScanlines: () =>
        set((state) => ({
          showScanlines: !state.showScanlines,
        })),

      toggleFilmGrain: () =>
        set((state) => ({
          showFilmGrain: !state.showFilmGrain,
        })),

      toggleVeins: () =>
        set((state) => ({
          showVeins: !state.showVeins,
        })),

      toggleSplatter: () =>
        set((state) => ({
          showSplatter: !state.showSplatter,
        })),

      toggleBrushStrokes: () =>
        set((state) => ({
          showBrushStrokes: !state.showBrushStrokes,
        })),

      setScanlinesIntensity: (intensity) =>
        set(() => ({
          scanlinesIntensity: Math.max(0, Math.min(1, intensity)),
        })),

      setScanlinesOpacity: (opacity) =>
        set(() => ({
          scanlinesOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setScanlinesSpacing: (spacing) =>
        set(() => ({
          scanlinesSpacing: Math.max(1, Math.min(10, spacing)),
        })),

      setScanlinesThickness: (thickness) =>
        set(() => ({
          scanlinesThickness: Math.max(0, Math.min(1, thickness)),
        })),

      setScanlinesBlendMode: (mode) =>
        set(() => ({
          scanlinesBlendMode: mode,
        })),

      setFilmGrainIntensity: (intensity) =>
        set(() => ({
          filmGrainIntensity: Math.max(0, Math.min(1, intensity)),
        })),

      setFilmGrainOpacity: (opacity) =>
        set(() => ({
          filmGrainOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setFilmGrainSize: (size) =>
        set(() => ({
          filmGrainSize: Math.max(0, Math.min(1, size)),
        })),

      setFilmGrainBlendMode: (mode) =>
        set(() => ({
          filmGrainBlendMode: mode,
        })),

      setVeinsIntensity: (intensity) =>
        set(() => ({
          veinsIntensity: Math.max(0, Math.min(1, intensity)),
        })),

      setVeinsOpacity: (opacity) =>
        set(() => ({
          veinsOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setVeinsScale: (scale) =>
        set(() => ({
          veinsScale: Math.max(0, Math.min(1, scale)),
        })),

      setVeinsBlendMode: (mode) =>
        set(() => ({
          veinsBlendMode: mode,
        })),

      setVeinsColor: (color) =>
        set(() => ({
          veinsColor: color,
        })),

      setVeinsSeed: (seed) =>
        set(() => ({
          veinsSeed: seed,
        })),

      randomizeVeinsSeed: () =>
        set(() => ({
          veinsSeed: Math.random(),
        })),

      setSplatterIntensity: (intensity) =>
        set(() => ({
          splatterIntensity: Math.max(0, Math.min(1, intensity)),
        })),

      setSplatterOpacity: (opacity) =>
        set(() => ({
          splatterOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setSplatterScale: (scale) =>
        set(() => ({
          splatterScale: Math.max(0, Math.min(1, scale)),
        })),

      setSplatterBlendMode: (mode) =>
        set(() => ({
          splatterBlendMode: mode,
        })),

      setSplatterColor: (color) =>
        set(() => ({
          splatterColor: color,
        })),

      setSplatterColor2: (color) =>
        set(() => ({
          splatterColor2: color,
        })),

      setSplatterColor3: (color) =>
        set(() => ({
          splatterColor3: color,
        })),

      setSplatterSeed: (seed) =>
        set(() => ({
          splatterSeed: seed,
        })),

      randomizeSplatterSeed: () =>
        set(() => ({
          splatterSeed: Math.random(),
        })),

      setSwooshOpacity: (opacity) =>
        set(() => ({
          swooshOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setBrushStrokesIntensity: (intensity) =>
        set(() => ({
          brushStrokesIntensity: Math.max(0, Math.min(1, intensity)),
        })),

      setBrushStrokesOpacity: (opacity) =>
        set(() => ({
          brushStrokesOpacity: Math.max(0, Math.min(1, opacity)),
        })),

      setBrushStrokesScale: (scale) =>
        set(() => ({
          brushStrokesScale: Math.max(0, Math.min(1, scale)),
        })),

      setBrushStrokesGrain: (grain) =>
        set(() => ({
          brushStrokesGrain: Math.max(0, Math.min(1, grain)),
        })),

      setBrushStrokesBlendMode: (mode) =>
        set(() => ({
          brushStrokesBlendMode: mode,
        })),

      setBrushStrokesColor: (color) =>
        set(() => ({
          brushStrokesColor: color,
        })),

      setBrushStrokesColor2: (color) =>
        set(() => ({
          brushStrokesColor2: color,
        })),

      setBrushStrokesColor3: (color) =>
        set(() => ({
          brushStrokesColor3: color,
        })),

      setBrushStrokesSeed: (seed) =>
        set(() => ({
          brushStrokesSeed: seed,
        })),

      randomizeBrushStrokesSeed: () =>
        set(() => ({
          brushStrokesSeed: Math.random(),
        })),

      randomizeAllEffects: () =>
        set((state) => ({
          veinsSeed: Math.random(),
          splatterSeed: Math.random(),
          brushStrokesSeed: Math.random(),
          splatterLayers: state.splatterLayers.map((layer) => ({
            ...layer,
            seed: Math.random(),
          })),
        })),

      addSplatterLayer: () =>
        set((state) => ({
          splatterLayers: [
            ...state.splatterLayers,
            {
              id: `splatter-${Date.now()}-${Math.random()}`,
              intensity: 0.5,
              opacity: 1.0,
              scale: 0.5,
              blendMode: 'normal',
              color: '#7542f8',
              seed: Math.random(),
            },
          ],
        })),

      removeSplatterLayer: (id) =>
        set((state) => ({
          splatterLayers: state.splatterLayers.filter((layer) => layer.id !== id),
        })),

      updateSplatterLayer: (id, updates) =>
        set((state) => ({
          splatterLayers: state.splatterLayers.map((layer) =>
            layer.id === id ? { ...layer, ...updates } : layer
          ),
        })),

      // Collage Actions
      addCollageImage: (name, url, img) =>
        set((state) => ({
          collageImages: [
            ...state.collageImages,
            {
              id: `collage-img-${Date.now()}-${Math.random()}`,
              name,
              url,
              img,
            },
          ],
        })),

      removeCollageImage: (id) =>
        set((state) => ({
          collageImages: state.collageImages.filter((img) => img.id !== id),
        })),

      clearAllCollageImages: () =>
        set(() => ({
          collageImages: [],
        })),

      updateCollageImagePosition: (id, position) =>
        set((state) => ({
          collageImages: state.collageImages.map((img) =>
            img.id === id ? { ...img, position } : img
          ),
        })),

      updateCollageImageScale: (id, scale) =>
        set((state) => ({
          collageImages: state.collageImages.map((img) =>
            img.id === id ? { ...img, scale } : img
          ),
        })),

      setCollageSeed: (seed) =>
        set(() => ({
          collageSeed: seed,
        })),

      randomizeCollageSeed: () =>
        set(() => ({
          collageSeed: Math.random(),
        })),

      setCollageParam: (key, value) =>
        set((state) => ({
          collageParams: {
            ...state.collageParams,
            [key]: value,
          },
        })),

      setCollageBlendMode: (mode) =>
        set(() => ({
          collageBlendMode: mode,
        })),

      toggleCollage: () =>
        set((state) => ({
          showCollage: !state.showCollage,
        })),

      // Animation Actions
      toggleAnimation: () =>
        set((state) => ({
          isAnimating: !state.isAnimating,
          currentAnimationTime: !state.isAnimating ? 0 : state.currentAnimationTime,
        })),

      setAnimationDuration: (duration) =>
        set(() => ({
          animationDuration: Math.max(1, Math.min(60, duration)),
        })),

      setCurrentAnimationTime: (time) =>
        set((state) => ({
          currentAnimationTime: Math.max(0, Math.min(state.animationDuration, time)),
        })),

      setAnimationSpeed: (speed) =>
        set(() => ({
          animationSpeed: Math.max(0.25, Math.min(4, speed)),
        })),

      // UI Actions
      toggleLeftSidebar: () =>
        set((state) => ({
          leftSidebarCollapsed: !state.leftSidebarCollapsed,
        })),

      toggleRightSidebar: () =>
        set((state) => ({
          rightSidebarCollapsed: !state.rightSidebarCollapsed,
        })),

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'dark' ? 'light' : 'dark',
        })),

      setControlMode: (mode) =>
        set(() => ({
          controlMode: mode,
        })),

      // Export
      exportCanvas: async (options) => {
        // This will be implemented with Fabric.js canvas export
        throw new Error('Export not yet implemented');
      },
    }),
    { name: 'TapestryStore' }
  )
);
