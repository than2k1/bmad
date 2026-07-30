import { COCO17Keypoints, SubjectBoundingBox } from '../types/vision';
import { PoseTemplate, PoseKeypointsMap } from '../types/pose';

export interface JointOffsetDetails {
  shoulderAngleDiff?: number;
  leftArmDiff?: number;
  rightArmDiff?: number;
  headOffset?: number;
}

export interface PoseComparisonResult {
  alignmentScore: number; // 0..100
  cueText: string;
  isGreenBadge: boolean; // alignmentScore >= 80
  details?: JointOffsetDetails;
}

/**
 * Normalizes detected keypoints to 0..1 bounding box coordinate space.
 * Falls back to raw coordinates if no bounding box is provided.
 */
function normalizeDetectedKeypoint(
  pt: { x: number; y: number } | undefined,
  boundingBox?: SubjectBoundingBox | null
): { x: number; y: number } | null {
  if (!pt || typeof pt.x !== 'number' || typeof pt.y !== 'number') return null;

  if (boundingBox && boundingBox.width > 0 && boundingBox.height > 0) {
    return {
      x: (pt.x - boundingBox.x) / boundingBox.width,
      y: (pt.y - boundingBox.y) / boundingBox.height,
    };
  }

  // If x, y are already normalized between 0 and 1
  if (pt.x <= 1.0 && pt.y <= 1.0 && pt.x >= 0 && pt.y >= 0) {
    return { x: pt.x, y: pt.y };
  }

  return { x: pt.x, y: pt.y };
}

/**
 * Compares detected COCO-17 keypoints against an active PoseTemplate
 * to compute alignment percentage (0-100%) and actionable photographer director cues.
 */
export function comparePoseToTemplate(
  detected: COCO17Keypoints | null,
  template: PoseTemplate | null,
  boundingBox?: SubjectBoundingBox | null
): PoseComparisonResult {
  if (!detected || !template || !template.keypoints) {
    return {
      alignmentScore: 0,
      cueText: 'Waiting for pose alignment...',
      isGreenBadge: false,
    };
  }

  const templateKp = template.keypoints;
  const jointKeys = Object.keys(templateKp) as (keyof PoseKeypointsMap)[];

  if (jointKeys.length === 0) {
    return {
      alignmentScore: 0,
      cueText: 'Waiting for pose alignment...',
      isGreenBadge: false,
    };
  }

  let totalDist = 0;
  let validJointCount = 0;

  const jointErrors: Record<string, number> = {};

  for (const key of jointKeys) {
    const tCoords = templateKp[key];
    if (!tCoords || !Array.isArray(tCoords)) continue;

    const dPt = normalizeDetectedKeypoint(detected[key as keyof COCO17Keypoints], boundingBox);
    if (!dPt) continue;

    const [tx, ty] = tCoords;
    const dist = Math.sqrt((dPt.x - tx) ** 2 + (dPt.y - ty) ** 2);

    jointErrors[key] = dist;
    totalDist += dist;
    validJointCount++;
  }

  if (validJointCount === 0) {
    return {
      alignmentScore: 0,
      cueText: 'Waiting for pose alignment...',
      isGreenBadge: false,
    };
  }

  const avgDistance = totalDist / validJointCount;

  // Evaluate Shoulder Alignment & Angle
  let shoulderAngleDiff = 0;
  const tLS = templateKp.left_shoulder;
  const tRS = templateKp.right_shoulder;
  const dLS = normalizeDetectedKeypoint(detected.left_shoulder, boundingBox);
  const dRS = normalizeDetectedKeypoint(detected.right_shoulder, boundingBox);

  let shoulderError = 0;
  if (tLS && tRS && dLS && dRS) {
    const tAngle = Math.atan2(tRS[1] - tLS[1], tRS[0] - tLS[0]) * (180 / Math.PI);
    const dAngle = Math.atan2(dRS.y - dLS.y, dRS.x - dLS.x) * (180 / Math.PI);
    shoulderAngleDiff = Math.abs(dAngle - tAngle);

    const lsErr = jointErrors['left_shoulder'] || 0;
    const rsErr = jointErrors['right_shoulder'] || 0;
    shoulderError = (lsErr + rsErr) / 2;
  }

  // Evaluate Arms Error
  const leftArmError =
    ((jointErrors['left_elbow'] || 0) + (jointErrors['left_wrist'] || 0)) /
    ((jointErrors['left_elbow'] !== undefined ? 1 : 0) + (jointErrors['left_wrist'] !== undefined ? 1 : 0) || 1);

  const rightArmError =
    ((jointErrors['right_elbow'] || 0) + (jointErrors['right_wrist'] || 0)) /
    ((jointErrors['right_elbow'] !== undefined ? 1 : 0) + (jointErrors['right_wrist'] !== undefined ? 1 : 0) || 1);

  // Evaluate Head Error
  const headError = jointErrors['nose'] || 0;

  // Calculate Overall Alignment Score (0 - 100)
  // Distance of 0.0 => 100%, 0.35 => 0%
  const keypointScore = Math.max(0, 100 * (1 - avgDistance / 0.35));
  const anglePenalty = Math.min(30, (shoulderAngleDiff / 45) * 30);
  let alignmentScore = Math.round(Math.max(0, Math.min(100, keypointScore - anglePenalty)));

  // If distance is near zero, guarantee 100
  if (avgDistance < 0.005 && shoulderAngleDiff < 1) {
    alignmentScore = 100;
  }

  const isGreenBadge = alignmentScore >= 80;

  // Generate Actionable Photographer Cue
  let cueText = 'Pose Matched! Perfect Alignment';

  if (!isGreenBadge) {
    if (shoulderAngleDiff > 15 || shoulderError > 0.15) {
      if (dLS && dRS && tLS && tRS) {
        const dDy = dRS.y - dLS.y;
        const tDy = tRS[1] - tLS[1];
        if (dDy < tDy - 0.05) {
          cueText = 'Tell subject: Turn shoulders 45° left';
        } else {
          cueText = 'Tell subject: Turn shoulders 45° right';
        }
      } else {
        cueText = 'Tell subject: Turn shoulders 45° left';
      }
    } else if (leftArmError > 0.12 && leftArmError >= rightArmError) {
      const dElbow = normalizeDetectedKeypoint(detected.left_elbow, boundingBox);
      const tElbow = templateKp.left_elbow;
      if (dElbow && tElbow && dElbow.y < tElbow[1] - 0.05) {
        cueText = 'Tell subject: Lower left arm';
      } else {
        cueText = 'Tell subject: Raise left arm';
      }
    } else if (rightArmError > 0.12) {
      const dElbow = normalizeDetectedKeypoint(detected.right_elbow, boundingBox);
      const tElbow = templateKp.right_elbow;
      if (dElbow && tElbow && dElbow.y < tElbow[1] - 0.05) {
        cueText = 'Tell subject: Lower right arm';
      } else {
        cueText = 'Tell subject: Raise right arm';
      }
    } else if (headError > 0.12) {
      cueText = 'Tell subject: Center head position';
    } else {
      cueText = 'Tell subject: Adjust stance to match pose';
    }
  }

  return {
    alignmentScore,
    cueText,
    isGreenBadge,
    details: {
      shoulderAngleDiff,
      leftArmDiff: leftArmError,
      rightArmDiff: rightArmError,
      headOffset: headError,
    },
  };
}
