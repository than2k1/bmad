import { useCameraStore } from '../../../stores/useCameraStore';
import { comparePoseToTemplate } from '../../../utils/directorCueEngine';
import { getPrimarySubject } from '../../../utils/visionInferencingEngine';
import { POSE_CATALOG } from '../../../data/poseCatalog';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

/**
 * Pure state evaluation logic matching DirectorCueOverlay rendering conditions.
 */
function evaluateDirectorCueState(state: ReturnType<typeof useCameraStore.getState>) {
  const { mode, isFrozen, selectedPoseId, visionResult } = state;
  const primarySubject = visionResult ? getPrimarySubject(visionResult) : null;

  if (mode !== 'person' || !isFrozen || !selectedPoseId || !primarySubject) {
    return null;
  }

  const activeTemplate = POSE_CATALOG.find((p) => p.id === selectedPoseId);
  if (!activeTemplate) {
    return null;
  }

  return comparePoseToTemplate(
    primarySubject.keypoints,
    activeTemplate,
    primarySubject.boundingBox
  );
}

console.log('Running DirectorCueOverlay state unit tests...');

// Reset camera store state
useCameraStore.setState({
  mode: 'person',
  isFrozen: false,
  selectedPoseId: null,
  visionResult: null,
});

// Test 1: Returns null when conditions are not met
{
  const eval1 = evaluateDirectorCueState(useCameraStore.getState());
  assert(eval1 === null, 'Should return null when isFrozen is false or selectedPoseId is null');

  useCameraStore.setState({ isFrozen: true, selectedPoseId: 'headshot-solo-classic', visionResult: null });
  const eval2 = evaluateDirectorCueState(useCameraStore.getState());
  assert(eval2 === null, 'Should return null when visionResult is null');
}

// Test 2: Renders evaluation when frozen, pose selected, and visionResult available
{
  useCameraStore.setState({
    mode: 'person',
    isFrozen: true,
    selectedPoseId: 'headshot-solo-classic',
    visionResult: {
      timestamp: Date.now(),
      subjectCount: 'solo',
      sceneType: 'landscape',
      confidenceScore: 0.95,
      subjects: [{
        boundingBox: { x: 10, y: 10, width: 100, height: 100 },
        confidence: 0.95,
        keypoints: {
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
          left_knee: { x: 40, y: 98 },
          right_knee: { x: 60, y: 98 },
          left_ankle: { x: 40, y: 100 },
          right_ankle: { x: 60, y: 100 },
        },
      }],
    },
  });

  const evalResult = evaluateDirectorCueState(useCameraStore.getState());
  assert(evalResult !== null, 'Should compute comparison when keyframe is frozen and visionResult is present');
  assert(typeof evalResult?.alignmentScore === 'number', 'Should return numeric alignment score');
  assert(typeof evalResult?.cueText === 'string', 'Should return actionable cue text');
}

console.log('DirectorCueOverlay unit tests passed!');
