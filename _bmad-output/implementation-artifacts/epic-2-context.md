# Epic 2 Context: Tap-to-Freeze Keyframe Vision Engine

<!-- Generated from planning artifacts. Regenerate with compile-epic-context if planning docs change. -->

## Goal

Enable users to tap a shutter button to freeze the viewfinder keyframe and run <200ms local AI vision inferencing for subject/scene detection.

## Stories

- Story 2.1: Shutter Keyframe Freeze & Unfreeze Pipeline
- Story 2.2: Local On-Device Vision Inferencing Engine

## Requirements & Constraints

- Keyframe vision analysis must complete within <200ms on modern mobile hardware (NFR-1.1).
- 100% local vision inferencing (CoreML / ONNX / TFLite). No photos transmitted to cloud (NFR-2.1).
- 100% offline functionality with zero external network calls (NFR-2.2).
- Viewfinder keyframe freeze trigger via intuitive shutter button (FR-2.1).
- Single-tap screen un-freeze back to 60 FPS live video preview (FR-2.3).
- Subject detection (Solo, Couple, Group of 3+) and scene classification (Landscape, Architecture, Food, Interior, Sunset) (FR-3.1, FR-4.1).

## Technical Decisions

- Thread-isolated local frame processor executing YOLO-Pose / MediaPipe / local vision inferencing engine asynchronously (AD-2).
- COCO-17 Keypoint JSON schema output compatible with SVG vector rendering (AD-4).
- Lightweight Zustand store manages transient vision state (`visionResult`, `inferenceLatencyMs`, `isAnalyzing`, `isFrozen`) (AD-5).
- Web simulator fallback support maintained for cross-platform vision HUD component previews.

## Cross-Story Dependencies

- Story 2.2 depends on Story 2.1 shutter freeze state and store pipeline in `useCameraStore.ts`.
- Story 2.2 outputs COCO-17 keypoints and subject bounding boxes consumed by Epic 3 (Person Mode pose overlays) and Epic 4 (Scene composition guidance).
