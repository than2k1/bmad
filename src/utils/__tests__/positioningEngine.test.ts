import {
  calculateDistanceGuidance,
  calculateHeightAndTiltGuidance,
  evaluateCameraPositioning,
  PositioningEvaluation,
} from '../positioningEngine';
import { SubjectBoundingBox, KeyframeVisionResult, COCO17Keypoints } from '../../types/vision';
import { FramingCrop } from '../../types/pose';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running positioningEngine unit tests...');

// Test 1: Null / Undefined Bounding Box Fallback
{
  const distRes = calculateDistanceGuidance(null, 'half_body');
  assert(distRes.directive === 'optimal', 'Null bbox should fallback to optimal distance');
  assert(distRes.badgeText === 'Distance Good', 'Null bbox should return Distance Good badge text');

  const heightTiltRes = calculateHeightAndTiltGuidance(null, null, 0, 'half_body');
  assert(heightTiltRes.heightDirective === 'optimal', 'Null bbox should fallback to optimal height');
  assert(heightTiltRes.tiltDirective === 'level', '0 degree pitch should return level tilt');

  const evalRes = evaluateCameraPositioning(null, 'half_body');
  assert(evalRes.isAllOptimal === true, 'Null vision result should default to all optimal fallback');
}

// Test 2: Distance Guidance Calculations for headshot, half_body, full_body
{
  // Headshot target height ratio ~ 0.55
  // Subject bbox too large (height ratio 0.80) => Step back
  const largeBbox: SubjectBoundingBox = { x: 100, y: 50, width: 300, height: 800 }; // 800 / 1000 = 0.80
  const distBack = calculateDistanceGuidance(largeBbox, 'headshot', 1000);
  assert(distBack.directive === 'step_back', `Expected step_back, got ${distBack.directive}`);
  assert(distBack.badgeText.includes('Step back'), `Expected 'Step back' in badgeText, got '${distBack.badgeText}'`);
  assert(distBack.metersOffset > 0, 'Meters offset should be > 0');

  // Subject bbox too small (height ratio 0.25) => Step closer
  const smallBbox: SubjectBoundingBox = { x: 100, y: 200, width: 100, height: 250 }; // 250 / 1000 = 0.25
  const distCloser = calculateDistanceGuidance(smallBbox, 'headshot', 1000);
  assert(distCloser.directive === 'step_closer', `Expected step_closer, got ${distCloser.directive}`);
  assert(distCloser.badgeText.includes('Step closer'), `Expected 'Step closer' in badgeText, got '${distCloser.badgeText}'`);
  assert(distCloser.metersOffset > 0, 'Meters offset should be > 0');

  // Subject bbox matching target (height ratio 0.55) => Optimal / Distance Good
  const perfectHeadshotBbox: SubjectBoundingBox = { x: 100, y: 100, width: 250, height: 550 };
  const distOptimal = calculateDistanceGuidance(perfectHeadshotBbox, 'headshot', 1000);
  assert(distOptimal.directive === 'optimal', `Expected optimal, got ${distOptimal.directive}`);
  assert(distOptimal.badgeText === 'Distance Good', `Expected 'Distance Good', got '${distOptimal.badgeText}'`);

  // Full Body target ratio ~ 0.75
  const fullBodyBbox: SubjectBoundingBox = { x: 100, y: 100, width: 300, height: 750 };
  const distFullOptimal = calculateDistanceGuidance(fullBodyBbox, 'full_body', 1000);
  assert(distFullOptimal.directive === 'optimal', `Expected full_body optimal, got ${distFullOptimal.directive}`);
}

// Test 3: Height Guidance Directives
{
  // Camera placed too low => Subject center Y is high up in frame => Lower camera directive
  const highSubjectBbox: SubjectBoundingBox = { x: 100, y: 20, width: 200, height: 400 }; // Center Y = 220 / 1000 = 0.22
  const heightResLow = calculateHeightAndTiltGuidance(highSubjectBbox, null, 0, 'half_body', 1000);
  assert(heightResLow.heightDirective === 'lower_camera', `Expected lower_camera, got ${heightResLow.heightDirective}`);
  assert(heightResLow.heightBadgeText.includes('Lower camera'), `Expected 'Lower camera', got '${heightResLow.heightBadgeText}'`);

  // Camera placed too high => Subject center Y is low down in frame => Raise camera directive
  const lowSubjectBbox: SubjectBoundingBox = { x: 100, y: 550, width: 200, height: 400 }; // Center Y = 750 / 1000 = 0.75
  const heightResHigh = calculateHeightAndTiltGuidance(lowSubjectBbox, null, 0, 'half_body', 1000);
  assert(heightResHigh.heightDirective === 'raise_camera', `Expected raise_camera, got ${heightResHigh.heightDirective}`);
  assert(heightResHigh.heightBadgeText.includes('Raise camera'), `Expected 'Raise camera', got '${heightResHigh.heightBadgeText}'`);

  // Optimal height
  const centeredSubjectBbox: SubjectBoundingBox = { x: 100, y: 250, width: 200, height: 400 }; // Center Y = 450 / 1000 = 0.45
  const heightResOptimal = calculateHeightAndTiltGuidance(centeredSubjectBbox, null, 0, 'half_body', 1000);
  assert(heightResOptimal.heightDirective === 'optimal', `Expected optimal height, got ${heightResOptimal.heightDirective}`);
}

// Test 4: Pitch / Tilt Guidance Directives
{
  const bbox: SubjectBoundingBox = { x: 100, y: 250, width: 200, height: 400 };

  // Pitch = -8 deg (camera pointing down) => Tilt camera up 8°
  const tiltUpRes = calculateHeightAndTiltGuidance(bbox, null, -8, 'half_body', 1000);
  assert(tiltUpRes.tiltDirective === 'tilt_up', `Expected tilt_up, got ${tiltUpRes.tiltDirective}`);
  assert(tiltUpRes.tiltBadgeText.includes('Tilt camera up 8°'), `Expected 'Tilt camera up 8°', got '${tiltUpRes.tiltBadgeText}'`);

  // Pitch = +6 deg (camera pointing up) => Tilt camera down 6°
  const tiltDownRes = calculateHeightAndTiltGuidance(bbox, null, 6, 'half_body', 1000);
  assert(tiltDownRes.tiltDirective === 'tilt_down', `Expected tilt_down, got ${tiltDownRes.tiltDirective}`);
  assert(tiltDownRes.tiltBadgeText.includes('Tilt camera down 6°'), `Expected 'Tilt camera down 6°', got '${tiltDownRes.tiltBadgeText}'`);

  // Pitch = 1.5 deg (within ±2 deg threshold) => Tilt Level Good / level
  const tiltLevelRes = calculateHeightAndTiltGuidance(bbox, null, 1.5, 'half_body', 1000);
  assert(tiltLevelRes.tiltDirective === 'level', `Expected level tilt, got ${tiltLevelRes.tiltDirective}`);
  assert(tiltLevelRes.tiltBadgeText === 'Tilt Level Good', `Expected 'Tilt Level Good', got '${tiltLevelRes.tiltBadgeText}'`);
}

// Test 5: Full Evaluation Integration
{
  const visionResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    keypoints: null,
    boundingBox: { x: 100, y: 125, width: 250, height: 550 },
    confidenceScore: 0.95,
  };

  const evaluation = evaluateCameraPositioning(visionResult, 'headshot', 0, 1000);
  assert(evaluation.distance.directive === 'optimal', 'Distance should be optimal');
  assert(evaluation.heightAndTilt.heightDirective === 'optimal', 'Height should be optimal');
  assert(evaluation.heightAndTilt.tiltDirective === 'level', 'Tilt should be level');
  assert(evaluation.isAllOptimal === true, 'isAllOptimal should be true when all parameters optimal');
}

console.log('All positioningEngine unit tests passed successfully!');
