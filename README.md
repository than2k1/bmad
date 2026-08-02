# PoseCam — AI-Powered Smart Viewfinder & Composition Assistant

**PoseCam** (`bmad-camera-app`) is an AI-powered smart camera application for iOS and Android built with **React Native**, **Expo**, **Vision Camera v4**, **Zustand**, and **ONNX Runtime**.

It acts as an intelligent assistant for both photographers and casual users, providing real-time camera viewfinder guidance, offline 17-keypoint human pose estimation, background spatial line & vanishing point detection, dynamic composition scoring (Rule of Thirds, Golden Ratio, Lead Room), hardware gyroscope leveling, and actionable photographer cue cards.

---

## Key Features

- 📸 **Dual Operational Modes:**
  - **Person Mode:** Dedicated human subject framing with reference pose template carousel, framing selector (Full Body, Half Body, Close-Up), and COCO-17 vector skeleton matching.
  - **Scene Mode:** Landscape & architecture photography assistant with Rule of Thirds and Golden Ratio composition grid overlays.
- ⚡ **100% Offline Local AI Vision:**
  - On-device YOLOv8-Pose ONNX model inferencing executing keyframe pose estimation in **< 200ms** without cloud latency or external API costs.
  - Multi-subject detection (solo, couple, group) with IoU Non-Maximum Suppression (NMS).
- 📐 **Smart Composition & Guidance:**
  - Real-time composition score calculation (0–100%).
  - Dynamic visual target framing box and directional movement guidance vectors.
  - Photographer Director Cue Cards (e.g., *"Step back 0.5m"*, *"Tilt camera up 4°"*).
- 📊 **Real-Time Viewfinder HUD & Badges:**
  - **Horizon Leveling Bar:** Hardware gyroscope integration for pitch/roll level feedback.
  - **Positioning Badges:** Estimated Subject Distance (m), Subject Height (m), and Vertical Camera Tilt (°).
  - **Exposure & Lens Advisory:** Over/under exposure warnings and 1-tap focal length preset recommendations (0.5x, 1x, 2x, 3x, 5x).
- 🔘 **Dual Shutter Control:**
  - **Keyframe Freeze Shutter:** Freezes live viewfinder feed to trigger local AI inferencing.
  - **Photo Capture Shutter:** Native photo capture and device file system save with toast notifications.

---

## Tech Stack

| Layer | Technology | Purpose |
|---|---|---|
| **Core Framework** | React Native `0.74.5` + Expo `~51.0.0` | Cross-platform mobile UI runtime & native toolchain |
| **Language** | TypeScript `5.1.3` | Type safety, domain contracts, and static checking |
| **Camera Runtime** | `react-native-vision-camera` `^4.5.2` | High-performance 60fps native camera preview stream |
| **State Management** | Zustand `^4.5.2` | Fast, reactive central camera state store |
| **AI Runtime** | ONNX Runtime (`onnxruntime-web` / `node`) `^1.27.0` | Offline on-device YOLOv8-Pose model inferencing |
| **Sensors & Files** | `expo-sensors` & `expo-file-system` | Hardware gyroscope leveling & local photo saving |

---

## Quick Start

### 1. Prerequisites
- **Node.js:** `v18.x` or `v20.x` LTS
- **Package Manager:** `npm` (v9+)
- **Mobile Environment:** Xcode 15+ (iOS Simulator) or Android Studio (Android Emulator)

### 2. Installation
```bash
git clone <repository-url>
cd bmad-camera-app
npm install
```

### 3. Running the App
Start the Expo Metro development server:
```bash
npm start
```

Launch on your target platform:
- **Android:** `npm run android`
- **iOS:** `npm run ios`
- **Web / Simulator Preview Mode:** `npm run web`

> *Note:* When launched on web or desktop simulators without physical camera hardware, PoseCam automatically enables **Simulator Preview Mode** with synthetic image tensor generation for rapid development.

---

## Comprehensive Project Documentation

Full technical documentation is available in the [`docs/`](docs/) directory:

- 📖 **[Master Documentation Index](docs/index.md)** — Primary AI retrieval source and navigation center.
- 📋 **[Project Overview](docs/project-overview.md)** — High-level product overview, core capabilities, and feature breakdown.
- 🏗️ **[System Architecture Document](docs/architecture.md)** — Comprehensive architecture design, AI pipeline details, and NFR matrix.
- 🌳 **[Source Tree Analysis](docs/source-tree-analysis.md)** — Directory structure tree, critical folder mapping, and entry points.
- 🧩 **[Component Inventory](docs/component-inventory.md)** — Complete catalog of all 17 viewfinder HUD overlay components.
- 🔄 **[State Management Patterns](docs/state-management-patterns.md)** — Reference for global Zustand camera store state & actions.
- 📐 **[Data Models & Contracts](docs/data-models.md)** — TypeScript interfaces for keypoints, vision results, and composition rules.
- 📦 **[Asset Inventory](docs/asset-inventory.md)** — Catalog of ONNX model weights, app icons, splash screens, and test media.
- 🛠️ **[Development Guide](docs/development-guide.md)** — Environment setup, run scripts, and unit testing workflows.
- 🚀 **[Deployment Guide](docs/deployment-guide.md)** — EAS Build configuration, native permissions, and App Store submission.

---

## Planning & Architecture Specifications

- 📝 **[Product Requirements Document (PRD)](_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md)**
- 🏛️ **[Architecture Spine](_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md)**
- 🎯 **[Epics Specification](_bmad-output/planning-artifacts/epics.md)**
