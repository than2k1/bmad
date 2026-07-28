import { useCameraStore } from '../useCameraStore';

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

  // Test setIsAnalyzing
  store.setIsAnalyzing(true);
  assert(useCameraStore.getState().isAnalyzing === true, 'setIsAnalyzing(true) failed');
  store.setIsAnalyzing(false);
  assert(useCameraStore.getState().isAnalyzing === false, 'setIsAnalyzing(false) failed');

  // Test toggleFreeze - freeze state transition
  store.toggleFreeze();
  let state = useCameraStore.getState();
  assert(state.isFrozen === true, 'toggleFreeze() should set isFrozen to true when false');
  assert(state.isAnalyzing === true, 'toggleFreeze() should set isAnalyzing to true when freezing');

  // Test toggleFreeze - unfreeze state transition
  store.toggleFreeze();
  state = useCameraStore.getState();
  assert(state.isFrozen === false, 'toggleFreeze() should set isFrozen to false when true');
  assert(state.isAnalyzing === false, 'toggleFreeze() should set isAnalyzing to false when un-freezing');

  // Test setIsFrozen directly
  store.setIsFrozen(true);
  assert(useCameraStore.getState().isFrozen === true, 'setIsFrozen(true) failed');
  store.setIsFrozen(false);
  assert(useCameraStore.getState().isFrozen === false, 'setIsFrozen(false) failed');

  console.log('All useCameraStore unit tests passed successfully!');
}

if (typeof require !== 'undefined' && require.main === module) {
  runCameraStoreTests();
} else if (typeof process !== 'undefined' && process.argv[1]?.includes('useCameraStore.test')) {
  runCameraStoreTests();
}
