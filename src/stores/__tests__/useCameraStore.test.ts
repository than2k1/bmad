import { useCameraStore } from '../useCameraStore';
import { KeyframeVisionResult } from '../../types/vision';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runCameraStoreTests() {
  const store = useCameraStore.getState();

  // Test initial state
  assert(store.isFrozen === false, 'isFrozen initial value should be false');
  assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
  assert(store.visionResult === null, 'visionResult initial value should be null');
  assert(store.inferenceLatencyMs === null, 'inferenceLatencyMs initial value should be null');
  assert(store.selectedFraming === 'half_body', 'selectedFraming default value should be half_body');
  assert(store.selectedPoseId === null, 'selectedPoseId default value should be null');

  // Test framing crop updates
  store.setSelectedFraming('headshot');
  assert(useCameraStore.getState().selectedFraming === 'headshot', 'setSelectedFraming(headshot) failed');
  store.setSelectedFraming('full_body');
  assert(useCameraStore.getState().selectedFraming === 'full_body', 'setSelectedFraming(full_body) failed');
  store.setSelectedFraming('half_body');

  // Test active pose selection
  store.setSelectedPoseId('half-body-solo-arms-crossed');
  assert(useCameraStore.getState().selectedPoseId === 'half-body-solo-arms-crossed', 'setSelectedPoseId failed');

  // Changing framing should reset selectedPoseId to null
  store.setSelectedFraming('headshot');
  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedFraming should reset selectedPoseId to null');

  store.setSelectedPoseId(null);
  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedPoseId(null) failed');

  // Test mode switching does not corrupt framing state
  store.setSelectedFraming('headshot');
  store.setMode('scene');
  assert(useCameraStore.getState().selectedFraming === 'headshot', 'selectedFraming should persist across mode switches');
  store.setMode('person');

  // Test setIsAnalyzing
  store.setIsAnalyzing(true);
  assert(useCameraStore.getState().isAnalyzing === true, 'setIsAnalyzing(true) failed');
  store.setIsAnalyzing(false);
  assert(useCameraStore.getState().isAnalyzing === false, 'setIsAnalyzing(false) failed');

  // Test visionResult and inferenceLatencyMs setters
  const dummyResult: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'architecture',
    subjects: [{
      keypoints: {
        nose: { x: 0.5, y: 0.2 },
        left_eye: { x: 0.48, y: 0.18 },
        right_eye: { x: 0.52, y: 0.18 },
        left_shoulder: { x: 0.4, y: 0.35 },
        right_shoulder: { x: 0.6, y: 0.35 },
        left_elbow: { x: 0.35, y: 0.5 },
        right_elbow: { x: 0.65, y: 0.5 },
        left_wrist: { x: 0.3, y: 0.65 },
        right_wrist: { x: 0.7, y: 0.65 },
        left_hip: { x: 0.42, y: 0.6 },
        right_hip: { x: 0.58, y: 0.6 },
        left_knee: { x: 0.43, y: 0.75 },
        right_knee: { x: 0.57, y: 0.75 },
        left_ankle: { x: 0.44, y: 0.9 },
        right_ankle: { x: 0.56, y: 0.9 },
      },
      boundingBox: { x: 0.3, y: 0.15, width: 0.4, height: 0.8 },
      confidence: 0.94,
    }],
    confidenceScore: 0.94,
  };

  store.setVisionResult(dummyResult, 64);
  let state = useCameraStore.getState();
  assert(state.visionResult !== null, 'setVisionResult failed to set visionResult');
  assert(state.inferenceLatencyMs === 64, 'setVisionResult failed to set inferenceLatencyMs');

  // Test clearVisionResult
  store.clearVisionResult();
  state = useCameraStore.getState();
  assert(state.visionResult === null, 'clearVisionResult failed to reset visionResult');
  assert(state.inferenceLatencyMs === null, 'clearVisionResult failed to reset inferenceLatencyMs');

  // Test toggleFreeze - freeze state transition
  store.toggleFreeze();
  state = useCameraStore.getState();
  assert(state.isFrozen === true, 'toggleFreeze() should set isFrozen to true when false');
  assert(state.isAnalyzing === true, 'toggleFreeze() should set isAnalyzing to true when freezing');

  // Set vision result while frozen
  store.setVisionResult(dummyResult, 55);

  // Test toggleFreeze - unfreeze state transition automatically clears visionResult
  store.toggleFreeze();
  state = useCameraStore.getState();
  assert(state.isFrozen === false, 'toggleFreeze() should set isFrozen to false when true');
  assert(state.isAnalyzing === false, 'toggleFreeze() should set isAnalyzing to false when un-freezing');
  assert(state.visionResult === null, 'un-freezing via toggleFreeze() must clear visionResult');
  assert(state.inferenceLatencyMs === null, 'un-freezing via toggleFreeze() must clear inferenceLatencyMs');

  // Test setIsFrozen directly with un-freeze clearing
  store.setIsFrozen(true);
  store.setVisionResult(dummyResult, 42);
  store.setIsFrozen(false);
  state = useCameraStore.getState();
  assert(state.isFrozen === false, 'setIsFrozen(false) failed');
  assert(state.visionResult === null, 'setIsFrozen(false) must clear visionResult');
  assert(state.inferenceLatencyMs === null, 'setIsFrozen(false) must clear inferenceLatencyMs');

  console.log('All useCameraStore unit tests passed successfully!');
}

if (typeof require !== 'undefined' && require.main === module) {
  runCameraStoreTests();
} else if (typeof process !== 'undefined' && process.argv[1]?.includes('useCameraStore.test')) {
  runCameraStoreTests();
}
