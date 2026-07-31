You are an Acceptance Auditor. Review the provided diff against `_bmad-output/implementation-artifacts/4-1-directional-distance-height-tilt-badges.md` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.

Diff:

```diff
diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
index f39c1f7..f095cba 100644
--- a/src/components/camera/CameraViewfinder.tsx
+++ b/src/components/camera/CameraViewfinder.tsx
@@ -13,6 +13,7 @@ import { LensPresetChips } from './LensPresetChips';
 import { ShutterButton } from './ShutterButton';
 import { AnalyzingIndicator } from './AnalyzingIndicator';
 import { DirectorCueOverlay } from './DirectorCueOverlay';
+import { PositioningBadgesOverlay } from './PositioningBadgesOverlay';
 import { useSafeCameraDevice } from '../../utils/cameraHooks';
 
 // Dynamic load Camera component for native platforms only
@@ -125,6 +126,9 @@ export const CameraViewfinder: React.FC = () => {
       {/* COCO-17 Vector Pose Overlay Layer */}
       <VectorPoseOverlay />
 
+      {/* Directional Distance & Height/Tilt Badges Overlay */}
+      <PositioningBadgesOverlay />
+
       {/* Director Cues & Pose Alignment Feedback Overlay */}
       <DirectorCueOverlay />

diff --git a/src/utils/positioningEngine.ts b/src/utils/positioningEngine.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/utils/positioningEngine.ts
@@ +1,197 @@
+import { SubjectBoundingBox, KeyframeVisionResult, COCO17Keypoints } from '../types/vision';
+import { FramingCrop } from '../types/pose';
+
+export type DistanceDirective = 'step_back' | 'step_closer' | 'optimal';
+export type HeightDirective = 'lower_camera' | 'raise_camera' | 'optimal';
+export type TiltDirective = 'tilt_up' | 'tilt_down' | 'level';
+
+export interface DistanceGuidanceResult {
+  directive: DistanceDirective;
+  badgeText: string;
+  metersOffset: number;
+  actualRatio: number;
+  targetRatio: number;
+}
+
+export interface HeightAndTiltGuidanceResult {
+  heightDirective: HeightDirective;
+  heightBadgeText: string;
+  tiltDirective: TiltDirective;
+  tiltBadgeText: string;
+  pitchDegrees: number;
+}
+
+export interface PositioningEvaluation {
+  distance: DistanceGuidanceResult;
+  heightAndTilt: HeightAndTiltGuidanceResult;
+  isAllOptimal: boolean;
+}
+
+interface FramingStandards {
+  targetRatio: number;
+  referenceDistance: number;
+  targetCenterY: number;
+  levelLabel: string;
+}
+
+const FRAMING_STANDARDS: Record<FramingCrop, FramingStandards> = {
+  headshot: {
+    targetRatio: 0.55,
+    referenceDistance: 1.5,
+    targetCenterY: 0.4,
+    levelLabel: 'eye level',
+  },
+  half_body: {
+    targetRatio: 0.55,
+    referenceDistance: 2.5,
+    targetCenterY: 0.45,
+    levelLabel: 'chest level',
+  },
+  full_body: {
+    targetRatio: 0.75,
+    referenceDistance: 4.0,
+    targetCenterY: 0.5,
+    levelLabel: 'waist level',
+  },
+};
+
+/**
+ * Calculates recommended distance adjustment (step back, step closer, optimal)
+ * based on detected subject bounding box height vs target framing standards.
+ */
+export function calculateDistanceGuidance(
+  boundingBox: SubjectBoundingBox | null,
+  framing: FramingCrop = 'half_body',
+  canvasHeight: number = 1000
+): DistanceGuidanceResult {
+  const standards = FRAMING_STANDARDS[framing] || FRAMING_STANDARDS.half_body;
+
+  if (!boundingBox || boundingBox.height <= 0) {
+    return {
+      directive: 'optimal',
+      badgeText: 'Distance Good',
+      metersOffset: 0,
+      actualRatio: 0,
+      targetRatio: standards.targetRatio,
+    };
+  }
+
+  const actualRatio =
+    boundingBox.height <= 1.0 ? boundingBox.height : boundingBox.height / (canvasHeight || 1000);
+
+  const ratioDiff = Math.abs(actualRatio - standards.targetRatio);
+  const TOLERANCE = 0.08;
+
+  if (ratioDiff <= TOLERANCE) {
+    return {
+      directive: 'optimal',
+      badgeText: 'Distance Good',
+      metersOffset: 0,
+      actualRatio,
+      targetRatio: standards.targetRatio,
+    };
+  }
+
+  // Calculate estimated distance offset in meters
+  const rawOffset = (ratioDiff / standards.targetRatio) * standards.referenceDistance;
+  // Round to nearest 0.5m step, minimum 0.5m
+  const metersOffset = Math.max(0.5, Math.round(rawOffset * 2) / 2);
+
+  if (actualRatio > standards.targetRatio + TOLERANCE) {
+    return {
+      directive: 'step_back',
+      badgeText: `Step back ~${metersOffset}m`,
+      metersOffset,
+      actualRatio,
+      targetRatio: standards.targetRatio,
+    };
+  } else {
+    return {
+      directive: 'step_closer',
+      badgeText: `Step closer ~${metersOffset}m`,
+      metersOffset,
+      actualRatio,
+      targetRatio: standards.targetRatio,
+    };
+  }
+}
+
+/**
+ * Calculates camera height and pitch/tilt guidance based on subject position in frame and device pitch angle.
+ */
+export function calculateHeightAndTiltGuidance(
+  boundingBox: SubjectBoundingBox | null,
+  _keypoints: COCO17Keypoints | null,
+  pitchDegrees: number = 0,
+  framing: FramingCrop = 'half_body',
+  canvasHeight: number = 1000
+): HeightAndTiltGuidanceResult {
+  const standards = FRAMING_STANDARDS[framing] || FRAMING_STANDARDS.half_body;
+
+  let heightDirective: HeightDirective = 'optimal';
+  let heightBadgeText = 'Camera Height Good';
+
+  if (boundingBox && boundingBox.height > 0) {
+    const rawCenterY = boundingBox.y + boundingBox.height / 2;
+    const actualCenterY = boundingBox.height <= 1.0 ? rawCenterY : rawCenterY / (canvasHeight || 1000);
+    const HEIGHT_TOLERANCE = 0.1;
+
+    if (actualCenterY < standards.targetCenterY - HEIGHT_TOLERANCE) {
+      heightDirective = 'lower_camera';
+      heightBadgeText = `Lower camera to ${standards.levelLabel}`;
+    } else if (actualCenterY > standards.targetCenterY + HEIGHT_TOLERANCE) {
+      heightDirective = 'raise_camera';
+      heightBadgeText = `Raise camera to ${standards.levelLabel}`;
+    }
+  }
+
+  let tiltDirective: TiltDirective = 'level';
+  let tiltBadgeText = 'Tilt Level Good';
+
+  const PITCH_TOLERANCE = 2.5;
+  const roundedPitch = Math.abs(Math.round(pitchDegrees));
+
+  if (pitchDegrees < -PITCH_TOLERANCE) {
+    tiltDirective = 'tilt_up';
+    tiltBadgeText = `Tilt camera up ${roundedPitch}°`;
+  } else if (pitchDegrees > PITCH_TOLERANCE) {
+    tiltDirective = 'tilt_down';
+    tiltBadgeText = `Tilt camera down ${roundedPitch}°`;
+  }
+
+  return {
+    heightDirective,
+    heightBadgeText,
+    tiltDirective,
+    tiltBadgeText,
+    pitchDegrees,
+  };
+}
+
+/**
+ * Evaluates combined camera positioning (distance, height, tilt) for keyframe vision result.
+ */
+export function evaluateCameraPositioning(
+  visionResult: KeyframeVisionResult | null,
+  framing: FramingCrop = 'half_body',
+  pitchDegrees: number = 0,
+  canvasHeight: number = 1000
+): PositioningEvaluation {
+  const boundingBox = visionResult?.boundingBox ?? null;
+  const keypoints = visionResult?.keypoints ?? null;
+
+  const distance = calculateDistanceGuidance(boundingBox, framing, canvasHeight);
+  const heightAndTilt = calculateHeightAndTiltGuidance(boundingBox, keypoints, pitchDegrees, framing, canvasHeight);
+
+  const isAllOptimal =
+    distance.directive === 'optimal' &&
+    heightAndTilt.heightDirective === 'optimal' &&
+    heightAndTilt.tiltDirective === 'level';
+
+  return {
+    distance,
+    heightAndTilt,
+    isAllOptimal,
+  };
+}

diff --git a/src/components/camera/PositioningBadgesOverlay.tsx b/src/components/camera/PositioningBadgesOverlay.tsx
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/components/camera/PositioningBadgesOverlay.tsx
@@ +1,113 @@
+import React, { useMemo } from 'react';
+import { StyleSheet, View, Text } from 'react-native';
+import { useCameraStore } from '../../stores/useCameraStore';
+import { evaluateCameraPositioning } from '../../utils/positioningEngine';
+
+export const PositioningBadgesOverlay: React.FC = () => {
+  const isFrozen = useCameraStore((state) => state.isFrozen);
+  const visionResult = useCameraStore((state) => state.visionResult);
+  const selectedFraming = useCameraStore((state) => state.selectedFraming);
+
+  const evaluation = useMemo(() => {
+    if (!isFrozen || !visionResult) return null;
+    return evaluateCameraPositioning(visionResult, selectedFraming, 0);
+  }, [isFrozen, visionResult, selectedFraming]);
+
+  if (!isFrozen || !visionResult || !evaluation) {
+    return null;
+  }
+
+  const { distance, heightAndTilt } = evaluation;
+
+  const isDistanceGood = distance.directive === 'optimal';
+  const isHeightGood = heightAndTilt.heightDirective === 'optimal';
+  const isTiltGood = heightAndTilt.tiltDirective === 'level';
+
+  return (
+    <View style={styles.overlayContainer} pointerEvents="box-none">
+      <View style={styles.badgeStack}>
+        {/* Distance Badge Chip */}
+        <View style={[styles.badgeChip, styles.distanceChip, isDistanceGood && styles.optimalChip]}>
+          <Text style={styles.badgeIcon}>📐</Text>
+          <Text style={[styles.badgeText, isDistanceGood ? styles.greenText : styles.cyanText]}>
+            {distance.badgeText}
+          </Text>
+        </View>
+
+        {/* Height Badge Chip */}
+        <View style={[styles.badgeChip, isHeightGood ? styles.optimalChip : styles.warningChip]}>
+          <Text style={styles.badgeIcon}>↕️</Text>
+          <Text style={[styles.badgeText, isHeightGood ? styles.greenText : styles.amberText]}>
+            {heightAndTilt.heightBadgeText}
+          </Text>
+        </View>
+
+        {/* Tilt Badge Chip */}
+        <View style={[styles.badgeChip, isTiltGood ? styles.optimalChip : styles.warningChip]}>
+          <Text style={styles.badgeIcon}>🔄</Text>
+          <Text style={[styles.badgeText, isTiltGood ? styles.greenText : styles.amberText]}>
+            {heightAndTilt.tiltBadgeText}
+          </Text>
+        </View>
+      </View>
+    </View>
+  );
+};
+
+const styles = StyleSheet.create({
+  overlayContainer: {
+    position: 'absolute',
+    left: 0,
+    right: 0,
+    top: 100,
+    zIndex: 25,
+    alignItems: 'center',
+  },
+  badgeStack: {
+    alignItems: 'center',
+    gap: 6,
+  },
+  badgeChip: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: 'rgba(0, 0, 0, 0.75)',
+    paddingHorizontal: 14,
+    paddingVertical: 6,
+    borderRadius: 20,
+    borderWidth: 1,
+    borderColor: 'rgba(255, 255, 255, 0.15)',
+    shadowColor: '#000',
+    shadowOffset: { width: 0, height: 2 },
+    shadowOpacity: 0.5,
+    shadowRadius: 4,
+    elevation: 4,
+  },
+  distanceChip: {
+    borderColor: 'rgba(0, 229, 255, 0.4)',
+  },
+  warningChip: {
+    borderColor: 'rgba(255, 159, 10, 0.4)',
+  },
+  optimalChip: {
+    borderColor: 'rgba(48, 209, 88, 0.4)',
+  },
+  badgeIcon: {
+    fontSize: 12,
+    marginRight: 6,
+  },
+  badgeText: {
+    fontSize: 13,
+    fontWeight: '700',
+    letterSpacing: 0.3,
+  },
+  cyanText: {
+    color: '#00E5FF',
+  },
+  amberText: {
+    color: '#FF9F0A',
+  },
+  greenText: {
+    color: '#30D158',
+  },
+});

diff --git a/src/utils/__tests__/positioningEngine.test.ts b/src/utils/__tests__/positioningEngine.test.ts
new file mode 100644
index 0000000..1234567
--- /dev/null
+++ b/src/utils/__tests__/positioningEngine.test.ts
@@ +1,120 @@
+import {
+  calculateDistanceGuidance,
+  calculateHeightAndTiltGuidance,
+  evaluateCameraPositioning,
+  PositioningEvaluation,
+} from '../positioningEngine';
+import { SubjectBoundingBox, KeyframeVisionResult, COCO17Keypoints } from '../../types/vision';
+import { FramingCrop } from '../../types/pose';
+
+function assert(condition: boolean, message: string) {
+  if (!condition) {
+    throw new Error(`Assertion failed: ${message}`);
+  }
+}
+
+console.log('Running positioningEngine unit tests...');
+
+// Test 1: Null / Undefined Bounding Box Fallback
+{
+  const distRes = calculateDistanceGuidance(null, 'half_body');
+  assert(distRes.directive === 'optimal', 'Null bbox should fallback to optimal distance');
+  assert(distRes.badgeText === 'Distance Good', 'Null bbox should return Distance Good badge text');
+
+  const heightTiltRes = calculateHeightAndTiltGuidance(null, null, 0, 'half_body');
+  assert(heightTiltRes.heightDirective === 'optimal', 'Null bbox should fallback to optimal height');
+  assert(heightTiltRes.tiltDirective === 'level', '0 degree pitch should return level tilt');
+
+  const evalRes = evaluateCameraPositioning(null, 'half_body');
+  assert(evalRes.isAllOptimal === true, 'Null vision result should default to all optimal fallback');
+}
+
+// Test 2: Distance Guidance Calculations for headshot, half_body, full_body
+{
+  // Headshot target height ratio ~ 0.55
+  // Subject bbox too large (height ratio 0.80) => Step back
+  const largeBbox: SubjectBoundingBox = { x: 100, y: 50, width: 300, height: 800 }; // 800 / 1000 = 0.80
+  const distBack = calculateDistanceGuidance(largeBbox, 'headshot', 1000);
+  assert(distBack.directive === 'step_back', `Expected step_back, got ${distBack.directive}`);
+  assert(distBack.badgeText.includes('Step back'), `Expected 'Step back' in badgeText, got '${distBack.badgeText}'`);
+  assert(distBack.metersOffset > 0, 'Meters offset should be > 0');
+
+  // Subject bbox too small (height ratio 0.25) => Step closer
+  const smallBbox: SubjectBoundingBox = { x: 100, y: 200, width: 100, height: 250 }; // 250 / 1000 = 0.25
+  const distCloser = calculateDistanceGuidance(smallBbox, 'headshot', 1000);
+  assert(distCloser.directive === 'step_closer', `Expected step_closer, got ${distCloser.directive}`);
+  assert(distCloser.badgeText.includes('Step closer'), `Expected 'Step closer' in badgeText, got '${distCloser.badgeText}'`);
+  assert(distCloser.metersOffset > 0, 'Meters offset should be > 0');
+
+  // Subject bbox matching target (height ratio 0.55) => Optimal / Distance Good
+  const perfectHeadshotBbox: SubjectBoundingBox = { x: 100, y: 100, width: 250, height: 550 };
+  const distOptimal = calculateDistanceGuidance(perfectHeadshotBbox, 'headshot', 1000);
+  assert(distOptimal.directive === 'optimal', `Expected optimal, got ${distOptimal.directive}`);
+  assert(distOptimal.badgeText === 'Distance Good', `Expected 'Distance Good', got '${distOptimal.badgeText}'`);
+
+  // Full Body target ratio ~ 0.75
+  const fullBodyBbox: SubjectBoundingBox = { x: 100, y: 100, width: 300, height: 750 };
+  const distFullOptimal = calculateDistanceGuidance(fullBodyBbox, 'full_body', 1000);
+  assert(distFullOptimal.directive === 'optimal', `Expected full_body optimal, got ${distFullOptimal.directive}`);
+}
+
+// Test 3: Height Guidance Directives
+{
+  // Camera placed too low => Subject center Y is high up in frame => Lower camera directive
+  const highSubjectBbox: SubjectBoundingBox = { x: 100, y: 20, width: 200, height: 400 }; // Center Y = 220 / 1000 = 0.22
+  const heightResLow = calculateHeightAndTiltGuidance(highSubjectBbox, null, 0, 'half_body', 1000);
+  assert(heightResLow.heightDirective === 'lower_camera', `Expected lower_camera, got ${heightResLow.heightDirective}`);
+  assert(heightResLow.heightBadgeText.includes('Lower camera'), `Expected 'Lower camera', got '${heightResLow.heightBadgeText}'`);
+
+  // Camera placed too high => Subject center Y is low down in frame => Raise camera directive
+  const lowSubjectBbox: SubjectBoundingBox = { x: 100, y: 550, width: 200, height: 400 }; // Center Y = 750 / 1000 = 0.75
+  const heightResHigh = calculateHeightAndTiltGuidance(lowSubjectBbox, null, 0, 'half_body', 1000);
+  assert(heightResHigh.heightDirective === 'raise_camera', `Expected raise_camera, got ${heightResHigh.heightDirective}`);
+  assert(heightResHigh.heightBadgeText.includes('Raise camera'), `Expected 'Raise camera', got '${heightResHigh.heightBadgeText}'`);
+
+  // Optimal height
+  const centeredSubjectBbox: SubjectBoundingBox = { x: 100, y: 250, width: 200, height: 400 }; // Center Y = 450 / 1000 = 0.45
+  const heightResOptimal = calculateHeightAndTiltGuidance(centeredSubjectBbox, null, 0, 'half_body', 1000);
+  assert(heightResOptimal.heightDirective === 'optimal', `Expected optimal height, got ${heightResOptimal.heightDirective}`);
+}
+
+// Test 4: Pitch / Tilt Guidance Directives
+{
+  const bbox: SubjectBoundingBox = { x: 100, y: 250, width: 200, height: 400 };
+
+  // Pitch = -8 deg (camera pointing down) => Tilt camera up 8°
+  const tiltUpRes = calculateHeightAndTiltGuidance(bbox, null, -8, 'half_body', 1000);
+  assert(tiltUpRes.tiltDirective === 'tilt_up', `Expected tilt_up, got ${tiltUpRes.tiltDirective}`);
+  assert(tiltUpRes.tiltBadgeText.includes('Tilt camera up 8°'), `Expected 'Tilt camera up 8°', got '${tiltUpRes.tiltBadgeText}'`);
+
+  // Pitch = +6 deg (camera pointing up) => Tilt camera down 6°
+  const tiltDownRes = calculateHeightAndTiltGuidance(bbox, null, 6, 'half_body', 1000);
+  assert(tiltDownRes.tiltDirective === 'tilt_down', `Expected tilt_down, got ${tiltDownRes.tiltDirective}`);
+  assert(tiltDownRes.tiltBadgeText.includes('Tilt camera down 6°'), `Expected 'Tilt camera down 6°', got '${tiltDownRes.tiltBadgeText}'`);
+
+  // Pitch = 1.5 deg (within ±2 deg threshold) => Tilt Level Good / level
+  const tiltLevelRes = calculateHeightAndTiltGuidance(bbox, null, 1.5, 'half_body', 1000);
+  assert(tiltLevelRes.tiltDirective === 'level', `Expected level tilt, got ${tiltLevelRes.tiltDirective}`);
+  assert(tiltLevelRes.tiltBadgeText === 'Tilt Level Good', `Expected 'Tilt Level Good', got '${tiltLevelRes.tiltBadgeText}'`);
+}
+
+// Test 5: Full Evaluation Integration
+{
+  const visionResult: KeyframeVisionResult = {
+    timestamp: Date.now(),
+    subjectCount: 'solo',
+    sceneType: 'landscape',
+    keypoints: null,
+    boundingBox: { x: 100, y: 125, width: 250, height: 550 },
+    confidenceScore: 0.95,
+  };

  const evaluation = evaluateCameraPositioning(visionResult, 'headshot', 0, 1000);
  assert(evaluation.distance.directive === 'optimal', 'Distance should be optimal');
  assert(evaluation.heightAndTilt.heightDirective === 'optimal', 'Height should be optimal');
  assert(evaluation.heightAndTilt.tiltDirective === 'level', 'Tilt should be level');
  assert(evaluation.isAllOptimal === true, 'isAllOptimal should be true when all parameters optimal');
}
```
