export interface MotionRotation {
  alpha?: number;
  beta?: number;
  gamma?: number;
}

/**
 * Converts radians to degrees.
 */
export function radiansToDegrees(radians: number): number {
  return radians * (180 / Math.PI);
}

/**
 * Normalizes an angle in degrees to the [-180, 180] degree range.
 */
export function normalizeAngle(degrees: number): number {
  let angle = degrees % 360;
  if (angle > 180) {
    angle -= 360;
  } else if (angle < -180) {
    angle += 360;
  }
  return angle;
}

/**
 * Calculates roll angle in degrees from sensor motion rotation data.
 * Gamma represents the roll angle (left/right tilt) in radians.
 */
export function calculateRollDegrees(rotation?: MotionRotation | null): number {
  if (!rotation || typeof rotation.gamma !== 'number' || isNaN(rotation.gamma)) {
    return 0;
  }
  return normalizeAngle(radiansToDegrees(rotation.gamma));
}

/**
 * Determines whether the device roll angle is within the specified level threshold (default +/-1.0 degree).
 */
export function isWithinLevelThreshold(rollDegrees: number, thresholdDegrees: number = 1.0): boolean {
  const normalized = normalizeAngle(rollDegrees);
  return Math.abs(normalized) <= thresholdDegrees;
}
