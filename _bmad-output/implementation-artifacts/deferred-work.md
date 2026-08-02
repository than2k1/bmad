# Deferred Work

## Deferred from: code review of 4-2-1-tap-lens-recommendation-exposure-alerts (2026-07-31)

- **evaluateLensRecommendation(null, 'headshot') test coverage gap** [`src/utils/__tests__/recommendationEngine.test.ts`]: The test suite does not explicitly assert that headshot framing returns `3x` when `visionResult` is null. Not a runtime bug, but a future-proofing gap worth adding in a future test sweep.
- **sceneType exhaustiveness — new values silently fall through** [`recommendationEngine.ts:55`]: If new `SceneType` values are added (e.g., `'night'`), they bypass all scene checks and fall to the `confidenceScore` path, potentially producing incorrect exposure guidance. Address when new scene types are introduced.

## Deferred from: code review of 4-3-scene-mode-composition-grid-overlays (2026-07-31)

- **Badge `top: 140` not safe-area aware** [`CompositionGridOverlay.tsx:106`]: Absolute pixel offset may overlap system UI (notch/dynamic island) on newer devices. Deferred — consistent with pre-existing layout pattern across project overlays; address holistically with a safe-area audit.
- **Test ratio assertions use `Math.round()` — floating-point brittle** [`sceneCompositionEngine.test.ts:13`]: Rounding masks precision; if ratio constants change slightly, tests pass silently when they shouldn't. Deferred — cosmetic test quality improvement.
- **4 separate store subscriptions in `CompositionGridOverlay`** [`CompositionGridOverlay.tsx:12-15`]: Individual selectors may cause excess re-renders on batch store updates. Deferred — low performance risk in current usage; revisit if frame-rate issues appear.

## Discovered during multi-subject clustering refactor (2026-08-01)

Pre-existing failures surfaced while verifying the multi-subject vision pipeline refactor. Both reproduce on a clean `git stash` of the refactor — not caused by it, but currently break the project's "100% test pass / 0 TS errors" claim from earlier story completion notes.

- **`DirectorCueOverlay.test.ts` cannot execute under `npx tsx`** [`src/components/camera/__tests__/DirectorCueOverlay.test.ts`]: Importing `react-native` triggers esbuild's Flow-syntax transform failure (`Unexpected "typeof"` at `node_modules/react-native/index.js:14:7`). React component tests need a jest + react-native transformer pipeline; plain `tsx` cannot run them. Deferred — tooling gap; either wire up jest with `react-native-testing-library` or convert this test to a hook/ logic-only test that doesn't import RN.
- **`sceneCompositionEngine.test.ts` passes invalid `'unknown'` sceneType** [`sceneCompositionEngine.test.ts:77`]: Story 4.3 tightened `evaluateSceneGuidanceBadge`'s param to `SceneType | null | undefined`, but the test still calls it with the literal `'unknown'` to exercise the fallback branch. TS error: `Argument of type '"unknown"' is not assignable to parameter of type 'SceneType | null | undefined'`. Deferred — fix by casting (`as SceneType`) or restructuring the test to verify fallback via `null`/`undefined` instead.

## Deferred from: code review of multi-subject clustering refactor (2026-08-01)

Reviewed uncommitted changes to `visionInferencingEngine.ts`, `recommendationEngine.ts`, `positioningEngine.ts`, `DirectorCueOverlay.tsx`, and tests against Story 4.2 and 4.3 specs. Layers: Blind Hunter, Edge Case Hunter, Acceptance Auditor. 1 decision-needed (resolved: raise nmsThreshold default to 0.6), 8 patch (all applied), 4 defer (below), 6 dismissed.

- **`useLensGuidance.onViewportLayout` is never wired — backlight alert always fires in production** [`src/hooks/useLensGuidance.ts:34-39`, `src/components/camera/CameraViewfinder.tsx`]: `useLensGuidance` returns `onViewportLayout` but `CameraViewfinder` never calls the hook; `ExposureAlertOverlay` and `LensPresetChips` only destructure `guidance`. `viewportHeight` stays at default `1000` forever. Effect: `bbox.y / 1000` is **always `< 0.3`** since `bbox.y` is normalized [0,1] → backlight alert fires for **every** keyframe with a detected subject. `bbox.height / 1000` is always `< 0.35` → substantial-height lens rec never fires in production. Deferred — pre-existing; the refactor correctly preserves literal thresholds. The bug is in caller wiring, not the engine. Tracked as epic-4 action item (owner: Winston).
- **Forced fallback masks genuine low-confidence with hardcoded 0.95** [`src/utils/visionInferencingEngine.ts:316-318`]: When the model returns all anchors below threshold (legitimate low-confidence scenario), the fallback fabricates `confidence = 0.95`. Downstream consumers receive a high-confidence signal for what is actually a low-quality detection. Deferred — pre-existing; old code did the same via `maxConf = 0.95`. Refactor preserves intentional behavior; semantic concern is design-level.
- **`sceneType` only emits 'landscape' or 'architecture'** [`src/utils/visionInferencingEngine.ts:461`]: Scene classification is derived from primary bbox height (`< 0.35 ? 'landscape' : 'architecture'`), never producing `'food'`, `'interior'`, or `'sunset'`. The `evaluateExposureGuidance` paths for `sunset`/`interior` are dead in production (only reachable via test fixtures). Deferred — pre-existing architectural limitation; real classification requires wiring the ONNX model's scene head.
- **Architecture Spine §3.2 schema mismatch** [`src/utils/recommendationEngine.ts:99-113`]: Spine specifies snake_case fields and additional fields (`positioning{}`, `suggested_pose_ids`, `scene_grid`). Implementation uses camelCase and a reduced field set. Deferred — pre-existing; Story 4.2 spec sanctions this deviation.

### Patches applied in this review

- **[D1] NMS IoU threshold default raised 0.45 → 0.6** [`visionInferencingEngine.ts:36, 302`]: Couples/group hugs produce overlapping torso boxes that would collapse distinct people into one subject at the typical detection-NMS default.
- **[P1] NaN propagation cascade in `extractAnchor`** [`visionInferencingEngine.ts:238-294`]: Added `Number.isFinite` validation + `safeRatio` helper; malformed anchor 0 (real scenario: all-below-threshold model output) no longer produces NaN bbox that propagates through NMS, getPrimarySubject, and into DirectorCueOverlay as `NaN% MATCH`.
- **[P2] Tie-break consistency** [`visionInferencingEngine.ts:460`]: `analyzeKeyframe` now uses the shared `pickPrimarySubject` helper for sceneType derivation, matching what downstream consumers use. Eliminates divergence on confidence ties.
- **[P3] Parser input validation** [`visionInferencingEngine.ts:213-236, 296-321`]: Added guards for `numAnchors <= 0`, `imgWidth <= 0`, `imgHeight <= 0`; `applyNMS` floors `maxDetections` at 1 to preserve "always >= 1 subject" producer contract.
- **[P4] NaN-confidence in `getPrimarySubject`** [`visionInferencingEngine.ts:330-358`]: Non-finite confidences normalized to 0 via shared `pickPrimarySubject` helper so the first NaN-confidence subject no longer always wins.
- **[P5] Bbox/keypoint coord clamping** [`visionInferencingEngine.ts:255-275`]: Added `clamp01` upper-bound to bbox x/y and keypoint x/y; previously values >1.0 from out-of-range tensor reads produced off-canvas overlays.
- **[P6] Test coverage gaps** [`src/utils/__tests__/visionInferencingEngine.test.ts`]: Added tests for fallback path (Test 7b), input validation guards (Test 7c), NMS boundary preservation (Test 7d), tie-on-confidence + NaN handling (extended Test 7), and MAX_SUBJECTS cap selection (extended Test 6).
- **[P7] Test fixture `keypoints: {} as any`** [`visionInferencingEngine.test.ts:146-148`]: Replaced with proper `STUB_KEYPOINTS` constant matching the pattern used in other test files.
- **[P8] Sprint-status action items** [`sprint-status.yaml`]: Marked grid stroke reconciliation done (code already complied with AC #2); added action items for the useLensGuidance wiring fix, DirectorCueOverlay jest tooling, and Math.round test brittleness. The `sceneCompositionEngine.test.ts` `'unknown'` literal was tracked here but is already resolved on main (commit 73a3215).

### Dismissed (6)

Crashes if `subjects` contains null/undefined entries (TypeScript prevents) · sort comparator NaN with NaN confidences (cascading from P4) · zero-area boxes produce IoU=0 (degenerate; only triggers on already-corrupt data) · O(n²) NMS performance (no measured regression; acceptable for current scale) · `sceneCompositionEngine.test.ts` "pre-existing" claim loose (doc accuracy, not code defect) · tie on confidence AND area ambiguity (documented first-wins behavior, design choice).

## Deferred from: code review of 5-1-background-line-bounding-box-spatial-layout-extractor (2026-08-01)

- **Coarse single-pair vertical bounding box aggregation merges distant structural lines** [`src/utils/spatialLayoutExtractor.ts:138-179`]: When multiple vertical lines exist, the aggregator picks the extreme leftmost and rightmost vertical lines, producing a single bounding box spanning the whole canvas. Deferred — heuristic limitation; refine in Story 5.2/5.3 as needed.
- **`arch` and `frame` labels defined in `StructuralLabel` type are unused in default aggregator logic** [`src/utils/spatialLayoutExtractor.ts:160-165`]: Aggregator emits only `'doorway'`, `'window'`, or `'structure'`. Deferred — placeholder type definitions for future curve/arch detection algorithms.

