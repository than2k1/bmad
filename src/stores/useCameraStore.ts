import { create } from 'zustand';
import { CameraState, AppMode, CameraPermissionStatus, LensPreset, GridMode } from '../types/camera';
import { KeyframeVisionResult } from '../types/vision';
import { FramingCrop } from '../types/pose';

export const useCameraStore = create<CameraState>((set) => ({
  mode: 'person',
  setMode: (mode: AppMode) =>
    set({
      mode,
      gridMode: 'none',
      // Reset AI freeze state so it doesn't bleed across Person <-> Scene switches
      isFrozen: false,
      isAnalyzing: false,
      visionResult: null,
      inferenceLatencyMs: null,
    }),

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

  selectedFraming: 'half_body',
  setSelectedFraming: (framing: FramingCrop) => set({ selectedFraming: framing, selectedPoseId: null }),

  selectedPoseId: null,
  setSelectedPoseId: (id: string | null) => set({ selectedPoseId: id }),

  gridMode: 'none',
  setGridMode: (mode: GridMode) => set({ gridMode: mode }),
  cycleGridMode: () =>
    set((state) => {
      const nextModeMap: Record<GridMode, GridMode> = {
        none: 'rule_of_thirds',
        rule_of_thirds: 'golden_ratio',
        golden_ratio: 'none',
      };
      return { gridMode: nextModeMap[state.gridMode] };
    }),
}));
