import { SceneType } from '../types/vision';

export interface GridLinesResult {
  verticalLines: [number, number];
  horizontalLines: [number, number];
  powerPoints: Array<{ x: number; y: number }>;
}

export interface SceneGuidanceBadge {
  text: string;
  accentColor: string;
}

/**
 * Calculates Rule of Thirds grid lines (33.3% and 66.7%) and 4 intersection power points.
 */
export function calculateRuleOfThirdsLines(width: number, height: number): GridLinesResult {
  const w = Math.max(0, width);
  const h = Math.max(0, height);

  const x1 = w * 0.3333;
  const x2 = w * 0.6667;
  const y1 = h * 0.3333;
  const y2 = h * 0.6667;

  return {
    verticalLines: [x1, x2],
    horizontalLines: [y1, y2],
    powerPoints: [
      { x: x1, y: y1 },
      { x: x1, y: y2 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
    ],
  };
}

/**
 * Calculates Golden Ratio (Phi) grid lines (38.2% and 61.8%) and 4 intersection power points.
 */
export function calculateGoldenRatioLines(width: number, height: number): GridLinesResult {
  const w = Math.max(0, width);
  const h = Math.max(0, height);

  const x1 = w * 0.382;
  const x2 = w * 0.618;
  const y1 = h * 0.382;
  const y2 = h * 0.618;

  return {
    verticalLines: [x1, x2],
    horizontalLines: [y1, y2],
    powerPoints: [
      { x: x1, y: y1 },
      { x: x1, y: y2 },
      { x: x2, y: y1 },
      { x: x2, y: y2 },
    ],
  };
}

/**
 * Evaluates scene type and optional horizon angle to generate tailored HUD guidance badge text and accent color.
 */
export function evaluateSceneGuidanceBadge(sceneType?: SceneType | null, horizonAngle?: number): SceneGuidanceBadge {
  switch (sceneType) {
    case 'landscape': {
      const absAngle = Math.abs(horizonAngle ?? 0);
      const text =
        absAngle > 3
          ? `Landscape Detected - Horizon Tilted ${Math.round(absAngle)}° — Level Your Shot`
          : 'Landscape Detected - Keep Horizon Level';
      return { text, accentColor: '#00e5ff' };
    }
    case 'architecture':
      return {
        text: 'Architecture Detected - Align Vertical Grid Lines',
        accentColor: '#ffd700',
      };
    case 'sunset':
      return {
        text: 'Sunset Detected - Position Horizon on Lower Third',
        accentColor: '#ff5722',
      };
    case 'food':
      return {
        text: 'Food Detected - Center Main Dish at Grid Intersection',
        accentColor: '#4caf50',
      };
    case 'interior':
      return {
        text: 'Interior Detected - Align Leading Lines & Balance Frame',
        accentColor: '#ab47bc',
      };
    default:
      return {
        text: 'Scene Detected - Align Key Subjects with Grid Lines',
        accentColor: '#00e5ff',
      };
  }
}
