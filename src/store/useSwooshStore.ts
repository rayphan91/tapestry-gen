import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { Swoosh, SwooshPoint } from '@/utils/swooshRenderer2D';
import { generateRandomSwoosh } from '@/utils/swooshGenerator';

interface SwooshState {
  swooshes: Swoosh[];
  selectedSwooshId: string | null;
  selectedPointIndex: number | null;
  isDrawing: boolean;
  currentDrawingSwoosh: Swoosh | null;
  drawMode: boolean; // Toggle between generate and draw mode

  // Actions
  addSwoosh: (swoosh: Swoosh) => void;
  removeSwoosh: (swooshId: string) => void;
  updateSwoosh: (swooshId: string, updates: Partial<Swoosh>) => void;
  selectSwoosh: (swooshId: string | null) => void;
  selectPoint: (pointIndex: number | null) => void;
  updateSwooshPoint: (swooshId: string, pointIndex: number, point: Partial<SwooshPoint>) => void;
  addPointToSwoosh: (swooshId: string, point: SwooshPoint, insertAtIndex?: number) => void;
  removePointFromSwoosh: (swooshId: string, pointIndex: number) => void;
  startDrawing: (initialPoint: SwooshPoint, color: string) => void;
  continueDrawing: (point: SwooshPoint) => void;
  finishDrawing: () => void;
  cancelDrawing: () => void;
  clearAllSwooshes: () => void;
  toggleDrawMode: () => void;
}

let swooshIdCounter = 0;

export const useSwooshStore = create<SwooshState>()(
  devtools(
    (set, get) => ({
      swooshes: [],
      selectedSwooshId: null,
      selectedPointIndex: null,
      isDrawing: false,
      currentDrawingSwoosh: null,
      drawMode: false,

      addSwoosh: (swoosh) =>
        set((state) => ({
          swooshes: [...state.swooshes, swoosh],
        })),

      removeSwoosh: (swooshId) =>
        set((state) => ({
          swooshes: state.swooshes.filter((s) => s.id !== swooshId),
          selectedSwooshId: state.selectedSwooshId === swooshId ? null : state.selectedSwooshId,
        })),

      updateSwoosh: (swooshId, updates) =>
        set((state) => ({
          swooshes: state.swooshes.map((swoosh) =>
            swoosh.id === swooshId ? { ...swoosh, ...updates } : swoosh
          ),
        })),

      selectSwoosh: (swooshId) =>
        set({
          selectedSwooshId: swooshId,
          selectedPointIndex: null,
        }),

      selectPoint: (pointIndex) =>
        set({ selectedPointIndex: pointIndex }),

      updateSwooshPoint: (swooshId, pointIndex, pointUpdate) =>
        set((state) => ({
          swooshes: state.swooshes.map((swoosh) => {
            if (swoosh.id !== swooshId) return swoosh;

            const newPoints = [...swoosh.points];
            newPoints[pointIndex] = { ...newPoints[pointIndex], ...pointUpdate };

            return { ...swoosh, points: newPoints };
          }),
        })),

      addPointToSwoosh: (swooshId, point, insertAtIndex) =>
        set((state) => ({
          swooshes: state.swooshes.map((swoosh) => {
            if (swoosh.id !== swooshId) return swoosh;

            const newPoints = [...swoosh.points];
            if (insertAtIndex !== undefined) {
              newPoints.splice(insertAtIndex, 0, point);
            } else {
              newPoints.push(point);
            }

            return { ...swoosh, points: newPoints };
          }),
        })),

      removePointFromSwoosh: (swooshId, pointIndex) =>
        set((state) => ({
          swooshes: state.swooshes.map((swoosh) => {
            if (swoosh.id !== swooshId) return swoosh;

            const newPoints = swoosh.points.filter((_, idx) => idx !== pointIndex);

            return { ...swoosh, points: newPoints };
          }),
        })),

      startDrawing: (initialPoint, color = '#ffdd00') => {
        const swoosh: Swoosh = {
          id: `swoosh-${++swooshIdCounter}`,
          points: [initialPoint],
          color,
          thickness: 200,
          opacity: 0.3,
          blendMode: 'soft-light',
        };

        set({
          isDrawing: true,
          currentDrawingSwoosh: swoosh,
        });
      },

      continueDrawing: (point) =>
        set((state) => {
          if (!state.currentDrawingSwoosh) return {};

          return {
            currentDrawingSwoosh: {
              ...state.currentDrawingSwoosh,
              points: [...state.currentDrawingSwoosh.points, point],
            },
          };
        }),

      finishDrawing: () =>
        set((state) => {
          if (!state.currentDrawingSwoosh) return { isDrawing: false };

          return {
            swooshes: [...state.swooshes, state.currentDrawingSwoosh],
            selectedSwooshId: state.currentDrawingSwoosh.id,
            isDrawing: false,
            currentDrawingSwoosh: null,
          };
        }),

      cancelDrawing: () =>
        set({
          isDrawing: false,
          currentDrawingSwoosh: null,
        }),

      clearAllSwooshes: () =>
        set({
          swooshes: [],
          selectedSwooshId: null,
          selectedPointIndex: null,
          isDrawing: false,
          currentDrawingSwoosh: null,
        }),

      toggleDrawMode: () =>
        set((state) => ({
          drawMode: !state.drawMode,
          // Cancel any active drawing when toggling mode
          isDrawing: false,
          currentDrawingSwoosh: null,
        })),
    }),
    { name: 'SwooshStore' }
  )
);
