# State Management Patterns — PoseCam (bmad-camera-app)

## Overview

State management in PoseCam is handled by a single central reactive **Zustand** store defined in [useCameraStore.ts](file:///o:/New%20folder/bmad-test/bmad/src/stores/useCameraStore.ts).

---

## State Schema Reference (`CameraState`)

```typescript
export interface CameraState {
  // Operational Mode
  mode: AppMode; // 'person' | 'scene'
  setMode: (mode: AppMode) => void;

  // Permissions
  permissionStatus: CameraPermissionStatus; // 'not-determined' | 'granted' | 'denied' | 'restricted'
  setPermissionStatus: (status: CameraPermissionStatus) => void;

  // Camera Focal Length / Lens Selection
  activeLens: LensPreset; // '0.5x' | '1x' | '2x' | '3x' | '5x'
  setActiveLens: (lens: LensPreset) => void;

  // Application Lifecycle (Thermal stability & background pause)
  isAppActive: boolean;
  setIsAppActive: (active: boolean) => void;

  // Keyframe Freeze & AI Analysis
  isFrozen: boolean;
  setIsFrozen: (frozen: boolean) => void;
  isAnalyzing: boolean;
  setIsAnalyzing: (analyzing: boolean) => void;
  toggleFreeze: () => void;

  // AI Vision Inferencing Results
  visionResult: KeyframeVisionResult | null;
  inferenceLatencyMs: number | null;
  setVisionResult: (result: KeyframeVisionResult | null, latencyMs?: number | null) => void;
  clearVisionResult: () => void;

  // Horizon Leveling HUD
  showHorizonBar: boolean;
  setShowHorizonBar: (show: boolean) => void;

  // Person Mode Framing & Reference Poses
  selectedFraming: FramingCrop; // 'full_body' | 'half_body' | 'close_up'
  setSelectedFraming: (framing: FramingCrop) => void;
  selectedPoseId: string | null;
  setSelectedPoseId: (id: string | null) => void;

  // Scene Mode Composition Grid
  gridMode: GridMode; // 'none' | 'rule_of_thirds' | 'golden_ratio'
  setGridMode: (mode: GridMode) => void;
  cycleGridMode: () => void;
}
```

---

## Key State Transitions & Behavioral Patterns

### 1. Keyframe Freeze Pipeline (`isFrozen` & `toggleFreeze`)
- Toggling freeze (`toggleFreeze()`) sets `isFrozen = true` and `isAnalyzing = true`.
- Upon freeze, `CameraViewfinder.tsx` triggers `analyzeKeyframe()`.
- When `analyzeKeyframe()` completes, `setVisionResult(outcome.result, outcome.latencyMs)` stores the AI detection result and sets `isAnalyzing = false`.
- Unfreezing (`isFrozen = false`) automatically clears `visionResult` and `inferenceLatencyMs` to restore clean viewfinder state.

### 2. App Lifecycle & Thermal Safeguard (`isAppActive`)
- Subscribes to native `AppState` changes.
- When app transitions to background (`AppState !== 'active'`), `isAppActive` is set to `false`.
- This unmounts/pauses native `CameraComponent` execution to preserve device battery and prevent thermal throttling.

### 3. Contextual Framing & Pose Reset (`selectedFraming`)
- When the user selects a new framing crop (`full_body`, `half_body`, `close_up`), `selectedPoseId` is automatically reset to `null` to ensure only valid poses matching the new framing crop are displayed.

### 4. Grid Mode Cycling (`cycleGridMode`)
- Cycles deterministically through Scene Mode grid overlays: `none` ➔ `rule_of_thirds` ➔ `golden_ratio` ➔ `none`.
