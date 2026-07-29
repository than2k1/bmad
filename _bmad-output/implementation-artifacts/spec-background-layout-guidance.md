# Specification: Background Object Layout & Photography Guidance Engine

**Status**: Drafted / Deferred (Future Epic Feature)  
**Date**: 2026-07-30  
**Target Module**: Camera Vision & Guidance Engine  

---

## 1. Overview

This document specifies the technical architecture, rule priorities, and UX interaction model for automated background object layout recognition and photography composition guidance.

By identifying background object layouts (lines, structural openings, horizon balance), the camera viewfinder provides dynamic directional feedback to guide photographers toward professional composition techniques.

---

## 2. Composition Rule Priority Matrix

The system dynamically selects the active guidance rule based on camera mode (`person` vs. `landscape`) and rule priority thresholds.

### Priority Cascades

| Mode | Priority 1 (Highest) | Priority 2 | Priority 3 | Priority 4 (Fallback) |
|---|---|---|---|---|
| **Landscape Mode** 🌄 | **Symmetry & Centering** (Rule 4) | **Leading Lines & Depth** (Rule 3) | **Frame-within-a-Frame** (Rule 1) | **Rule of Thirds** (Rule 2) |
| **Person Mode** 👤 | **Frame-within-a-Frame** (Rule 1) | **Leading Lines & Depth** (Rule 3) | **Symmetry & Centering** (Rule 4) | **Rule of Thirds** (Rule 2) |

---

## 3. Technical Architecture

### 3.1 Data Flow Pipeline

```
[ Camera Frame ] 
      │
      ├──> [ Tier 1: Pose Keypoints (30 FPS) ] ───────┐
      │                                               ▼
      └──> [ Tier 2: Spatial Layout Extractor ] ──> [ compositionRuleEngine ]
           (Line detection, Bounding Boxes)           │
                                                      ▼
                                           [ Active Guidance Cue ]
                                                      │
                                                      ▼
                                           [ Viewfinder HUD Overlay ]
```

### 3.2 Strategy Definition (`src/services/composition/compositionStrategy.ts`)

```typescript
export const COMPOSITION_PRIORITIES = {
  landscape: [
    'symmetry_centering',   // Priority 1
    'leading_lines',        // Priority 2
    'frame_in_frame',       // Priority 3
    'rule_of_thirds',       // Priority 4
  ],
  person: [
    'frame_in_frame',       // Priority 1
    'leading_lines',        // Priority 2
    'symmetry_centering',   // Priority 3
    'rule_of_thirds',       // Priority 4
  ],
} as const;

export interface CompositionGuidance {
  activeRule: 'frame_in_frame' | 'leading_lines' | 'symmetry_centering' | 'rule_of_thirds';
  score: number; // 0 to 100% alignment score
  isSatisfied: boolean; // >= 85% threshold
  directionalCue: {
    pan: 'left' | 'right' | 'centered';
    tilt: 'up' | 'down' | 'level';
    distance: 'step_closer' | 'step_back' | 'perfect';
  };
  guideLines: Array<{ start: [number, number]; end: [number, number] }>;
}
```

---

## 4. Proposed Future Epic & Story Breakdown

### **Epic 5: Background Object & Composition Guidance Engine**

* **Story 5.1: Background Bounding Box & Line Extraction Pipeline**
  * Implement Tier 2 keyframe inference for spatial line detection (Hough transform) and background structural bounding boxes (arches, doors, windows).
* **Story 5.2: Mode-Driven Composition Rule Evaluator Engine**
  * Build `compositionRuleEngine` enforcing mode-specific priority cascades (`Landscape` vs `Person`) with score thresholding ($\ge 70\%$).
* **Story 5.3: Viewfinder Directional Cues & Target Visual Overlay**
  * Render SVG target overlays and text guidance banners (*"Pan right 5° to align inside doorway"*) on `CameraViewfinder`.

---

## 5. Next Steps

This spec has been documented and archived for future epic planning. Current active sprint execution remains focused on **Story 3-1: Manual Framing Selector & Contextual Pose Filtering**.
