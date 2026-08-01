import { KeyframeVisionResult } from './vision';
import { FramingCrop } from './pose';

export type AppMode = 'person' | 'scene';

export type CameraPermissionStatus = 'granted' | 'denied' | 'not-determined' | 'restricted';

export type LensPreset = '0.5x' | '1x' | '3x';

export type GridMode = 'none' | 'rule_of_thirds' | 'golden_ratio';

export interface CameraState {
  // Active App Mode (Person vs Scene)
  mode: AppMode;
  setMode: (mode: AppMode) => void;

  // Camera Hardware & Permission State
  permissionStatus: CameraPermissionStatus;
  setPermissionStatus: (status: CameraPermissionStatus) => void;

  // Active Lens Zoom Preset
  activeLens: LensPreset;
  setActiveLens: (lens: LensPreset) => void;

  // App & Viewfinder Active State (for thermal stability & background pause)
  isAppActive: boolean;
  setIsAppActive: (active: boolean) => void;

  // Frozen Keyframe & Vision Analysis State
  isFrozen: boolean;
  setIsFrozen: (frozen: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  toggleFreeze: () => void;

  // Vision Inferencing Results & Latency
  visionResult: KeyframeVisionResult | null;
  inferenceLatencyMs: number | null;
  setVisionResult: (result: KeyframeVisionResult | null, latencyMs?: number | null) => void;
  clearVisionResult: () => void;

  // Horizon Leveling Bar State
  showHorizonBar: boolean;
  setShowHorizonBar: (show: boolean) => void;

  // Framing Crop & Selected Pose State
  selectedFraming: FramingCrop;
  setSelectedFraming: (framing: FramingCrop) => void;
  selectedPoseId: string | null;
  setSelectedPoseId: (id: string | null) => void;

  // Grid Overlay Mode State
  gridMode: GridMode;
  setGridMode: (mode: GridMode) => void;
  cycleGridMode: () => void;
}
