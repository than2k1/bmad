---
title: "Architecture Spine: Pose Suggestion & Camera Configuration Mobile App"
status: final
version: 1.0.0
created: 2026-07-28
updated: 2026-07-28
---

# Technical Architecture Spine
## Pose Suggestion & Camera Configuration Mobile App

---

## 1. Architectural Invariants & Decisions (ADs)

### AD-1: Application Framework & Native Bridge
* **Status**: `[ADOPTED]`
* **Binds**: Core mobile app runtime and cross-platform native bridge.
* **Rule**: The app shall be built on **React Native (Expo Managed Workflow with Config Plugins)**. Native camera access and hardware sensors are bound via `react-native-vision-camera` and `expo-sensors`.
* **Prevents**: Divergent native iOS/Android codebases or pure web-view wrappers that lack native camera performance.

### AD-2: Viewfinder Preview & Keyframe AI Vision Pipeline
* **Status**: `[ADOPTED]`
* **Binds**: Camera rendering and AI vision model execution.
* **Rule**:
  1. The live camera viewfinder runs on a high-performance native preview layer at 60 FPS.
  2. Upon tapping "Analyze / Freeze", a single high-resolution keyframe is passed to a native Frame Processor executing local C++/CoreML/ONNX vision models (YOLO-Pose / MediaPipe Pose).
  3. Vision inference results (detected body keypoints, framing bounding box, scene type) are returned asynchronously within $<200\text{ms}$ to update the UI overlay.
* **Prevents**: Thermal throttling, high battery drain, and UI stutter caused by continuous 60 FPS video frame processing on the JS main thread.

### AD-3: Hardware Sensor & Horizon Leveling Pipeline
* **Status**: `[ADOPTED]`
* **Binds**: Physical device orientation and tilt calculation.
* **Rule**: Horizon level and pitch/roll tilt indicators are updated via `expo-sensors` (Gyroscope / Accelerometer) at 60Hz. Sensor values update native UI transforms directly via `react-native-reanimated` shared values to bypass the JavaScript bridge.
* **Prevents**: Laggy or jittery horizon bar movements caused by JS bridge serialization.

### AD-4: Pose Template Data Format & Vector Rendering
* **Status**: `[ADOPTED]`
* **Binds**: Pose catalog storage and screen overlay rendering.
* **Rule**:
  1. Pose templates are stored as structured JSON files adhering to the **COCO-17 Keypoint Format**.
  2. Pose overlays are rendered using `react-native-svg` as resolution-independent vector lines and joint circles, scaled dynamically to match the viewfinder canvas aspect ratio.
* **Prevents**: Raster image scaling artifacts, high asset bundle sizes, and complex 3D engine dependencies.

### AD-5: State Management & Persistence
* **Status**: `[ADOPTED]`
* **Binds**: App state, active framing selection, and pose catalog filtering.
* **Rule**: Transient camera UI state (Active mode, selected framing, current frozen keyframe, active pose overlay) is managed via a lightweight **Zustand** store. Local app settings (favorite poses, custom templates) are stored via `expo-file-system`.
* **Prevents**: Redux boilerplate and unnecessary re-renders of the live camera HUD.

---

## 2. System Architecture & Component Diagram

```mermaid
graph TD
    subgraph UI Layer (React Native / Reanimated / SVG)
        A[Viewfinder Screen HUD] --> B[Mode Selector: Person / Scene]
        A --> C[Framing Selector: Headshot / Half / Full]
        A --> D[Pose Wireframe Overlay Carousel]
        A --> E[Native Horizon Level Bar]
    end

    subgraph Native Sensor Stream (60Hz)
        E <== Gyro / Accelerometer (Reanimated Shared Value) ==> F[Device Hardware Sensors]
    end

    subgraph Camera & Vision Pipeline
        G[Native Camera Viewfinder] -->|Tap to Freeze| H[Keyframe Frame Processor]
        H -->|On-Device Vision Model| I[Local CoreML / ONNX Inference Engine]
        I -->|Detected Keypoints & Bounding Box| J[Pose & Composition Logic Engine]
        J -->|Filtered Pose Recommendations & Lens Badges| A
    end

    subgraph Pose Catalog & Asset Storage
        K[JSON Pose Templates Catalog] -->|COCO-17 Keypoints| D
    end
```

---

## 3. Data Schemas & Contracts

### 3.1 Pose Template Data Schema (`PoseTemplate.json`)
```json
{
  "$schema": "http://json-schema.org/draft-07/schema#",
  "title": "PoseTemplate",
  "type": "object",
  "properties": {
    "id": { "type": "string" },
    "title": { "type": "string" },
    "category": { "type": "string", "enum": ["person", "scene"] },
    "framing": { "type": "string", "enum": ["headshot", "half_body", "full_body"] },
    "subject_count": { "type": "integer", "default": 1 },
    "tags": { "type": "array", "items": { "type": "string" } },
    "keypoints": {
      "type": "object",
      "properties": {
        "nose": { "type": "array", "items": { "type": "number" }, "minItems": 2, "maxItems": 2 },
        "left_eye": { "type": "array", "items": { "type": "number" } },
        "right_eye": { "type": "array", "items": { "type": "number" } },
        "left_shoulder": { "type": "array", "items": { "type": "number" } },
        "right_shoulder": { "type": "array", "items": { "type": "number" } },
        "left_elbow": { "type": "array", "items": { "type": "number" } },
        "right_elbow": { "type": "array", "items": { "type": "number" } },
        "left_wrist": { "type": "array", "items": { "type": "number" } },
        "right_wrist": { "type": "array", "items": { "type": "number" } },
        "left_hip": { "type": "array", "items": { "type": "number" } },
        "right_hip": { "type": "array", "items": { "type": "number" } },
        "left_knee": { "type": "array", "items": { "type": "number" } },
        "right_knee": { "type": "array", "items": { "type": "number" } },
        "left_ankle": { "type": "array", "items": { "type": "number" } },
        "right_ankle": { "type": "array", "items": { "type": "number" } }
      },
      "required": ["nose", "left_shoulder", "right_shoulder", "left_hip", "right_hip"]
    },
    "skeleton_connections": {
      "type": "array",
      "items": { "type": "array", "items": { "type": "string" }, "minItems": 2, "maxItems": 2 }
    }
  },
  "required": ["id", "title", "category", "framing", "keypoints"]
}
```

### 3.2 Guidance Engine Output Schema (`GuidanceOutput.json`)
```json
{
  "recommended_lens": "3x",
  "lens_reason": "Telephoto lens avoids facial distortion for half-body portraits.",
  "positioning": {
    "distance_action": "step_back",
    "distance_meters": 1.2,
    "camera_height_action": "lower_to_waist",
    "tilt_angle_degree": 5.0
  },
  "suggested_pose_ids": ["full_body_standing_01", "full_body_casual_02"],
  "scene_grid": "rule_of_thirds"
}
```

---

## 4. Deferred Decisions & Future Scenarios

* `[DEFERRED]` Specific ONNX model file quantization (FP16 vs INT8 precision) — to be benchmarked during implementation.
* `[DEFERRED]` Custom user-created pose template saving pipeline — deferred to V2.
