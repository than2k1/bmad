---
baseline_commit: 6b458a88b977439727dc8cd4028fcc0539717e6c
---
# Story 5.2: Mode-Driven Composition Rule Evaluator Engine (`compositionRuleEngine`)

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

As a photographer or user,  
I want the camera engine to dynamically evaluate classic photography composition rules (Symmetry & Centering, Leading Lines & Depth, Frame-within-a-Frame, Rule of Thirds) based on the active camera mode (Person Mode vs. Scene/Landscape Mode),  
so that I receive real-time, mode-prioritized composition alignment scores, satisfies-threshold indicators ($\ge 85\%$), and actionable directional pan/tilt/distance guidance cues.

## Acceptance Criteria

1. **Given** a keyframe is analyzed (`isFrozen === true` and `visionResult !== null`),  
   **When** `evaluateCompositionRules(mode, spatialLayout, subjects, viewportWidth, viewportHeight)` in `src/utils/compositionRuleEngine.ts` is executed,  
   **Then** it selects the active priority cascade based on camera mode from `src/utils/compositionStrategy.ts`:  
   - **Landscape / Scene Mode**: Priority 1: `symmetry_centering` $\to$ Priority 2: `leading_lines` $\to$ Priority 3: `frame_in_frame` $\to$ Priority 4: `rule_of_thirds` (fallback).  
   - **Person Mode**: Priority 1: `frame_in_frame` $\to$ Priority 2: `leading_lines` $\to$ Priority 3: `symmetry_centering` $\to$ Priority 4: `rule_of_thirds` (fallback).  

2. **Given** spatial layout data (`lines`, `boundingBoxes`, `horizonLine`, `vanishingPoint`) from Tier 2 extraction and detected subject keypoints/bounding boxes,  
   **When** the evaluator scans the priority cascade for the active mode,  
   **Then** it evaluates each rule sequentially and selects the highest-priority rule whose alignment confidence/score meets or exceeds the $\ge 70\%$ confidence trigger threshold.  
   - If no rule meets the $\ge 70\%$ threshold (or `spatialLayout` is undefined/empty), the engine falls back to `activeRule: 'rule_of_thirds'`.  

3. **Given** an evaluated composition result,  
   **When** returned from `evaluateCompositionRules`,  
   **Then** it provides a structured object matching the `CompositionRuleResult` interface:  
   - `activeRule`: `'frame_in_frame' | 'leading_lines' | 'symmetry_centering' | 'rule_of_thirds'`.  
   - `score`: Alignment score percentage ($0$ to $100\%$).  
   - `isSatisfied`: `true` when alignment score is $\ge 85\%$ (target composition achieved), else `false`.  
   - `directionalCue`: Structured object `{ pan: 'left' | 'right' | 'centered', tilt: 'up' | 'down' | 'level', distance: 'step_closer' | 'step_back' | 'perfect' }`.  
   - `guideLines`: Array of SVG-ready vector line segments `{ start: Point2D; end: Point2D }` for visual overlay rendering.  
   - `textCue`: Human-readable photographer instruction string (e.g. *"Pan right 5° to align inside doorway"*, *"Step back ~1m to frame subject"*, *"Keep camera level for symmetry"*, *"Align subject with grid power points"*).  

4. **Given** individual composition rule evaluation math:  
   - **`symmetry_centering`**: Evaluates vertical structural lines and horizon tilt relative to viewport center axis ($x = W/2$, $y = H/2$). Scores alignment based on centroid offset from center axis.  
   - **`leading_lines`**: Evaluates converging diagonal lines and estimated `vanishingPoint`. Scores alignment based on proximity of vanishing point to central grid axes or power points.  
   - **`frame_in_frame`**: Evaluates background structural bounding boxes (`doorway`, `window`, `arch`, `frame`, `structure`). Compares subject bounding box centroid or canvas center to the interior bounds of the structural frame.  
   - **`rule_of_thirds`**: Baseline fallback rule. Compares subject centroid or primary structural lines against $33.3\%$ / $66.7\%$ grid lines.  

5. **Given** keyframe vision inferencing execution in `src/utils/visionInferencingEngine.ts` or camera store state in `src/stores/useCameraStore.ts`,  
   **When** `analyzeKeyframe` runs or `compositionResult` is updated,  
   **Then** composition rule evaluation completes within $< 15\text{ms}$ CPU time budget without blocking UI rendering or delaying frame processor output.  

6. **Given** preview is un-frozen (`isFrozen === false`),  
   **When** `clearVisionResult()` is called on `useCameraStore`,  
   **Then** any cached `compositionResult` state is cleared from store state cleanly.

## Tasks / Subtasks

- [x] Task 1: Type Definitions & Priority Strategy Mapping (AC: #1, #3)
  - [x] Create `src/types/composition.ts`: Define `CompositionRuleType` (`'frame_in_frame' | 'leading_lines' | 'symmetry_centering' | 'rule_of_thirds'`), `PanDirection` (`'left' | 'right' | 'centered'`), `TiltDirection` (`'up' | 'down' | 'level'`), `DistanceDirection` (`'step_closer' | 'step_back' | 'perfect'`), `CompositionDirectionalCue`, `CompositionGuideLine`, and `CompositionRuleResult`.
  - [x] Create `src/utils/compositionStrategy.ts`: Export `COMPOSITION_PRIORITIES` constant object defining priority cascades for `'person'` and `'scene'`/`'landscape'` modes, and constants `RULE_SATISFIED_THRESHOLD = 85`, `RULE_TRIGGER_THRESHOLD = 70`.
- [x] Task 2: Rule Evaluators Engine (AC: #1, #2, #4, #5)
  - [x] Create `src/utils/compositionRuleEngine.ts`:
    - [x] `evaluateSymmetry(spatialLayout, width, height)`: Calculates horizontal/vertical balance score and pan/tilt offsets.
    - [x] `evaluateLeadingLines(spatialLayout, width, height)`: Calculates diagonal line convergence, vanishing point distance to grid centers, and directional cues.
    - [x] `evaluateFrameInFrame(spatialLayout, subjects, width, height)`: Evaluates subject framing inside background structural bounding boxes (`doorway`, `window`, `arch`, etc.).
    - [x] `evaluateRuleOfThirds(spatialLayout, subjects, width, height)`: Baseline grid alignment evaluator.
    - [x] `evaluateCompositionRules(mode, spatialLayout, subjects, viewportWidth, viewportHeight)`: Main entry point iterating through mode priority cascade, selecting highest rule $\ge 70\%$, returning fallback `rule_of_thirds` if none match.
- [x] Task 3: Comprehensive Unit Test Suite (AC: #1-6)
  - [x] Create `src/utils/__tests__/compositionRuleEngine.test.ts`:
    - [x] Test mode priority ordering (`landscape` prefers symmetry, `person` prefers frame-in-frame).
    - [x] Test threshold logic ($\ge 70\%$ trigger threshold, $\ge 85\%$ satisfies threshold).
    - [x] Test directional cue calculations for pan, tilt, distance.
    - [x] Test fallback to `rule_of_thirds` when no background structures are detected.
    - [x] Test performance execution time ($< 15\text{ms}$).
- [x] Task 4: Vision Engine & Store Coupling (AC: #3, #5, #6)
  - [x] Update `src/types/vision.ts`: Export optional `compositionResult?: CompositionRuleResult` on `KeyframeVisionResult`.
  - [x] Update `src/utils/visionInferencingEngine.ts`: Call `evaluateCompositionRules` during keyframe analysis when spatial layout is present.
  - [x] Verify store `clearVisionResult()` resets vision & composition result state cleanly.
- [x] Task 5: Automated Verification & DoD Check (AC: #1-6)
  - [x] Run TypeScript compiler checks (`npx tsc --noEmit`).
  - [x] Run unit test suite (`npx tsx src/utils/__tests__/compositionRuleEngine.test.ts`, `npx tsx src/utils/__tests__/spatialLayoutExtractor.test.ts`, `npx tsx src/utils/__tests__/visionInferencingEngine.test.ts`).

### Review Findings

- [x] [Review][Patch] Directional Pan and Tilt Cue Sign Inconsistency in Leading Lines Evaluator [src/utils/compositionRuleEngine.ts:173-178]
- [x] [Review][Patch] Potential Division by Zero and NaN Propagation in evaluateFrameInFrame [src/utils/compositionRuleEngine.ts:248]
- [x] [Review][Patch] Unguarded Viewport Dimensions (0 Width/Height) and Custom Default Fallback [src/utils/compositionRuleEngine.ts:400-401]
- [x] [Review][Patch] Unfiltered Primary Bounding Box Selection in evaluateFrameInFrame [src/utils/compositionRuleEngine.ts:230]
- [x] [Review][Patch] Unused DEFAULT_CONFIG.mode in visionInferencingEngine.ts [src/utils/visionInferencingEngine.ts:544]


## File List

- `src/types/composition.ts` (NEW)
- `src/utils/compositionStrategy.ts` (NEW)
- `src/utils/compositionRuleEngine.ts` (NEW)
- `src/utils/__tests__/compositionRuleEngine.test.ts` (NEW)
- `src/types/vision.ts` (MODIFIED)
- `src/utils/visionInferencingEngine.ts` (MODIFIED)
- `src/stores/useCameraStore.ts` (MODIFIED)

## Change Log

- Story 5.2 created: Mode-Driven Composition Rule Evaluator Engine (`compositionRuleEngine`) (Date: 2026-08-02).
- Story 5.2 implementation completed: Created composition types, priority cascade strategy, rule evaluator engine, unit tests, and vision engine integration. (Date: 2026-08-02).

## Dev Notes

- **Architecture Invariants & Standards Compliance:**
  - **AD-2 (Keyframe AI Vision Pipeline):** Composition rule evaluator runs on frozen keyframes (`isFrozen === true`) within $< 15\text{ms}$ budget (well within the overall $< 200\text{ms}$ total keyframe budget).
  - **AD-5 (State Management):** Transient composition evaluation results stored in Zustand `useCameraStore` via `KeyframeVisionResult.compositionResult`.
  - **NFR-1.1 & NFR-2.1 & NFR-2.2:** On-device, local execution, 100% offline, zero network requests.

- **Existing Codebase Analysis & Integration Points:**
  - `src/types/vision.ts` (MODIFY): Add `compositionResult?: CompositionRuleResult` to `KeyframeVisionResult`.
  - `src/utils/spatialLayoutExtractor.ts`: Provides `SpatialLayoutResult` (`lines`, `boundingBoxes`, `horizonLine`, `vanishingPoint`).
  - `src/utils/visionInferencingEngine.ts` (MODIFY): Incorporate `evaluateCompositionRules` during keyframe analysis.
  - `src/stores/useCameraStore.ts` (MODIFY): Manages `visionResult` state which now includes `compositionResult`.

- **Rule Priority Cascades (`compositionStrategy.ts`):**
  - **Landscape Mode (and default scene mode):**
    1. `symmetry_centering` (Priority 1)
    2. `leading_lines` (Priority 2)
    3. `frame_in_frame` (Priority 3)
    4. `rule_of_thirds` (Priority 4 / Fallback)
  - **Person Mode:**
    1. `frame_in_frame` (Priority 1)
    2. `leading_lines` (Priority 2)
    3. `symmetry_centering` (Priority 3)
    4. `rule_of_thirds` (Priority 4 / Fallback)

- **Learnings from Previous Stories (Epic 4 & Story 5.1):**
  - Keep math functions pure, fast, and resilient to missing or empty arrays (e.g., zero lines detected, no bounding boxes).
  - Use float comparisons or explicit delta checks ($\epsilon = 0.001$) in unit tests for geometry and line math.
  - Ensure `textCue` strings are concise, high-contrast, and action-oriented for photographer HUD display.

### References

- [Epic 5 Context Document](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/epic-5-context.md)
- [Background Layout Guidance Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/spec-background-layout-guidance.md)
- [Story 5.1 Spatial Layout Extractor](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/5-1-background-line-bounding-box-spatial-layout-extractor.md)
- [Architecture Spine AD-2, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L22-L51)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L72)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- Story created following BMad create-story workflow protocol.
- Executed Red-Green-Refactor cycle for compositionRuleEngine.
- Ran TypeScript compilation (`npx tsc --noEmit`) and verified 0 errors.
- Executed full unit test suite (11 test files), all passing cleanly.

### Completion Notes List

- Created `src/types/composition.ts` with `CompositionRuleType`, `CompositionDirectionalCue`, `CompositionGuideLine`, and `CompositionRuleResult`.
- Created `src/utils/compositionStrategy.ts` with `COMPOSITION_PRIORITIES` for person vs landscape/scene modes, `RULE_SATISFIED_THRESHOLD = 85`, and `RULE_TRIGGER_THRESHOLD = 70`.
- Created `src/utils/compositionRuleEngine.ts` implementing `evaluateSymmetry`, `evaluateLeadingLines`, `evaluateFrameInFrame`, `evaluateRuleOfThirds`, and `evaluateCompositionRules`.
- Created `src/utils/__tests__/compositionRuleEngine.test.ts` validating mode priority ordering, thresholds, directional cues, fallbacks, and sub-15ms performance execution (0.003ms average).
- Updated `src/types/vision.ts` to include optional `compositionResult` on `KeyframeVisionResult`.
- Integrated `evaluateCompositionRules` into `analyzeKeyframe` in `src/utils/visionInferencingEngine.ts`.
- Verified store state reset in `useCameraStore.ts` via `clearVisionResult()`.

