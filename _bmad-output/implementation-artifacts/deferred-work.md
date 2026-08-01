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
