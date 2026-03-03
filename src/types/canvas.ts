// Canvas and Export Types

export interface CanvasSize {
  width: number;
  height: number;
}

export interface CanvasViewport {
  zoom: number; // 0.1 to 2.0
  pan: {
    x: number;
    y: number;
  };
}

export type ExportFormat = 'png' | 'jpeg' | 'svg';

export interface ExportOptions {
  format: ExportFormat;
  quality: number; // 1-100 for JPEG
  width: number;
  height: number;
  scale: number; // 1x, 2x, 3x for retina
}

export interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type CanvasMode = 'static' | 'animate';

export interface CanvasState {
  mode: CanvasMode;
  size: CanvasSize;
  viewport: CanvasViewport;
  backgroundColor: string;
}
