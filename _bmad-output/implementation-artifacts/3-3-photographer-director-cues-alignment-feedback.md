---
baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
---

# Story 3.3: Photographer Director Cues & Alignment Feedback

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user/photographer,  
I want on-screen Director Prompts (e.g., *"Tell her: Turn shoulders 45° left"*) and visual alignment feedback,  
so that I can naturally coach the subject to match the target pose without awkward audio sounds.

## Acceptance Criteria

1. **Given** a target pose overlay is active on a frozen keyframe (`isFrozen === true` and `selectedPoseId !== null` in `useCameraStore`),  
   **When** keyframe vision analysis completes (`visionResult` contains detected subject `keypoints`),  
   **Then** the director cue comparison engine compares detected subject pose keypoints against the active `PoseTemplate` keypoints to calculate pose match percentage and positional/angular offsets.
2. **Given** pose comparison is evaluated,  
   **When** rendered on the camera viewfinder HUD,  
   **Then** the HUD displays a high-contrast "Director Cue" text chip providing concise, human-readable coaching instructions (e.g., *"Tell subject: Turn shoulders 45° left"* or *"Tell subject: Raise left arm"*).
3. **Given** a Director Cue chip is displayed,  
   **When** pose alignment score is calculated,  
   **Then** a visual Alignment Score Badge displays the match percentage (0–100%) and turns GREEN (`#30D158`) when pose match reaches or exceeds 80%.
4. **Given** the keyframe is un-frozen or the pose overlay is dismissed,  
   **When** returning to live 60 FPS preview mode or clearing `selectedPoseId`,  
   **Then** Director Cue chips and Alignment Badges hide gracefully without leaving orphaned HUD state or causing UI re-render jitter.

## Tasks / Subtasks

- [x] Task 1: Director Cue & Pose Alignment Comparison Engine Utility (AC: #1, #3)
  - [x] Create `src/utils/directorCueEngine.ts`: Implement pose comparison logic (`comparePoseToTemplate`) comparing detected `COCO17Keypoints` against `PoseTemplate` keypoints.
  - [x] Calculate normalized keypoint Euclidean distances and joint angles (e.g., shoulder tilt, arm extension, torso orientation) to compute an overall `alignmentScore` (0–100%).
  - [x] Generate natural, actionable photographer cue strings (e.g., `"Tell subject: Turn shoulders 45° left"`, `"Tell subject: Raise left arm slightly"`, `"Pose Matched! Perfect Alignment"`).
  - [x] Create `src/utils/__tests__/directorCueEngine.test.ts`: Unit test suite validating 0%, >80%, and 100% alignment scores, cue generation for shoulder/arm/head misalignments, GREEN badge threshold at >= 80%, and missing keypoint fallbacks.
- [x] Task 2: Director Cue Chip & Alignment Badge HUD Component (AC: #2, #3, #4)
  - [x] Create `src/components/camera/DirectorCueOverlay.tsx`: HUD component rendering high-contrast Director Cue text chip and Alignment Score Badge.
  - [x] Apply dynamic color styling to Alignment Score Badge: GREEN (`#30D158`) when `alignmentScore >= 80`, and AMBER/CYAN (`#FF9F0A` / `#00E5FF`) when below 80%.
  - [x] Ensure smooth opacity transition and high-contrast background styling for legibility over bright or dark keyframes.
- [x] Task 3: Camera Viewfinder HUD Integration (AC: #1, #2, #4)
  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `DirectorCueOverlay` when `mode === 'person'`, `isFrozen === true`, `selectedPoseId !== null`, and `visionResult !== null`.
  - [x] Ensure non-blocking touch behavior (`pointerEvents="box-none"`) and proper layer stacking relative to `VectorPoseOverlay` and top/bottom HUD controls.
- [x] Task 4: Automated Verification & DoD Check (AC: #1, #2, #3, #4)
  - [x] Run TypeScript compiler checks (`npx tsc --noEmit`).
  - [x] Run full test suite including new and existing unit tests (`npx tsx src/utils/__tests__/directorCueEngine.test.ts`, `npx tsx src/utils/__tests__/poseRenderer.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`, `npx tsx src/stores/__tests__/useCameraStore.test.ts`).

## Dev Notes

- **Architecture Invariants & Requirements Compliance:**
  - **AD-2 (Keyframe AI Vision Pipeline):** Director cues and alignment score calculations run on frozen keyframe vision results (`visionResult` in `useCameraStore`), avoiding expensive frame processor computation during 60 FPS live preview.
  - **AD-4 (COCO-17 Keypoint Schema):** Pose comparison utilizes standard COCO-17 keypoint structures (`nose`, `left_shoulder`, `right_shoulder`, `left_elbow`, `right_elbow`, `left_wrist`, `right_wrist`, `left_hip`, `right_hip`, `left_knee`, `right_knee`, `left_ankle`, `right_ankle`).
  - **AD-5 (State Management):** Reactive state from `useCameraStore` (`isFrozen`, `visionResult`, `selectedPoseId`, `mode`) determines cue visibility without unnecessary store mutations.
  - **FR-3.1, FR-3.2, FR-3.3, FR-3.4:** On-screen Director Prompts coach the photographer to direct the model, accompanied by a visual alignment score badge turning GREEN at >= 80% match.
- **Existing Codebase Analysis & Files Being Modified:**
  - `src/types/vision.ts`: Uses `COCO17Keypoints`, `KeyframeVisionResult`, `Point2D`.
  - `src/types/pose.ts`: Uses `PoseTemplate`, `PoseKeypointsMap`.
  - `src/data/poseCatalog.ts`: Uses `POSE_CATALOG` to look up the active `PoseTemplate` by `selectedPoseId`.
  - `src/stores/useCameraStore.ts`: Source of `isFrozen`, `visionResult`, `selectedPoseId`, `mode`.
  - `src/components/camera/CameraViewfinder.tsx`: Incorporates `DirectorCueOverlay` into Person mode HUD layer.
  - `src/utils/directorCueEngine.ts` (NEW): Core math and natural language cue generator utility.
  - `src/utils/__tests__/directorCueEngine.test.ts` (NEW): Unit tests for alignment score & cue engine.
  - `src/components/camera/DirectorCueOverlay.tsx` (NEW): High-contrast HUD text chip & score badge component.
- **What Must Be Preserved:**
  - Story 3.2 COCO-17 Vector Pose Overlay (`VectorPoseOverlay.tsx`) drag, scale, reset, and dismiss interactions.
  - Story 3.1 Framing selector (`FramingSelector.tsx`) and Pose carousel (`PoseCarousel.tsx`).
  - Story 2.1 Shutter button freeze/unfreeze keyframe pipeline (`analyzeKeyframe` & `AnalyzingIndicator.tsx`).
  - Horizon level bar and lens preset chips.
- **Code Safety & Quality Controls:**
  - Keypoint comparison logic must handle optional or missing keypoints safely (e.g. headshot templates lacking knees/ankles).
  - Normalize detected subject keypoints relative to subject bounding box before comparing with template keypoints to ensure scale/translation invariance.
  - Threshold for GREEN alignment badge is strictly `>= 80` (percentage scale 0–100).

### Project Structure Notes

- Aligns with project structure and naming conventions:
  - `src/utils/directorCueEngine.ts`
  - `src/utils/__tests__/directorCueEngine.test.ts`
  - `src/components/camera/DirectorCueOverlay.tsx`
  - `src/components/camera/CameraViewfinder.tsx`

### References

- [Epic 3 Story 3.3 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L186-L197)
- [Architecture Spine AD-2, AD-4, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L22-L51)
- [PRD FR-3.1..FR-3.4](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L41-L47)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L63)
- [Story 3.2 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/3-2-coco-17-vector-pose-overlay-renderer.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- `npx tsx src/utils/__tests__/directorCueEngine.test.ts` (All unit tests passed)
- `npx tsx src/utils/__tests__/poseRenderer.test.ts` (All unit tests passed)
- `npx tsx src/utils/__tests__/poseFilter.test.ts` (All unit tests passed)
- `npx tsx src/stores/__tests__/useCameraStore.test.ts` (All unit tests passed)
- `npx tsc --noEmit` (0 errors)

### Completion Notes List

- Implemented `comparePoseToTemplate` in `src/utils/directorCueEngine.ts` to compute keypoint Euclidean distances & shoulder angle alignment score (0–100%) and actionable director cues.
- Implemented `DirectorCueOverlay` component in `src/components/camera/DirectorCueOverlay.tsx` displaying alignment score badge (GREEN `#30D158` at >=80%, AMBER `#FF9F0A` below 80%) and high-contrast photographer cue chip.
- Integrated `DirectorCueOverlay` into `src/components/camera/CameraViewfinder.tsx` for `person` mode on frozen keyframe.
- Created `src/utils/__tests__/directorCueEngine.test.ts` with unit tests validating 0%, >80%, and 100% alignment scores, cue generation for shoulder/arm/head misalignments, GREEN badge threshold at >=80%, and missing keypoint fallbacks.

### File List

- `src/utils/directorCueEngine.ts`
- `src/utils/__tests__/directorCueEngine.test.ts`
- `src/components/camera/DirectorCueOverlay.tsx`
- `src/components/camera/CameraViewfinder.tsx`
- `_bmad-output/implementation-artifacts/3-3-photographer-director-cues-alignment-feedback.md`
- `_bmad-output/implementation-artifacts/sprint-status.yaml`

### Change Log

- 2026-07-30: Created Story 3.3 context for Photographer Director Cues & Alignment Feedback. Set status to ready-for-dev.
- 2026-07-30: Implemented pose alignment engine, Director Cue HUD overlay, and CameraViewfinder integration. Completed all DoD verification gates and updated status to review.

### Review Findings

- [x] [Review][Patch] Unmemoized POSE_CATALOG lookups during HUD render pass [`src/components/camera/DirectorCueOverlay.tsx:17`](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/DirectorCueOverlay.tsx#L17)
- [x] [Review][Patch] Dynamic type coercion `(detected as any)[key]` when accessing COCO-17 keypoints [`src/utils/directorCueEngine.ts:80`](file:///o:/New%20folder/bmad-test/bmad/src/utils/directorCueEngine.ts#L80)

