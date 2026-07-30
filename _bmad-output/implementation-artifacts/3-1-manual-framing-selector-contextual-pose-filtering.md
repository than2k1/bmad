---
baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
---
# Story 3.1: Manual Framing Selector & Contextual Pose Filtering

Status: done

## Story

As a user,  
I want to select my desired framing crop (`Headshot`, `Half-Body`, `Full-Body`),  
so that the pose carousel displays templates that match my intended photo framing.

## Acceptance Criteria

1. **Given** Person Mode is active on the viewfinder HUD,  
   **When** the user selects a framing crop option (`Headshot` | `Half-Body` | `Full-Body`),  
   **Then** the active framing state (`selectedFraming`: `'headshot'` | `'half_body'` | `'full_body'`) updates in `useCameraStore` (defaulting to `'half_body'`).
2. **Given** Person Mode is active and framing selection is set,  
   **When** the pose template catalog/carousel renders,  
   **Then** the pose carousel filters to display only wireframe templates whose `framing` property matches the active `selectedFraming` crop.
3. **Given** Person Mode is active and keyframe vision inference completes (from Story 2.2),  
   **When** auto-detected subject count (`solo` | `couple` | `group`) is available in `visionResult` in `useCameraStore`,  
   **Then** contextual filtering automatically refines the pose carousel templates to match BOTH the selected framing (`headshot` | `half_body` | `full_body`) AND the detected subject count (`solo` | `couple` | `group`).
4. **Given** Person Mode is active,  
   **When** the user toggles between Person and Scene modes (or un-freezes keyframe preview),  
   **Then** framing selector HUD controls adjust gracefully (hidden in Scene mode, visible in Person mode) without resetting or corrupting state store values.

## Tasks / Subtasks

- [x] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
  - [x] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
  - [x] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
- [x] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
  - [x] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
  - [x] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
- [x] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
  - [x] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
  - [x] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
  - [x] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
- [x] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
  - [x] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
  - [x] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
- [x] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
  - [x] Run TypeScript type checks (`npx tsc --noEmit`).
  - [x] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).

### Review Findings

- [x] [Review][Patch] Stale selectedPoseId state when switching framing crops [src/stores/useCameraStore.ts:L50]
- [x] [Review][Patch] Redundant subject count text formatting in PoseCarousel context badge [src/components/camera/PoseCarousel.tsx:L26]
- [x] [Review][Patch] Lack of useMemo for filterPoseTemplates in PoseCarousel [src/components/camera/PoseCarousel.tsx:L15]
- [x] [Review][Patch] Empty state UI missing in PoseCarousel when no poses match criteria [src/components/camera/PoseCarousel.tsx:L31]
- [x] [Review][Patch] Single underscore string replacement in PoseCarousel framing tag text [src/components/camera/PoseCarousel.tsx:L71]

## Dev Notes

- **Architecture Invariants & Requirements Compliance:**
  - **AD-4 (Pose Template Schema):** All pose templates must use COCO-17 keypoint structures (`nose`, `left_eye`, `right_eye`, `left_shoulder`, `right_shoulder`, `left_elbow`, `right_elbow`, `left_wrist`, `right_wrist`, `left_hip`, `right_hip`, `left_knee`, `right_knee`, `left_ankle`, `right_ankle`) and schema specified in `ARCHITECTURE-SPINE.md#3.1`.
  - **AD-5 (Zustand State):** Transient framing selection (`selectedFraming`) and selected pose (`selectedPoseId`) are managed in `useCameraStore` to ensure decoupled, reactive UI updates.
  - **FR-3.1 & FR-3.2:** Provide manual framing selector (`Headshot`, `Half-Body`, `Full-Body`) and contextual filtering based on detected subject count (`solo`, `couple`, `group`) from `visionResult`.
- **Existing Codebase Analysis & Files Being Modified:**
  - `src/types/camera.ts`: Update `CameraState` to include `selectedFraming` and `selectedPoseId`.
  - `src/stores/useCameraStore.ts`: Implement `selectedFraming` and `selectedPoseId` state actions.
  - `src/components/camera/CameraViewfinder.tsx`: Incorporate `FramingSelector` and `PoseCarousel` controls into the Person Mode HUD layer.
  - `src/types/pose.ts` (NEW): Data contracts for pose templates and framing crops.
  - `src/data/poseCatalog.ts` (NEW): Static catalog of COCO-17 pose templates.
  - `src/utils/poseFilter.ts` (NEW): Pure filtering utility for pose templates.
  - `src/utils/__tests__/poseFilter.test.ts` (NEW): Unit tests for pose template filtering logic.
  - `src/components/camera/FramingSelector.tsx` (NEW): HUD crop selection chip group.
  - `src/components/camera/PoseCarousel.tsx` (NEW): Horizontal pose card carousel component.
- **What Must Be Preserved:**
  - Story 2.2 local vision inferencing engine output (`visionResult` in `useCameraStore`).
  - Web simulator preview fallback capability in `CameraViewfinder.tsx`.
  - Horizon level bar and lens preset chip overlays in camera HUD.
- **Code Safety & Quality Controls:**
  - Filtering logic must be pure, deterministic, and handle `null` / `undefined` `subjectCount` gracefully.
  - UI components must maintain 60 FPS performance by keeping state selectors concise.

### Project Structure Notes

- Aligns with existing project structure:
  - `src/types/pose.ts`
  - `src/types/camera.ts`
  - `src/data/poseCatalog.ts`
  - `src/stores/useCameraStore.ts`
  - `src/utils/poseFilter.ts`
  - `src/utils/__tests__/poseFilter.test.ts`
  - `src/components/camera/FramingSelector.tsx`
  - `src/components/camera/PoseCarousel.tsx`
  - `src/components/camera/CameraViewfinder.tsx`

### References

- [Epic 3 Story 3.1 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L164-L174)
- [Architecture Spine AD-4, AD-5, PoseTemplate Schema](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L37-L125)
- [PRD FR-3.1, FR-3.2, FR-3.3](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L42-L46)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L74)
- [Story 2.2 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/2-2-local-on-device-vision-inferencing-engine.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- `npx tsx src/stores/__tests__/useCameraStore.test.ts` -> PASSED
- `npx tsx src/utils/__tests__/poseFilter.test.ts` -> PASSED
- `npx tsc --noEmit` -> PASSED (0 errors)

### Completion Notes List

- Defined framing crop types (`FramingCrop`), pose templates data contracts (`PoseTemplate`), and static COCO-17 pose catalog (`POSE_CATALOG`).
- Expanded `useCameraStore` state with `selectedFraming` (default `'half_body'`) and `selectedPoseId` (default `null`).
- Created pure, deterministic `poseFilter` utility supporting single framing crop filtering, dual framing + subject count filtering, and fallback behavior.
- Built UI components `FramingSelector` and `PoseCarousel` with contextual subject count badge and integrated them into `CameraViewfinder` for `person` mode.
- Verified 100% test pass rate across store unit tests, utility unit tests, and TypeScript compiler check.

### File List

- `src/types/pose.ts` (NEW)
- `src/types/camera.ts` (MODIFIED)
- `src/data/poseCatalog.ts` (NEW)
- `src/stores/useCameraStore.ts` (MODIFIED)
- `src/stores/__tests__/useCameraStore.test.ts` (MODIFIED)
- `src/utils/poseFilter.ts` (NEW)
- `src/utils/__tests__/poseFilter.test.ts` (NEW)
- `src/components/camera/FramingSelector.tsx` (NEW)
- `src/components/camera/PoseCarousel.tsx` (NEW)
- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)

### Change Log

- 2026-07-29: Created Story 3.1 context for Manual Framing Selector & Contextual Pose Filtering. Set status to ready-for-dev.
- 2026-07-30: Completed implementation of Story 3.1: manual framing selector, pose catalog, camera store state expansion, contextual pose filtering, HUD integration, and unit test suite. Status updated to review.
