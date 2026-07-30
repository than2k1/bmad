import {
  normalizeKeypointsToCanvas,
  getSkeletonConnectionLines,
  clampPoseTransform,
} from '../poseRenderer';
import { PoseKeypointsMap } from '../../types/pose';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runPoseRendererTests() {
  const sampleKeypoints: PoseKeypointsMap = {
    nose: [0.5, 0.2],
    left_shoulder: [0.3, 0.4],
    right_shoulder: [0.7, 0.4],
    left_elbow: [0.2, 0.6],
    left_hip: [0.4, 0.8],
    right_hip: [0.6, 0.8],
  };

  const canvasWidth = 400;
  const canvasHeight = 800;

  // Test 1: normalizeKeypointsToCanvas maps coordinates accurately
  const mapped = normalizeKeypointsToCanvas(sampleKeypoints, canvasWidth, canvasHeight);
  assert(mapped.nose.x === 200 && mapped.nose.y === 160, 'nose should map to (200, 160)');
  assert(mapped.left_shoulder.x === 120 && mapped.left_shoulder.y === 320, 'left_shoulder should map to (120, 320)');
  assert(mapped.right_shoulder.x === 280 && mapped.right_shoulder.y === 320, 'right_shoulder should map to (280, 320)');
  assert(mapped.left_elbow.x === 80 && mapped.left_elbow.y === 480, 'left_elbow should map to (80, 480)');

  // Test 2: normalizeKeypointsToCanvas handles missing optional keypoints safely
  const partialKeypoints: PoseKeypointsMap = {
    nose: [0.5, 0.2],
    left_shoulder: [0.3, 0.4],
    right_shoulder: [0.7, 0.4],
    left_hip: [0.4, 0.8],
    right_hip: [0.6, 0.8],
  };
  const partialMapped = normalizeKeypointsToCanvas(partialKeypoints, canvasWidth, canvasHeight);
  assert(partialMapped.left_elbow === undefined, 'missing left_elbow should be undefined');

  // Test 3: getSkeletonConnectionLines generates valid lines
  const connections: [string, string][] = [
    ['left_shoulder', 'right_shoulder'],
    ['left_shoulder', 'left_elbow'],
  ];
  const lines = getSkeletonConnectionLines(sampleKeypoints, connections, canvasWidth, canvasHeight);
  assert(lines.length === 2, 'Should generate 2 connection lines');
  assert(lines[0].id === 'left_shoulder-right_shoulder', 'First line id match');
  assert(lines[0].x1 === 120 && lines[0].y1 === 320 && lines[0].x2 === 280 && lines[0].y2 === 320, 'Line 1 coordinates match');
  assert(lines[1].id === 'left_shoulder-left_elbow', 'Second line id match');

  // Test 4: getSkeletonConnectionLines skips connections with missing keypoints
  const incompleteConnections: [string, string][] = [
    ['left_shoulder', 'right_shoulder'],
    ['left_elbow', 'left_wrist'], // left_wrist missing
  ];
  const filteredLines = getSkeletonConnectionLines(sampleKeypoints, incompleteConnections, canvasWidth, canvasHeight);
  assert(filteredLines.length === 1, 'Should skip incomplete connection line');

  // Test 5: clampPoseTransform scale and translation bounds
  const tooSmall = clampPoseTransform({ translateX: 0, translateY: 0, scale: 0.2 }, canvasWidth, canvasHeight);
  assert(tooSmall.scale === 0.5, 'Min scale should clamp to 0.5');

  const tooLarge = clampPoseTransform({ translateX: 0, translateY: 0, scale: 5.0 }, canvasWidth, canvasHeight);
  assert(tooLarge.scale === 3.0, 'Max scale should clamp to 3.0');

  const overflowTrans = clampPoseTransform({ translateX: 1000, translateY: -1000, scale: 1.0 }, canvasWidth, canvasHeight);
  assert(overflowTrans.translateX === canvasWidth * 0.75, 'TranslateX should clamp to max margin');
  assert(overflowTrans.translateY === -canvasHeight * 0.75, 'TranslateY should clamp to min margin');

  console.log('All poseRenderer unit tests passed successfully!');
}

if (typeof require !== 'undefined' && require.main === module) {
  runPoseRendererTests();
} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseRenderer.test')) {
  runPoseRendererTests();
}
