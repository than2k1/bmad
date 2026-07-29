import { analyzeKeyframe } from '../visionInferencingEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function runVisionEngineTests() {
  const start = performance.now();
  const outcome = await analyzeKeyframe();
  const totalTestDuration = performance.now() - start;

  // 1. Latency Validation (<200ms requirement per NFR-1.1)
  assert(
    outcome.latencyMs < 200,
    `Keyframe inferencing latency (${outcome.latencyMs}ms) exceeded 200ms threshold`
  );
  assert(
    totalTestDuration < 300,
    `Total inferencing duration (${totalTestDuration}ms) exceeded acceptable test limit`
  );

  // 2. Schema Validation (COCO-17 Keypoints, Bounding Box, Subject Count, Scene Type)
  const { result } = outcome;
  assert(result.subjectCount === 'solo' || result.subjectCount === 'couple' || result.subjectCount === 'group', 'Invalid subjectCount');
  assert(result.sceneType === 'landscape' || result.sceneType === 'architecture' || result.sceneType === 'food' || result.sceneType === 'interior' || result.sceneType === 'sunset', 'Invalid sceneType');
  assert(result.keypoints !== null, 'Keypoints output should not be null');
  
  if (result.keypoints) {
    assert(typeof result.keypoints.nose.x === 'number', 'Missing nose keypoint x coordinate');
    assert(typeof result.keypoints.nose.y === 'number', 'Missing nose keypoint y coordinate');
    assert(typeof result.keypoints.left_shoulder.x === 'number', 'Missing left_shoulder keypoint');
    assert(typeof result.keypoints.right_shoulder.x === 'number', 'Missing right_shoulder keypoint');
    assert(typeof result.keypoints.left_hip.x === 'number', 'Missing left_hip keypoint');
    assert(typeof result.keypoints.right_ankle.x === 'number', 'Missing right_ankle keypoint');
  }

  assert(result.boundingBox !== null, 'Bounding box output should not be null');
  if (result.boundingBox) {
    assert(result.boundingBox.width > 0 && result.boundingBox.height > 0, 'Bounding box dimensions must be positive');
  }

  assert(result.confidenceScore > 0.5, 'Confidence score should be > 0.5');

  console.log(`All visionInferencingEngine unit tests passed successfully! (Latency: ${outcome.latencyMs}ms)`);
}

if (typeof require !== 'undefined' && require.main === module) {
  runVisionEngineTests().catch((err) => {
    console.error('Vision engine test failed:', err);
    process.exit(1);
  });
} else if (typeof process !== 'undefined' && process.argv[1]?.includes('visionInferencingEngine.test')) {
  runVisionEngineTests().catch((err) => {
    console.error('Vision engine test failed:', err);
    process.exit(1);
  });
}
