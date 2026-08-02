import { PoseKeypointsMap } from '../types/pose';

export interface CanvasPoint {
  x: number;
  y: number;
}

export interface SkeletonLine {
  id: string;
  fromKey: string;
  toKey: string;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export interface PoseTransform {
  translateX: number;
  translateY: number;
  scale: number;
}

export const DEFAULT_TRANSFORM: PoseTransform = {
  translateX: 0,
  translateY: 0,
  scale: 1.0,
};

/**
 * Maps normalized COCO-17 keypoint coordinates (0.0 .. 1.0) into absolute canvas pixel dimensions.
 */
export function normalizeKeypointsToCanvas(
  keypoints: PoseKeypointsMap,
  canvasWidth: number,
  canvasHeight: number
): Record<string, CanvasPoint> {
  const result: Record<string, CanvasPoint> = {};

  if (!keypoints) return result;

  for (const [jointName, coords] of Object.entries(keypoints)) {
    if (Array.isArray(coords) && coords.length >= 2) {
      const [nx, ny] = coords;
      if (typeof nx === 'number' && typeof ny === 'number' && !isNaN(nx) && !isNaN(ny)) {
        result[jointName] = {
          x: Math.round(nx * canvasWidth),
          y: Math.round(ny * canvasHeight),
        };
      }
    }
  }

  return result;
}

/**
 * Generates SVG line segment specifications for valid skeleton connections.
 * Skips connection lines if either endpoint keypoint is omitted or missing.
 */
export function getSkeletonConnectionLines(
  keypoints: PoseKeypointsMap,
  connections: [string, string][],
  canvasWidth: number,
  canvasHeight: number
): SkeletonLine[] {
  const mappedPoints = normalizeKeypointsToCanvas(keypoints, canvasWidth, canvasHeight);
  const lines: SkeletonLine[] = [];

  if (!connections || !Array.isArray(connections)) {
    return lines;
  }

  for (const [fromKey, toKey] of connections) {
    const fromPt = mappedPoints[fromKey];
    const toPt = mappedPoints[toKey];

    if (fromPt && toPt) {
      lines.push({
        id: `${fromKey}-${toKey}`,
        fromKey,
        toKey,
        x1: fromPt.x,
        y1: fromPt.y,
        x2: toPt.x,
        y2: toPt.y,
      });
    }
  }

  return lines;
}

/**
 * Filters a full skeleton connection list to only those pairs where BOTH
 * keypoints are present in the template's keypoints map.
 *
 * Use this for couple/group/party templates whose keypoints are intentionally
 * sparse — it ensures every rendered joint has its connecting limb lines,
 * producing a complete skeleton for the joints that ARE defined rather than
 * a visually broken partial skeleton.
 */
export function getRenderedSkeletonConnections(
  keypoints: PoseKeypointsMap,
  connections: [string, string][]
): [string, string][] {
  if (!keypoints || !connections || !Array.isArray(connections)) return [];
  const defined = new Set(Object.keys(keypoints));
  return connections.filter(([from, to]) => defined.has(from) && defined.has(to));
}

/**
 * Clamps scale factor (0.5x .. 3.0x) and translation boundaries to ensure vector overlay stays visible.
 */
export function clampPoseTransform(
  transform: PoseTransform,
  canvasWidth: number,
  canvasHeight: number
): PoseTransform {
  const minScale = 0.5;
  const maxScale = 3.0;
  const maxTransX = canvasWidth * 0.75;
  const maxTransY = canvasHeight * 0.75;

  const clampedScale = Math.min(Math.max(transform.scale, minScale), maxScale);
  const clampedX = Math.min(Math.max(transform.translateX, -maxTransX), maxTransX);
  const clampedY = Math.min(Math.max(transform.translateY, -maxTransY), maxTransY);

  return {
    translateX: clampedX,
    translateY: clampedY,
    scale: clampedScale,
  };
}
