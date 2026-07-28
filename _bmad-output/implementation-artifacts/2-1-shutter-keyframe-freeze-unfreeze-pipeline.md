# Story 2.1: Shutter Keyframe Freeze & Unfreeze Pipeline

Status: ready-for-dev

## Story

As a user,  
I want to tap an "Analyze / Freeze" shutter button to freeze the viewfinder preview,  
so that the app can analyze the image without motion blur.

## Acceptance Criteria

1. **Given** the live preview is running at 60 FPS,  
   **When** the user taps the shutter button,  
   **Then** the camera preview freezes on a high-resolution keyframe snapshot, and an "Analyzing..." visual indicator appears on screen.
2. **Given** the viewfinder is in a frozen state,  
   **When** the user taps anywhere on the screen or taps the shutter button again,  
   **Then** the camera preview un-freezes back to 60 FPS live video, and the "Analyzing..." indicator disappears.
3. **Given** the shutter button is displayed floating over the bottom HUD of the camera viewfinder,  
   **When** rendered,  
   **Then** the button presents a clear, high-contrast camera shutter design (outer ring with inner trigger circle) with minimum 44x44pt touch target and proper accessibility attributes (`accessibilityRole="button"`, `accessibilityLabel="Analyze and freeze keyframe"`).
4. **Given** `useCameraStore` manages transient camera state,  
   **When** keyframe freeze state changes,  
   **Then** `isFrozen` (`boolean`) and `isAnalyzing` (`boolean`) state properties in `useCameraStore` update accordingly, dynamically controlling camera active feed state (`isActive={isAppActive && !isFrozen}`).

## Tasks / Subtasks

- [ ] Task 1: Camera Store State Expansion & Unit Tests (AC: #4)
  - [ ] Update `src/types/camera.ts` to add `isAnalyzing: boolean`, `setIsAnalyzing: (analyzing: boolean) => void`, and `toggleFreeze: () => void`.
  - [ ] Update `src/stores/useCameraStore.ts` to implement `isAnalyzing` state and `toggleFreeze` action (toggling `isFrozen` and managing `isAnalyzing`).
  - [ ] Create `src/stores/__tests__/useCameraStore.test.ts` to test store state transitions for freezing, un-freezing, and toggling.
- [ ] Task 2: Shutter Button Component Implementation (AC: #1, #3)
  - [ ] Create `src/components/camera/ShutterButton.tsx` with high-contrast shutter button UI (white outer ring, inner circle with amber/cyan highlight when active/frozen).
  - [ ] Connect `isFrozen`, `isAnalyzing`, and `toggleFreeze` from `useCameraStore`.
  - [ ] Ensure minimum 44pt touch target diameter (e.g. 72x72pt button size) and accessibility attributes (`accessibilityRole="button"`, `accessibilityLabel`).
- [ ] Task 3: Analyzing Indicator & Freeze Overlay Component Implementation (AC: #1, #2)
  - [ ] Create `src/components/camera/AnalyzingIndicator.tsx` rendering a sleek glassmorphic HUD pill ("Analyzing...") with an animated activity spinner or Reanimated pulsing ring when `isFrozen` / `isAnalyzing` is active.
  - [ ] Add single-tap gesture listener / `Pressable` overlay covering the viewfinder so tapping anywhere on screen un-freezes the camera feed back to live 60 FPS video.
- [ ] Task 4: Camera Viewfinder Integration & Freeze Control (AC: #1, #2, #4)
  - [ ] Update `src/components/camera/CameraViewfinder.tsx` to read `isFrozen` and `isAnalyzing` from `useCameraStore`.
  - [ ] Pass `isActive={isAppActive && !isFrozen}` to `<Camera>` (pausing/freezing native camera stream on keyframe).
  - [ ] Mount `<ShutterButton />` in bottom HUD container above/alongside `LensPresetChips`.
  - [ ] Mount `<AnalyzingIndicator />` / Freeze touch listener in HUD overlay canvas when `isFrozen` is true.

## Dev Notes

- **Architecture Invariants Compliance:**
  - **AD-1 (App Framework & Vision Camera):** Utilize `react-native-vision-camera` state binding (`isActive={isAppActive && !isFrozen}`) for instant keyframe freeze without continuous JS bridge streaming.
  - **AD-2 (Viewfinder 60 FPS & Keyframe AI Pipeline):** Tapping shutter button freezes preview instantly and triggers `isAnalyzing` HUD state. Pausing `isActive` on keyframe avoids unnecessary continuous frame processing and conserves battery/thermals.
  - **AD-5 (Zustand State):** Extend existing `useCameraStore` with `isAnalyzing` and `toggleFreeze()` helper, keeping transient state centralized without Redux boilerplate.
- **Existing Codebase Analysis & File Updates:**
  - `src/types/camera.ts`: Existing `CameraState` contains `isFrozen` and `setIsFrozen`. Add `isAnalyzing: boolean`, `setIsAnalyzing: (analyzing: boolean) => void`, and `toggleFreeze: () => void`.
  - `src/stores/useCameraStore.ts`: Implement `isAnalyzing` (default `false`) and `toggleFreeze` logic in Zustand store.
  - `src/components/camera/CameraViewfinder.tsx`: Needs layout update to bind `isActive={isAppActive && !isFrozen}`, mount `<ShutterButton />` in bottom HUD, and mount `<AnalyzingIndicator />` overlay.
- **Code Safety & Edge Cases:**
  - Handle rapid double-tapping on shutter button by debouncing or checking state in `toggleFreeze`.
  - When app goes to background while frozen (`isAppActive = false`), ensure `isActive` remains `false`.
  - Ensure touch targets adhere to mobile design guidelines (minimum 44x44pt touchable area).
  - Do not use invalid React Native CSS properties like `backgroundColor: 'inherit'` or invalid inline style types.
- **Testing Approach:**
  - Unit tests: `npx tsx src/stores/__tests__/useCameraStore.test.ts` or Jest.
  - Typecheck: `npx tsc --noEmit`.

### Project Structure Notes

- Extends established structure:
  - `src/types/camera.ts`
  - `src/stores/useCameraStore.ts`
  - `src/components/camera/ShutterButton.tsx`
  - `src/components/camera/AnalyzingIndicator.tsx`
  - `src/components/camera/CameraViewfinder.tsx`
  - `src/stores/__tests__/useCameraStore.test.ts`

### References

- [Epic 2 Story 2.1 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L138-L148)
- [Architecture Spine AD-2 & AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L22-L50)
- [PRD FR-2.1, FR-2.2, FR-2.3](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md#L61-L64)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L57)
- [Story 1.3 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/1-3-mode-switcher-quick-lens-preset-chips.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- None.

### Completion Notes List

- Story file generated by `bmad-create-story` workflow.

### File List

- `src/types/camera.ts`
- `src/stores/useCameraStore.ts`
- `src/components/camera/ShutterButton.tsx`
- `src/components/camera/AnalyzingIndicator.tsx`
- `src/components/camera/CameraViewfinder.tsx`
- `src/stores/__tests__/useCameraStore.test.ts`
