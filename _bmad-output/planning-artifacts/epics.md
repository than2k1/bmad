---
stepsCompleted: ["step-01-validate-prerequisites", "step-02-design-epics", "step-03-create-stories", "step-04-final-validation"]
inputDocuments:
  - "prd.md"
  - "ARCHITECTURE-SPINE.md"
---

# AI Pose Suggestion & Camera Config App - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for the AI Pose Suggestion & Camera Config App, decomposing requirements from the PRD and Technical Architecture Spine into implementable epics and user stories.

## Requirements Inventory

### Functional Requirements

* **FR-1.1**: The app shall prompt the user to select between two primary modes: Person Mode or Scene Mode.
* **FR-1.2**: The live viewfinder shall display a native 60 FPS 2D horizon leveling bar powered by device Gyroscope/Accelerometer.
* **FR-1.3**: The viewfinder shall provide quick-switch lens preset chips (`[0.5x]`, `[1x]`, `[3x Portrait]`) mapped to optical zoom levels.
* **FR-2.1**: The viewfinder shall feature an intuitive "Analyze / Freeze" shutter button.
* **FR-2.2**: Upon tapping, the app shall capture a keyframe, freeze preview, and run lightweight on-device vision models in $<200\text{ms}$.
* **FR-2.3**: The user can un-freeze or re-analyze with a single tap.
* **FR-3.1**: In Person Mode, the vision engine shall detect subject count (Solo, Couple, Group of 3+).
* **FR-3.2**: The app shall provide a Manual Framing Selector (`Headshot`, `Half-Body`, `Full-Body`).
* **FR-3.3**: The app shall display a scrollable carousel of matching Pose Wireframe Overlays filtered by framing and subject count.
* **FR-3.4**: Selecting a pose wireframe shall overlay an adjustable semi-transparent vector outline over the camera preview.
* **FR-4.1**: In Scene Mode, the vision engine shall classify scene types (Landscape, Architecture, Food, Interior, Sunset).
* **FR-4.2**: The viewfinder shall toggle composition grid overlays (Rule of Thirds / Golden Ratio).
* **FR-4.3**: The app shall suggest composition & lens tweaks (*"Switch to 0.5x Ultra-Wide for architectural scale"*).
* **FR-5.1**: The HUD shall display concise visual directional badges for distance and camera height/tilt (*"Step back ~1m"*, *"Lower camera"*).
* **FR-5.2**: The HUD shall display 1-tap lens recommendations (`[3x Portrait Lens]`).
* **FR-5.3**: The HUD shall provide high-contrast exposure guidance for backlit/low-light scenes.

### NonFunctional Requirements

* **NFR-1.1 Processing Latency**: Keyframe vision analysis must complete within $<200\text{ms}$ on modern mobile hardware.
* **NFR-1.2 Frame Rate**: Viewfinder preview and sensor horizon bar must run at smooth 60 FPS.
* **NFR-1.3 Battery & Thermals**: Thermal stability with low battery impact.
* **NFR-2.1 On-Device Privacy**: 100% local vision inferencing (CoreML / ONNX / TFLite). No photos transmitted to cloud.
* **NFR-2.2 Offline Operation**: 100% offline functionality.
* **NFR-3.1 Cross-Platform Build**: React Native / Expo codebase supporting iOS 16+ and Android 11+.

### Additional Requirements (Technical Architecture Spine)

* **AR-1 Starter Template & Stack**: React Native + Expo Managed Workflow using `react-native-vision-camera`, `expo-sensors`, and `react-native-reanimated`.
* **AR-2 Vision Frame Processor Pipeline**: Thread-isolated native frame processor executing local C++/CoreML/ONNX models (YOLO-Pose / MediaPipe Pose).
* **AR-3 Native Sensor Stream**: Gyroscope/Accelerometer 60Hz stream updating Reanimated Shared Values directly to bypass JS bridge lag.
* **AR-4 Vector Pose Schema**: COCO-17 Keypoint JSON schema rendered via `react-native-svg`.
* **AR-5 State Architecture**: Zustand store for transient camera HUD state + `expo-file-system` for asset storage.

### UX Design Requirements

* N/A (Integrated directly into HUD specification in PRD & Architecture Spine).

### FR Coverage Map

* **FR-1.1**: Story 1.3 (Mode Switcher)
* **FR-1.2**: Story 1.2 (Gyro Horizon Bar)
* **FR-1.3**: Story 1.3 (Lens Preset Chips)
* **FR-2.1**: Story 2.1 (Shutter Freeze & Unfreeze)
* **FR-2.2**: Story 2.2 (Local Vision Inferencing Engine)
* **FR-2.3**: Story 2.1 (Single-tap Unfreeze)
* **FR-3.1**: Story 3.1 (Framing & Subject Count Detection)
* **FR-3.2**: Story 3.1 (Manual Framing Selector)
* **FR-3.3**: Story 3.2 (Pose Wireframe Carousel)
* **FR-3.4**: Story 3.2 (Vector Overlay Renderer)
* **FR-4.1**: Story 4.3 (Scene Mode Classification)
* **FR-4.2**: Story 4.3 (Composition Grid Overlays)
* **FR-4.3**: Story 4.2 (Composition Tweaks & Lens Advice)
* **FR-5.1**: Story 4.1 (Directional Distance & Height Badges)
* **FR-5.2**: Story 4.2 (1-Tap Recommended Lens Chips)
* **FR-5.3**: Story 4.2 (Exposure & Backlit Guidance)

---

## Epic List

### Epic 1: Mobile Project Foundation & Viewfinder HUD Setup
**Goal:** Enable users to launch the app, switch between Person/Scene modes, view a smooth 60 FPS viewfinder, switch lenses, and use a Gyro-powered horizon bar.
**FRs covered:** FR-1.1, FR-1.2, FR-1.3

### Epic 2: Tap-to-Freeze Keyframe Vision Engine
**Goal:** Enable users to tap a shutter button to freeze the viewfinder keyframe and run $<200\text{ms}$ local AI vision inferencing for subject/scene detection.
**FRs covered:** FR-2.1, FR-2.2, FR-2.3

### Epic 3: Person Mode & Pose Wireframe Overlay Engine
**Goal:** Enable users to pick framing crops (`Headshot`, `Half-Body`, `Full-Body`), overlay COCO-17 vector pose guides, and view on-screen Director Prompts to coach the subject.
**FRs covered:** FR-3.1, FR-3.2, FR-3.3, FR-3.4

### Epic 4: Camera Positioning & Scene Composition Guidance
**Goal:** Provide concise visual HUD badges for distance/height/tilt (*"Step back ~1m"*), recommended lens highlights, exposure alerts, and Rule of Thirds grids.
**FRs covered:** FR-4.1, FR-4.2, FR-4.3, FR-5.1, FR-5.2, FR-5.3

---

## Detailed Story Breakdown

### Epic 1: Mobile Project Foundation & Viewfinder HUD Setup

#### Story 1.1: Expo Project Initialization & Hardware Camera Viewfinder
As a user,  
I want to open the app and view a 60 FPS live camera preview on my phone,  
So that I can frame my shots smoothly without lag.

**Acceptance Criteria:**
* **Given** the app is launched on an iOS or Android device,
* **When** the user grants camera permissions,
* **Then** the app renders a 60 FPS native camera preview using `react-native-vision-camera` in Expo.
* **And** a fallback permission prompt is displayed if camera permission is denied.

#### Story 1.2: Native Gyroscope Horizon Leveling Bar
As a user,  
I want a smooth horizon leveling bar overlaid on the viewfinder,  
So that I can keep my camera level while framing photos.

**Acceptance Criteria:**
* **Given** the camera preview is active,
* **When** the user tilts or rolls the phone,
* **Then** a 2D horizon level bar rotates at 60Hz via `expo-sensors` updating `react-native-reanimated` shared values on the UI thread.
* **And** the level bar turns green when tilt is within $\pm 1^\circ$ of horizontal.

#### Story 1.3: Mode Switcher & Quick Lens Preset Chips
As a user,  
I want to toggle between Person and Scene modes and switch lens zoom levels (`[0.5x]`, `[1x]`, `[3x Portrait]`),  
So that I can adapt the camera preview to my current photography subject.

**Acceptance Criteria:**
* **Given** the Viewfinder HUD is active,
* **When** the user taps `[3x Portrait]`,
* **Then** the native camera switches to the telephoto lens instantly.
* **And** tapping Person vs Scene mode updates the Zustand store state.

---

### Epic 2: Tap-to-Freeze Keyframe Vision Engine

#### Story 2.1: Shutter Keyframe Freeze & Unfreeze Pipeline
As a user,  
I want to tap an "Analyze / Freeze" shutter button to freeze the viewfinder preview,  
So that the app can analyze the image without motion blur.

**Acceptance Criteria:**
* **Given** the live preview is running,
* **When** the user taps the shutter button,
* **Then** the preview freezes on a high-resolution keyframe, and an "Analyzing..." indicator appears.
* **And** tapping the screen again un-freezes the preview back to 60 FPS live video.

#### Story 2.2: Local On-Device Vision Inferencing Engine
As a user,  
I want keyframe vision analysis to run locally on-device in $<200\text{ms}$,  
So that I get instant recommendations offline with 100% privacy.

**Acceptance Criteria:**
* **Given** a keyframe is frozen,
* **When** the frame processor executes the local CoreML/ONNX model (YOLO-Pose / MediaPipe),
* **Then** detected body keypoints and subject bounding boxes are calculated within $<200\text{ms}$.
* **And** no network requests are sent.

---

### Epic 3: Person Mode & Pose Wireframe Overlay Engine

#### Story 3.1: Manual Framing Selector & Contextual Pose Filtering
As a user,  
I want to select my desired framing crop (`Headshot`, `Half-Body`, `Full-Body`),  
So that the pose carousel displays templates that match my intended photo framing.

**Acceptance Criteria:**
* **Given** Person Mode is active,
* **When** the user selects `Half-Body`,
* **Then** the pose carousel filters to display only half-body wireframe templates.
* **And** auto-detected subject count (Solo, Couple, Group) further refines the filtered templates.

#### Story 3.2: COCO-17 Vector Pose Overlay Renderer
As a user,  
I want to select a pose wireframe from the carousel and overlay it on the camera viewfinder,  
So that I can guide the subject to match the pose outline.

**Acceptance Criteria:**
* **Given** a pose template is selected from the carousel,
* **When** rendered on screen,
* **Then** `react-native-svg` draws a semi-transparent COCO-17 skeleton vector outline over the camera view.
* **And** the overlay can be dragged or resized to fit the frame.

#### Story 3.3: Photographer Director Cues & Alignment Feedback
As a user/photographer,  
I want on-screen Director Prompts (e.g., *"Tell her: Turn shoulders 45° left"*),  
So that I can naturally coach the model without awkward audio sounds.

**Acceptance Criteria:**
* **Given** a target pose overlay is active on a frozen keyframe,
* **When** the vision engine compares detected subject pose keypoints against the target pose,
* **Then** the HUD displays a high-contrast "Director Cue" text chip instructing the photographer how to direct the subject.
* **And** a visual alignment score badge turns GREEN when pose match exceeds 80%.

---

### Epic 4: Camera Positioning & Scene Composition Guidance

#### Story 4.1: Directional Distance & Height/Tilt Badges
As a user,  
I want concise visual badges on screen (*"Step back ~1m"*, *"Lower camera to chest level"*),  
So that I know exactly where to move the camera for optimal framing.

**Acceptance Criteria:**
* **Given** a frozen keyframe is analyzed,
* **When** the subject bounding box size is evaluated against the target framing,
* **Then** high-contrast directional badges (*"Step back ~1m"*, *"Tilt camera up 5°"*) are overlaid on the HUD.

#### Story 4.2: 1-Tap Lens Recommendation & Exposure Alerts
As a user,  
I want the HUD to highlight the recommended lens (`[3x Portrait Lens]`) and alert me to lighting issues,  
So that I avoid facial distortion and backlit silhouettes.

**Acceptance Criteria:**
* **Given** a portrait keyframe is analyzed,
* **When** the app detects a close-up/half-body crop on a 1x lens,
* **Then** it highlights the `[3x Portrait Lens]` button with a badge (*"Recommended to prevent distortion"*).
* **And** backlit scenes trigger a chip suggesting exposure adjustment (+0.7 EV).

#### Story 4.3: Scene Mode Composition Grid Overlays
As a user shooting landscapes or architecture,  
I want to toggle Rule of Thirds and Golden Ratio composition grids,  
So that I can align horizons and architectural lines cleanly.

**Acceptance Criteria:**
* **Given** Scene Mode is active,
* **When** the user toggles Grid Mode,
* **Then** a crisp Rule of Thirds or Golden Ratio vector grid is drawn over the viewfinder.
* **And** scene classification badges (*"Landscape Detected - Keep Horizon Level"*) appear.
