import { create } from 'zustand';
import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';
import { KeyframeVisionResult } from '../types/vision';

export const useCameraStore = create<CameraState>((set) => ({
  mode: 'person',
  setMode: (mode: AppMode) => set({ mode }),

  permissionStatus: 'not-determined',
  setPermissionStatus: (status: CameraPermissionStatus) => set({ permissionStatus: status }),

  activeLens: '1x',
  setActiveLens: (lens: LensPreset) => set({ activeLens: lens }),

  isAppActive: true,
  setIsAppActive: (active: boolean) => set({ isAppActive: active }),

  isFrozen: false,
  setIsFrozen: (frozen: boolean) =>
    set({
      isFrozen: frozen,
      isAnalyzing: frozen,
      ...(frozen ? {} : { visionResult: null, inferenceLatencyMs: null }),
    }),

  isAnalyzing: false,
  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),

  toggleFreeze: () =>
    set((state) => {
      const nextFrozen = !state.isFrozen;
      return {
        isFrozen: nextFrozen,
        isAnalyzing: nextFrozen,
        ...(nextFrozen ? {} : { visionResult: null, inferenceLatencyMs: null }),
      };
    }),

  visionResult: null,
  inferenceLatencyMs: null,
  setVisionResult: (result: KeyframeVisionResult | null, latencyMs: number | null = null) =>
    set({ visionResult: result, inferenceLatencyMs: latencyMs }),
  clearVisionResult: () => set({ visionResult: null, inferenceLatencyMs: null }),

  showHorizonBar: true,
  setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
}));
