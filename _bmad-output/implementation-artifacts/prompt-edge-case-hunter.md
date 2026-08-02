Invoke the `bmad-review-edge-case-hunter` skill on this diff:

```diff
diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
index b27ca65..b57bd11 100644
--- a/src/stores/__tests__/useCameraStore.test.ts
+++ b/src/stores/__tests__/useCameraStore.test.ts
@@ -75,11 +75,23 @@ export function runCameraStoreTests() {
       confidence: 0.94,
     }],
     confidenceScore: 0.94,
+    spatialLayout: {
+      lines: [
+        { start: { x: 0, y: 240 }, end: { x: 640, y: 240 }, angleDeg: 0, length: 640, confidence: 0.9, type: 'horizon' },
+      ],
+      boundingBoxes: [
+        { id: 'bbox-1', label: 'doorway', x: 100, y: 50, width: 200, height: 350, confidence: 0.88 },
+      ],
+      horizonLine: { start: { x: 0, y: 240 }, end: { x: 640, y: 240 }, angleDeg: 0, length: 640, confidence: 0.9, type: 'horizon' },
+      extractionLatencyMs: 12,
+    },
   };
 
   store.setVisionResult(dummyResult, 64);
   let state = useCameraStore.getState();
   assert(state.visionResult !== null, 'setVisionResult failed to set visionResult');
+  assert(state.visionResult?.spatialLayout !== undefined, 'setVisionResult failed to store spatialLayout');
+  assert(state.visionResult?.spatialLayout?.boundingBoxes.length === 1, 'spatialLayout boundingBoxes failed');
   assert(state.inferenceLatencyMs === 64, 'setVisionResult failed to set inferenceLatencyMs');
 
   // Test clearVisionResult
diff --git a/src/types/vision.ts b/src/types/vision.ts
index 0d65896..02b66dd 100644
--- a/src/types/vision.ts
+++ b/src/types/vision.ts
@@ -41,6 +41,37 @@ export interface SubjectDetection {
   confidence: number;
 }
 
+export type LineType = 'horizon' | 'vertical' | 'diagonal';
+
+export type StructuralLabel = 'doorway' | 'window' | 'arch' | 'frame' | 'structure';
+
+export interface LineSegment {
+  start: Point2D;
+  end: Point2D;
+  angleDeg: number;
+  length: number;
+  confidence: number;
+  type: LineType;
+}
+
+export interface BackgroundBoundingBox {
+  id: string;
+  label: StructuralLabel;
+  x: number;
+  y: number;
+  width: number;
+  height: number;
+  confidence: number;
+}
+
+export interface SpatialLayoutResult {
+  lines: LineSegment[];
+  boundingBoxes: BackgroundBoundingBox[];
+  horizonLine?: LineSegment;
+  vanishingPoint?: Point2D;
+  extractionLatencyMs: number;
+}
+
 export interface KeyframeVisionResult {
   timestamp: number;
   subjectCount: SubjectCount;
@@ -51,4 +82,6 @@ export interface KeyframeVisionResult {
   /** Lighting quality score [0–1]: 0 = dark/unusable, 1 = well-lit. Distinct from
    *  confidenceScore (vision inference confidence). Used by exposure guidance logic. */
   lightingConfidence?: number;
+  /** Background structural lines, horizon, vanishing point, and openings (Story 5.1). */
+  spatialLayout?: SpatialLayoutResult;
 }
diff --git a/src/utils/__tests__/visionInferencingEngine.test.ts b/src/utils/__tests__/visionInferencingEngine.test.ts
index 40696c7..03ac633 100644
--- a/src/utils/__tests__/visionInferencingEngine.test.ts
+++ b/src/utils/__tests__/visionInferencingEngine.test.ts
@@ -268,6 +268,9 @@ export async function runVisionEngineTests() {
   assert(result.confidenceScore > 0.5, 'Confidence score should be > 0.5');
   assert(typeof result.lightingConfidence === 'number', 'lightingConfidence should be populated');
   assert(result.lightingConfidence! >= 0 && result.lightingConfidence! <= 1, 'lightingConfidence should be in [0, 1]');
+  assert(result.spatialLayout !== undefined, 'spatialLayout should be populated in KeyframeVisionResult');
+  assert(Array.isArray(result.spatialLayout?.lines), 'spatialLayout.lines should be an array');
+  assert(result.spatialLayout!.lines.length > 0, 'spatialLayout.lines should contain detected or synthetic lines');
 
 
   console.log(`✅ All visionInferencingEngine unit tests passed successfully! (Cached Latency: ${outcome.latencyMs}ms, total test duration: ${totalTestDuration.toFixed(1)}ms)`);
diff --git a/src/utils/visionInferencingEngine.ts b/src/utils/visionInferencingEngine.ts
index 197b9a3..1a93084 100644
--- a/src/utils/visionInferencingEngine.ts
+++ b/src/utils/visionInferencingEngine.ts
@@ -1,4 +1,5 @@
 import { KeyframeVisionResult, COCO17Keypoints, SubjectBoundingBox, SubjectDetection, SubjectCount, SceneType } from '../types/vision';
+import { extractSpatialLayout } from './spatialLayoutExtractor';
 
 export interface VisionAnalysisOutcome {
   result: KeyframeVisionResult;
@@ -535,6 +536,8 @@ export async function analyzeKeyframe(
 
   const confidenceScore = subjects.reduce((max, s) => Math.max(max, s.confidence), 0);
 
+  const spatialLayout = extractSpatialLayout(options.inputWidth, options.inputHeight);
+
   const result: KeyframeVisionResult = {
     timestamp: Date.now(),
     subjectCount,
@@ -542,6 +545,7 @@ export async function analyzeKeyframe(
     subjects,
     confidenceScore,
     lightingConfidence,
+    spatialLayout,
   };
diff --git a/src/utils/spatialLayoutExtractor.ts b/src/utils/spatialLayoutExtractor.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/spatialLayoutExtractor.ts
@@ +1,266 @@
+import {
+  Point2D,
+  LineType,
+  StructuralLabel,
+  LineSegment,
+  BackgroundBoundingBox,
+  SpatialLayoutResult,
+} from '../types/vision';
+
+/**
+ * Classifies line orientation based on angle relative to horizontal.
+ * - Horizon: angle within +/- 15 deg of horizontal (0 or 180 deg)
+ * - Vertical: angle within +/- 15 deg of vertical (90 deg)
+ * - Diagonal: all other angles
+ */
+export function classifyLineType(angleDeg: number): LineType {
+  const normAngle = Math.abs(angleDeg % 180);
+  const tiltFromHoriz = normAngle > 90 ? 180 - normAngle : normAngle;
+
+  if (tiltFromHoriz <= 15) {
+    return 'horizon';
+  }
+  if (Math.abs(tiltFromHoriz - 90) <= 15) {
+    return 'vertical';
+  }
+  return 'diagonal';
+}
+
+/**
+ * Calculates metrics (length, angle in deg, type) for a line segment given start and end points.
+ */
+export function calculateLineMetrics(
+  start: Point2D,
+  end: Point2D,
+  confidence: number = 0.9,
+  overrideType?: LineType
+): LineSegment {
+  const dx = end.x - start.x;
+  const dy = end.y - start.y;
+  const length = Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100;
+  const angleDeg = Math.round((Math.atan2(dy, dx) * (180 / Math.PI)) * 100) / 100;
+  const type = overrideType ?? classifyLineType(angleDeg);
+
+  return {
+    start,
+    end,
+    angleDeg,
+    length,
+    confidence,
+    type,
+  };
+}
+
+/**
+ * Computes 2D intersection point between two line segments.
+ * Returns undefined if lines are parallel or collinear.
+ */
+export function computeLineIntersection(line1: LineSegment, line2: LineSegment): Point2D | undefined {
+  const x1 = line1.start.x, y1 = line1.start.y;
+  const x2 = line1.end.x, y2 = line1.end.y;
+  const x3 = line2.start.x, y3 = line2.start.y;
+  const x4 = line2.end.x, y4 = line2.end.y;
+
+  const a1 = y2 - y1;
+  const b1 = x1 - x2;
+  const c1 = a1 * x1 + b1 * y1;
+
+  const a2 = y4 - y3;
+  const b2 = x3 - x4;
+  const c2 = a2 * x3 + b2 * y3;
+
+  const det = a1 * b2 - a2 * b1;
+  if (Math.abs(det) < 1e-5) {
+    return undefined;
+  }
+
+  const x = (c1 * b2 - c2 * b1) / det;
+  const y = (a1 * c2 - a2 * c1) / det;
+
+  return {
+    x: Math.round(x * 100) / 100,
+    y: Math.round(y * 100) / 100,
+  };
+}
+
+/**
+ * Generates synthetic structural background lines for default simulator preview or fallback execution.
+ */
+export function generateSyntheticLines(canvasWidth: number, canvasHeight: number): LineSegment[] {
+  const midY = canvasHeight * 0.5;
+  const horizon = calculateLineMetrics(
+    { x: 0, y: midY },
+    { x: canvasWidth, y: midY },
+    0.92,
+    'horizon'
+  );
+
+  const vertLeft = calculateLineMetrics(
+    { x: canvasWidth * 0.25, y: canvasHeight * 0.2 },
+    { x: canvasWidth * 0.25, y: canvasHeight * 0.8 },
+    0.88,
+    'vertical'
+  );
+
+  const vertRight = calculateLineMetrics(
+    { x: canvasWidth * 0.75, y: canvasHeight * 0.2 },
+    { x: canvasWidth * 0.75, y: canvasHeight * 0.8 },
+    0.85,
+    'vertical'
+  );
+
+  const diagLeft = calculateLineMetrics(
+    { x: 0, y: 0 },
+    { x: canvasWidth * 0.5, y: midY },
+    0.86,
+    'diagonal'
+  );
+
+  const diagRight = calculateLineMetrics(
+    { x: canvasWidth, y: 0 },
+    { x: canvasWidth * 0.5, y: midY },
+    0.84,
+    'diagonal'
+  );
+
+  return [horizon, vertLeft, vertRight, diagLeft, diagRight];
+}
+
+/**
+ * Groups structural lines into BackgroundBoundingBox objects (e.g. doorways, windows, arches).
+ */
+export function aggregateStructuralBoundingBoxes(
+  lines: LineSegment[],
+  canvasWidth: number,
+  canvasHeight: number
+): BackgroundBoundingBox[] {
+  const verticals = lines.filter((l) => l.type === 'vertical');
+  if (verticals.length < 2) {
+    return [];
+  }
+
+  // Sort verticals by X position
+  const sortedVerts = [...verticals].sort((a, b) => Math.min(a.start.x, a.end.x) - Math.min(b.start.x, b.end.x));
+  const v1 = sortedVerts[0];
+  const v2 = sortedVerts[sortedVerts.length - 1];
+
+  const minX = Math.min(v1.start.x, v1.end.x, v2.start.x, v2.end.x);
+  const maxX = Math.max(v1.start.x, v1.end.x, v2.start.x, v2.end.x);
+  const minY = Math.min(v1.start.y, v1.end.y, v2.start.y, v2.end.y);
+  const maxY = Math.max(v1.start.y, v1.end.y, v2.start.y, v2.end.y);
+
+  const width = Math.round((maxX - minX) * 100) / 100;
+  const height = Math.round((maxY - minY) * 100) / 100;
+
+  if (width <= 0 || height <= 0) {
+    return [];
+  }
+
+  const aspectRatio = height / width;
+  let label: StructuralLabel = 'structure';
+  if (aspectRatio >= 1.5) {
+    label = 'doorway';
+  } else if (aspectRatio >= 0.8 && aspectRatio < 1.5) {
+    label = 'window';
+  }
+
+  const avgConfidence = Math.round(((v1.confidence + v2.confidence) / 2) * 100) / 100;
+
+  return [
+    {
+      id: `bbox-${label}-1`,
+      label,
+      x: Math.round(minX * 100) / 100,
+      y: Math.round(minY * 100) / 100,
+      width,
+      height,
+      confidence: avgConfidence,
+    },
+  ];
+}
+
+/**
+ * Extracts background structural layout (horizon, line classification, vanishing point, openings/bounding boxes).
+ * Executed in Tier 2 spatial layout pipeline under <200ms budget.
+ */
+export function extractSpatialLayout(
+  canvasWidth: number,
+  canvasHeight: number,
+  rawLines?: LineSegment[],
+  options?: { confidenceThreshold?: number }
+): SpatialLayoutResult {
+  const startTime = performance.now();
+  const confidenceThreshold = options?.confidenceThreshold ?? 0.5;
+
+  let inputLines: LineSegment[];
+  const isSynthetic = rawLines === undefined;
+
+  if (isSynthetic) {
+    inputLines = generateSyntheticLines(canvasWidth, canvasHeight);
+  } else {
+    inputLines = rawLines.filter((l) => l.confidence >= confidenceThreshold);
+  }
+
+  // Process & validate line types/metrics
+  const lines: LineSegment[] = inputLines.map((l) => {
+    const type = l.type ?? classifyLineType(l.angleDeg);
+    return {
+      ...l,
+      type,
+    };
+  });
+
+  // Identify primary horizon line
+  const horizonLines = lines
+    .filter((l) => l.type === 'horizon')
+    .sort((a, b) => b.confidence - a.confidence || b.length - a.length);
+
+  const horizonLine = horizonLines.length > 0 ? horizonLines[0] : undefined;
+
+  // Calculate vanishing point from diagonal line intersections
+  const diagonalLines = lines.filter((l) => l.type === 'diagonal');
+  let vanishingPoint: Point2D | undefined = undefined;
+
+  if (diagonalLines.length >= 2) {
+    const intersections: Point2D[] = [];
+    for (let i = 0; i < diagonalLines.length; i++) {
+      for (let j = i + 1; j < diagonalLines.length; j++) {
+        const pt = computeLineIntersection(diagonalLines[i], diagonalLines[j]);
+        if (pt) {
+          // Keep intersections reasonably near canvas bounds
+          if (
+            pt.x >= -canvasWidth &&
+            pt.x <= canvasWidth * 2 &&
+            pt.y >= -canvasHeight &&
+            pt.y <= canvasHeight * 2
+          ) {
+            intersections.push(pt);
+          }
+        }
+      }
+    }
+
+    if (intersections.length > 0) {
+      const avgX = intersections.reduce((sum, p) => sum + p.x, 0) / intersections.length;
+      const avgY = intersections.reduce((sum, p) => sum + p.y, 0) / intersections.length;
+      vanishingPoint = {
+        x: Math.round(avgX * 100) / 100,
+        y: Math.round(avgY * 100) / 100,
+      };
+    }
+  }
+
+  // Aggregate bounding boxes for structural elements
+  const boundingBoxes = aggregateStructuralBoundingBoxes(lines, canvasWidth, canvasHeight);
+
+  const extractionLatencyMs = Math.round(performance.now() - startTime);
+
+  return {
+    lines,
+    boundingBoxes,
+    horizonLine,
+    vanishingPoint,
+    extractionLatencyMs,
+  };
+}
diff --git a/src/utils/__tests__/spatialLayoutExtractor.test.ts b/src/utils/__tests__/spatialLayoutExtractor.test.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/__tests__/spatialLayoutExtractor.test.ts
@@ +1,81 @@
+import { extractSpatialLayout, generateSyntheticLines, computeLineIntersection } from '../spatialLayoutExtractor';
+import { LineSegment, SpatialLayoutResult } from '../../types/vision';
+
+function assert(condition: boolean, message: string) {
+  if (!condition) {
+    throw new Error(`Assertion Failed: ${message}`);
+  }
+}
+
+function runTests() {
+  console.log('Running spatialLayoutExtractor tests...');
+
+  // Test 1: Synthetic Default Generation
+  const syntheticResult = extractSpatialLayout(640, 480);
+  assert(syntheticResult !== null, 'syntheticResult should not be null');
+  assert(Array.isArray(syntheticResult.lines), 'syntheticResult.lines should be an array');
+  assert(syntheticResult.lines.length > 0, 'syntheticResult.lines should contain default lines');
+  assert(syntheticResult.extractionLatencyMs < 200, `Latency budget exceeded: ${syntheticResult.extractionLatencyMs}ms`);
+  console.log('  ✓ Test 1: Synthetic Default Generation passed');
+
+  // Test 2: Line Type Classification & Confidence Filtering
+  const inputLines: LineSegment[] = [
+    // Horizon line (angle ~0 deg)
+    { start: { x: 0, y: 240 }, end: { x: 640, y: 240 }, angleDeg: 0, length: 640, confidence: 0.9, type: 'horizon' },
+    // Vertical line (angle ~90 deg)
+    { start: { x: 100, y: 50 }, end: { x: 100, y: 400 }, angleDeg: 90, length: 350, confidence: 0.85, type: 'vertical' },
+    // Diagonal line 1
+    { start: { x: 0, y: 0 }, end: { x: 320, y: 240 }, angleDeg: 36.87, length: 400, confidence: 0.88, type: 'diagonal' },
+    // Diagonal line 2
+    { start: { x: 640, y: 0 }, end: { x: 320, y: 240 }, angleDeg: 143.13, length: 400, confidence: 0.82, type: 'diagonal' },
+    // Low confidence line (should be filtered out)
+    { start: { x: 50, y: 50 }, end: { x: 80, y: 80 }, angleDeg: 45, length: 42, confidence: 0.3, type: 'diagonal' },
+  ];
+
+  const result = extractSpatialLayout(640, 480, inputLines);
+  assert(result.lines.length === 4, `Expected 4 lines after filtering low confidence, got ${result.lines.length}`);
+  assert(result.horizonLine !== undefined, 'Horizon line should be identified');
+  assert(result.horizonLine?.confidence === 0.9, 'Primary horizon line should match input');
+  assert(result.vanishingPoint !== undefined, 'Vanishing point should be calculated from diagonals');
+  assert(Math.abs(result.vanishingPoint!.x - 320) < 1, `Vanishing point x should be ~320, got ${result.vanishingPoint?.x}`);
+  assert(Math.abs(result.vanishingPoint!.y - 240) < 1, `Vanishing point y should be ~240, got ${result.vanishingPoint?.y}`);
+  console.log('  ✓ Test 2: Line Type Classification & Confidence Filtering passed');
+
+  // Test 3: Line Intersection Math Utility
+  const line1: LineSegment = { start: { x: 0, y: 0 }, end: { x: 10, y: 10 }, angleDeg: 45, length: 14.14, confidence: 0.9, type: 'diagonal' };
+  const line2: LineSegment = { start: { x: 0, y: 10 }, end: { x: 10, y: 0 }, angleDeg: -45, length: 14.14, confidence: 0.9, type: 'diagonal' };
+  const intersection = computeLineIntersection(line1, line2);
+  assert(intersection !== undefined, 'Intersection should be found');
+  assert(Math.abs(intersection!.x - 5) < 0.001, `Intersection x expected 5, got ${intersection?.x}`);
+  assert(Math.abs(intersection!.y - 5) < 0.001, `Intersection y expected 5, got ${intersection?.y}`);
+  console.log('  ✓ Test 3: Line Intersection Math Utility passed');
+
+  // Test 4: Bounding Box Aggregation from Enclosed Structure Lines
+  const doorwayLines: LineSegment[] = [
+    { start: { x: 200, y: 100 }, end: { x: 200, y: 400 }, angleDeg: 90, length: 300, confidence: 0.95, type: 'vertical' },
+    { start: { x: 350, y: 100 }, end: { x: 350, y: 400 }, angleDeg: 90, length: 300, confidence: 0.92, type: 'vertical' },
+    { start: { x: 200, y: 100 }, end: { x: 350, y: 100 }, angleDeg: 0, length: 150, confidence: 0.90, type: 'horizon' },
+  ];
+
+  const doorwayResult = extractSpatialLayout(640, 480, doorwayLines);
+  assert(doorwayResult.boundingBoxes.length > 0, 'Should detect at least 1 bounding box for doorway structure');
+  const doorBox = doorwayResult.boundingBoxes[0];
+  assert(doorBox.x === 200, `Expected doorBox.x 200, got ${doorBox.x}`);
+  assert(doorBox.y === 100, `Expected doorBox.y 100, got ${doorBox.y}`);
+  assert(doorBox.width === 150, `Expected doorBox.width 150, got ${doorBox.width}`);
+  assert(doorBox.height === 300, `Expected doorBox.height 300, got ${doorBox.height}`);
+  console.log('  ✓ Test 4: Bounding Box Aggregation passed');
+
+  // Test 5: Empty Input Handling
+  const emptyResult = extractSpatialLayout(640, 480, []);
+  assert(emptyResult.lines.length === 0, 'Empty lines input should return 0 lines');
+  assert(emptyResult.horizonLine === undefined, 'Empty lines input should have no horizonLine');
+  assert(emptyResult.vanishingPoint === undefined, 'Empty lines input should have no vanishingPoint');
+  assert(emptyResult.boundingBoxes.length === 0, 'Empty lines input should have no boundingBoxes');
+  console.log('  ✓ Test 5: Empty Input Handling passed');
+
+  console.log('✅ All spatialLayoutExtractor tests passed successfully!');
+}
+
+runTests();
```
