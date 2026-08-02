# Project Documentation Index — PoseCam (bmad-camera-app)

## Project Overview

- **Project Name:** PoseCam (`bmad-camera-app`)
- **Repository Type:** Monolith (Single cohesive mobile application codebase)
- **Project Type:** Mobile Application (`mobile`)
- **Primary Language:** TypeScript (`v5.1.3`)
- **Core Framework:** React Native (`0.74.5`) & Expo (`~51.0.0`)
- **Architecture Pattern:** Layered Component & Local Vision Inferencing Pipeline Architecture

---

## Quick Reference

- **Target Platforms:** iOS (15.0+) & Android (API 34+)
- **Primary Camera Library:** `react-native-vision-camera` (`v4.5.2`)
- **State Management:** Zustand (`v4.5.2`) via [useCameraStore.ts](file:///o:/New%20folder/bmad-test/bmad/src/stores/useCameraStore.ts)
- **Local AI Inferencing:** ONNX Runtime (`onnxruntime-web` / `onnxruntime-node`) with `assets/models/yolov8n-pose.onnx`
- **Application Entry Point:** [src/app/index.tsx](file:///o:/New%20folder/bmad-test/bmad/src/app/index.tsx) -> [CameraViewfinder.tsx](file:///o:/New%20folder/bmad-test/bmad/src/components/camera/CameraViewfinder.tsx)

---

## Generated Documentation

- [Project Overview](./project-overview.md) — High-level project summary, core capabilities, and feature list.
- [System Architecture Document](./architecture.md) — Complete technical architecture, AI pipeline engine details, and NFR analysis.
- [Source Tree Analysis](./source-tree-analysis.md) — Annotated directory tree, critical folder descriptions, and key file entry points.
- [Component Inventory](./component-inventory.md) — Catalog of all 17 viewfinder HUD overlay components and controls.
- [State Management Patterns](./state-management-patterns.md) — Reference for global Zustand camera store state, actions, and lifecycle.
- [Data Models & Contracts](./data-models.md) — TypeScript type interfaces for keypoints, vision results, framing, and composition.
- [Asset Inventory](./asset-inventory.md) — Catalog of ONNX model weights, app icons, splash screens, and test assets.
- [Development Guide](./development-guide.md) — Setup instructions, Expo Metro scripts, and unit testing workflows.
- [Deployment Guide](./deployment-guide.md) — EAS Build configuration, app store submission, and permissions setup.

---

## Existing Project Artifacts & Specifications

- [Product Requirements Document (PRD)](../_bmad-output/planning-artifacts/prds/prd-bmad-2026-07-28/prd.md) — Initial product requirements and user stories.
- [Architecture Spine](../_bmad-output/planning-artifacts/architecture/ARCHITECTURE-SPINE.md) — Technical architecture spine and design decisions.
- [Epics Specification](../_bmad-output/planning-artifacts/epics.md) — Epic breakdowns and user story definitions.

---

## Getting Started

To get started with local development:

```bash
# 1. Install dependencies
npm install

# 2. Start the Expo Metro Bundler
npm start

# 3. Launch on platform of choice
npm run android   # Android device / emulator
npm run ios       # iOS simulator
npm run web       # Simulator preview fallback mode
```
