# Story 2.2: Local On-Device Vision Inferencing Engine

Status: in-review

## Story

As a user,  
I want keyframe vision analysis to run locally on-device in $<200\text{ms}$,  
so that I get instant recommendations offline with 100% privacy.

## Acceptance Criteria

1. **Given** a camera keyframe is frozen by tapping the shutter button,  
   **When** the vision inferencing engine executes keyframe analysis (via local CoreML/ONNX model execution or cross-platform local engine),  
   **Then** detected body keypoints (COCO-17 format), subject bounding box, subject count (`solo` | `couple` | `group`), and scene type classification (`landscape` | `architecture` | `food` | `interior` | `sunset`) are calculated in $<200\text{ms}$.
2. **Given** local vision inferencing is active,  
   **When** processing frozen keyframes,  
   **Then** 100% of inferencing is executed locally on-device without initiating any HTTP/HTTPS network requests (NFR-2.1, NFR-2.2 offline privacy compliance).
3. **Given** `useCameraStore` manages transient camera and vision state,  
   **When** keyframe inferencing completes,  
   **Then** `visionResult` (`KeyframeVisionResult | null`) and `inferenceLatencyMs` (`number | null`) update in Zustand store, and `isAnalyzing` transitions to `false` while `isFrozen` remains `true`.
4. **Given** the user un-freezes the viewfinder back to live 60 FPS video,  
   **When** un-freeze occurs,  
   **Then** `visionResult` and `inferenceLatencyMs` are cleared (`null`) in `useCameraStore`.

## Tasks / Subtasks

- [x] Task 1: Vision Engine Type Definitions & Data Contracts (AC: #1, #3)
  - [x] Create/update `src/types/vision.ts` defining `Point2D`, `COCO17Keypoints`, `SubjectBoundingBox`, `SubjectCount`, `SceneType`, and `KeyframeVisionResult`.
  - [x] Update `src/types/camera.ts` to include `visionResult: KeyframeVisionResult | null`, `inferenceLatencyMs: number | null`, `setVisionResult: (result: KeyframeVisionResult | null) => void`, and `clearVisionResult: () => void`.
- [x] Task 2: Camera Store State Expansion & Un-freeze Reset (AC: #3, #4)
  - [x] Update `src/stores/useCameraStore.ts` to implement `visionResult` and `inferenceLatencyMs` initial state (`null`).
  - [x] Update `setIsFrozen` and `toggleFreeze` in `useCameraStore` so that un-freezing automatically calls `clearVisionResult()`.
  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying vision result state transitions and un-freeze clearing logic.
- [x] Task 3: Local On-Device Vision Inferencing Engine Implementation (AC: #1, #2)
  - [x] Create `src/utils/visionInferencingEngine.ts` implementing `analyzeKeyframe(frameData?: unknown): Promise<KeyframeVisionResult>`.
  - [x] Ensure execution completes asynchronously within $<200\text{ms}$ (target ~45-85ms) without blocking the main JS UI loop.
  - [x] Structure engine to extract COCO-17 keypoints (nose, eyes, shoulders, elbows, wrists, hips, knees, ankles) and bounding boxes matching `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md`).
  - [x] Guarantee 100% offline local processing with ZERO external network calls.
- [x] Task 4: Camera Viewfinder & Analyzing Indicator Integration (AC: #1, #3, #4)
  - [x] Update `src/components/camera/CameraViewfinder.tsx` to automatically trigger `analyzeKeyframe()` when `isFrozen` turns true.
  - [x] Store the returned `KeyframeVisionResult` in `useCameraStore` and set `isAnalyzing` to false once complete.
  - [x] Update `src/components/camera/AnalyzingIndicator.tsx` to display completion status or latency badge (e.g., `"Analyzed in 62ms"`) when `visionResult` is ready.
- [x] Task 5: Automated Unit Tests & Latency Validation (AC: #1, #2, #3, #4)
  - [x] Create `src/utils/__tests__/visionInferencingEngine.test.ts` to validate:
    - Inferencing completes in $<200\text{ms}$.
    - Returned `KeyframeVisionResult` conforms to COCO-17 keypoints schema.
    - Zero network calls are dispatched during inferencing.

## Dev Notes

- **Architecture Invariants & Requirements Compliance:**
  - **AD-2 (Viewfinder 60 FPS & Keyframe AI Pipeline):** Keyframe vision inferencing is executed upon shutter freeze. Keyframe analysis runs asynchronously in $<200\text{ms}$ to prevent frame processor blocking or thermal throttling.
  - **AD-4 (Pose Template Schema):** Outputs COCO-17 Keypoint structures (`nose`, `left_eye`, `right_eye`, `left_shoulder`, `right_shoulder`, `left_elbow`, `right_elbow`, `left_wrist`, `right_wrist`, `left_hip`, `right_hip`, `left_knee`, `right_knee`, `left_ankle`, `right_ankle`) compatible with SVG rendering in Epic 3.
  - **AD-5 (Zustand State):** Vision result state is held in `useCameraStore` to avoid unnecessary re-renders.
  - **NFR-1.1 (Latency):** Keyframe analysis MUST complete within $<200\text{ms}$ (measured via performance timer `performance.now()`).
  - **NFR-2.1 & NFR-2.2 (Privacy & Offline):** 100% local processing; zero network dependencies or cloud API requests.
- **Existing Codebase Analysis & Files Being Modified:**
  - `src/types/camera.ts`: Update `CameraState` to include `visionResult` and `inferenceLatencyMs`.
  - `src/stores/useCameraStore.ts`: Implement `visionResult` state management and un-freeze reset logic.
  - `src/components/camera/CameraViewfinder.tsx`: Trigger local vision inferencing on keyframe freeze.
  - `src/components/camera/AnalyzingIndicator.tsx`: Update HUD pill to display completion state and latency badge when analysis finishes.
  - `src/types/vision.ts` (NEW): Data contracts for vision model outputs.
  - `src/utils/visionInferencingEngine.ts` (NEW): Core local inferencing utility.
  - `src/utils/__tests__/visionInferencingEngine.test.ts` (NEW): Unit tests for vision engine.
- **What Must Be Preserved:**
  - Single-tap un-freeze gesture overlay in `AnalyzingIndicator.tsx` (Story 2.1).
  - Web simulator preview fallback capability in `CameraViewfinder.tsx`.
  - Reanimated shared value leveling pipeline in `HorizonLevelBar.tsx`.
- **Code Safety & Quality Controls:**
  - All async operations must handle cancellation if user rapidly taps un-freeze before analysis finishes.
  - Performance measurement must use `performance.now()` for sub-millisecond accuracy.
- **Testing Approach:**
  - Run `npx tsc --noEmit` for TypeScript compilation check.
  - Run unit test suite using `npx tsx` for store and vision engine tests.

### Project Structure Notes

- Aligns with existing project structure:
  - `src/types/vision.ts`
  - `src/types/camera.ts`
  - `src/stores/useCameraStore.ts`
  - `src/utils/visionInferencingEngine.ts`
  - `src/utils/__tests__/visionInferencingEngine.test.ts`
  - `src/components/camera/CameraViewfinder.tsx`
  - `src/components/camera/AnalyzingIndicator.tsx`

### References

- [Epic 2 Story 2.2 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L149-L159)
- [Architecture Spine AD-2, AD-4, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L22-L50)
- [PRD FR-2.2, NFR-1.1, NFR-2.1, NFR-2.2](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L37-L41)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L58)
- [Story 2.1 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/2-1-shutter-keyframe-freeze-unfreeze-pipeline.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

### Completion Notes List

- Story file generated by `bmad-create-story` workflow.

### File List

- `src/types/vision.ts`
- `src/types/camera.ts`
- `src/stores/useCameraStore.ts`
- `src/utils/visionInferencingEngine.ts`
- `src/utils/__tests__/visionInferencingEngine.test.ts`
- `src/components/camera/CameraViewfinder.tsx`
- `src/components/camera/AnalyzingIndicator.tsx`

### Change Log

- 2026-07-29: Created Story 2.2 context for Local On-Device Vision Inferencing Engine. Set status to ready-for-dev.
