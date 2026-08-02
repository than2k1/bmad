import { extractSpatialLayout, generateSyntheticLines, computeLineIntersection } from '../spatialLayoutExtractor';
import { LineSegment, SpatialLayoutResult } from '../../types/vision';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion Failed: ${message}`);
  }
}

function runTests() {
  console.log('Running spatialLayoutExtractor tests...');

  // Test 1: Synthetic Default Generation
  const syntheticResult = extractSpatialLayout(640, 480);
  assert(syntheticResult !== null, 'syntheticResult should not be null');
  assert(Array.isArray(syntheticResult.lines), 'syntheticResult.lines should be an array');
  assert(syntheticResult.lines.length > 0, 'syntheticResult.lines should contain default lines');
  assert(syntheticResult.extractionLatencyMs < 200, `Latency budget exceeded: ${syntheticResult.extractionLatencyMs}ms`);
  console.log('  ✓ Test 1: Synthetic Default Generation passed');

  // Test 2: Line Type Classification & Confidence Filtering
  const inputLines: LineSegment[] = [
    // Horizon line (angle ~0 deg)
    { start: { x: 0, y: 240 }, end: { x: 640, y: 240 }, angleDeg: 0, length: 640, confidence: 0.9, type: 'horizon' },
    // Vertical line (angle ~90 deg)
    { start: { x: 100, y: 50 }, end: { x: 100, y: 400 }, angleDeg: 90, length: 350, confidence: 0.85, type: 'vertical' },
    // Diagonal line 1
    { start: { x: 0, y: 0 }, end: { x: 320, y: 240 }, angleDeg: 36.87, length: 400, confidence: 0.88, type: 'diagonal' },
    // Diagonal line 2
    { start: { x: 640, y: 0 }, end: { x: 320, y: 240 }, angleDeg: 143.13, length: 400, confidence: 0.82, type: 'diagonal' },
    // Low confidence line (should be filtered out)
    { start: { x: 50, y: 50 }, end: { x: 80, y: 80 }, angleDeg: 45, length: 42, confidence: 0.3, type: 'diagonal' },
  ];

  const result = extractSpatialLayout(640, 480, inputLines);
  assert(result.lines.length === 4, `Expected 4 lines after filtering low confidence, got ${result.lines.length}`);
  assert(result.horizonLine !== undefined, 'Horizon line should be identified');
  assert(result.horizonLine?.confidence === 0.9, 'Primary horizon line should match input');
  assert(result.vanishingPoint !== undefined, 'Vanishing point should be calculated from diagonals');
  assert(Math.abs(result.vanishingPoint!.x - 320) < 1, `Vanishing point x should be ~320, got ${result.vanishingPoint?.x}`);
  assert(Math.abs(result.vanishingPoint!.y - 240) < 1, `Vanishing point y should be ~240, got ${result.vanishingPoint?.y}`);
  console.log('  ✓ Test 2: Line Type Classification & Confidence Filtering passed');

  // Test 3: Line Intersection Math Utility
  const line1: LineSegment = { start: { x: 0, y: 0 }, end: { x: 10, y: 10 }, angleDeg: 45, length: 14.14, confidence: 0.9, type: 'diagonal' };
  const line2: LineSegment = { start: { x: 0, y: 10 }, end: { x: 10, y: 0 }, angleDeg: -45, length: 14.14, confidence: 0.9, type: 'diagonal' };
  const intersection = computeLineIntersection(line1, line2);
  assert(intersection !== undefined, 'Intersection should be found');
  assert(Math.abs(intersection!.x - 5) < 0.001, `Intersection x expected 5, got ${intersection?.x}`);
  assert(Math.abs(intersection!.y - 5) < 0.001, `Intersection y expected 5, got ${intersection?.y}`);
  console.log('  ✓ Test 3: Line Intersection Math Utility passed');

  // Test 4: Bounding Box Aggregation from Enclosed Structure Lines
  const doorwayLines: LineSegment[] = [
    { start: { x: 200, y: 100 }, end: { x: 200, y: 400 }, angleDeg: 90, length: 300, confidence: 0.95, type: 'vertical' },
    { start: { x: 350, y: 100 }, end: { x: 350, y: 400 }, angleDeg: 90, length: 300, confidence: 0.92, type: 'vertical' },
    { start: { x: 200, y: 100 }, end: { x: 350, y: 100 }, angleDeg: 0, length: 150, confidence: 0.90, type: 'horizon' },
  ];

  const doorwayResult = extractSpatialLayout(640, 480, doorwayLines);
  assert(doorwayResult.boundingBoxes.length > 0, 'Should detect at least 1 bounding box for doorway structure');
  const doorBox = doorwayResult.boundingBoxes[0];
  assert(doorBox.x === 200, `Expected doorBox.x 200, got ${doorBox.x}`);
  assert(doorBox.y === 100, `Expected doorBox.y 100, got ${doorBox.y}`);
  assert(doorBox.width === 150, `Expected doorBox.width 150, got ${doorBox.width}`);
  assert(doorBox.height === 300, `Expected doorBox.height 300, got ${doorBox.height}`);
  console.log('  ✓ Test 4: Bounding Box Aggregation passed');

  // Test 5: Empty Input Handling
  const emptyResult = extractSpatialLayout(640, 480, []);
  assert(emptyResult.lines.length === 0, 'Empty lines input should return 0 lines');
  assert(emptyResult.horizonLine === undefined, 'Empty lines input should have no horizonLine');
  assert(emptyResult.vanishingPoint === undefined, 'Empty lines input should have no vanishingPoint');
  assert(emptyResult.boundingBoxes.length === 0, 'Empty lines input should have no boundingBoxes');
  console.log('  ✓ Test 5: Empty Input Handling passed');

  console.log('✅ All spatialLayoutExtractor tests passed successfully!');
}

runTests();
