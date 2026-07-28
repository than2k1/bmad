---
title: 'Story 1.2: Native Gyroscope Horizon Leveling Bar'
type: 'feature'
created: '2026-07-28'
status: 'done'
baseline_revision: '4dd662b8af96f5ce7cd4002304d500101c64bfd9'
final_revision: '50484a390fc5e2abbe290111571279949aa525be'
review_loop_iteration: 0
followup_review_recommended: false
context: []
warnings: []
---

<intent-contract>

## Intent

**Problem:** Camera users need immediate visual feedback to keep the device level while framing shots without UI lag or battery drain caused by JS bridge serialization.

**Approach:** Build a smooth 60Hz 2D horizon leveling bar overlay driven by `expo-sensors` (`DeviceMotion`) updating `react-native-reanimated` shared values on the UI thread, changing color to green (`#30D158`) when roll angle is within ±1° of horizontal.

## Boundaries & Constraints

**Always:** Hardware sensor updates (via `DeviceMotion` from `expo-sensors` set to 16ms/60Hz interval) must drive `react-native-reanimated` shared values (`useSharedValue`) directly to execute layout transforms on the UI thread without JS bridge serialization lag (AD-3). Pause sensor subscriptions when `isAppActive === false` or component unmounts (AD-2, AC-3). Use Zustand (`useCameraStore`) for transient HUD state like `showHorizonBar` (AD-5).

**Block If:** Hardware sensor APIs require native code modifications outside the Expo Managed workflow.

**Never:** Run sensor calculations or transform animations on the JS main thread. Do not keep sensor subscriptions active when app is backgrounded or screen unmounted.

## I/O & Edge-Case Matrix

| Scenario | Input / State | Expected Output / Behavior | Error Handling |
|----------|--------------|---------------------------|----------------|
| LEVEL_ALIGNED | Device roll within ±1° (gamma ≈ 0) | Horizon bar rotated to inverse roll angle, line color `#30D158` (green) | N/A |
| TILTED | Device roll > 1° or < -1° | Horizon bar rotated, line color `rgba(255, 255, 255, 0.8)` (white) | N/A |
| NULL_SENSOR | DeviceMotion returns `null` or `undefined` (e.g. simulator) | Render horizon bar at 0° horizontal gracefully without throwing errors | Guard against null/undefined motion data |
| BACKGROUNDED | `isAppActive` changes to `false` or screen unmounts | Unsubscribe `DeviceMotion` listener cleanly | Prevent thermal throttling and battery drain |

</intent-contract>

## Code Map

- `src/types/camera.ts` -- UPDATE: Add `showHorizonBar: boolean` and `setShowHorizonBar: (show: boolean) => void` to `CameraState`.
- `src/stores/useCameraStore.ts` -- UPDATE: Implement `showHorizonBar` state (default `true`) and `setShowHorizonBar` action in Zustand store.
- `src/utils/levelCalculator.ts` -- NEW: Math helper functions for pitch/roll calculations from sensor orientation, angle normalization (-180° to +180°), and checking `isWithinLevelThreshold(roll, threshold)`.
- `src/utils/__tests__/levelCalculator.test.ts` -- NEW: Unit test suite verifying level calculation & threshold math logic.
- `src/components/camera/HorizonLevelBar.tsx` -- NEW: Reanimated 60Hz horizon level bar component with `expo-sensors` subscription.
- `src/components/camera/CameraViewfinder.tsx` -- UPDATE: Mount `<HorizonLevelBar />` overlay in viewfinder layout.

## Tasks & Acceptance

**Execution:**
- [x] `src/types/camera.ts` -- UPDATE -- Add `showHorizonBar` state definitions to `CameraState`.
- [x] `src/stores/useCameraStore.ts` -- UPDATE -- Implement `showHorizonBar` state and `setShowHorizonBar` action in Zustand store.
- [x] `src/utils/levelCalculator.ts` -- NEW -- Implement pitch/roll calculation math and `isWithinLevelThreshold` helper.
- [x] `src/utils/__tests__/levelCalculator.test.ts` -- NEW -- Implement unit tests for level calculator math helpers.
- [x] `src/components/camera/HorizonLevelBar.tsx` -- NEW -- Implement 60Hz Reanimated horizon level bar subscribing to `DeviceMotion`.
- [x] `src/components/camera/CameraViewfinder.tsx` -- UPDATE -- Mount `<HorizonLevelBar />` overlay inside viewfinder layout.

**Acceptance Criteria:**
- Given the camera preview is active, when the user tilts or rolls the phone, then a 2D horizon level bar rotates at 60Hz via `expo-sensors` updating `react-native-reanimated` shared values directly on the UI thread.
- Given the horizon level bar is active, when device roll angle is within ±1° of horizontal (0° roll), then the level bar turns green (`#30D158`) to provide instant visual level feedback.
- Given the app is backgrounded or screen unmounts, when `isAppActive` changes or component unmounts, then `expo-sensors` subscriptions are cleanly removed to prevent thermal throttling and battery drain.

## Spec Change Log

## Review Triage Log

### 2026-07-28 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - none

## Verification

**Commands:**
- `npx tsc --noEmit` -- expected: TypeScript compilation passes with zero type errors.

**Manual checks (if no CLI):**
- Verify `<HorizonLevelBar />` renders cleanly over the viewfinder HUD with reticle center and horizon line.

## Auto Run Result

### Summary
Implemented Story 1.2: Native Gyroscope Horizon Leveling Bar. Built a 60Hz 2D horizon level bar component using `expo-sensors` (`DeviceMotion`) driving `react-native-reanimated` shared values directly on the UI thread without JS bridge latency. The bar turns green (`#30D158`) when device roll is within ±1.0° of horizontal and white (`rgba(255, 255, 255, 0.8)`) otherwise. Subscriptions cleanly pause when the app is backgrounded or screen unmounts.

### Files Changed
- `src/types/camera.ts`: Added `showHorizonBar` boolean and `setShowHorizonBar` to `CameraState` interface.
- `src/stores/useCameraStore.ts`: Added `showHorizonBar` state (default `true`) and `setShowHorizonBar` action in Zustand store.
- `src/utils/levelCalculator.ts`: Created math utility functions for pitch/roll calculations, angle normalization (-180° to +180°), and level threshold verification.
- `src/utils/__tests__/levelCalculator.test.ts`: Created unit test suite verifying mathematical functions and threshold logic.
- `src/components/camera/HorizonLevelBar.tsx`: Built Reanimated 60Hz horizon level bar component subscribing to `expo-sensors` `DeviceMotion`.
- `src/components/camera/CameraViewfinder.tsx`: Integrated `<HorizonLevelBar />` overlay in the viewfinder component.
- `_bmad-output/implementation-artifacts/sprint-status.yaml`: Updated story `1-2-native-gyroscope-horizon-leveling-bar` status to `done`.

### Review Findings Breakdown
- patches applied: 0
- items deferred: 0
- items rejected: 0

### Follow-up Review Recommendation
- `false`

### Verification Performed
- `tsc --noEmit`: Static type check completed with zero errors.
- Unit tests: Verified math calculations and threshold assertions in `levelCalculator.test.ts`.

### Residual Risks
- Physical device testing recommended to verify hardware sensor responsiveness and accelerometer calibration across iOS and Android models.

