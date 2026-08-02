import { KeyframeVisionResult } from '../types/vision';
import { FramingCrop } from '../types/pose';
import { LensPreset } from '../types/camera';
import { getPrimarySubject } from './visionInferencingEngine';

export interface LensRecommendationResult {
  recommendedLens: LensPreset | null;
  lensReason: string | null;
}

export interface GuidanceOutput {
  recommendedLens: LensPreset | null;
  lensReason: string | null;
  exposureGuidance: string | null;
}

/**
 * Evaluates camera keyframe vision result and active lens state to determine
 * whether a 3x telephoto/portrait lens is recommended to avoid facial distortion.
 */
export function evaluateLensRecommendation(
  visionResult: KeyframeVisionResult | null,
  selectedFraming: FramingCrop,
  activeLens: LensPreset,
  viewportHeight: number = 1000
): LensRecommendationResult {
  if (activeLens === '3x') {
    return { recommendedLens: null, lensReason: null };
  }

  const isPortraitCrop = selectedFraming === 'headshot' || selectedFraming === 'half_body';
  const primaryBbox = getPrimarySubject(visionResult)?.boundingBox ?? null;
  const heightRatio =
    primaryBbox != null && viewportHeight > 0
      ? primaryBbox.height <= 1.0
        ? primaryBbox.height
        : primaryBbox.height / viewportHeight
      : 0;
  const hasSubstantialSubjectHeight = heightRatio > 0.35;

  if (isPortraitCrop || hasSubstantialSubjectHeight) {
    return {
      recommendedLens: '3x',
      lensReason: 'Prevents facial distortion for portrait crops',
    };
  }

  return { recommendedLens: null, lensReason: null };
}

/**
 * Evaluates scene illumination and keyframe confidence to offer high-contrast
 * EV adjustment and lighting guidance tips.
 *
 * Backlight detection uses two signals (compound OR):
 *  1. sceneType === 'sunset' — explicit scene classification
 *  2. backlightRatio: subject bounding box top-edge is in the upper 30% of the
 *     frame, indicating a bright sky/light source behind the subject.
 *
 * Low-light detection uses `lightingConfidence` (a dedicated lighting quality
 * metric [0–1]) when available, falling back to `confidenceScore` otherwise.
 */
export function evaluateExposureGuidance(
  visionResult: KeyframeVisionResult | null,
  viewportHeight: number = 1000
): string | null {
  if (!visionResult) {
    return null;
  }

  // Backlight signal 1: explicit scene classification
  const isBacklitScene = visionResult.sceneType === 'sunset';

  // Backlight signal 2: subject bounding box near top of frame (bright sky behind subject)
  const backlitBbox = getPrimarySubject(visionResult)?.boundingBox ?? null;
  const yRatio =
    backlitBbox != null && viewportHeight > 0
      ? backlitBbox.y <= 1.0
        ? backlitBbox.y
        : backlitBbox.y / viewportHeight
      : 1.0;
  const isBacklitByPosition = backlitBbox != null && yRatio < 0.3;

  if (isBacklitScene || isBacklitByPosition) {
    return '+0.7 EV (Backlit Scene Detected)';
  }

  if (visionResult.sceneType === 'interior') {
    return 'Low Light - Hold Camera Steady';
  }

  // Use dedicated lightingConfidence when available; fall back to confidenceScore
  const lightingScore =
    visionResult.lightingConfidence ?? visionResult.confidenceScore;
  if (lightingScore < 0.6) {
    return 'Low Light Detected';
  }

  return null;
}

/**
 * Unified guidance evaluation following the Architecture Spine 3.2 schema.
 */
export function evaluateRecommendations(
  visionResult: KeyframeVisionResult | null,
  selectedFraming: FramingCrop,
  activeLens: LensPreset,
  viewportHeight: number = 1000
): GuidanceOutput {
  const lensResult = evaluateLensRecommendation(visionResult, selectedFraming, activeLens, viewportHeight);
  const exposureGuidance = evaluateExposureGuidance(visionResult, viewportHeight);

  return {
    recommendedLens: lensResult.recommendedLens,
    lensReason: lensResult.lensReason,
    exposureGuidance,
  };
}
