import { comparePoseToTemplate, PoseComparisonResult } from '../directorCueEngine';
import { COCO17Keypoints, SubjectBoundingBox } from '../../types/vision';
import { PoseTemplate } from '../../types/pose';
import { POSE_CATALOG } from '../../data/poseCatalog';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running directorCueEngine unit tests...');

const classicHeadshot = POSE_CATALOG.find((p) => p.id === 'headshot-solo-classic')!;
const armsCrossed = POSE_CATALOG.find((p) => p.id === 'half-body-solo-arms-crossed')!;

// Test 1: Null/undefined handling
{
  const result1 = comparePoseToTemplate(null, classicHeadshot);
  assert(result1.alignmentScore === 0, 'Null detected keypoints should return 0 score');
  assert(result1.cueText.length > 0, 'Should return fallback cue text for null keypoints');

  const result2 = comparePoseToTemplate({} as COCO17Keypoints, null);
  assert(result2.alignmentScore === 0, 'Null template should return 0 score');
}

// Test 2: Perfect match calculation (100%)
{
  // Construct detected keypoints matching classicHeadshot exactly
  // Template keypoints:
  // nose: [0.5, 0.35], left_eye: [0.46, 0.32], right_eye: [0.54, 0.32], left_shoulder: [0.35, 0.65], right_shoulder: [0.65, 0.65], left_hip: [0.4, 0.95], right_hip: [0.6, 0.95]
  const bbox: SubjectBoundingBox = { x: 100, y: 100, width: 200, height: 400 };

  const perfectDetected: COCO17Keypoints = {
    nose: { x: 100 + 0.5 * 200, y: 100 + 0.35 * 400 },
    left_eye: { x: 100 + 0.46 * 200, y: 100 + 0.32 * 400 },
    right_eye: { x: 100 + 0.54 * 200, y: 100 + 0.32 * 400 },
    left_shoulder: { x: 100 + 0.35 * 200, y: 100 + 0.65 * 400 },
    right_shoulder: { x: 100 + 0.65 * 200, y: 100 + 0.65 * 400 },
    left_elbow: { x: 100 + 0.3 * 200, y: 100 + 0.8 * 400 },
    right_elbow: { x: 100 + 0.7 * 200, y: 100 + 0.8 * 400 },
    left_wrist: { x: 100 + 0.25 * 200, y: 100 + 0.9 * 400 },
    right_wrist: { x: 100 + 0.75 * 200, y: 100 + 0.9 * 400 },
    left_hip: { x: 100 + 0.4 * 200, y: 100 + 0.95 * 400 },
    right_hip: { x: 100 + 0.6 * 200, y: 100 + 0.95 * 400 },
    left_knee: { x: 100 + 0.4 * 200, y: 100 + 0.98 * 400 },
    right_knee: { x: 100 + 0.6 * 200, y: 100 + 0.98 * 400 },
    left_ankle: { x: 100 + 0.4 * 200, y: 100 + 1.0 * 400 },
    right_ankle: { x: 100 + 0.6 * 200, y: 100 + 1.0 * 400 },
  };

  const result = comparePoseToTemplate(perfectDetected, classicHeadshot, bbox);
  assert(result.alignmentScore >= 98, `Perfect match score should be ~100%, got ${result.alignmentScore}`);
  assert(result.cueText.includes('Matched') || result.cueText.includes('Perfect'), `Cue text should signal match, got: ${result.cueText}`);
}

// Test 3: High match (>= 80%) threshold GREEN badge check
{
  const bbox: SubjectBoundingBox = { x: 0, y: 0, width: 100, height: 100 };
  // Slightly perturbed keypoints (close to template)
  const highMatchDetected: COCO17Keypoints = {
    nose: { x: 51, y: 35 },
    left_eye: { x: 46, y: 32 },
    right_eye: { x: 54, y: 32 },
    left_shoulder: { x: 36, y: 66 },
    right_shoulder: { x: 64, y: 65 },
    left_elbow: { x: 30, y: 80 },
    right_elbow: { x: 70, y: 80 },
    left_wrist: { x: 25, y: 90 },
    right_wrist: { x: 75, y: 90 },
    left_hip: { x: 40, y: 95 },
    right_hip: { x: 60, y: 95 },
    left_knee: { x: 40, y: 98 },
    right_knee: { x: 60, y: 98 },
    left_ankle: { x: 40, y: 100 },
    right_ankle: { x: 60, y: 100 },
  };

  const result = comparePoseToTemplate(highMatchDetected, classicHeadshot, bbox);
  assert(result.alignmentScore >= 80, `High match score should be >= 80%, got ${result.alignmentScore}`);
}

// Test 4: Shoulder misalignment cue generation
{
  const bbox: SubjectBoundingBox = { x: 0, y: 0, width: 100, height: 100 };
  // Right shoulder significantly shifted up/tilted
  const shoulderMisaligned: COCO17Keypoints = {
    nose: { x: 50, y: 35 },
    left_eye: { x: 46, y: 32 },
    right_eye: { x: 54, y: 32 },
    left_shoulder: { x: 35, y: 78 }, // way down
    right_shoulder: { x: 65, y: 50 }, // way up
    left_elbow: { x: 30, y: 80 },
    right_elbow: { x: 70, y: 80 },
    left_wrist: { x: 25, y: 90 },
    right_wrist: { x: 75, y: 90 },
    left_hip: { x: 40, y: 95 },
    right_hip: { x: 60, y: 95 },
    left_knee: { x: 40, y: 98 },
    right_knee: { x: 60, y: 98 },
    left_ankle: { x: 40, y: 100 },
    right_ankle: { x: 60, y: 100 },
  };

  const result = comparePoseToTemplate(shoulderMisaligned, classicHeadshot, bbox);
  assert(result.alignmentScore < 80, `Shoulder misaligned score should be < 80%, got ${result.alignmentScore}`);
  assert(result.cueText.toLowerCase().includes('shoulder'), `Cue should mention shoulder, got: ${result.cueText}`);
}

// Test 5: Arm misalignment cue generation
{
  const bbox: SubjectBoundingBox = { x: 0, y: 0, width: 100, height: 100 };
  // Arms crossed template expects arms crossed around y=0.52-0.54
  // Detected has left arm raised high above head (y=0.1)
  const armMisaligned: COCO17Keypoints = {
    nose: { x: 50, y: 22 },
    left_eye: { x: 47, y: 19 },
    right_eye: { x: 53, y: 19 },
    left_shoulder: { x: 36, y: 38 },
    right_shoulder: { x: 64, y: 38 },
    left_elbow: { x: 20, y: 20 }, // arm raised high
    right_elbow: { x: 58, y: 52 },
    left_wrist: { x: 15, y: 10 }, // wrist up high
    right_wrist: { x: 44, y: 54 },
    left_hip: { x: 42, y: 78 },
    right_hip: { x: 58, y: 78 },
    left_knee: { x: 42, y: 90 },
    right_knee: { x: 58, y: 90 },
    left_ankle: { x: 42, y: 100 },
    right_ankle: { x: 58, y: 100 },
  };

  const result = comparePoseToTemplate(armMisaligned, armsCrossed, bbox);
  assert(result.cueText.toLowerCase().includes('arm'), `Cue should mention arm, got: ${result.cueText}`);
}

// Test 6: Missing keypoints in headshot template (no knees/ankles) safely handled
{
  const headshotNoLegs = POSE_CATALOG.find((p) => p.framing === 'headshot')!;
  const detectedNoLegs: COCO17Keypoints = {
    nose: { x: 50, y: 35 },
    left_eye: { x: 46, y: 32 },
    right_eye: { x: 54, y: 32 },
    left_shoulder: { x: 35, y: 65 },
    right_shoulder: { x: 65, y: 65 },
    left_elbow: { x: 30, y: 80 },
    right_elbow: { x: 70, y: 80 },
    left_wrist: { x: 25, y: 90 },
    right_wrist: { x: 75, y: 90 },
    left_hip: { x: 40, y: 95 },
    right_hip: { x: 60, y: 95 },
    left_knee: { x: 0, y: 0 },
    right_knee: { x: 0, y: 0 },
    left_ankle: { x: 0, y: 0 },
    right_ankle: { x: 0, y: 0 },
  };

  const result = comparePoseToTemplate(detectedNoLegs, headshotNoLegs, { x: 0, y: 0, width: 100, height: 100 });
  assert(!isNaN(result.alignmentScore), 'Alignment score should not be NaN');
  assert(result.alignmentScore >= 90, `Headshot alignment score should ignore unmapped legs, got ${result.alignmentScore}`);
}

console.log('All directorCueEngine unit tests passed successfully!');
