import { analyzeKeyframe, preprocessImageToTensor, calculateFrameLuminance, parseYOLOv8PoseTensor, preloadVisionModel, ImageFrameInput } from '../visionInferencingEngine';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export async function runVisionEngineTests() {
  // 1. Test Model Pre-loading and Warmup
  await preloadVisionModel();

  const start = performance.now();

  // 2. Test Static Image Frame Preprocessing & Tensor Creation
  const mockImage: ImageFrameInput = {
    data: new Uint8Array(640 * 640 * 3).fill(128),
    width: 640,
    height: 640,
    channels: 3,
  };

  const tensor = preprocessImageToTensor(mockImage, 640, 640);
  assert(tensor.length === 1 * 3 * 640 * 640, `Tensor length should be 1228800, got ${tensor.length}`);
  assert(Math.abs(tensor[0] - 0.5019) < 0.01, 'Tensor RGB normalization should map 128 to ~0.5019');

  // Test luminance calculation on dark, bright, and mid-gray frames
  const darkFrame: ImageFrameInput = { data: new Uint8Array(100 * 100 * 3).fill(0), width: 100, height: 100, channels: 3 };
  const brightFrame: ImageFrameInput = { data: new Uint8Array(100 * 100 * 3).fill(255), width: 100, height: 100, channels: 3 };
  assert(calculateFrameLuminance(darkFrame) === 0, 'Black frame luminance should be 0.0');
  assert(calculateFrameLuminance(brightFrame) === 1, 'White frame luminance should be 1.0');
  assert(Math.abs(calculateFrameLuminance(mockImage) - 0.502) < 0.01, 'Mid-gray frame luminance should be ~0.502');

  // 3. Test YOLOv8-Pose Tensor Parsing
  const synthOutput = new Float32Array(56 * 8400);
  synthOutput[0 * 8400 + 0] = 320; // cx
  synthOutput[1 * 8400 + 0] = 320; // cy
  synthOutput[2 * 8400 + 0] = 200; // w
  synthOutput[3 * 8400 + 0] = 400; // h
  synthOutput[4 * 8400 + 0] = 0.92; // conf
  synthOutput[5 * 8400 + 0] = 320; // nose x
  synthOutput[6 * 8400 + 0] = 140; // nose y
  synthOutput[7 * 8400 + 0] = 0.98; // nose conf

  const parsed = parseYOLOv8PoseTensor(synthOutput, 8400, 640, 640, 0.4);
  assert(parsed !== null, 'Tensor parsing should return valid object');
  assert(Math.abs(parsed!.confidence - 0.92) < 0.01, 'Confidence score should match tensor anchor');
  assert(parsed!.keypoints.nose.x === 0.5, 'Nose x coordinate should be normalized to 0.5 (320/640)');

  // 4. Test Cached Session Keyframe Inferencing Pipeline Execution
  const outcome = await analyzeKeyframe(mockImage);
  const totalTestDuration = performance.now() - start;

  assert(
    outcome.latencyMs < 200,
    `Cached keyframe inferencing latency (${outcome.latencyMs}ms) exceeded 200ms threshold`
  );

  const { result } = outcome;
  assert(result.subjectCount === 'solo' || result.subjectCount === 'couple' || result.subjectCount === 'group', 'Invalid subjectCount');
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
  assert(typeof result.lightingConfidence === 'number', 'lightingConfidence should be populated');
  assert(result.lightingConfidence! >= 0 && result.lightingConfidence! <= 1, 'lightingConfidence should be in [0, 1]');


  console.log(`✅ All visionInferencingEngine unit tests passed successfully! (Cached Latency: ${outcome.latencyMs}ms)`);
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
