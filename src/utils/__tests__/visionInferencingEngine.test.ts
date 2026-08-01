import {
  analyzeKeyframe,
  preprocessImageToTensor,
  calculateFrameLuminance,
  parseYOLOv8PoseTensor,
  preloadVisionModel,
  getPrimarySubject,
  ImageFrameInput,
} from '../visionInferencingEngine';
import { KeyframeVisionResult, SubjectDetection, COCO17Keypoints } from '../../types/vision';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

const STUB_KEYPOINTS: COCO17Keypoints = {
  nose: { x: 0.5, y: 0.2 },
  left_eye: { x: 0.48, y: 0.18 },
  right_eye: { x: 0.52, y: 0.18 },
  left_ear: { x: 0.46, y: 0.2 },
  right_ear: { x: 0.54, y: 0.2 },
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
};

/**
 * Helper: populate an anchor slot in a [1, 56, 8400] YOLOv8-Pose tensor with a synthetic detection.
 * Anchor layout per row (numAnchors entries per row):
 *   row 0..3: bbox [cx, cy, w, h]   row 4: confidence   rows 5..55: 17 keypoints (x, y, conf)
 */
function setAnchor(
  tensor: Float32Array,
  anchorIdx: number,
  numAnchors: number,
  bbox: [number, number, number, number],
  conf: number,
  keypointGrid?: [number, number]
) {
  tensor[0 * numAnchors + anchorIdx] = bbox[0];
  tensor[1 * numAnchors + anchorIdx] = bbox[1];
  tensor[2 * numAnchors + anchorIdx] = bbox[2];
  tensor[3 * numAnchors + anchorIdx] = bbox[3];
  tensor[4 * numAnchors + anchorIdx] = conf;

  // If a keypoint grid offset is provided, place 17 keypoints around the bbox center
  if (keypointGrid) {
    const [kpX, kpY] = keypointGrid;
    for (let i = 0; i < 17; i++) {
      tensor[(5 + i * 3) * numAnchors + anchorIdx] = kpX;
      tensor[(5 + i * 3 + 1) * numAnchors + anchorIdx] = kpY;
      tensor[(5 + i * 3 + 2) * numAnchors + anchorIdx] = 0.9;
    }
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

  // 3. Test YOLOv8-Pose Tensor Parsing (single anchor preserved from prior test)
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
  assert(Array.isArray(parsed), 'Parser should return an array of SubjectDetection');
  assert(parsed.length === 1, `Single-anchor tensor should yield 1 subject, got ${parsed.length}`);
  assert(Math.abs(parsed[0].confidence - 0.92) < 0.01, 'Confidence score should match tensor anchor');
  assert(parsed[0].keypoints.nose.x === 0.5, 'Nose x coordinate should be normalized to 0.5 (320/640)');

  // 4. Test Multi-Subject Extraction (two non-overlapping anchors → two subjects)
  {
    const multiTensor = new Float32Array(56 * 8400);
    // Anchor 0: left subject at cx=160, cy=320, w=120, h=300
    setAnchor(multiTensor, 0, 8400, [160, 320, 120, 300], 0.9, [160, 320]);
    // Anchor 100: right subject at cx=480, cy=320, w=120, h=300 (no overlap with anchor 0)
    setAnchor(multiTensor, 100, 8400, [480, 320, 120, 300], 0.85, [480, 320]);

    const multiParsed = parseYOLOv8PoseTensor(multiTensor, 8400, 640, 640, 0.4);
    assert(multiParsed.length === 2, `Two non-overlapping anchors should yield 2 subjects, got ${multiParsed.length}`);
    // Sorted by confidence descending — anchor 0 (0.9) first
    assert(Math.abs(multiParsed[0].confidence - 0.9) < 0.01, 'First subject should be highest confidence');
    assert(Math.abs(multiParsed[1].confidence - 0.85) < 0.01, 'Second subject should be next-highest');
  }

  // 5. Test NMS Deduplication (two highly-overlapping anchors → one subject)
  {
    const overlapTensor = new Float32Array(56 * 8400);
    // Anchor 0: subject at cx=320, cy=320, w=200, h=400
    setAnchor(overlapTensor, 0, 8400, [320, 320, 200, 400], 0.95, [320, 320]);
    // Anchor 1: nearly identical subject at cx=325, cy=322, w=205, h=405 (IoU ≈ 0.94, well above 0.6)
    setAnchor(overlapTensor, 1, 8400, [325, 322, 205, 405], 0.85, [325, 322]);

    const overlapParsed = parseYOLOv8PoseTensor(overlapTensor, 8400, 640, 640, 0.4);
    assert(overlapParsed.length === 1, `Two highly-overlapping anchors should be NMS-suppressed to 1 subject, got ${overlapParsed.length}`);
    assert(Math.abs(overlapParsed[0].confidence - 0.95) < 0.01, 'Surviving subject should be highest-confidence one');
  }

  // 6. Test Max-Subjects Cap (6 non-overlapping anchors → capped at 4)
  {
    const capTensor = new Float32Array(56 * 8400);
    for (let i = 0; i < 6; i++) {
      const cx = 60 + i * 100;
      setAnchor(capTensor, i * 100, 8400, [cx, 320, 80, 200], 0.9 - i * 0.05, [cx, 320]);
    }
    const capParsed = parseYOLOv8PoseTensor(capTensor, 8400, 640, 640, 0.4);
    assert(capParsed.length === 4, `6 anchors should cap at 4 subjects, got ${capParsed.length}`);
    // Verify the 4 highest-confidence subjects survive (not just the count).
    // Confidence sequence was 0.9, 0.85, 0.8, 0.75, 0.7, 0.65 — top 4 expected.
    assert(Math.abs(capParsed[0].confidence - 0.9) < 0.001, `Top subject should be 0.9 conf, got ${capParsed[0].confidence}`);
    assert(Math.abs(capParsed[3].confidence - 0.75) < 0.001, `4th subject should be 0.75 conf (lowest kept), got ${capParsed[3].confidence}`);
  }

  // 7. Test getPrimarySubject helper (including tie-on-confidence + NaN handling)
  {
    assert(getPrimarySubject(null) === null, 'getPrimarySubject(null) should return null');
    const emptyResult: KeyframeVisionResult = {
      timestamp: Date.now(),
      subjectCount: 'solo',
      sceneType: 'architecture',
      subjects: [],
      confidenceScore: 0,
    };
    assert(getPrimarySubject(emptyResult) === null, 'getPrimarySubject on empty subjects should return null');

    const multiResult: KeyframeVisionResult = {
      timestamp: Date.now(),
      subjectCount: 'group',
      sceneType: 'architecture',
      subjects: [
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0, y: 0, width: 0.2, height: 0.4 }, confidence: 0.7 },
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0.5, y: 0, width: 0.3, height: 0.6 }, confidence: 0.92 },
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0.8, y: 0, width: 0.15, height: 0.3 }, confidence: 0.85 },
      ],
      confidenceScore: 0.92,
    };
    const primary = getPrimarySubject(multiResult);
    assert(primary !== null, 'getPrimarySubject should return non-null for non-empty subjects');
    assert(Math.abs(primary!.confidence - 0.92) < 0.001, 'getPrimarySubject should return highest-confidence subject');

    // Tie on confidence: larger bbox area wins
    const tiedResult: KeyframeVisionResult = {
      timestamp: Date.now(),
      subjectCount: 'couple',
      sceneType: 'architecture',
      subjects: [
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0, y: 0, width: 0.2, height: 0.2 }, confidence: 0.9 },     // area 0.04
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0.5, y: 0, width: 0.3, height: 0.3 }, confidence: 0.9 },    // area 0.09 ← winner
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0.1, y: 0.5, width: 0.25, height: 0.25 }, confidence: 0.9 }, // area 0.0625
      ],
      confidenceScore: 0.9,
    };
    const tiedPrimary = getPrimarySubject(tiedResult);
    assert(tiedPrimary !== null, 'tied getPrimarySubject should still return a subject');
    assert(Math.abs(tiedPrimary!.boundingBox.width - 0.3) < 0.001, 'On tied confidence, larger-area bbox should win');

    // NaN confidence on first subject should NOT cause it to win over a valid one
    const nanResult: KeyframeVisionResult = {
      timestamp: Date.now(),
      subjectCount: 'couple',
      sceneType: 'architecture',
      subjects: [
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0, y: 0, width: 0.4, height: 0.4 }, confidence: NaN },
        { keypoints: STUB_KEYPOINTS, boundingBox: { x: 0.5, y: 0, width: 0.2, height: 0.2 }, confidence: 0.5 },
      ],
      confidenceScore: 0.5,
    };
    const nanPrimary = getPrimarySubject(nanResult);
    assert(nanPrimary !== null && Math.abs(nanPrimary!.confidence - 0.5) < 0.001, 'NaN-confidence subject should not win over a valid 0.5-conf one');
  }

  // 7b. Test forced fallback path (all anchors below threshold → single phantom subject)
  {
    const emptyTensor = new Float32Array(56 * 8400); // all zeros — nothing meets threshold
    const fallbackParsed = parseYOLOv8PoseTensor(emptyTensor, 8400, 640, 640, 0.4);
    assert(fallbackParsed.length === 1, `Empty/below-threshold tensor should yield 1 fallback subject, got ${fallbackParsed.length}`);
    assert(Math.abs(fallbackParsed[0].confidence - 0.95) < 0.001, 'Fallback subject should carry forced 0.95 confidence');
    // Bbox defaults should be finite (NaN would propagate to UI as `NaN% MATCH`)
    const fb = fallbackParsed[0].boundingBox;
    assert(Number.isFinite(fb.x) && Number.isFinite(fb.y) && Number.isFinite(fb.width) && Number.isFinite(fb.height), 'Fallback bbox must be fully finite (no NaN propagation)');
    assert(fb.width > 0 && fb.height > 0, 'Fallback bbox should have positive dimensions');
  }

  // 7c. Test input validation guards (degenerate dimensions → safe fallback)
  {
    const guardParsed = parseYOLOv8PoseTensor(new Float32Array(0), 0, 0, 0, 0.4);
    assert(guardParsed.length === 1, 'numAnchors<=0 / imgWidth<=0 should return safe fallback, not crash');
    assert(Math.abs(guardParsed[0].confidence - 0.95) < 0.001, 'Guard fallback should carry 0.95 confidence');
    // maxSubjects=0 should still yield >=1 (producer contract floor)
    const capFloor = parseYOLOv8PoseTensor(new Float32Array(56 * 8400), 8400, 640, 640, 0.4, 0.6, 0);
    assert(capFloor.length >= 1, 'maxSubjects=0 should floor to 1 (producer contract)');
  }

  // 7d. Test NMS boundary — two subjects with low overlap (IoU < 0.6) should both survive
  {
    const distinctTensor = new Float32Array(56 * 8400);
    // Two people side-by-side: cx=160 vs cx=480, w=120 each — IoU = 0
    setAnchor(distinctTensor, 0, 8400, [160, 320, 120, 300], 0.9, [160, 320]);
    setAnchor(distinctTensor, 100, 8400, [480, 320, 120, 300], 0.85, [480, 320]);
    const distinctParsed = parseYOLOv8PoseTensor(distinctTensor, 8400, 640, 640, 0.4);
    assert(distinctParsed.length === 2, `Two non-overlapping subjects (IoU=0) should both survive at threshold 0.6, got ${distinctParsed.length}`);
  }

  // 8. Test Cached Session Keyframe Inferencing Pipeline Execution
  const outcome = await analyzeKeyframe(mockImage);
  const totalTestDuration = performance.now() - start;

  assert(
    outcome.latencyMs < 200,
    `Cached keyframe inferencing latency (${outcome.latencyMs}ms) exceeded 200ms threshold`
  );

  const { result } = outcome;
  assert(result.subjectCount === 'solo' || result.subjectCount === 'couple' || result.subjectCount === 'group', 'Invalid subjectCount');
  assert(Array.isArray(result.subjects), 'result.subjects should be an array');
  assert(result.subjects.length > 0, 'Synthetic fallback path should produce at least 1 subject');

  const primaryKps = result.subjects[0].keypoints;
  assert(typeof primaryKps.nose.x === 'number', 'Missing nose keypoint x coordinate');
  assert(typeof primaryKps.nose.y === 'number', 'Missing nose keypoint y coordinate');
  assert(typeof primaryKps.left_shoulder.x === 'number', 'Missing left_shoulder keypoint');
  assert(typeof primaryKps.right_shoulder.x === 'number', 'Missing right_shoulder keypoint');
  assert(typeof primaryKps.left_hip.x === 'number', 'Missing left_hip keypoint');
  assert(typeof primaryKps.right_ankle.x === 'number', 'Missing right_ankle keypoint');

  const primaryBbox = result.subjects[0].boundingBox;
  assert(primaryBbox.width > 0 && primaryBbox.height > 0, 'Bounding box dimensions must be positive');

  assert(result.confidenceScore > 0.5, 'Confidence score should be > 0.5');
  assert(typeof result.lightingConfidence === 'number', 'lightingConfidence should be populated');
  assert(result.lightingConfidence! >= 0 && result.lightingConfidence! <= 1, 'lightingConfidence should be in [0, 1]');


  console.log(`✅ All visionInferencingEngine unit tests passed successfully! (Cached Latency: ${outcome.latencyMs}ms, total test duration: ${totalTestDuration.toFixed(1)}ms)`);
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
