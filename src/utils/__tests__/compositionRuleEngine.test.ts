function assert(condition: boolean, message?: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message || 'Condition failed'}`);
  }
}

import {
  evaluateSymmetry,
  evaluateLeadingLines,
  evaluateFrameInFrame,
  evaluateRuleOfThirds,
  evaluateCompositionRules,
} from '../compositionRuleEngine';
import { SpatialLayoutResult, SubjectDetection } from '../../types/vision';

function createMockSpatialLayout(): SpatialLayoutResult {
  return {
    lines: [
      {
        start: { x: 100, y: 100 },
        end: { x: 100, y: 500 },
        angleDeg: 90,
        length: 400,
        confidence: 0.9,
        type: 'vertical',
      },
      {
        start: { x: 500, y: 100 },
        end: { x: 500, y: 500 },
        angleDeg: 90,
        length: 400,
        confidence: 0.9,
        type: 'vertical',
      },
      {
        start: { x: 0, y: 0 },
        end: { x: 300, y: 300 },
        angleDeg: 45,
        length: 424,
        confidence: 0.85,
        type: 'diagonal',
      },
      {
        start: { x: 600, y: 0 },
        end: { x: 300, y: 300 },
        angleDeg: 135,
        length: 424,
        confidence: 0.85,
        type: 'diagonal',
      },
    ],
    boundingBoxes: [
      {
        id: 'bbox-doorway-1',
        label: 'doorway',
        x: 150,
        y: 100,
        width: 300,
        height: 450,
        confidence: 0.9,
      },
    ],
    horizonLine: {
      start: { x: 0, y: 300 },
      end: { x: 600, y: 300 },
      angleDeg: 0,
      length: 600,
      confidence: 0.95,
      type: 'horizon',
    },
    vanishingPoint: { x: 300, y: 300 },
    extractionLatencyMs: 2,
  };
}

function createMockSubject(x: number, y: number, width: number, height: number): SubjectDetection {
  const fallback = { x: x + width / 2, y: y + height * 0.2, confidence: 0.9 };
  return {
    boundingBox: { x, y, width, height },
    confidence: 0.9,
    keypoints: {
      nose: fallback,
      left_eye: fallback,
      right_eye: fallback,
      left_shoulder: fallback,
      right_shoulder: fallback,
      left_elbow: fallback,
      right_elbow: fallback,
      left_wrist: fallback,
      right_wrist: fallback,
      left_hip: fallback,
      right_hip: fallback,
      left_knee: fallback,
      right_knee: fallback,
      left_ankle: fallback,
      right_ankle: fallback,
    },
  };
}

function testModePriorities() {
  console.log('Testing Mode Priorities...');
  const layout = createMockSpatialLayout();
  const W = 600;
  const H = 600;
  // Subject centered inside doorway (150-450) -> x=200/600, y=150/600, width=200/600, height=300/600
  const subjects = [createMockSubject(200 / W, 150 / H, 200 / W, 300 / H)];

  // Scene mode: Symmetry (Priority 1) should be evaluated first
  const sceneRes = evaluateCompositionRules('scene', layout, subjects, W, H);
  assert(sceneRes.activeRule === 'symmetry_centering', `Expected symmetry_centering for scene, got ${sceneRes.activeRule}`);

  // Person mode: Frame-in-Frame (Priority 1) should be evaluated first
  const personRes = evaluateCompositionRules('person', layout, subjects, W, H);
  assert(personRes.activeRule === 'frame_in_frame', `Expected frame_in_frame for person, got ${personRes.activeRule}`);

  console.log('✓ Mode Priorities test passed');
}

function testThresholdsAndFallback() {
  console.log('Testing Thresholds and Fallbacks...');
  const W = 600;
  const H = 600;

  // Empty layout & subjects -> Fallback to rule_of_thirds
  const emptyRes = evaluateCompositionRules('scene', undefined, [], W, H);
  assert(emptyRes.activeRule === 'rule_of_thirds', `Expected rule_of_thirds fallback, got ${emptyRes.activeRule}`);

  // Satisfied threshold check (>= 85%)
  const layout = createMockSpatialLayout(); // perfectly centered VP and symmetry (300, 300)
  const perfectRes = evaluateCompositionRules('scene', layout, [], W, H);
  assert(perfectRes.score >= 85, `Expected score >= 85, got ${perfectRes.score}`);
  assert(perfectRes.isSatisfied === true, 'Expected isSatisfied to be true for score >= 85');

  console.log('✓ Thresholds and Fallbacks test passed');
}

function testDirectionalCues() {
  console.log('Testing Directional Cues...');
  const W = 600;
  const H = 600;

  // Off-center subject to the right
  const offCenterSubjects = [createMockSubject(400 / W, 200 / H, 150 / W, 300 / H)];
  const layout: SpatialLayoutResult = {
    lines: [],
    boundingBoxes: [],
    extractionLatencyMs: 1,
  };

  const res = evaluateCompositionRules('person', layout, offCenterSubjects, W, H);
  assert(res.activeRule === 'rule_of_thirds');
  assert(res.directionalCue.pan !== undefined);
  assert(res.directionalCue.tilt !== undefined);
  assert(res.directionalCue.distance !== undefined);
  assert(typeof res.textCue === 'string' && res.textCue.length > 0);

  console.log('✓ Directional Cues test passed');
}

function testPerformanceBudget() {
  console.log('Testing Performance Budget (<15ms)...');
  const layout = createMockSpatialLayout();
  const W = 600;
  const H = 600;
  const subjects = [createMockSubject(200 / W, 150 / H, 200 / W, 300 / H)];

  const start = performance.now();
  for (let i = 0; i < 100; i++) {
    evaluateCompositionRules('person', layout, subjects, W, H);
  }
  const avgDuration = (performance.now() - start) / 100;
  assert(avgDuration < 15, `Expected execution < 15ms, took ${avgDuration.toFixed(2)}ms`);

  console.log(`✓ Performance Budget test passed (${avgDuration.toFixed(3)}ms avg)`);
}

function runAllTests() {
  console.log('Running compositionRuleEngine unit tests...');
  testModePriorities();
  testThresholdsAndFallback();
  testDirectionalCues();
  testPerformanceBudget();
  console.log('All compositionRuleEngine unit tests passed successfully!');
}

runAllTests();
