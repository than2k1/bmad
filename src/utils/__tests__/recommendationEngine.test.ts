import {
  evaluateLensRecommendation,
  evaluateExposureGuidance,
  evaluateRecommendations,
} from '../recommendationEngine';
import { KeyframeVisionResult, COCO17Keypoints } from '../../types/vision';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

const STUB_KEYPOINTS: COCO17Keypoints = {
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
};

console.log('Running recommendationEngine unit tests...');

// Test 1: Null / Undefined Fallbacks
{
  const lensRes = evaluateLensRecommendation(null, 'full_body', '1x');
  assert(lensRes.recommendedLens === null, 'Null visionResult with standard framing should return null recommendedLens');
  assert(lensRes.lensReason === null, 'Null visionResult should return null lensReason');

  // Explicit headshot framing even with null visionResult should still suggest 3x on 1x/0.5x lens
  const headshotLensRes = evaluateLensRecommendation(null, 'headshot', '1x');
  assert(headshotLensRes.recommendedLens === '3x', 'Headshot framing should recommend 3x lens');
  assert(headshotLensRes.lensReason !== null, 'Headshot framing should provide reason');

  const expRes = evaluateExposureGuidance(null);
  assert(expRes === null, 'Null visionResult should return null exposure guidance');

  const fullEval = evaluateRecommendations(null, 'full_body', '1x');
  assert(fullEval.recommendedLens === null, 'Full body null visionResult should return null recommendedLens');
  assert(fullEval.exposureGuidance === null, 'Null visionResult should return null exposureGuidance');
}

// Test 2: Lens Recommendation Logic
{
  // Portrait crop (half_body) on 1x lens => recommend 3x
  const halfBodyRes = evaluateLensRecommendation(null, 'half_body', '1x');
  assert(halfBodyRes.recommendedLens === '3x', 'half_body framing on 1x lens should recommend 3x');
  assert(
    halfBodyRes.lensReason === 'Prevents facial distortion for portrait crops',
    `Expected distortion reason, got '${halfBodyRes.lensReason}'`
  );

  // Already on 3x lens => no recommendation needed
  const active3xRes = evaluateLensRecommendation(null, 'headshot', '3x');
  assert(active3xRes.recommendedLens === null, 'Already active 3x lens should not recommend 3x');

  // Full body framing but subject height ratio > 0.35 (e.g. 450px out of 1000px viewport) => recommend 3x
  const largeSubjectVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [{
      keypoints: STUB_KEYPOINTS,
      boundingBox: { x: 100, y: 100, width: 300, height: 450 }, // 450/1000 = 0.45 > 0.35
      confidence: 0.9,
    }],
    confidenceScore: 0.9,
  };
  const largeSubjectRes = evaluateLensRecommendation(largeSubjectVision, 'full_body', '1x', 1000);
  assert(largeSubjectRes.recommendedLens === '3x', 'Subject height ratio > 0.35 should recommend 3x lens');

  // Full body framing with small subject height ratio (200px / 1000px = 0.20 <= 0.35) => no 3x recommendation
  const smallSubjectVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [{
      keypoints: STUB_KEYPOINTS,
      boundingBox: { x: 100, y: 100, width: 200, height: 200 }, // 200/1000 = 0.20
      confidence: 0.9,
    }],
    confidenceScore: 0.9,
  };
  const smallSubjectRes = evaluateLensRecommendation(smallSubjectVision, 'full_body', '1x', 1000);
  assert(smallSubjectRes.recommendedLens === null, 'Full body with small subject ratio should not recommend 3x');
}

// Test 3: Exposure Guidance Logic
{
  // Backlit scene (sunset sceneType)
  const sunsetVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'sunset',
    subjects: [],
    confidenceScore: 0.95,
  };
  const sunsetExp = evaluateExposureGuidance(sunsetVision);
  assert(
    sunsetExp === '+0.7 EV (Backlit Scene Detected)',
    `Expected backlit alert via sceneType, got '${sunsetExp}'`
  );

  // Backlit scene via bounding box position: subject y=100 out of 1000px viewport = 10% from top < 30% threshold
  const positionalBacklitVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [{
      keypoints: STUB_KEYPOINTS,
      boundingBox: { x: 100, y: 100, width: 200, height: 300 }, // y/1000 = 0.10 < 0.30 → backlit
      confidence: 0.9,
    }],
    confidenceScore: 0.9,
    lightingConfidence: 0.9,
  };
  const positionalBacklitExp = evaluateExposureGuidance(positionalBacklitVision, 1000);
  assert(
    positionalBacklitExp === '+0.7 EV (Backlit Scene Detected)',
    `Expected backlit alert via bounding box position, got '${positionalBacklitExp}'`
  );

  // NOT backlit by position: subject y=400 out of 1000px = 40% from top > 30% threshold
  const notBacklitByPositionVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [{
      keypoints: STUB_KEYPOINTS,
      boundingBox: { x: 100, y: 400, width: 200, height: 300 }, // y/1000 = 0.40 >= 0.30 → not backlit
      confidence: 0.9,
    }],
    confidenceScore: 0.9,
    lightingConfidence: 0.9,
  };
  const notBacklitExp = evaluateExposureGuidance(notBacklitByPositionVision, 1000);
  assert(notBacklitExp === null, `Subject in mid-frame should not trigger backlit alert, got '${notBacklitExp}'`);

  // Interior low light scene
  const interiorVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'interior',
    subjects: [],
    confidenceScore: 0.85,
  };
  const interiorExp = evaluateExposureGuidance(interiorVision);
  assert(
    interiorExp === 'Low Light - Hold Camera Steady',
    `Expected low light interior alert, got '${interiorExp}'`
  );

  // Low lightingConfidence (dedicated field) triggers low-light alert — high confidenceScore must NOT suppress it
  const lowLightConfidenceVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [],
    confidenceScore: 0.9, // high vision confidence — should NOT be used for lighting
    lightingConfidence: 0.4, // low lighting quality — should trigger alert
  };
  const lowLightExp = evaluateExposureGuidance(lowLightConfidenceVision);
  assert(
    lowLightExp === 'Low Light Detected',
    `Expected low light alert via lightingConfidence, got '${lowLightExp}'`
  );

  // Low confidence fallback: no lightingConfidence field — falls back to confidenceScore
  const lowConfFallbackVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [],
    confidenceScore: 0.4,
  };
  const lowConfFallbackExp = evaluateExposureGuidance(lowConfFallbackVision);
  assert(
    lowConfFallbackExp === 'Low Light Detected',
    `Expected low light detected via confidenceScore fallback, got '${lowConfFallbackExp}'`
  );

  // Good lighting: high lightingConfidence and good sceneType
  const goodLightingVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'landscape',
    subjects: [],
    confidenceScore: 0.95,
    lightingConfidence: 0.95,
  };
  const goodLightingExp = evaluateExposureGuidance(goodLightingVision);
  assert(goodLightingExp === null, 'Good lighting landscape should return null exposure guidance');
}

// Test 4: Unified Guidance Schema
{
  const sunsetHeadshotVision: KeyframeVisionResult = {
    timestamp: Date.now(),
    subjectCount: 'solo',
    sceneType: 'sunset',
    subjects: [{
      keypoints: STUB_KEYPOINTS,
      boundingBox: { x: 100, y: 100, width: 300, height: 500 },
      confidence: 0.9,
    }],
    confidenceScore: 0.9,
  };

  const evalResult = evaluateRecommendations(sunsetHeadshotVision, 'headshot', '1x', 1000);
  assert(evalResult.recommendedLens === '3x', 'Unified evaluation should include recommendedLens 3x');
  assert(
    evalResult.lensReason === 'Prevents facial distortion for portrait crops',
    'Unified evaluation should include lensReason'
  );
  assert(
    evalResult.exposureGuidance === '+0.7 EV (Backlit Scene Detected)',
    'Unified evaluation should include exposureGuidance'
  );
}

console.log('All recommendationEngine unit tests passed successfully!');
