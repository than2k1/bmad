---
baseline_commit: e7e1e4901a376979b074b0a5141a6c72dc87451b
---
# Story 4.1: Directional Distance & Height/Tilt Badges

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user,  
I want concise visual badges on screen (*"Step back ~1m"*, *"Lower camera to chest level"*, *"Tilt camera up 5°"*),  
so that I know exactly where to move the camera for optimal framing and composition.

## Acceptance Criteria

1. **Given** a frozen keyframe is analyzed (`isFrozen === true` and `visionResult !== null` in `useCameraStore`),  
   **When** the positioning engine evaluates detected subject bounding box dimensions relative to target framing standards (`headshot`, `half_body`, `full_body`),  
   **Then** the engine calculates recommended distance adjustments and generates visual distance badges (e.g., *"Step back ~1m"*, *"Step closer ~0.5m"*, or *"Distance Good"*).
2. **Given** subject keypoints or bounding box position and device pitch/tilt angle are evaluated,  
   **When** camera height or pitch angle deviates from optimal perspective for the selected framing,  
   **Then** visual height and tilt badges display clear, concise movement directives (e.g., *"Lower camera to waist level"*, *"Raise camera to eye level"*, *"Tilt camera up 5°"*, or *"Tilt camera down 3°"*).
3. **Given** directional distance and height/tilt badges are calculated,  
   **When** rendered on the camera viewfinder HUD,  
   **Then** badges appear in a high-contrast floating badge stack overlay with semi-transparent dark backgrounds (`rgba(0, 0, 0, 0.75)`), cyan/amber visual accents, and high legibility over light or dark keyframes.
4. **Given** the keyframe is un-frozen (`isFrozen === false`) or `visionResult` is cleared,  
   **When** returning to live 60 FPS preview mode,  
   **Then** directional badges hide gracefully without leaving orphaned HUD state or causing UI render jitter.

## Tasks / Subtasks

- [x] Task 1: Directional Positioning & Framing Engine Utility (AC: #1, #2)
  - [x] Create `src/utils/positioningEngine.ts`: Implement `calculateDistanceGuidance`, `calculateHeightAndTiltGuidance`, and `evaluateCameraPositioning`.
  - [x] Calculate target vs actual subject bounding box height/width ratios to compute distance direction (`step_back`, `step_closer`, `optimal`) and estimated meters offset.
  - [x] Calculate vertical bounding box alignment and pitch angle to compute height directives (`lower_camera`, `raise_camera`, `optimal`) and tilt directives (`tilt_up`, `tilt_down`, `level`).
  - [x] Create `src/utils/__tests__/positioningEngine.test.ts`: Unit test suite validating distance calculation across headshot/half_body/full_body crops, height/tilt badge string generation, edge case null bounding box fallbacks, and threshold boundaries.
- [x] Task 2: Directional Positioning Badges HUD Component (AC: #3, #4)
  - [x] Create `src/components/camera/PositioningBadgesOverlay.tsx`: Floating HUD overlay rendering high-contrast distance and height/tilt badge chips.
  - [x] Apply translucent dark styling (`rgba(0, 0, 0, 0.75)`), cyan (`#00E5FF`) accents for distance, and amber (`#FF9F0A`) / green (`#30D158`) accents for height & tilt.
  - [x] Ensure non-blocking touch interaction (`pointerEvents="box-none"`) and clean unmount/hide when keyframe is un-frozen.
- [x] Task 3: Camera Viewfinder HUD Integration (AC: #1, #3, #4)
  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `PositioningBadgesOverlay` when `isFrozen === true` and `visionResult !== null`.
  - [x] Ensure layer stacking and safe area offsets align cleanly relative to `DirectorCueOverlay` and top/bottom HUD controls.
- [x] Task 4: Automated Verification & DoD Check (AC: #1, #2, #3, #4)
  - [x] Run TypeScript compiler checks (`npx tsc --noEmit`).
  - [x] Run unit test suite (`npx tsx src/utils/__tests__/positioningEngine.test.ts`, `npx tsx src/utils/__tests__/directorCueEngine.test.ts`, etc.).

### Review Findings

- [x] [Review][Patch] Hardware device pitch angle defaulted to 0 in PositioningBadgesOverlay [src/components/camera/PositioningBadgesOverlay.tsx:13]

## Dev Notes

- **Architecture Invariants & Standards Compliance:**
  - **AD-2 (Keyframe AI Vision Pipeline):** Positioning calculations run on frozen keyframe vision results (`visionResult` in `useCameraStore`), avoiding frame processor overhead during 60 FPS live preview.
  - **AD-5 (State Management):** Selects reactive state from `useCameraStore` (`isFrozen`, `visionResult`, `selectedFraming`, `mode`).
  - **FR-5.1:** Visual directional badges for distance and camera height/tilt (*"Step back ~1m"*, *"Lower camera"*).
- **Existing Codebase Analysis & Files Being Modified:**
  - `src/types/vision.ts`: Provides `KeyframeVisionResult`, `SubjectBoundingBox`, `COCO17Keypoints`.
  - `src/types/pose.ts`: Provides `FramingCrop` (`headshot`, `half_body`, `full_body`).
  - `src/stores/useCameraStore.ts`: Provides `isFrozen`, `visionResult`, `selectedFraming`.
  - `src/utils/positioningEngine.ts` (NEW): Positioning and framing comparison utility routines.
  - `src/utils/__tests__/positioningEngine.test.ts` (NEW): Unit test suite for positioning math.
  - `src/components/camera/PositioningBadgesOverlay.tsx` (NEW): High-contrast HUD badge stack overlay component.
  - `src/components/camera/CameraViewfinder.tsx` (MODIFY): Incorporates `PositioningBadgesOverlay`.
- **Learnings from Story 3.3:**
  - Use `useMemo` for positioning badge computations in the overlay component.
  - Implement defensive checks for `boundingBox === null` or undefined keypoints.
  - Parent container must use `pointerEvents="box-none"` to avoid intercepting touch events.

### Project Structure Notes

- Aligns with project structure and naming conventions:
  - `src/utils/positioningEngine.ts`
  - `src/utils/__tests__/positioningEngine.test.ts`
  - `src/components/camera/PositioningBadgesOverlay.tsx`
  - `src/components/camera/CameraViewfinder.tsx`

### References

- [Epic 4 Story 4.1 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L201-L211)
- [Architecture Spine AD-2, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L22-L51)
- [PRD FR-5.1](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L51)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L66)
- [Story 3.3 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/3-3-photographer-director-cues-alignment-feedback.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- Executed `npx tsc --noEmit` cleanly (0 errors).
- Executed unit test suite with `npx tsx` (`positioningEngine.test.ts`, `directorCueEngine.test.ts`, `lensCalculator.test.ts`, `levelCalculator.test.ts`, `poseFilter.test.ts`, `poseRenderer.test.ts`, `visionInferencingEngine.test.ts`) - 100% pass rate.

### Completion Notes List

- Created `src/utils/positioningEngine.ts` with `calculateDistanceGuidance`, `calculateHeightAndTiltGuidance`, and `evaluateCameraPositioning`.
- Created comprehensive unit test suite in `src/utils/__tests__/positioningEngine.test.ts` covering distance calculations, height/tilt badge string generation, edge case null fallbacks, and framing ratio thresholds.
- Built `src/components/camera/PositioningBadgesOverlay.tsx` floating HUD overlay component with translucent dark background (`rgba(0,0,0,0.75)`), cyan accents (`#00E5FF`) for distance directives, and amber (`#FF9F0A`) / green (`#30D158`) accents for height & tilt directives.
- Integrated `PositioningBadgesOverlay` into `src/components/camera/CameraViewfinder.tsx`, ensuring non-blocking touches (`pointerEvents="box-none"`) and clean auto-hide upon keyframe unfreeze.

### File List

- `src/utils/positioningEngine.ts` (NEW)
- `src/utils/__tests__/positioningEngine.test.ts` (NEW)
- `src/components/camera/PositioningBadgesOverlay.tsx` (NEW)
- `src/components/camera/CameraViewfinder.tsx` (MODIFY)
- `_bmad-output/implementation-artifacts/4-1-directional-distance-height-tilt-badges.md` (MODIFY)
- `_bmad-output/implementation-artifacts/sprint-status.yaml` (MODIFY)

### Change Log

- 2026-07-31: Initial creation of Story 4.1 context file. Set status to ready-for-dev.
- 2026-07-31: Implemented positioning engine, positioning badges overlay component, viewfinder HUD integration, unit tests, and updated story status to review.
