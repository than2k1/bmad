import { SubjectBoundingBox, KeyframeVisionResult, COCO17Keypoints } from '../types/vision';
import { FramingCrop } from '../types/pose';

export type DistanceDirective = 'step_back' | 'step_closer' | 'optimal';
export type HeightDirective = 'lower_camera' | 'raise_camera' | 'optimal';
export type TiltDirective = 'tilt_up' | 'tilt_down' | 'level';

export interface DistanceGuidanceResult {
  directive: DistanceDirective;
  badgeText: string;
  metersOffset: number;
  actualRatio: number;
  targetRatio: number;
}

export interface HeightAndTiltGuidanceResult {
  heightDirective: HeightDirective;
  heightBadgeText: string;
  tiltDirective: TiltDirective;
  tiltBadgeText: string;
  pitchDegrees: number;
}

export interface PositioningEvaluation {
  distance: DistanceGuidanceResult;
  heightAndTilt: HeightAndTiltGuidanceResult;
  isAllOptimal: boolean;
}

interface FramingStandards {
  targetRatio: number;
  referenceDistance: number;
  targetCenterY: number;
  levelLabel: string;
}

const FRAMING_STANDARDS: Record<FramingCrop, FramingStandards> = {
  headshot: {
    targetRatio: 0.55,
    referenceDistance: 1.5,
    targetCenterY: 0.4,
    levelLabel: 'eye level',
  },
  half_body: {
    targetRatio: 0.55,
    referenceDistance: 2.5,
    targetCenterY: 0.45,
    levelLabel: 'chest level',
  },
  full_body: {
    targetRatio: 0.75,
    referenceDistance: 4.0,
    targetCenterY: 0.5,
    levelLabel: 'waist level',
  },
};

/**
 * Calculates recommended distance adjustment (step back, step closer, optimal)
 * based on detected subject bounding box height vs target framing standards.
 */
export function calculateDistanceGuidance(
  boundingBox: SubjectBoundingBox | null,
  framing: FramingCrop = 'half_body',
  canvasHeight: number = 1000
): DistanceGuidanceResult {
  const standards = FRAMING_STANDARDS[framing] || FRAMING_STANDARDS.half_body;

  if (!boundingBox || boundingBox.height <= 0) {
    return {
      directive: 'optimal',
      badgeText: 'Distance Good',
      metersOffset: 0,
      actualRatio: 0,
      targetRatio: standards.targetRatio,
    };
  }

  const actualRatio =
    boundingBox.height <= 1.0 ? boundingBox.height : boundingBox.height / (canvasHeight || 1000);

  const ratioDiff = Math.abs(actualRatio - standards.targetRatio);
  const TOLERANCE = 0.08;

  if (ratioDiff <= TOLERANCE) {
    return {
      directive: 'optimal',
      badgeText: 'Distance Good',
      metersOffset: 0,
      actualRatio,
      targetRatio: standards.targetRatio,
    };
  }

  // Calculate estimated distance offset in meters
  const rawOffset = (ratioDiff / standards.targetRatio) * standards.referenceDistance;
  // Round to nearest 0.5m step, minimum 0.5m
  const metersOffset = Math.max(0.5, Math.round(rawOffset * 2) / 2);

  if (actualRatio > standards.targetRatio + TOLERANCE) {
    return {
      directive: 'step_back',
      badgeText: `Step back ~${metersOffset}m`,
      metersOffset,
      actualRatio,
      targetRatio: standards.targetRatio,
    };
  } else {
    return {
      directive: 'step_closer',
      badgeText: `Step closer ~${metersOffset}m`,
      metersOffset,
      actualRatio,
      targetRatio: standards.targetRatio,
    };
  }
}

/**
 * Calculates camera height and pitch/tilt guidance based on subject position in frame and device pitch angle.
 */
export function calculateHeightAndTiltGuidance(
  boundingBox: SubjectBoundingBox | null,
  _keypoints: COCO17Keypoints | null,
  pitchDegrees: number = 0,
  framing: FramingCrop = 'half_body',
  canvasHeight: number = 1000
): HeightAndTiltGuidanceResult {
  const standards = FRAMING_STANDARDS[framing] || FRAMING_STANDARDS.half_body;

  let heightDirective: HeightDirective = 'optimal';
  let heightBadgeText = 'Camera Height Good';

  if (boundingBox && boundingBox.height > 0) {
    const rawCenterY = boundingBox.y + boundingBox.height / 2;
    const actualCenterY = boundingBox.height <= 1.0 ? rawCenterY : rawCenterY / (canvasHeight || 1000);
    const HEIGHT_TOLERANCE = 0.1;

    if (actualCenterY < standards.targetCenterY - HEIGHT_TOLERANCE) {
      heightDirective = 'lower_camera';
      heightBadgeText = `Lower camera to ${standards.levelLabel}`;
    } else if (actualCenterY > standards.targetCenterY + HEIGHT_TOLERANCE) {
      heightDirective = 'raise_camera';
      heightBadgeText = `Raise camera to ${standards.levelLabel}`;
    }
  }

  let tiltDirective: TiltDirective = 'level';
  let tiltBadgeText = 'Tilt Level Good';

  const PITCH_TOLERANCE = 2.5;
  const roundedPitch = Math.abs(Math.round(pitchDegrees));

  if (pitchDegrees < -PITCH_TOLERANCE) {
    tiltDirective = 'tilt_up';
    tiltBadgeText = `Tilt camera up ${roundedPitch}°`;
  } else if (pitchDegrees > PITCH_TOLERANCE) {
    tiltDirective = 'tilt_down';
    tiltBadgeText = `Tilt camera down ${roundedPitch}°`;
  }

  return {
    heightDirective,
    heightBadgeText,
    tiltDirective,
    tiltBadgeText,
    pitchDegrees,
  };
}

/**
 * Evaluates combined camera positioning (distance, height, tilt) for keyframe vision result.
 */
export function evaluateCameraPositioning(
  visionResult: KeyframeVisionResult | null,
  framing: FramingCrop = 'half_body',
  pitchDegrees: number = 0,
  canvasHeight: number = 1000
): PositioningEvaluation {
  const boundingBox = visionResult?.boundingBox ?? null;
  const keypoints = visionResult?.keypoints ?? null;

  const distance = calculateDistanceGuidance(boundingBox, framing, canvasHeight);
  const heightAndTilt = calculateHeightAndTiltGuidance(boundingBox, keypoints, pitchDegrees, framing, canvasHeight);

  const isAllOptimal =
    distance.directive === 'optimal' &&
    heightAndTilt.heightDirective === 'optimal' &&
    heightAndTilt.tiltDirective === 'level';

  return {
    distance,
    heightAndTilt,
    isAllOptimal,
  };
}
