---
title: "PRD: Pose Suggestion & Camera Configuration Mobile App"
status: draft
version: 1.0.0
author: Personal Project
created: 2026-07-28
updated: 2026-07-28
---

# Product Requirement Document (PRD)
## AI Pose Suggestion & Camera Configuration Mobile App

---

## 1. Executive Overview & Goals

### 1.1 Product Vision
An intelligent, battery-friendly mobile camera companion app designed for personal photography. The app analyzes live and freeze-frame camera viewfinders to offer real-time recommendations for **camera positioning (distance, tilt, height)**, **hardware lens selection (0.5x, 1x, 3x portrait)**, and **contextual pose wireframe overlays** for portraits and group photos.

### 1.2 Target Audience & Stakes
* **Audience**: Personal solo project (Primary user: Yourself & personal photography workflow).
* **Rigor Level**: Lightweight, high-clarity PRD optimized for direct implementation.

---

## 2. Technical Architecture & Constraints

### 2.1 Core Engineering Principles
* **Battery-Friendly & Thermal-Safe**: Avoid continuous 60 FPS 3D AR spatial mesh rendering. Utilize native hardware sensors (Gyroscope / Accelerometer) and throttled keyframe AI analysis.
* **Hybrid Tap-to-Freeze Workflow**: Real-time native preview HUD for quick alignment $\rightarrow$ Tap to Freeze/Analyze for deep keyframe vision analysis.
* **Offline-First & On-Device**: Vision inferencing runs on-device (CoreML / ONNX / TFLite) for privacy, zero latency, and offline usage while traveling.
* **Cross-Platform Delivery**: Built on React Native / Expo (or Flutter) for seamless development on PC and over-the-air iOS testing via Expo Go / EAS.

---

## 3. User Journey & Core Interaction Flow

```
┌─────────────────┐    ┌────────────────────┐    ┌──────────────────────┐
│  Choose Mode    │───>│ Native Live Preview│───>│ Tap Viewfinder Freeze│
│ (Person / Scene)│    │ (Gyro Horizon Bar) │    │  (AI Vision Engine)  │
└─────────────────┘    └────────────────────┘    └──────────────────────┘
                                                            │
                                                            ▼
┌─────────────────┐    ┌────────────────────┐    ┌──────────────────────┐
│ Capture Final   │<───│ Direct Subject     │<───│ Render Guidance HUD  │
│  Photo          │    │ to Match Wireframe │    │ (Pose Wireframe +    │
└─────────────────┘    └────────────────────┘    │ Lens & Distance Badges)
                                                 └──────────────────────┘
```

---

## 4. Functional Requirements (FRs)

### FR-1: Mode Selection & Live Viewfinder HUD
* **FR-1.1**: The app shall prompt the user upon launch to select between two primary modes: **Person Mode** or **Scene Mode**.
* **FR-1.2**: The live viewfinder shall display a native 60 FPS 2D horizon leveling bar powered by device Gyroscope/Accelerometer sensors. `[ASSUMPTION: Hardware sensors read via native hooks]`.
* **FR-1.3**: The viewfinder shall provide quick-switch lens preset chips (`[0.5x]`, `[1x]`, `[3x Portrait]`) mapped to phone camera optical zoom levels.

### FR-2: Tap-to-Freeze Analysis Engine
* **FR-2.1**: The viewfinder shall feature an intuitive "Analyze / Freeze" shutter button.
* **FR-2.2**: Upon tapping, the app shall capture a full-resolution keyframe, freeze the preview, and run lightweight on-device vision models within $< 200\text{ms}$.
* **FR-2.3**: The user can un-freeze or re-analyze with a single tap at any time.

### FR-3: Person Mode & Pose Wireframe Engine
* **FR-3.1**: In Person Mode, the vision engine shall detect the number of subjects present (Solo, Couple, Group of $3+$).
* **FR-3.2**: The app shall include a **Manual Framing Selector** allowing the user to select or override desired composition crop:
  * `Headshot / Close-Up`
  * `Half-Body (Medium Shot)`
  * `Full-Body`
* **FR-3.3**: The app shall display a scrollable carousel of matching **Pose Wireframe Overlays** filtered by framing selection and subject count.
* **FR-3.4**: Selecting a pose wireframe shall overlay an adjustable semi-transparent vector outline over the camera preview so the photographer can align the subject.

### FR-4: Scene Mode & Composition Guidance Engine
* **FR-4.1**: In Scene Mode, the vision engine shall classify scene types (Landscape, Architecture, Food/Macro, Interior, Sunset).
* **FR-4.2**: The viewfinder shall toggle composition grid overlays (Rule of Thirds grid or Golden Ratio lines).
* **FR-4.3**: The app shall suggest composition tweaks (e.g. *"Switch to 0.5x Ultra-Wide for architectural scale"*, *"Align horizon with middle grid"*). `[ASSUMPTION: Rule of thirds alignment verified via edge detection & horizon sensor]`.

### FR-5: Camera Positioning & Hardware Guidance HUD
* **FR-5.1**: The HUD shall display concise visual directional chips for physical positioning:
  * Distance advice (*"Step back ~1m"* or *"Move closer"* based on subject bounding box size).
  * Height/Angle advice (*"Lower camera to chest level"*, *"Tilt phone up 15°"*).
* **FR-5.2**: The HUD shall display 1-tap lens recommendations (e.g., highlighting `[3x Portrait Lens]` when a close-up/half-body portrait is selected to avoid focal length distortion).
* **FR-5.3**: The HUD shall provide high-contrast visual exposure indicators for backlit or low-light scenes.

---

## 5. Non-Functional Requirements (NFRs)

### NFR-1: Performance & Efficiency
* **NFR-1.1 Processing Latency**: Keyframe vision analysis must complete within $200\text{ms}$ on modern mobile hardware (iPhone 12+ / Android equivalent).
* **NFR-1.2 Frame Rate**: Viewfinder preview and sensor-driven horizon bar must run at smooth 60 FPS without dropping frames.
* **NFR-1.3 Battery & Thermals**: Continuous background camera preview must maintain thermal stability without causing device overheating or battery drain.

### NFR-2: Privacy & Reliability
* **NFR-2.1 On-Device Inferencing**: All pose estimation and scene classification models must run 100% locally on device. No photos or video frames shall be transmitted to external cloud servers.
* **NFR-2.2 Offline Operation**: Full functionality (camera HUD, pose catalog, AI detection) must work completely offline without internet connectivity.

### NFR-3: Compatibility
* **NFR-3.1 Cross-Platform Build**: Codebase built using React Native / Expo (or Flutter) supporting iOS 16+ and Android 11+.

---

## 6. Out of Scope / Future Enhancements (V2+)

* `[OUT OF SCOPE V1]` Generative AI pose creation (V1 relies on curated high-quality vector pose libraries).
* `[OUT OF SCOPE V1]` Video recording pose tracking (V1 is focused exclusively on still photography).
* `[OUT OF SCOPE V1]` Social sharing network inside the app.

---

## 7. Open Questions & Assumptions Log

* `[ASSUMPTION]` Initial pose library will bundle ~30 curated vector pose templates across Headshot, Half-body, and Full-body categories.
* `[ASSUMPTION]` Development environment will use React Native / Expo with `react-native-vision-camera` and native vision frame processors.
