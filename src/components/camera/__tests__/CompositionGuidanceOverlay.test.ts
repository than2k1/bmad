import { useCameraStore } from '../../../stores/useCameraStore';
import {
  getDirectionalBadges,
  evaluateGuidanceOverlayState,
} from '../../../utils/compositionGuidanceEngine';
import { CompositionRuleResult } from '../../../types/composition';
import { KeyframeVisionResult } from '../../../types/vision';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

console.log('Running CompositionGuidanceOverlay unit tests...');

// Reset store state
useCameraStore.setState({
  mode: 'scene',
  isFrozen: false,
  visionResult: null,
});

// Test 1: getDirectionalBadges helper outputs correct visual arrow strings
{
  const badges1 = getDirectionalBadges({ pan: 'left', tilt: 'up', distance: 'step_closer' });
  assert(badges1.includes('PAN LEFT ◄'), 'Should format pan left arrow');
  assert(badges1.includes('TILT UP ▲'), 'Should format tilt up arrow');
  assert(badges1.includes('STEP CLOSER'), 'Should format step closer instruction');

  const badges2 = getDirectionalBadges({ pan: 'right', tilt: 'down', distance: 'step_back' });
  assert(badges2.includes('PAN RIGHT ►'), 'Should format pan right arrow');
  assert(badges2.includes('TILT DOWN ▼'), 'Should format tilt down arrow');
  assert(badges2.includes('STEP BACK'), 'Should format step back instruction');

  const badgesOptimal = getDirectionalBadges({ pan: 'centered', tilt: 'level', distance: 'perfect' });
  assert(badgesOptimal.length === 0, 'Should have empty directional badges when alignment is centered/level/perfect');
}

// Test 2: evaluateGuidanceOverlayState returns null when unfrozen or visionResult/compositionResult is missing
{
  const eval1 = evaluateGuidanceOverlayState({ isFrozen: false, visionResult: null });
  assert(eval1 === null, 'Should return null when isFrozen is false');

  const eval2 = evaluateGuidanceOverlayState({
    isFrozen: true,
    visionResult: {
      timestamp: Date.now(),
      subjectCount: 'solo',
      sceneType: 'landscape',
      confidenceScore: 0.9,
      subjects: [],
    },
  });
  assert(eval2 === null, 'Should return null when compositionResult is missing');
}

// Test 3: Evaluates satisfied composition (score >= 85%) with GREEN badge & text
{
  const mockCompositionResult: CompositionRuleResult = {
    activeRule: 'symmetry_centering',
    score: 92,
    isSatisfied: true,
    directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
    guideLines: [{ start: { x: 50, y: 0 }, end: { x: 50, y: 100 } }],
    textCue: 'Perfect symmetry achieved!',
  };

  const mockVisionResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    confidenceScore: 0.95,
    subjects: [],
    compositionResult: mockCompositionResult,
  };

  const state = evaluateGuidanceOverlayState({ isFrozen: true, visionResult: mockVisionResult });
  assert(state !== null, 'Should evaluate non-null state when frozen with compositionResult');
  if (!state) throw new Error('State is null');
  assert(state.isSatisfied === true, 'Should reflect satisfied boolean');
  assert(state.statusColor === '#30D158', 'Should use GREEN (#30D158) status color for satisfied composition');
  assert(state.statusText === 'COMPOSITION SATISFIED (85%+)', 'Should return success status text');
  assert(state.activeRule === 'symmetry_centering', 'Should return activeRule symmetry_centering');
  assert(state.guideLines.length === 1, 'Should preserve guideLines array');
}

// Test 4: Evaluates active alignment in progress (score < 85%) with CYAN/AMBER status color
{
  const mockCompositionResult: CompositionRuleResult = {
    activeRule: 'leading_lines',
    score: 75,
    isSatisfied: false,
    directionalCue: { pan: 'left', tilt: 'level', distance: 'perfect' },
    guideLines: [{ start: { x: 0, y: 100 }, end: { x: 50, y: 50 } }],
    textCue: 'Pan left to align perspective leading lines',
  };

  const mockVisionResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'architecture',
    confidenceScore: 0.9,
    subjects: [],
    spatialLayout: {
      lines: [],
      boundingBoxes: [],
      vanishingPoint: { x: 50, y: 50 },
      extractionLatencyMs: 8,
    },
    compositionResult: mockCompositionResult,
  };

  const state = evaluateGuidanceOverlayState({ isFrozen: true, visionResult: mockVisionResult });
  assert(state !== null, 'Should evaluate state');
  if (!state) throw new Error('State is null');
  assert(state.isSatisfied === false, 'Should be unsatisfied');
  assert(state.statusColor === '#00E5FF', 'Should use CYAN (#00E5FF) status color when 70 <= score < 85');
  assert(state.statusText === 'ALIGNMENT IN PROGRESS', 'Should return ALIGNMENT IN PROGRESS status text');
  assert(state.directionalBadges.includes('PAN LEFT ◄'), 'Should include directional badge PAN LEFT');
  assert(state.spatialLayout?.vanishingPoint?.x === 50, 'Should include spatialLayout vanishing point');
}

// Test 5: Evaluates low score (<70%) with AMBER status color
{
  const mockCompositionResult: CompositionRuleResult = {
    activeRule: 'rule_of_thirds',
    score: 55,
    isSatisfied: false,
    directionalCue: { pan: 'right', tilt: 'up', distance: 'step_closer' },
    guideLines: [],
    textCue: 'Align subject with grid power points',
  };

  const mockVisionResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    confidenceScore: 0.8,
    subjects: [],
    compositionResult: mockCompositionResult,
  };

  const state = evaluateGuidanceOverlayState({ isFrozen: true, visionResult: mockVisionResult });
  assert(state !== null, 'Should evaluate state');
  if (!state) throw new Error('State is null');
  assert(state.statusColor === '#FFD60A', 'Should use AMBER (#FFD60A) status color when score < 70');
  assert(state.directionalBadges.length === 3, 'Should format 3 directional badges for pan right, tilt up, step closer');
}

// Test 6: Evaluates frame_in_frame rule with background structural bounding boxes
{
  const mockCompositionResult: CompositionRuleResult = {
    activeRule: 'frame_in_frame',
    score: 88,
    isSatisfied: true,
    directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
    guideLines: [],
    textCue: 'Subject framed within doorway',
  };

  const mockVisionResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'architecture',
    confidenceScore: 0.95,
    subjects: [],
    spatialLayout: {
      lines: [],
      boundingBoxes: [
        { id: 'box-1', label: 'doorway', x: 20, y: 10, width: 60, height: 80, confidence: 0.9 },
      ],
      extractionLatencyMs: 10,
    },
    compositionResult: mockCompositionResult,
  };

  const state = evaluateGuidanceOverlayState({ isFrozen: true, visionResult: mockVisionResult });
  assert(state !== null, 'Should evaluate state');
  if (!state) throw new Error('State is null');
  assert(state.activeRule === 'frame_in_frame', 'Should match frame_in_frame active rule');
  assert(state.spatialLayout?.boundingBoxes.length === 1, 'Should include structural bounding boxes');
}

console.log('CompositionGuidanceOverlay unit tests passed!');
