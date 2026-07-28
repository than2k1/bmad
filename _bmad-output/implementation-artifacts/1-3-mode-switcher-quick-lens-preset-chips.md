---
baseline_commit: 355e73e0778071e8e83617a48f54a811b79c392b
---

# Story 1.3: Mode Switcher & Quick Lens Preset Chips

Status: done

## Story

As a user,  
I want to toggle between Person and Scene modes and switch lens zoom levels (`[0.5x]`, `[1x]`, `[3x Portrait]`),  
so that I can adapt the camera preview to my current photography subject.

## Acceptance Criteria

1. **Given** the Viewfinder HUD is active,  
   **When** the user taps `[3x Portrait]`,  
   **Then** the native camera switches to the telephoto lens zoom level (`3.0x`), and the active chip highlights with a portrait indicator (`3x Portrait`).
2. **Given** Person or Scene mode is active,  
   **When** the user taps the Mode Switcher segmented control (`Person` vs `Scene`),  
   **Then** `useCameraStore`'s `mode` state updates (`'person'` | `'scene'`), and the HUD UI reflects the selected mode with visual feedback.
3. **Given** quick lens preset chips (`[0.5x]`, `[1x]`, `[3x Portrait]`) are displayed floating over the camera preview canvas,  
   **When** the user taps any chip,  
   **Then** `useCameraStore`'s `activeLens` state updates (`'0.5x'` | `'1x'` | `'3x'`), updating the native `Camera` zoom property instantly.
4. **Given** hardware camera min/max zoom limits (e.g. device without ultra-wide lens or on simulator),  
   **When** a lens preset zoom is applied,  
   **Then** the numeric zoom level is safely clamped within `device.minZoom` and `device.maxZoom` bounds to prevent runtime hardware errors or exceptions.

## Tasks / Subtasks

- [x] Task 1: Lens Zoom Math Utilities & Unit Tests (AC: #1, #4)
  - [x] Create `src/utils/lensCalculator.ts` mapping `LensPreset` (`'0.5x'`, `'1x'`, `'3x'`) to numeric zoom levels (`0.5`, `1.0`, `3.0`).
  - [x] Implement `getLensChipLabel(lens: LensPreset)` helper returning `'0.5x'`, `'1x'`, or `'3x Portrait'`.
  - [x] Implement `clampZoom(targetZoom: number, minZoom?: number, maxZoom?: number)` helper to protect against hardware limits.
  - [x] Create `src/utils/__tests__/lensCalculator.test.ts` to test conversion, labeling, and clamping functions.
- [x] Task 2: Mode Switcher Component Implementation (AC: #2)
  - [x] Create `src/components/camera/ModeSwitcher.tsx` with segmented pill UI (`Person` / `Scene`).
  - [x] Connect `mode` and `setMode` from `useCameraStore`.
  - [x] Style with dark glassmorphism background (`rgba(0,0,0,0.5)`), active pill pill highlight (`#FFFFFF` text, semi-transparent background), and touch accessibility props (`accessibilityRole="tab"`).
- [x] Task 3: Lens Preset Chips Component Implementation (AC: #1, #3)
  - [x] Create `src/components/camera/LensPresetChips.tsx` rendering chips for `0.5x`, `1x`, and `3x Portrait`.
  - [x] Connect `activeLens` and `setActiveLens` from `useCameraStore`.
  - [x] Style horizontal floating chip bar with active state highlight (gold/amber `#FFD60A` or white `#FFFFFF` accent ring for `3x Portrait`).
- [x] Task 4: Camera Viewfinder Integration & Dynamic Zoom Binding (AC: #1, #2, #3, #4)
  - [x] Update `src/components/camera/CameraViewfinder.tsx` to read `activeLens` from store and calculate clamped `zoom` value via `clampZoom(getNumericZoom(activeLens), device.minZoom, device.maxZoom)`.
  - [x] Pass `zoom={zoomValue}` to `<Camera>` component from `react-native-vision-camera`.
  - [x] Mount `<ModeSwitcher />` in top HUD overlay area and `<LensPresetChips />` in bottom HUD overlay area.
  - [x] Ensure non-overlapping layout with existing `<HorizonLevelBar />`.

### Review Findings

- [x] [Review][Patch] Static top/bottom HUD positioning ignores device safe area insets [src/components/camera/CameraViewfinder.tsx:103-116]
- [x] [Review][Patch] Unit tests use custom assert() function instead of standard Jest describe/it/expect blocks [src/utils/__tests__/lensCalculator.test.ts:1-40]
- [x] [Review][Patch] clampZoom helper does not validate targetZoom for NaN or Infinity [src/utils/lensCalculator.ts:38-50]
- [x] [Review][Patch] Chip touch target height is less than the recommended 44pt mobile minimum [src/components/camera/LensPresetChips.tsx:61-68]

## Dev Notes

- **Architecture Invariants Compliance:**
  - **AD-1 (App Framework & Vision Camera):** Use `react-native-vision-camera` `zoom` prop for lens preset zoom control.
  - **AD-2 (Viewfinder 60 FPS):** Keep mode switcher and lens preset components lightweight in Zustand store (`useCameraStore`) to prevent frame drops or JS thread stutter.
  - **AD-5 (Zustand State):** Reuse existing store properties `mode` (`'person' | 'scene'`), `activeLens` (`'0.5x' | '1x' | '3x'`).
- **Existing Codebase Analysis & File Updates:**
  - `src/types/camera.ts`: Existing `AppMode` (`'person' | 'scene'`) and `LensPreset` (`'0.5x' | '1x' | '3x'`) already defined.
  - `src/stores/useCameraStore.ts`: Existing Zustand store with `mode`, `setMode`, `activeLens`, `setActiveLens`.
  - `src/components/camera/CameraViewfinder.tsx`: Needs layout update to wrap `<Camera>` with top overlay (`ModeSwitcher`), bottom overlay (`LensPresetChips`), and pass `zoom` prop.
- **Code Safety & Edge Cases:**
  - `device` object in `CameraViewfinder.tsx` may have `minZoom` (e.g. 1.0) and `maxZoom` (e.g. 5.0). If user selects `0.5x`, `clampZoom(0.5, 1.0, 5.0)` must return `1.0` to avoid out-of-bounds error on single-lens hardware.
  - Handle simulator or `device == null` state gracefully.
  - Do not use invalid React Native style properties like `backgroundColor: 'inherit'` (learned from Story 1.2 review).
- **Testing Approach:**
  - Run unit tests: `npm test` or `npx jest src/utils/__tests__/lensCalculator.test.ts`.
  - Typecheck: `npx tsc --noEmit`.

### Project Structure Notes

- Aligns with unified project structure under `src/components/camera/`, `src/stores/`, `src/types/`, `src/utils/`.

### References

- [Epic 1 Story 1.3 Spec](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/epics.md#L123-L133)
- [Architecture Spine AD-1, AD-2, AD-5](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md#L14-L50)
- [Sprint Status YAML](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/sprint-status.yaml#L53)
- [Story 1.1 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/1-1-expo-project-initialization-hardware-camera-viewfinder.md)
- [Story 1.2 Implementation Artifact](file:///o:/New%20folder/bmad-test/bmad/_bmad-output/implementation-artifacts/1-2-native-gyroscope-horizon-leveling-bar.md)

## Dev Agent Record

### Agent Model Used

Gemini 3.6 Flash (High)

### Debug Log References

- None.

### Completion Notes List

- Implemented `src/utils/lensCalculator.ts` with `getNumericZoom`, `getLensChipLabel`, and `clampZoom` functions.
- Implemented unit tests in `src/utils/__tests__/lensCalculator.test.ts` covering conversion, labeling, and min/max zoom clamping.
- Implemented `ModeSwitcher` segmented control component with dark glassmorphism styling and accessibility attributes.
- Implemented `LensPresetChips` floating horizontal lens preset selection bar component with gold highlight for `3x Portrait`.
- Integrated `ModeSwitcher` and `LensPresetChips` into `CameraViewfinder.tsx` HUD overlays with dynamic safe zoom binding `clampZoom(getNumericZoom(activeLens), device.minZoom, device.maxZoom)`.
- Ran TypeScript type check (`npx tsc --noEmit`) and unit tests (`npx tsx src/utils/__tests__/lensCalculator.test.ts`, `npx tsx src/utils/__tests__/levelCalculator.test.ts`) with 100% pass rate.

### File List

- `src/types/camera.ts`
- `src/stores/useCameraStore.ts`
- `src/utils/lensCalculator.ts`
- `src/utils/__tests__/lensCalculator.test.ts`
- `src/components/camera/ModeSwitcher.tsx`
- `src/components/camera/LensPresetChips.tsx`
- `src/components/camera/CameraViewfinder.tsx`

### Change Log

- Implemented Story 1.3: Mode Switcher & Quick Lens Preset Chips (Date: 2026-07-28)
