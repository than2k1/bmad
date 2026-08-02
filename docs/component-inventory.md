# Component Inventory — PoseCam (bmad-camera-app)

## Overview

The PoseCam UI component hierarchy is built around modular, decoupled HUD overlays layered directly on top of the native camera preview stream in [CameraViewfinder.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraViewfinder.tsx).

---

## Component Catalog (`src/components/camera/`)

| Component Name | Type | Purpose & Description | Store Subscriptions |
|---|---|---|---|
| `CameraViewfinder.tsx` | Container | Main viewfinder screen container. Handles safe area offsets, hardware device resolution, active app lifecycle, and HUD layer ordering. | `mode`, `isAppActive`, `activeLens`, `isFrozen`, `setVisionResult`, `setIsAnalyzing` |
| `AnalyzingIndicator.tsx` | HUD Overlay | Displays an animated "ANALYZING KEYFRAME AI..." pill HUD during active keyframe inferencing. Tap listener triggers keyframe unfreeze. | `isAnalyzing`, `isFrozen`, `toggleFreeze` |
| `CameraPermissionScreen.tsx` | View | Native camera permission request and rationale screen displayed when camera access has not been granted. | `permissionStatus`, `setPermissionStatus` |
| `CaptureShutterButton.tsx` | Control | Primary shutter button triggering native photo capture and file system saving via `usePhotoCapture` hook. | N/A (Receives `isCapturing` & `onPress` props) |
| `CompositionGridOverlay.tsx` | Canvas | Renders SVG composition grid lines (Rule of Thirds 3x3 or Golden Ratio Phi lines) on top of the viewfinder canvas. | `gridMode`, `mode` |
| `CompositionGuidanceOverlay.tsx` | HUD Overlay | Renders visual target framing bounding boxes, directional guidance vectors, and framing score percentages (0–100%). | `visionResult`, `isFrozen`, `selectedPoseId` |
| `DirectorCueOverlay.tsx` | HUD Overlay | Displays actionable photographer cue cards (e.g. *"Step back 0.5m"*, *"Tilt camera up 4°"*) based on real-time vision evaluation. | `visionResult`, `isFrozen` |
| `ExposureAlertOverlay.tsx` | HUD Overlay | Renders over/under exposure alert banners and 1-tap lens recommendation suggestion chips. | `visionResult`, `activeLens`, `setActiveLens` |
| `FramingSelector.tsx` | Control | Selector chips for framing crop (`full_body`, `half_body`, `close_up`) in Person Mode. | `selectedFraming`, `setSelectedFraming` |
| `GridModeToggle.tsx` | Control | Toggle button for Scene Mode cycling between Grid Off, Rule of Thirds, and Golden Ratio. | `gridMode`, `cycleGridMode` |
| `HorizonLevelBar.tsx` | HUD Overlay | Real-time gyroscope leveling bar displaying pitch/roll degree offset with green alignment indicator when level (< 1.5°). | `showHorizonBar` |
| `LensPresetChips.tsx` | Control | Horizontal selector chips for camera focal length presets (`0.5x`, `1x`, `2x`, `3x`, `5x`). | `activeLens`, `setActiveLens` |
| `ModeSwitcher.tsx` | Control | Mode toggle pill allowing instant switching between Person Mode (`person`) and Scene Mode (`scene`). | `mode`, `setMode` |
| `PoseCarousel.tsx` | Control | Horizontal reference pose template carousel allowing user to pick reference poses filtered by selected framing crop. | `selectedFraming`, `selectedPoseId`, `setSelectedPoseId` |
| `PositioningBadgesOverlay.tsx` | HUD Overlay | Displays real-time subject Distance badge (m), Subject Height badge (m), and Camera Tilt badge (°). | `visionResult`, `isFrozen` |
| `ShutterButton.tsx` | Control | Secondary shutter control button for triggering keyframe freeze / unfreeze. | `isFrozen`, `toggleFreeze` |
| `VectorPoseOverlay.tsx` | Canvas | Renders 17 COCO keypoints and skeletal connection vectors (shoulders, spine, limbs) over detected subjects using React Native SVG. | `visionResult`, `isFrozen` |

---

## Component Layering & Z-Index Stack

```
Z-Index 50: Toast Notification Banner
Z-Index 20: Top HUD (ModeSwitcher) & Bottom HUD (Framing, Carousel, Lens Chips, Shutters)
Z-Index 15: DirectorCueOverlay, ExposureAlertOverlay, PositioningBadgesOverlay
Z-Index 10: CompositionGuidanceOverlay, VectorPoseOverlay, CompositionGridOverlay, HorizonLevelBar
Z-Index  0: Camera Preview Stream (Native VisionCamera / Simulator Canvas)
```
