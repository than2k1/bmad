# Epic 1 Context: Mobile Project Foundation & Viewfinder HUD Setup

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable users to launch the app, switch between Person/Scene modes, view a smooth 60 FPS viewfinder, switch lenses, and use a Gyro-powered horizon bar.

## Stories

- Story 1.1: Expo Project Initialization & Hardware Camera Viewfinder
- Story 1.2: Native Gyroscope Horizon Leveling Bar
- Story 1.3: Mode Switcher & Quick Lens Preset Chips

## Requirements & Constraints

- Live viewfinder preview and sensor horizon bar must run at a smooth 60 FPS.
- Thermal stability with low battery impact; camera resources paused (`isActive={false}`) when app is backgrounded.
- 100% local execution and offline operation.
- React Native / Expo Managed Workflow with Config Plugins supporting iOS 16+ and Android 11+.

## Technical Decisions

- Application framework based on React Native (Expo Managed Workflow with Config Plugins) using `react-native-vision-camera`, `expo-sensors`, and `react-native-reanimated`. (AD-1)
- Live camera viewfinder runs on a native high-performance preview layer at 60 FPS. (AD-2)
- Sensor stream updates native UI transforms directly via `react-native-reanimated` shared values at 60Hz. (AD-3)
- Lightweight Zustand store manages transient camera HUD state (Active mode, permission status, lens zoom). (AD-5)

## UX & Interaction Patterns

- HUD layout overlaying the viewfinder preview.
- Permission request screen displayed if camera permission is not yet granted, with fallback to system settings if denied.
