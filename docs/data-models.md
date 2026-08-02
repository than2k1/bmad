# Data Models & Contracts — PoseCam (bmad-camera-app)

## Overview

This document specifies the core domain interfaces, data structures, and type contracts used across PoseCam's local vision pipeline, pose catalog, and composition rule engines.

---

## 1. Vision & Keypoint Contracts (`src/types/vision.ts`)

### `COCO17Keypoints`
Standard 17-keypoint human body pose structure normalized `[0.0, 1.0]`:
```typescript
export interface Keypoint {
  x: number;          // Normalized X coordinate [0.0, 1.0]
  y: number;          // Normalized Y coordinate [0.0, 1.0]
  confidence: number; // Detection confidence [0.0, 1.0]
}

export interface COCO17Keypoints {
  nose: Keypoint;
  left_eye: Keypoint;
  right_eye: Keypoint;
  left_ear: Keypoint;
  right_ear: Keypoint;
  left_shoulder: Keypoint;
  right_shoulder: Keypoint;
  left_elbow: Keypoint;
  right_elbow: Keypoint;
  left_wrist: Keypoint;
  right_wrist: Keypoint;
  left_hip: Keypoint;
  right_hip: Keypoint;
  left_knee: Keypoint;
  right_knee: Keypoint;
  left_ankle: Keypoint;
  right_ankle: Keypoint;
}
```

### `SubjectDetection` & `KeyframeVisionResult`
```typescript
export interface SubjectBoundingBox {
  x: number;      // Top-left X normalized
  y: number;      // Top-left Y normalized
  width: number;  // Bounding box width normalized
  height: number; // Bounding box height normalized
}

export interface SubjectDetection {
  keypoints: COCO17Keypoints;
  boundingBox: SubjectBoundingBox;
  confidence: number;
}

export type SubjectCount = 'solo' | 'couple' | 'group';
export type SceneType = 'landscape' | 'architecture';

export interface KeyframeVisionResult {
  timestamp: number;
  subjectCount: SubjectCount;
  sceneType: SceneType;
  subjects: SubjectDetection[];
  confidenceScore: number;
  lightingConfidence: number;
  spatialLayout: SpatialLayout;
  compositionResult: CompositionEvaluationResult;
}
```

---

## 2. Pose Catalog & Framing Contracts (`src/types/pose.ts`)

```typescript
export type FramingCrop = 'full_body' | 'half_body' | 'close_up';

export interface ReferencePose {
  id: string;
  name: string;
  framing: FramingCrop;
  category: 'female' | 'male' | 'unisex' | 'couple';
  keypoints: COCO17Keypoints;
  description?: string;
  thumbnailUri?: string;
}
```

---

## 3. Composition & Spatial Geometry Contracts (`src/types/composition.ts`)

```typescript
export interface SpatialLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  type: 'horizontal' | 'vertical' | 'diagonal';
  strength: number;
}

export interface VanishingPoint {
  x: number;
  y: number;
  confidence: number;
}

export interface SpatialLayout {
  dominantLines: SpatialLine[];
  primaryVanishingPoint: VanishingPoint | null;
  horizonY: number;
}

export interface CompositionEvaluationResult {
  score: number;             // Overall framing score [0, 100]
  ruleOfThirdsScore: number; // Rule of Thirds alignment [0, 100]
  goldenRatioScore: number;  // Golden Ratio Phi alignment [0, 100]
  leadRoomScore: number;     // Gaze/lead room score [0, 100]
  centerBalanceScore: number; // Left/right spatial symmetry [0, 100]
  primaryRuleMatched: string; // e.g. "Rule of Thirds", "Golden Ratio"
}
```
