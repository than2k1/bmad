---
baseline_commit: 72f94dca1ba21b014ec95aebfd72d73cd64b219f
---
# Story 4.3: Scene Mode Composition Grid Overlays

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a user shooting landscapes or architecture,  
I want to toggle Rule of Thirds and Golden Ratio composition grids and view scene classification guidance badges,  
so that I can align horizons, architectural lines, and subjects cleanly for optimal composition.

## Acceptance Criteria

1. **Given** Scene Mode is active (`mode === 'scene'` in `useCameraStore`),  
   **When** the user taps the Grid Mode toggle button on the viewfinder HUD,  
   **Then** the app cycles through grid overlay modes: `none` → `rule_of_thirds` → `golden_ratio` → `none`, and updates `gridMode` in `useCameraStore`.
2. **Given** `gridMode` is set to `rule_of_thirds` or `golden_ratio` in Scene Mode,  
   **When** rendered on the camera viewfinder,  
   **Then** a crisp vector grid is drawn using `react-native-svg` overlaying the camera preview canvas:  
   - Rule of Thirds renders 4 grid lines at $33.3\%$ and $66.7\%$ horizontal/vertical canvas dimensions with semi-transparent white/cyan stroke ($1.5\text{px}$, `rgba(255, 255, 255, 0.45)`).  
   - Golden Ratio (Phi Grid) renders 4 grid lines at $38.2\%$ ($\frac{1}{\Phi^2}$) and $61.8\%$ ($\frac{1}{\Phi}$) horizontal/vertical canvas dimensions.
3. **Given** a keyframe is analyzed in Scene Mode (`isFrozen === true` and `visionResult !== null`),  
   **When** `visionResult.sceneType` is evaluated (e.g. `landscape`, `architecture`, `food`, `interior`, `sunset`),  
   **Then** a high-contrast floating HUD badge chip displays tailored scene classification guidance (e.g. *"Landscape Detected - Keep Horizon Level"*, *"Architecture Detected - Align Vertical Grid Lines"*, *"Sunset Detected - Position Horizon on Lower Third"*).
4. **Given** the user switches mode from Scene Mode to Person Mode (`mode === 'person'`),  
   **When** the mode transitions,  
   **Then** scene composition grid overlays and scene classification badges hide gracefully without leftover HUD artifacts or interfering with pose wireframe overlays.

## Tasks / Subtasks

- [x] Task 1: Camera Store & Type Extensions for Grid Mode (AC: #1, #4)
  - [x] Update `src/types/camera.ts`: Define `GridMode` type (`'none' | 'rule_of_thirds' | 'golden_ratio'`). Add `gridMode: GridMode`, `setGridMode: (mode: GridMode) => void`, and `cycleGridMode: () => void` to `CameraState` interface.
  - [x] Update `src/stores/useCameraStore.ts`: Initialize `gridMode: 'none'`, implement `setGridMode` and `cycleGridMode` (cycling `'none'` → `'rule_of_thirds'` → `'golden_ratio'` → `'none'`).
- [x] Task 2: Scene Composition & Grid Math Engine Utility (AC: #2, #3)
  - [x] Create `src/utils/sceneCompositionEngine.ts`: Implement `calculateRuleOfThirdsLines`, `calculateGoldenRatioLines`, and `evaluateSceneGuidanceBadge`.
  - [x] `calculateRuleOfThirdsLines(width, height)`: Computes X coordinates ($width \times 0.3333$, $width \times 0.6667$) and Y coordinates ($height \times 0.3333$, $height \times 0.6667$).
  - [x] `calculateGoldenRatioLines(width, height)`: Computes X coordinates ($width \times 0.382$, $width \times 0.618$) and Y coordinates ($height \times 0.382$, $height \times 0.618$).
  - [x] `evaluateSceneGuidanceBadge(sceneType, horizonAngle)`: Generates actionable advice badge text and accent color based on detected `sceneType` (`landscape`, `architecture`, `food`, `interior`, `sunset`).
  - [x] Create `src/utils/__tests__/sceneCompositionEngine.test.ts`: Comprehensive unit test suite covering line coordinate calculations, ratio precision, scene guidance string formatting, and edge case fallbacks.
- [x] Task 3: Vector Composition Grid & Scene Guidance Overlay Component (AC: #1, #2, #3, #4)
  - [x] Create `src/components/camera/CompositionGridOverlay.tsx`: SVG vector renderer for Rule of Thirds and Golden Ratio grid lines with high-contrast floating scene classification badge chip.
  - [x] Render grid lines using `react-native-svg` `Line` elements with crisp stroke rendering and subtle intersection accent dots at grid power points.
  - [x] Apply `pointerEvents="box-none"` to container to avoid blocking camera gestures or shutter interaction.
- [x] Task 4: Viewfinder HUD Integration & Grid Toggle Control (AC: #1, #2, #3, #4)
  - [x] Update `src/components/camera/CameraViewfinder.tsx`: Render `CompositionGridOverlay` when `mode === 'scene'` and `gridMode !== 'none'`.
  - [x] Add Grid Toggle Chip/Button to viewfinder HUD controls in Scene Mode allowing single-tap cycling of grid modes (`[Grid: Off]`, `[Grid: 1/3]`, `[Grid: Phi]`).
- [x] Task 5: Automated Verification & DoD Check (AC: #1, #2, #3, #4)
  - [x] Run TypeScript compiler checks (`npx tsc --noEmit`).
  - [x] Run unit test suite (`npx tsx src/utils/__tests__/sceneCompositionEngine.test.ts`, `npx tsx src/utils/__tests__/recommendationEngine.test.ts`, etc.).

### Review Findings

<!-- Code review: 2026-07-31 | Layers: blind, edge, auditor | 5 dismissed, 2 deferred -->

**Decision Needed:**
- [x] [Review][Decision] `horizonAngle` accepted but never used — should landscape guidance dynamically vary based on actual tilt angle? [sceneCompositionEngine.ts:65]
- [x] [Review][Decision] Golden Ratio grid uses unauthorized cyan stroke `rgba(0,229,255,0.55)` — spec AC #2 specifies `rgba(255,255,255,0.45)` for all modes; confirm intentional per-mode color differentiation [CompositionGridOverlay.tsx:39]

**Patch:**
- [x] [Review][Patch] `gridMode` not reset on mode switch — store value lingers when returning to Scene Mode [useCameraStore.ts:51-65]
- [x] [Review][Patch] `sceneType: undefined` shows misleading "Scene Detected" badge when vision result has no classification [CompositionGridOverlay.tsx:48]
- [x] [Review][Patch] Power point circle opacity 0.7 vs spec-specified 0.6 [CompositionGridOverlay.tsx:82]
- [x] [Review][Patch] `evaluateSceneGuidanceBadge` accepts loose `string` param — tighten to `SceneType | null | undefined` for compile-time safety [sceneCompositionEngine.ts:65]

**Deferred:**
- [x] [Review][Defer] Badge `top: 140` not safe-area aware — may overlap notch/dynamic island on newer devices [CompositionGridOverlay.tsx:106] — deferred, pre-existing layout pattern in project
- [x] [Review][Defer] Test ratio assertions use `Math.round()` — floating-point brittle if ratio constants change [sceneCompositionEngine.test.ts:13] — deferred, cosmetic test quality

## File List

- `src/types/camera.ts` (MODIFIED)
- `src/stores/useCameraStore.ts` (MODIFIED)
- `src/utils/sceneCompositionEngine.ts` (NEW)
- `src/utils/__tests__/sceneCompositionEngine.test.ts` (NEW)
- `src/components/camera/CompositionGridOverlay.tsx` (NEW)
- `src/components/camera/GridModeToggle.tsx` (NEW)
- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)

## Change Log

- 2026-07-31: Implemented Scene Mode composition grid overlays and scene guidance HUD badges (Story 4.3).

## Dev Notes

- **Architecture Invariants & Standards Compliance:**
  - **AD-1 (React Native / Expo Managed Workflow):** Built using Expo compatible components and `react-native-svg` vector overlays.
  - **AD-4 (Vector Data Format & Vector Rendering):** Uses `react-native-svg` for resolution-independent canvas overlay lines scaled dynamically to viewfinder dimensions.
  - **AD-5 (State Management):** Zustand `useCameraStore` manages transient `gridMode` state.
  - **FR-4.1:** Scene classification (Landscape, Architecture, Food, Interior, Sunset).
  - **FR-4.2:** Toggle composition grid overlays (Rule of Thirds / Golden Ratio).
  - **FR-4.3:** Suggest composition & lens tweaks based on scene classification.

- **Existing Codebase Analysis & Files Being Modified:**
  - `src/types/camera.ts` (MODIFY): Add `GridMode` type and update `CameraState`.
  - `src/stores/useCameraStore.ts` (MODIFY): Add `gridMode` state, `setGridMode`, `cycleGridMode`.
  - `src/types/vision.ts`: Provides `SceneType` (`'landscape' | 'architecture' | 'food' | 'interior' | 'sunset'`) and `KeyframeVisionResult`.
  - `src/utils/sceneCompositionEngine.ts` (NEW): Grid line math and scene guidance message engine.
  - `src/utils/__tests__/sceneCompositionEngine.test.ts` (NEW): Unit test suite for composition math.
  - `src/components/camera/CompositionGridOverlay.tsx` (NEW): SVG vector overlay component for grids & scene badges.
  - `src/components/camera/GridModeToggle.tsx` (NEW): Single-tap HUD mode toggle chip.
  - `src/components/camera/CameraViewfinder.tsx` (MODIFY): Incorporates `CompositionGridOverlay` and grid toggle HUD control.

- **Mathematical Specifications:**
  - **Rule of Thirds Ratios:** Horizontal lines at $y = 0.3333 \cdot H$ and $y = 0.6667 \cdot H$; Vertical lines at $x = 0.3333 \cdot W$ and $x = 0.6667 \cdot W$.
  - **Golden Ratio (Phi Grid) Ratios:** Horizontal lines at $y = 0.382 \cdot H$ and $y = 0.618 \cdot H$; Vertical lines at $x = 0.382 \cdot W$ and $x = 0.618 \cdot W$ (where $1/\Phi \approx 0.61803398875$ and $1/\Phi^2 \approx 0.38196601125$).
  - **Power Points:** Intersection circles (radius $3\text{px}$, opacity $0.6$) rendered at the 4 grid line intersection points.

- **Learnings from Previous Stories:**
  - Container must use `pointerEvents="box-none"` to keep camera interactions smooth.
  - SVG elements should use explicit `strokeWidth={1.5}` and `strokeDasharray` if subtle dashed accents are needed.
  - Keep state changes in Zustand predictable with clear toggle functions.

### Project Structure Notes

- New files align with codebase architecture:
  - `src/utils/sceneCompositionEngine.ts`
  - `src/utils/__tests__/sceneCompositionEngine.test.ts`
  - `src/components/camera/CompositionGridOverlay.tsx`
  - `src/components/camera/GridModeToggle.tsx`

### References

- [Epic 4 Story 4.3 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L222-L232)
- [Architecture Spine AD-4, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L37-L51)
- [PRD FR-4.1, FR-4.2, FR-4.3](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L44-L46)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L68)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- Story implementation completed following Red-Green-Refactor TDD cycle.
- All unit tests executed successfully via `tsx` runner with 0 failures.
- TypeScript compilation checked (`npx tsc --noEmit`) with 0 errors.

### Completion Notes List

- Added `GridMode` state and toggle cycling (`none` → `rule_of_thirds` → `golden_ratio` → `none`) to Zustand `useCameraStore`.
- Implemented `sceneCompositionEngine.ts` to compute exact Rule of Thirds and Golden Ratio grid line coordinates and power point intersections, as well as scene classification guidance badge text.
- Created `CompositionGridOverlay.tsx` SVG overlay using `react-native-svg` and high-contrast floating guidance badge chip.
- Created `GridModeToggle.tsx` HUD chip button and integrated grid overlay into `CameraViewfinder.tsx`.
- Updated story status to `review` and sprint status to `review`.

