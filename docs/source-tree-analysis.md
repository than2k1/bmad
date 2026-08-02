# Source Tree Analysis — PoseCam (bmad-camera-app)

## Project Directory Overview

```
bmad-camera-app/ (Monolith Mobile Application)
├── App.tsx                     # Entry point fallback & application bootstrap
├── app.json                    # Expo configuration & native permissions (Camera, Vision Camera plugin)
├── package.json                # Project dependencies, scripts, and Expo / React Native configuration
├── tsconfig.json               # TypeScript compiler options
├── assets/                     # Application static assets (icons, splash screen, adaptive icons)
├── design-artifacts/           # UI/UX design specifications, color palettes, and component guidelines
├── src/                        # Primary TypeScript source directory
│   ├── app/                    # Expo Router file-based entry route
│   │   └── index.tsx           # Primary screen wrapper (SafeAreaProvider & CameraViewfinder)
│   ├── components/             # UI Components & Viewfinder HUD overlays
│   │   └── camera/             # Camera HUD & Overlay components (17 visual overlays)
│   │       ├── AnalyzingIndicator.tsx        # HUD overlay for keyframe AI analyzing indicator & unfreeze tap
│   │       ├── CameraPermissionScreen.tsx    # Native camera permission request & rationale screen
│   │       ├── CameraViewfinder.tsx          # Main Viewfinder container combining Vision Camera & HUD overlays
│   │       ├── CaptureShutterButton.tsx      # Native photo capture shutter button with feedback animations
│   │       ├── CompositionGridOverlay.tsx    # Rule of Thirds & Golden Ratio grid canvas renderer
│   │       ├── CompositionGuidanceOverlay.tsx# Dynamic direction guidance arrows & visual framing cues
│   │       ├── DirectorCueOverlay.tsx        # Photographer cue cards & pose alignment feedback banner
│   │       ├── ExposureAlertOverlay.tsx      # Over/under exposure alerts & 1-tap lens recommendation chips
│   │       ├── FramingSelector.tsx           # Full body, half body, close-up framing selection chips
│   │       ├── GridModeToggle.tsx            # Scene mode grid overlay toggle button
│   │       ├── HorizonLevelBar.tsx           # Real-time gyroscope horizon leveling bar
│   │       ├── LensPresetChips.tsx           # Quick lens focal length selectors (0.5x, 1x, 2x, 3x, 5x)
│   │       ├── ModeSwitcher.tsx              # Mode toggle (Person Mode vs Scene Mode)
│   │       ├── PoseCarousel.tsx              # Horizontal reference pose template carousel selector
│   │       ├── PositioningBadgesOverlay.tsx  # Distance (m), Subject Height (m), and Camera Tilt (°) HUD badges
│   │       ├── ShutterButton.tsx             # Keyframe Freeze / Unfreeze shutter button
│   │       └── VectorPoseOverlay.tsx         # COCO-17 17-keypoint skeleton pose overlay canvas
│   ├── data/                   # Static data catalogs and reference templates
│   │   └── poseCatalog.ts      # COCO-17 reference pose template catalog (solo, couple, group)
│   ├── hooks/                  # Custom React hooks
│   │   ├── useLensGuidance.ts  # Viewfinder viewport dimensions & safe area measurement hook
│   │   └── usePhotoCapture.ts  # Photo capture, file system save, and notification toast hook
│   ├── stores/                 # State management layer
│   │   └── useCameraStore.ts   # Zustand global camera store (mode, lens, freeze, vision result, poses)
│   ├── types/                  # TypeScript type definitions and contracts
│   │   ├── camera.ts           # Camera mode, lens preset, grid mode, and store state interfaces
│   │   ├── composition.ts      # Spatial layout, composition rules, and line detection contracts
│   │   ├── onnxruntime.d.ts    # Ambient ONNX Runtime module type declarations
│   │   ├── pose.ts             # Pose framing, COCO-17 keypoints, and reference pose contracts
│   │   └── vision.ts           # Keyframe vision result, subject detection, and scene type contracts
│   └── utils/                  # Core algorithmic engines and helper utilities
│       ├── cameraHooks.ts                # React Native Vision Camera device resolution hook
│       ├── compositionGuidanceEngine.ts  # Directional guidance vector calculator
│       ├── compositionRuleEngine.ts      # Rule of Thirds, Golden Ratio & Lead Room rule evaluator
│       ├── compositionStrategy.ts        # Strategy pattern interface for composition rules
│       ├── directorCueEngine.ts          # Actionable photographer cue string generator
│       ├── lensCalculator.ts             # Lens zoom numeric conversion & clamping utility
│       ├── levelCalculator.ts            # Gyroscope tilt angle & horizon leveling math
│       ├── poseFilter.ts                 # Contextual reference pose filtering algorithm
│       ├── poseRenderer.ts               # SVG / canvas vector skeleton rendering calculations
│       ├── positioningEngine.ts          # Distance estimation, subject height & tilt angle badges
│       ├── recommendationEngine.ts       # 1-tap lens focal length & exposure advice engine
│       ├── sceneCompositionEngine.ts     # Scene mode framing & composition optimizer
│       ├── spatialLayoutExtractor.ts     # Background edge detection & vanishing point extractor
│       └── visionInferencingEngine.ts    # Sub-20ms ONNX YOLOv8-Pose model inferencing & NMS parser
├── docs/                       # Project documentation knowledge base (BMad generated)
└── _bmad-output/               # BMad planning, architectural, and implementation artifacts
```

## Critical Directory Descriptions

### 1. `src/components/camera/`
- **Purpose:** Houses all UI overlays, HUD elements, gesture handlers, and Viewfinder container logic.
- **Key Entry Point:** [CameraViewfinder.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraViewfinder.tsx)
- **Key Modules:** `VectorPoseOverlay.tsx`, `CompositionGuidanceOverlay.tsx`, `PositioningBadgesOverlay.tsx`, `DirectorCueOverlay.tsx`, `HorizonLevelBar.tsx`.

### 2. `src/utils/`
- **Purpose:** Contains all pure algorithmic engines driving local AI vision, rule evaluation, mathematical calculations, and feature extraction.
- **Key Modules:**
  - `visionInferencingEngine.ts`: ONNX runtime integration, image tensor preprocessing, YOLOv8-Pose output parsing with IoU Non-Maximum Suppression.
  - `compositionRuleEngine.ts`: Real-time Rule of Thirds, Golden Ratio, and Lead Room composition scoring.
  - `spatialLayoutExtractor.ts`: Edge/line detection and vanishing point spatial layout calculations.
  - `positioningEngine.ts`: Camera-to-subject distance (m), subject height (m), and vertical tilt (°) badges.
  - `directorCueEngine.ts`: Human-readable director guidance cues (e.g. "Step back 0.5m", "Tilt camera up 5°").

### 3. `src/stores/`
- **Purpose:** Centralized Zustand state management.
- **Key File:** `useCameraStore.ts` — reactive state store connecting hardware events, user selections, and vision inference results.

### 4. `src/data/` & `src/types/`
- **Purpose:** Type safety contracts and reference pose data catalogs.
- **Key Files:** `poseCatalog.ts`, `vision.ts`, `pose.ts`, `camera.ts`, `composition.ts`.
