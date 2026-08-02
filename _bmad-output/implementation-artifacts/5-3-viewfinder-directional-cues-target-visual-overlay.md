---
baseline_commit: a96e55a2647bd0beeb412d59030e8894cb7b9e25
---
# Story 5.3: Viewfinder Directional Cues & Target Visual Overlay HUD Renderer

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a photographer or user,  
I want a dynamic visual composition guidance overlay on the camera viewfinder that renders real-time vector guide lines, target structural frame bounding boxes, directional pan/tilt/distance cues, and high-contrast instruction text banners,  
so that I can interactively align my camera frame with mode-driven composition rules (Symmetry & Centering, Leading Lines & Depth, Frame-within-a-Frame, Rule of Thirds).

## Acceptance Criteria

1. **Given** a keyframe is captured and frozen (`isFrozen === true`) with active `compositionResult` from `compositionRuleEngine` (Story 5.2) and `spatialLayout` from `spatialLayoutExtractor` (Story 5.1),  
   **When** `CompositionGuidanceOverlay.tsx` is rendered on `CameraViewfinder.tsx`,  
   **Then** it extracts `activeRule`, `score`, `isSatisfied`, `directionalCue`, `guideLines`, and `textCue` from `useCameraStore` (`visionResult.compositionResult`).
2. **Given** `directionalCue` data (`pan`, `tilt`, `distance`),  
   **When** pan, tilt, or distance alignment is required,  
   **Then** the HUD displays high-contrast visual directional badges/arrows (`PAN LEFT ◄`, `PAN RIGHT ►`, `TILT UP ▲`, `TILT DOWN ▼`, `STEP BACK`, `STEP CLOSER`) formatted with responsive layout offsets via `useSafeAreaInsets()`.
3. **Given** `guideLines` array (`{ start: Point2D; end: Point2D }`) and spatial structural bounding boxes,  
   **When** rendered via `react-native-svg` overlay canvas,  
   **Then** SVG vector lines are drawn over the viewfinder matching the active composition rule type:  
   - `frame_in_frame`: Semi-transparent target bounding box outline around detected structural frames (`doorway`, `window`, `arch`, `structure`) highlighting the target subject alignment zone.  
   - `leading_lines`: Converging perspective guide lines intersecting at the estimated vanishing point crosshair marker.  
   - `symmetry_centering`: Central symmetry axis guide lines (vertical or horizontal) with alignment target markers.  
   - `rule_of_thirds`: Grid lines with highlighted power point intersection markers.
4. **Given** composition evaluation score and satisfaction state,  
   **When** `isSatisfied === true` ($\ge 85\%$ alignment threshold),  
   **Then** the target alignment score badge and cue banner turn GREEN (`#30D158`) with a success message (*"COMPOSITION SATISFIED (85%+)"*).  
   **And** when `isSatisfied === false` ($< 85\%$), the cue banner remains high-contrast AMBER (`#FFD60A`) or CYAN (`#00E5FF`) indicating active alignment guidance (*"ALIGNMENT IN PROGRESS"*).
5. **Given** live vs. frozen camera preview state,  
   **When** `isFrozen === false` or `clearVisionResult()` is executed,  
   **Then** `CompositionGuidanceOverlay` hides or clears SVG lines and directional badges cleanly without ghosting or state leaks.
6. **Given** user touch interactions on the camera viewfinder (shutter button, mode switcher, lens preset chips),  
   **When** `CompositionGuidanceOverlay` is mounted on `CameraViewfinder.tsx`,  
   **Then** its container uses `pointerEvents="none"` (or `pointerEvents="box-none"`) so it never intercepts touch events or blocks viewfinder controls.

## Tasks / Subtasks

- [x] Task 1: Component Architecture & Store Coupling (AC: #1, #5, #6)
  - [x] Create `src/components/camera/CompositionGuidanceOverlay.tsx`: Connect to `useCameraStore` for `visionResult`, `isFrozen`, and `mode`.
  - [x] Apply `pointerEvents="none"` and safe area inset layout via `useSafeAreaInsets()`.
- [x] Task 2: Directional Badge & Instruction Text Banner Renderer (AC: #1, #2, #4)
  - [x] Render high-contrast `textCue` banner at top/center HUD offset (positioned below `ModeSwitcher`).
  - [x] Render directional pan/tilt/distance visual arrow badges based on `directionalCue` (`pan: 'left' | 'right' | 'centered'`, `tilt: 'up' | 'down' | 'level'`, `distance: 'step_closer' | 'step_back' | 'perfect'`).
  - [x] Render alignment score percentage badge ($0-100\%$) with status color coding (GREEN `#30D158` when `isSatisfied === true`, AMBER `#FFD60A` / CYAN `#00E5FF` when `isSatisfied === false`).
- [x] Task 3: SVG Vector Guide Lines & Structural Target Renderer (AC: #3, #4)
  - [x] Build SVG overlay canvas using `react-native-svg` for `guideLines` (`{ start: Point2D; end: Point2D }`).
  - [x] Implement rule-specific target overlays:
    - [x] `frame_in_frame`: Target rectangle around primary background structural bounding box with semi-transparent accent fill (`rgba(0, 229, 255, 0.15)`).
    - [x] `leading_lines`: Converging diagonal guide lines with vanishing point crosshair marker.
    - [x] `symmetry_centering`: Axis line and centering crosshair marker.
    - [x] `rule_of_thirds`: Standard grid power point markers.
- [x] Task 4: Viewfinder Integration & Overlay Layering (AC: #1, #5, #6)
  - [x] Mount `CompositionGuidanceOverlay` in `src/components/camera/CameraViewfinder.tsx`.
  - [x] Coordinate layer ordering relative to `CompositionGridOverlay`, `DirectorCueOverlay`, `PositioningBadgesOverlay`, and `VectorPoseOverlay`.
- [x] Task 5: Comprehensive Unit & Component Test Suite (AC: #1-6)
  - [x] Create `src/components/camera/__tests__/CompositionGuidanceOverlay.test.ts` (or `.test.tsx`): Test state rendering for satisfied vs unsatisfied composition, directional arrow output, SVG guide lines rendering, hidden state when `isFrozen === false` or `compositionResult` is null.
- [x] Task 6: Verification & Definition of Done Check (AC: #1-6)
  - [x] Run `npx tsc --noEmit` to verify zero TypeScript errors.
  - [x] Run full unit test suite (`spatialLayoutExtractor.test.ts`, `compositionRuleEngine.test.ts`, `visionInferencingEngine.test.ts`, `useCameraStore.test.ts`, and new component tests).

### Review Findings

- [x] [Review][Patch] Replace React.Fragment with react-native-svg `<G>` group component in SVG canvas [src/components/camera/CompositionGuidanceOverlay.tsx:99,131]
- [x] [Review][Patch] Handle normalized [0..1] bounding box coordinates in CompositionGuidanceOverlay [src/components/camera/CompositionGuidanceOverlay.tsx:83]

## Dev Notes

- **Architecture Invariants & Standards Compliance:**
  - **AD-2 (Keyframe AI Vision Pipeline):** Runs on frozen keyframe (`isFrozen === true`) keyframe analysis outputs (`compositionResult`).
  - **AD-5 (State Architecture):** Reads `compositionResult` and `spatialLayout` from Zustand `useCameraStore`.
  - **NFR-1.2 & NFR-2.1 & NFR-2.2:** Declarative UI rendering, 100% on-device local inferencing visualization, smooth 60 FPS overhead-free layer with `pointerEvents="none"`.

- **Existing Codebase Analysis & Integration Points:**
  - `src/utils/compositionGuidanceEngine.ts` (NEW): Overlay state evaluator & directional arrow formatting utility.
  - `src/components/camera/CompositionGuidanceOverlay.tsx` (NEW): HUD overlay component.
  - `src/components/camera/__tests__/CompositionGuidanceOverlay.test.ts` (NEW): Unit test suite.
  - `src/components/camera/CameraViewfinder.tsx` (MODIFY): Mount `CompositionGuidanceOverlay`.
  - `src/types/composition.ts`: Interfaces (`CompositionRuleResult`, `CompositionDirectionalCue`, `CompositionGuideLine`).
  - `src/utils/compositionRuleEngine.ts`: Source of `evaluateCompositionRules`.

- **Learnings from Previous Stories (Epic 4 & Story 5.2):**
  - Use `useSafeAreaInsets()` for top/bottom HUD positioning to avoid overlapping notch or system bars.
  - Ensure overlay component returns `null` cleanly when `!isFrozen` or `!compositionResult`.
  - Wrap SVG elements safely and ensure vector coordinate scaling handles camera view container bounds.

### References

- [Epic 5 Context Document](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/epic-5-context.md)
- [Background Layout Guidance Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/spec-background-layout-guidance.md)
- [Story 5.1 Spatial Layout Extractor](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/5-1-background-line-bounding-box-spatial-layout-extractor.md)
- [Story 5.2 Composition Rule Evaluator Engine](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/5-2-mode-driven-composition-rule-evaluator-engine.md)
- [CameraViewfinder.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraViewfinder.tsx)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L73)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- Story created following BMad create-story workflow protocol.
- Created pure overlay state evaluator `compositionGuidanceEngine.ts`.
- Implemented `CompositionGuidanceOverlay.tsx` HUD component with vector guide lines, target frames, score badges, and directional arrows.
- Mounted `CompositionGuidanceOverlay` on `CameraViewfinder.tsx`.
- Created comprehensive unit test suite in `CompositionGuidanceOverlay.test.ts`.
- Verified TypeScript compilation (`npx tsc --noEmit`) with 0 errors.
- Executed full test suite (`CompositionGuidanceOverlay.test.ts`, `compositionRuleEngine.test.ts`, `spatialLayoutExtractor.test.ts`, `visionInferencingEngine.test.ts`, `useCameraStore.test.ts`), all passing 100%.

### Completion Notes List

- Story 5.3 implementation complete: Viewfinder Directional Cues & Target Visual Overlay HUD Renderer.
- Implemented responsive safe-area offset HUD banner rendering composition status (`COMPOSITION SATISFIED (85%+)` vs `ALIGNMENT IN PROGRESS`), score percentage badge, and photographer instruction text cues.
- Rendered directional arrow badges (`PAN LEFT ◄`, `PAN RIGHT ►`, `TILT UP ▲`, `TILT DOWN ▼`, `STEP BACK`, `STEP CLOSER`).
- Implemented SVG vector guidance layer via `react-native-svg` rendering rule-specific overlays (`frame_in_frame` structural target bounding boxes, `leading_lines` vanishing point crosshair markers, `symmetry_centering` axis target crosshairs, and `rule_of_thirds` power point markers).
- Mounted overlay in `CameraViewfinder.tsx` with non-blocking `pointerEvents="none"`.

### File List

- `src/utils/compositionGuidanceEngine.ts` (NEW)
- `src/components/camera/CompositionGuidanceOverlay.tsx` (NEW)
- `src/components/camera/__tests__/CompositionGuidanceOverlay.test.ts` (NEW)
- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)

## Change Log

- Story 5.3 implementation completed: Viewfinder Directional Cues & Target Visual Overlay HUD Renderer (Date: 2026-08-02).

