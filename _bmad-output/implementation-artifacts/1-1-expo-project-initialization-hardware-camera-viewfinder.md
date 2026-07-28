---
status: done
baseline_revision: 9cf2900fcd9c8dff0b36ed9c951645eef1d38233
final_revision: e1e554e64271053a8d6f5fb745a4f99ebf00193b
followup_review_recommended: false
---

# Story 1.1: Expo Project Initialization & Hardware Camera Viewfinder


## Story

As a user,
I want to open the app and view a 60 FPS live camera preview on my phone,
so that I can frame my shots smoothly without lag.

## Acceptance Criteria

1. **Given** the app is launched on an iOS or Android device, **When** camera permission is not yet granted, **Then** an intuitive permission request screen is displayed explaining camera usage.
2. **Given** camera permission is granted by the user, **When** the camera screen mounts, **Then** the app binds the native back camera device using `react-native-vision-camera` and renders a smooth 60 FPS live camera preview.
3. **Given** camera permission is denied or restricted, **When** permission state is checked, **Then** a fallback screen is displayed with clear messaging and an action to open system settings.
4. **Given** camera hardware is active, **When** the app is backgrounded or navigated away, **Then** camera resources are cleanly paused (`isActive={false}`) to ensure device thermal stability and zero battery drain.

## Tasks / Subtasks

- [x] Task 1: Project Initialization & Dependency Setup (AC: #1, #2)
  - [x] Initialize Expo Managed workflow configuration (with config plugins for `react-native-vision-camera`).
  - [x] Add `react-native-vision-camera`, `react-native-reanimated`, `expo-sensors`, `react-native-svg`, `zustand`, `expo-file-system` to dependencies.
  - [x] Configure `app.json` / `app.config.js` camera permission strings (`NSCameraUsageDescription` for iOS, `CAMERA` permission for Android).
- [x] Task 2: Camera State & Store Setup (AC: #1, #2, #3, #4)
  - [x] Create Zustand camera store (`src/stores/useCameraStore.ts`) to track transient camera state (active mode, camera permission status, active zoom/lens).
  - [x] Define initial store types (`CameraState` interface).
- [x] Task 3: Permission Request & Fallback Screen (AC: #1, #3)
  - [x] Create `CameraPermissionScreen` component (`src/components/camera/CameraPermissionScreen.tsx`).
  - [x] Implement explicit camera permission request trigger using `useCameraPermission` hook from `react-native-vision-camera`.
  - [x] Build fallback view with explanation text and button opening app settings (`Linking.openSettings()`).
- [x] Task 4: 60 FPS Native Viewfinder Component (AC: #2, #4)
  - [x] Create `CameraViewfinder` component (`src/components/camera/CameraViewfinder.tsx`).
  - [x] Select back camera device via `useCameraDevice('back')`.
  - [x] Render `<Camera>` component from `react-native-vision-camera` with `style={StyleSheet.absoluteFill}`, `device={device}`, `isActive={isAppActive}`.
  - [x] Handle loading state while camera device initializes.
  - [x] Ensure full screen layout and proper aspect ratio handling.
- [x] Task 5: App Root Integration & Verification (AC: #1, #2, #3, #4)
  - [x] Connect `CameraPermissionScreen` and `CameraViewfinder` in main screen layout (`src/app/index.tsx` or `App.tsx`).
  - [x] Verify permission grant flow and live preview rendering.

## Dev Notes

- **Architecture Invariants:**
  - **AD-1 (App Framework & Native Bridge):** Build on React Native (Expo Managed Workflow with Config Plugins). Native camera access bound strictly via `react-native-vision-camera`.
  - **AD-2 (Viewfinder Preview):** Live camera viewfinder runs on a native high-performance preview layer at 60 FPS. Ensure camera `isActive` prop is bound to screen focus and app foreground state to avoid thermal throttling.
  - **AD-5 (State Management):** Use Zustand for transient camera state in `src/stores/useCameraStore.ts`.
- **Target File Structure:**
  ```text
  src/
  ├── app/
  │   └── index.tsx (or App.tsx)
  ├── components/
  │   └── camera/
  │       ├── CameraViewfinder.tsx
  │       └── CameraPermissionScreen.tsx
  ├── stores/
  │   └── useCameraStore.ts
  └── types/
      └── camera.ts
  ```
- **Code Safety & Edge Cases:**
  - `device` can be `undefined` on simulators or during initial device query. Provide a loading/unsupported placeholder gracefully instead of throwing NullPointer exception.
  - Ensure `NSCameraUsageDescription` in `app.json` has a user-friendly explanation ("Camera access is required for real-time viewfinder framing and AI pose suggestions").
  - On app state change (background/foreground via `AppState`), update `isActive` to `false` when backgrounded to prevent background camera battery drain.

### Project Structure Notes

- Unified structure established under `src/` using modular organization (`components/camera`, `stores`, `types`).
- Expo config plugins used for native module linking (`react-native-vision-camera`).

### References

- [Epic 1 Overview](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L79-L82)
- [Story 1.1 Specification](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L101-L111)
- [Architectural Decision AD-1 & AD-2](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L14-L30)
- [Architectural Decision AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L46-L50)
- [PRD Requirements FR-1.1 & NFR-1.2](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L56-L59)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- None. Implementation completed cleanly.

### Completion Notes List

- Created `package.json`, `app.json`, and `tsconfig.json` with Expo Managed Workflow config and `react-native-vision-camera` config plugin.
- Created `src/types/camera.ts` defining `CameraState` and domain type definitions.
- Created `src/stores/useCameraStore.ts` using Zustand to manage transient camera state.
- Implemented `CameraPermissionScreen` with permission request hook and fallback button opening system settings via `Linking.openSettings()`.
- Implemented `CameraViewfinder` displaying 60 FPS native camera preview with `AppState` background listener for thermal stability.
- Integrated components into `src/app/index.tsx` and `App.tsx`.

### File List

- [package.json](file:///o:/New%20folder/bmad-test/bmad/package.json)
- [app.json](file:///o:/New%20folder/bmad-test/bmad/app.json)
- [tsconfig.json](file:///o:/New%20folder/bmad-test/bmad/tsconfig.json)
- [App.tsx](file:///o:/New%20folder/bmad-test/bmad/App.tsx)
- [src/types/camera.ts](file:///o:/New%20folder/bmad-test/bmad/src/types/camera.ts)
- [src/stores/useCameraStore.ts](file:///o:/New%20folder/bmad-test/bmad/src/stores/useCameraStore.ts)
- [src/components/camera/CameraPermissionScreen.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraPermissionScreen.tsx)
- [src/components/camera/CameraViewfinder.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraViewfinder.tsx)
- [src/app/index.tsx](file:///o:/New%20folder/bmad-test/bmad/src/app/index.tsx)

## Review Triage Log

### 2026-07-28 — Review pass
- intent_gap: 0
- bad_spec: 0
- patch: 0
- defer: 0
- reject: 0
- addressed_findings:
  - none



