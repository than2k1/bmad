# Deferred Work

## Deferred from: code review of 4-2-1-tap-lens-recommendation-exposure-alerts (2026-07-31)

- **evaluateLensRecommendation(null, 'headshot') test coverage gap** [`src/utils/__tests__/recommendationEngine.test.ts`]: The test suite does not explicitly assert that headshot framing returns `3x` when `visionResult` is null. Not a runtime bug, but a future-proofing gap worth adding in a future test sweep.
- **sceneType exhaustiveness — new values silently fall through** [`recommendationEngine.ts:55`]: If new `SceneType` values are added (e.g., `'night'`), they bypass all scene checks and fall to the `confidenceScore` path, potentially producing incorrect exposure guidance. Address when new scene types are introduced.

## Deferred from: code review of 4-3-scene-mode-composition-grid-overlays (2026-07-31)

- **Badge `top: 140` not safe-area aware** [`CompositionGridOverlay.tsx:106`]: Absolute pixel offset may overlap system UI (notch/dynamic island) on newer devices. Deferred — consistent with pre-existing layout pattern across project overlays; address holistically with a safe-area audit.
- **Test ratio assertions use `Math.round()` — floating-point brittle** [`sceneCompositionEngine.test.ts:13`]: Rounding masks precision; if ratio constants change slightly, tests pass silently when they shouldn't. Deferred — cosmetic test quality improvement.
- **4 separate store subscriptions in `CompositionGridOverlay`** [`CompositionGridOverlay.tsx:12-15`]: Individual selectors may cause excess re-renders on batch store updates. Deferred — low performance risk in current usage; revisit if frame-rate issues appear.
