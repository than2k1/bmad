import {
  Point2D,
  LineType,
  StructuralLabel,
  LineSegment,
  BackgroundBoundingBox,
  SpatialLayoutResult,
} from '../types/vision';

/**
 * Classifies line orientation based on angle relative to horizontal.
 * - Horizon: angle within +/- 15 deg of horizontal (0 or 180 deg)
 * - Vertical: angle within +/- 15 deg of vertical (90 deg)
 * - Diagonal: all other angles
 */
export function classifyLineType(angleDeg: number): LineType {
  const normAngle = Math.abs(angleDeg % 180);
  const tiltFromHoriz = normAngle > 90 ? 180 - normAngle : normAngle;

  if (tiltFromHoriz <= 15) {
    return 'horizon';
  }
  if (Math.abs(tiltFromHoriz - 90) <= 15) {
    return 'vertical';
  }
  return 'diagonal';
}

/**
 * Calculates metrics (length, angle in deg, type) for a line segment given start and end points.
 */
export function calculateLineMetrics(
  start: Point2D,
  end: Point2D,
  confidence: number = 0.9,
  overrideType?: LineType
): LineSegment {
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const length = Math.round(Math.sqrt(dx * dx + dy * dy) * 100) / 100;
  const angleDeg = Math.round((Math.atan2(dy, dx) * (180 / Math.PI)) * 100) / 100;
  const type = overrideType ?? classifyLineType(angleDeg);

  return {
    start,
    end,
    angleDeg,
    length,
    confidence,
    type,
  };
}

/**
 * Computes 2D intersection point between two line segments.
 * Returns undefined if lines are parallel or collinear.
 */
export function computeLineIntersection(line1: LineSegment, line2: LineSegment): Point2D | undefined {
  const x1 = line1.start.x, y1 = line1.start.y;
  const x2 = line1.end.x, y2 = line1.end.y;
  const x3 = line2.start.x, y3 = line2.start.y;
  const x4 = line2.end.x, y4 = line2.end.y;

  const a1 = y2 - y1;
  const b1 = x1 - x2;
  const c1 = a1 * x1 + b1 * y1;

  const a2 = y4 - y3;
  const b2 = x3 - x4;
  const c2 = a2 * x3 + b2 * y3;

  const det = a1 * b2 - a2 * b1;
  if (Math.abs(det) < 1e-5) {
    return undefined;
  }

  const x = (c1 * b2 - c2 * b1) / det;
  const y = (a1 * c2 - a2 * c1) / det;

  return {
    x: Math.round(x * 100) / 100,
    y: Math.round(y * 100) / 100,
  };
}

/**
 * Generates synthetic structural background lines for default simulator preview or fallback execution.
 */
export function generateSyntheticLines(canvasWidth: number, canvasHeight: number): LineSegment[] {
  const midY = canvasHeight * 0.5;
  const horizon = calculateLineMetrics(
    { x: 0, y: midY },
    { x: canvasWidth, y: midY },
    0.92,
    'horizon'
  );

  const vertLeft = calculateLineMetrics(
    { x: canvasWidth * 0.25, y: canvasHeight * 0.2 },
    { x: canvasWidth * 0.25, y: canvasHeight * 0.8 },
    0.88,
    'vertical'
  );

  const vertRight = calculateLineMetrics(
    { x: canvasWidth * 0.75, y: canvasHeight * 0.2 },
    { x: canvasWidth * 0.75, y: canvasHeight * 0.8 },
    0.85,
    'vertical'
  );

  const diagLeft = calculateLineMetrics(
    { x: 0, y: 0 },
    { x: canvasWidth * 0.5, y: midY },
    0.86,
    'diagonal'
  );

  const diagRight = calculateLineMetrics(
    { x: canvasWidth, y: 0 },
    { x: canvasWidth * 0.5, y: midY },
    0.84,
    'diagonal'
  );

  return [horizon, vertLeft, vertRight, diagLeft, diagRight];
}

/**
 * Groups structural lines into BackgroundBoundingBox objects (e.g. doorways, windows, arches).
 */
export function aggregateStructuralBoundingBoxes(
  lines: LineSegment[],
  canvasWidth: number,
  canvasHeight: number
): BackgroundBoundingBox[] {
  const verticals = lines.filter((l) => l.type === 'vertical');
  if (verticals.length < 2) {
    return [];
  }

  // Sort verticals by X position
  const sortedVerts = [...verticals].sort((a, b) => Math.min(a.start.x, a.end.x) - Math.min(b.start.x, b.end.x));
  const v1 = sortedVerts[0];
  const v2 = sortedVerts[sortedVerts.length - 1];

  const minX = Math.min(v1.start.x, v1.end.x, v2.start.x, v2.end.x);
  const maxX = Math.max(v1.start.x, v1.end.x, v2.start.x, v2.end.x);
  const minY = Math.min(v1.start.y, v1.end.y, v2.start.y, v2.end.y);
  const maxY = Math.max(v1.start.y, v1.end.y, v2.start.y, v2.end.y);

  const width = Math.round((maxX - minX) * 100) / 100;
  const height = Math.round((maxY - minY) * 100) / 100;

  if (width <= 0 || height <= 0) {
    return [];
  }

  const aspectRatio = height / width;
  let label: StructuralLabel = 'structure';
  if (aspectRatio >= 1.5) {
    label = 'doorway';
  } else if (aspectRatio >= 0.8 && aspectRatio < 1.5) {
    label = 'window';
  }

  const avgConfidence = Math.round(((v1.confidence + v2.confidence) / 2) * 100) / 100;

  return [
    {
      id: `bbox-${label}-1`,
      label,
      x: Math.round(minX * 100) / 100,
      y: Math.round(minY * 100) / 100,
      width,
      height,
      confidence: avgConfidence,
    },
  ];
}

function getCurrentTimeMs(): number {
  if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
    return performance.now();
  }
  return Date.now();
}

/**
 * Extracts background structural layout (horizon, line classification, vanishing point, openings/bounding boxes).
 * Executed in Tier 2 spatial layout pipeline under <200ms budget.
 */
export function extractSpatialLayout(
  canvasWidth: number,
  canvasHeight: number,
  rawLines?: LineSegment[],
  options?: { confidenceThreshold?: number }
): SpatialLayoutResult {
  const startTime = getCurrentTimeMs();
  const confidenceThreshold = options?.confidenceThreshold ?? 0.5;

  let inputLines: LineSegment[];
  const isSynthetic = rawLines === undefined;

  if (isSynthetic) {
    inputLines = generateSyntheticLines(canvasWidth, canvasHeight);
  } else {
    inputLines = rawLines.filter((l) => l.confidence >= confidenceThreshold);
  }

  // Process & validate line types/metrics
  const lines: LineSegment[] = inputLines.map((l) => {
    const type = l.type ?? classifyLineType(l.angleDeg);
    return {
      ...l,
      type,
    };
  });

  // Identify primary horizon line
  const horizonLines = lines
    .filter((l) => l.type === 'horizon')
    .sort((a, b) => b.confidence - a.confidence || b.length - a.length);

  const horizonLine = horizonLines.length > 0 ? horizonLines[0] : undefined;

  // Calculate vanishing point from diagonal line intersections
  const diagonalLines = lines.filter((l) => l.type === 'diagonal');
  let vanishingPoint: Point2D | undefined = undefined;

  if (diagonalLines.length >= 2) {
    const intersections: Point2D[] = [];
    for (let i = 0; i < diagonalLines.length; i++) {
      for (let j = i + 1; j < diagonalLines.length; j++) {
        const pt = computeLineIntersection(diagonalLines[i], diagonalLines[j]);
        if (pt) {
          // Keep intersections reasonably near canvas bounds
          if (
            pt.x >= -canvasWidth &&
            pt.x <= canvasWidth * 2 &&
            pt.y >= -canvasHeight &&
            pt.y <= canvasHeight * 2
          ) {
            intersections.push(pt);
          }
        }
      }
    }

    if (intersections.length > 0) {
      const avgX = intersections.reduce((sum, p) => sum + p.x, 0) / intersections.length;
      const avgY = intersections.reduce((sum, p) => sum + p.y, 0) / intersections.length;
      vanishingPoint = {
        x: Math.round(avgX * 100) / 100,
        y: Math.round(avgY * 100) / 100,
      };
    }
  }

  // Aggregate bounding boxes for structural elements
  const boundingBoxes = aggregateStructuralBoundingBoxes(lines, canvasWidth, canvasHeight);

  const extractionLatencyMs = Math.round(getCurrentTimeMs() - startTime);

  return {
    lines,
    boundingBoxes,
    horizonLine,
    vanishingPoint,
    extractionLatencyMs,
  };
}
