# Project Overview — PoseCam (bmad-camera-app)

## Executive Summary

**PoseCam** (`bmad-camera-app`) is an AI-powered smart camera application for iOS and Android designed to guide photographers and casual users in capturing perfectly framed, well-composed, and professionally posed photographs.

Operating **100% offline and on-device**, PoseCam leverages custom ONNX vision inferencing to detect 17 COCO human body keypoints, analyze background spatial geometry, evaluate composition rules (Rule of Thirds, Golden Ratio, Lead Room), and render real-time visual badges, vector pose overlays, and photographer director cues directly over the live camera viewfinder.

---

## Core Capabilities & Features

### 1. Dual Operational Modes
- **Person Mode:** Dedicated to portrait and human subject photography. Provides framing selection (Full Body, Half Body, Close-Up), reference pose template carousel, and COCO-17 vector skeleton matching.
- **Scene Mode:** Tailored for landscape, architecture, and environmental photography. Enables Rule of Thirds and Golden Ratio composition grid overlays and spatial balance guidelines.

### 2. Live On-Device Vision Inferencing Engine
- Runs offline YOLOv8-Pose model inferencing in under 200ms per keyframe.
- Detects solo, couple, and group subjects with IoU Non-Maximum Suppression (NMS).
- Extracts background lines, dominant axes, and vanishing points.

### 3. Smart Framing & Composition Guidance
- Real-time composition score calculation (0–100%).
- Visual guidance HUD with directional positioning arrows and target framing boxes.
- Photographer Cue Cards (e.g. *"Move subject left to align on Rule of Thirds grid"*).

### 4. Interactive Viewfinder HUD & Overlays
- **Horizon Leveling Bar:** Hardware gyroscope integration for pitch/roll level feedback.
- **Positioning Badges:** Real-time distance estimate (m), subject height (m), and camera tilt angle (°).
- **Exposure & Lens Advisory:** 1-tap focal length recommendations (0.5x, 1x, 2x, 3x, 5x) and exposure alert warnings.
- **Keyframe Freeze / Unfreeze:** Freeze viewfinder to freeze AI analysis or capture photo.

---

## Technology Stack Summary

- **Framework:** React Native `0.74.5` + Expo `~51.0.0`
- **Language:** TypeScript `5.1.3`
- **Camera Runtime:** `react-native-vision-camera` `^4.5.2`
- **State Management:** Zustand `^4.5.2`
- **AI Runtime:** ONNX Runtime (`onnxruntime-web` / `onnxruntime-node`) `^1.27.0`
- **Hardware Integration:** Gyroscope (`expo-sensors`), File System (`expo-file-system`)

---

## Documentation Navigation

- [Architecture Document](./architecture.md) — Comprehensive technical architecture, pipeline engines, and NFR analysis.
- [Source Tree Analysis](./source-tree-analysis.md) — Directory tree mapping, key file locations, and entry points.
- [Component Inventory](./component-inventory.md) — Catalog of all 17 viewfinder HUD overlay components and controls.
- [State Management Patterns](./state-management-patterns.md) — Detailed reference for global Zustand store state & actions.
- [Data Models & Contracts](./data-models.md) — Keypoint schemas, vision results, and composition rule interfaces.
- [Asset Inventory](./asset-inventory.md) — Catalog of static icons, splash assets, and ONNX models.
- [Development Guide](./development-guide.md) — Setup instructions, run scripts, and test suite execution.
- [Deployment Guide](./deployment-guide.md) — EAS Build configuration, App Store submission, and permissions.
