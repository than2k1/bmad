import { Point2D, SpatialLayoutResult, SubjectDetection, BackgroundBoundingBox, LineSegment } from '../types/vision';
import { AppMode } from '../types/camera';
import {
  CompositionRuleType,
  CompositionRuleResult,
  CompositionDirectionalCue,
  CompositionGuideLine,
  PanDirection,
  TiltDirection,
  DistanceDirection,
} from '../types/composition';
import {
  COMPOSITION_PRIORITIES,
  RULE_SATISFIED_THRESHOLD,
  RULE_TRIGGER_THRESHOLD,
} from './compositionStrategy';

/**
 * Calculates distance between two 2D points.
 */
function distance2D(p1: Point2D, p2: Point2D): number {
  const dx = p2.x - p1.x;
  const dy = p2.y - p1.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalizes subject bounding box to pixel units, regardless of whether
 * it was specified in normalized [0..1] or pixel coordinates.
 */
function getSubjectPixelBBox(s: SubjectDetection, width: number, height: number) {
  const isNormalized = s.boundingBox.x <= 1.0 && s.boundingBox.width <= 1.0;
  return {
    x: isNormalized ? s.boundingBox.x * width : s.boundingBox.x,
    y: isNormalized ? s.boundingBox.y * height : s.boundingBox.y,
    width: isNormalized ? s.boundingBox.width * width : s.boundingBox.width,
    height: isNormalized ? s.boundingBox.height * height : s.boundingBox.height,
  };
}

/**
 * Evaluates Symmetry & Centering rule.
 * Evaluates vertical structural lines and horizon tilt relative to viewport center axis.
 */
export function evaluateSymmetry(
  spatialLayout: SpatialLayoutResult | undefined,
  width: number,
  height: number,
  subjects: SubjectDetection[] = []
): CompositionRuleResult {
  const centerX = width / 2;
  const centerY = height / 2;

  let targetX = centerX;
  let targetY = centerY;
  let hasLines = false;
  let tiltAngle = 0;

  if (spatialLayout) {
    if (spatialLayout.horizonLine) {
      tiltAngle = Math.abs(spatialLayout.horizonLine.angleDeg);
      if (tiltAngle > 90) tiltAngle = Math.abs(180 - tiltAngle);
    }

    const vertLines = spatialLayout.lines.filter((l) => l.type === 'vertical');
    if (vertLines.length > 0) {
      hasLines = true;
      const sumX = vertLines.reduce((acc, l) => acc + (l.start.x + l.end.x) / 2, 0);
      targetX = sumX / vertLines.length;
    }
  }

  // Fallback to primary subject centroid if no vertical lines
  if (!hasLines && subjects.length > 0) {
    const primaryPixel = getSubjectPixelBBox(subjects[0], width, height);
    targetX = primaryPixel.x + primaryPixel.width / 2;
    targetY = primaryPixel.y + primaryPixel.height / 2;
    hasLines = true;
  }

  if (!hasLines && !spatialLayout?.horizonLine) {
    return {
      activeRule: 'symmetry_centering',
      score: 0,
      isSatisfied: false,
      directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
      guideLines: [],
      textCue: 'No structural symmetry elements detected',
    };
  }

  const offsetX = targetX - centerX;
  const offsetY = targetY - centerY;
  const normOffsetX = Math.abs(offsetX) / (width / 2);

  // Score calculation: 100 - offset penalty - tilt penalty
  const score = Math.max(0, Math.min(100, Math.round(100 - normOffsetX * 60 - tiltAngle * 2.5)));
  const isSatisfied = score >= RULE_SATISFIED_THRESHOLD;

  let pan: PanDirection = 'centered';
  if (offsetX > width * 0.05) pan = 'left';
  else if (offsetX < -width * 0.05) pan = 'right';

  let tilt: TiltDirection = 'level';
  if (offsetY > height * 0.05) tilt = 'up';
  else if (offsetY < -height * 0.05) tilt = 'down';

  const directionalCue: CompositionDirectionalCue = {
    pan,
    tilt,
    distance: 'perfect',
  };

  const guideLines: CompositionGuideLine[] = [
    { start: { x: centerX, y: 0 }, end: { x: centerX, y: height } },
    { start: { x: 0, y: centerY }, end: { x: width, y: centerY } },
  ];

  let textCue = 'Keep camera level for symmetry';
  if (tiltAngle > 3) {
    textCue = `Adjust tilt by ${Math.round(tiltAngle)}° for horizon symmetry`;
  } else if (pan !== 'centered') {
    textCue = `Pan ${pan} to center symmetrical frame`;
  } else if (isSatisfied) {
    textCue = 'Symmetry & Centering aligned (≥85%)';
  }

  return {
    activeRule: 'symmetry_centering',
    score,
    isSatisfied,
    directionalCue,
    guideLines,
    textCue,
  };
}

/**
 * Evaluates Leading Lines & Depth rule.
 * Evaluates converging diagonal lines and estimated vanishingPoint.
 */
export function evaluateLeadingLines(
  spatialLayout: SpatialLayoutResult | undefined,
  width: number,
  height: number
): CompositionRuleResult {
  if (!spatialLayout || !spatialLayout.vanishingPoint) {
    return {
      activeRule: 'leading_lines',
      score: 0,
      isSatisfied: false,
      directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
      guideLines: [],
      textCue: 'No converging leading lines detected',
    };
  }

  const vp = spatialLayout.vanishingPoint;
  const centerX = width / 2;
  const centerY = height / 2;
  const diagLen = Math.sqrt(width * width + height * height);

  const vpDist = distance2D(vp, { x: centerX, y: centerY });
  const normDist = vpDist / diagLen;

  const score = Math.max(0, Math.min(100, Math.round(100 - normDist * 140)));
  const isSatisfied = score >= RULE_SATISFIED_THRESHOLD;

  const offsetX = vp.x - centerX;
  const offsetY = vp.y - centerY;

  let pan: PanDirection = 'centered';
  if (offsetX > width * 0.08) pan = 'left';
  else if (offsetX < -width * 0.08) pan = 'right';

  let tilt: TiltDirection = 'level';
  if (offsetY > height * 0.08) tilt = 'up';
  else if (offsetY < -height * 0.08) tilt = 'down';

  const directionalCue: CompositionDirectionalCue = {
    pan,
    tilt,
    distance: 'perfect',
  };

  const guideLines: CompositionGuideLine[] = spatialLayout.lines
    .filter((l) => l.type === 'diagonal')
    .map((l) => ({ start: l.start, end: l.end }));

  let textCue = 'Leading lines converging at center';
  if (pan !== 'centered' || tilt !== 'level') {
    textCue = `Align vanishing point with central axis (${pan !== 'centered' ? `pan ${pan}` : ''})`;
  } else if (isSatisfied) {
    textCue = 'Leading lines & depth aligned (≥85%)';
  }

  return {
    activeRule: 'leading_lines',
    score,
    isSatisfied,
    directionalCue,
    guideLines,
    textCue,
  };
}

const FRAME_LABELS = new Set(['doorway', 'window', 'arch', 'frame', 'structure']);

/**
 * Evaluates Frame-within-a-Frame rule.
 * Evaluates background structural bounding boxes (doorway, window, arch, frame, structure)
 * and subject placement inside interior bounds.
 */
export function evaluateFrameInFrame(
  spatialLayout: SpatialLayoutResult | undefined,
  subjects: SubjectDetection[] = [],
  width: number,
  height: number
): CompositionRuleResult {
  if (!spatialLayout || spatialLayout.boundingBoxes.length === 0) {
    return {
      activeRule: 'frame_in_frame',
      score: 0,
      isSatisfied: false,
      directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
      guideLines: [],
      textCue: 'No structural framing elements detected',
    };
  }

  // Pick primary structural bounding box matching framing labels, falling back to first box
  const primaryBBox =
    spatialLayout.boundingBoxes.find((b) => FRAME_LABELS.has(b.label.toLowerCase())) ||
    spatialLayout.boundingBoxes[0];

  if (!primaryBBox || primaryBBox.width <= 0 || primaryBBox.height <= 0) {
    return {
      activeRule: 'frame_in_frame',
      score: 0,
      isSatisfied: false,
      directionalCue: { pan: 'centered', tilt: 'level', distance: 'perfect' },
      guideLines: [],
      textCue: 'No valid structural framing elements detected',
    };
  }
  const frameCenterX = primaryBBox.x + primaryBBox.width / 2;
  const frameCenterY = primaryBBox.y + primaryBBox.height / 2;

  // Determine target center (subject centroid or canvas center)
  let subjectCenterX = width / 2;
  let subjectCenterY = height / 2;
  let subjectWidth = primaryBBox.width * 0.5;

  if (subjects.length > 0) {
    const sPixel = getSubjectPixelBBox(subjects[0], width, height);
    subjectCenterX = sPixel.x + sPixel.width / 2;
    subjectCenterY = sPixel.y + sPixel.height / 2;
    subjectWidth = sPixel.width;
  }

  const offsetX = subjectCenterX - frameCenterX;
  const offsetY = subjectCenterY - frameCenterY;
  const normOffsetX = Math.abs(offsetX) / primaryBBox.width;

  // Base score from box confidence (80%) boosted by subject centering inside frame
  const baseConf = primaryBBox.confidence * 85;
  const score = Math.max(0, Math.min(100, Math.round(baseConf + 15 - normOffsetX * 30)));
  const isSatisfied = score >= RULE_SATISFIED_THRESHOLD;

  let pan: PanDirection = 'centered';
  if (offsetX > primaryBBox.width * 0.1) pan = 'left';
  else if (offsetX < -primaryBBox.width * 0.1) pan = 'right';

  let tilt: TiltDirection = 'level';
  if (offsetY > primaryBBox.height * 0.1) tilt = 'up';
  else if (offsetY < -primaryBBox.height * 0.1) tilt = 'down';

  let distance: DistanceDirection = 'perfect';
  if (subjectWidth < primaryBBox.width * 0.3) distance = 'step_closer';
  else if (subjectWidth > primaryBBox.width * 0.95) distance = 'step_back';

  const directionalCue: CompositionDirectionalCue = { pan, tilt, distance };

  const guideLines: CompositionGuideLine[] = [
    { start: { x: primaryBBox.x, y: primaryBBox.y }, end: { x: primaryBBox.x + primaryBBox.width, y: primaryBBox.y } },
    { start: { x: primaryBBox.x + primaryBBox.width, y: primaryBBox.y }, end: { x: primaryBBox.x + primaryBBox.width, y: primaryBBox.y + primaryBBox.height } },
    { start: { x: primaryBBox.x + primaryBBox.width, y: primaryBBox.y + primaryBBox.height }, end: { x: primaryBBox.x, y: primaryBBox.y + primaryBBox.height } },
    { start: { x: primaryBBox.x, y: primaryBBox.y + primaryBBox.height }, end: { x: primaryBBox.x, y: primaryBBox.y } },
  ];

  let textCue = `Frame subject inside ${primaryBBox.label}`;
  if (distance === 'step_closer') textCue = `Step closer to fill ${primaryBBox.label} frame`;
  else if (distance === 'step_back') textCue = `Step back ~1m to frame subject in ${primaryBBox.label}`;
  else if (pan !== 'centered') textCue = `Pan ${pan} to align inside ${primaryBBox.label}`;
  else if (isSatisfied) textCue = `Perfectly framed within ${primaryBBox.label} (≥85%)`;

  return {
    activeRule: 'frame_in_frame',
    score,
    isSatisfied,
    directionalCue,
    guideLines,
    textCue,
  };
}

/**
 * Evaluates Rule of Thirds baseline fallback rule.
 * Compares subject centroid or primary structural lines against 33.3% / 66.7% grid lines.
 */
export function evaluateRuleOfThirds(
  spatialLayout: SpatialLayoutResult | undefined,
  subjects: SubjectDetection[] = [],
  width: number,
  height: number
): CompositionRuleResult {
  const x1 = width * (1 / 3);
  const x2 = width * (2 / 3);
  const y1 = height * (1 / 3);
  const y2 = height * (2 / 3);

  const powerPoints: Point2D[] = [
    { x: x1, y: y1 },
    { x: x1, y: y2 },
    { x: x2, y: y1 },
    { x: x2, y: y2 },
  ];

  let targetPoint: Point2D = { x: x1, y: y1 };

  if (subjects.length > 0) {
    const sPixel = getSubjectPixelBBox(subjects[0], width, height);
    targetPoint = {
      x: sPixel.x + sPixel.width / 2,
      y: sPixel.y + sPixel.height * 0.3, // focus near eyes/head
    };
  } else if (spatialLayout?.horizonLine) {
    targetPoint = {
      x: width / 2,
      y: (spatialLayout.horizonLine.start.y + spatialLayout.horizonLine.end.y) / 2,
    };
  } else {
    targetPoint = { x: width / 2, y: height / 2 };
  }

  // Find nearest power point
  let minPowerDist = Infinity;
  let nearestPowerPoint = powerPoints[0];
  for (const pp of powerPoints) {
    const d = distance2D(targetPoint, pp);
    if (d < minPowerDist) {
      minPowerDist = d;
      nearestPowerPoint = pp;
    }
  }

  const diagLen = Math.sqrt(width * width + height * height);
  const normDist = minPowerDist / diagLen;

  // Base Rule of Thirds score: 75% base for default grid alignment
  const score = Math.max(50, Math.min(100, Math.round(95 - normDist * 160)));
  const isSatisfied = score >= RULE_SATISFIED_THRESHOLD;

  const offsetX = targetPoint.x - nearestPowerPoint.x;
  const offsetY = targetPoint.y - nearestPowerPoint.y;

  let pan: PanDirection = 'centered';
  if (offsetX > width * 0.06) pan = 'left';
  else if (offsetX < -width * 0.06) pan = 'right';

  let tilt: TiltDirection = 'level';
  if (offsetY > height * 0.06) tilt = 'up';
  else if (offsetY < -height * 0.06) tilt = 'down';

  const directionalCue: CompositionDirectionalCue = {
    pan,
    tilt,
    distance: 'perfect',
  };

  const guideLines: CompositionGuideLine[] = [
    { start: { x: x1, y: 0 }, end: { x: x1, y: height } },
    { start: { x: x2, y: 0 }, end: { x: x2, y: height } },
    { start: { x: 0, y: y1 }, end: { x: width, y: y1 } },
    { start: { x: 0, y: y2 }, end: { x: width, y: y2 } },
  ];

  let textCue = 'Align subject with grid power points';
  if (pan !== 'centered' || tilt !== 'level') {
    textCue = `Pan ${pan !== 'centered' ? pan : ''} / tilt ${tilt !== 'level' ? tilt : ''} toward grid intersection`;
  } else if (isSatisfied) {
    textCue = 'Rule of Thirds aligned (≥85%)';
  }

  return {
    activeRule: 'rule_of_thirds',
    score,
    isSatisfied,
    directionalCue,
    guideLines,
    textCue,
  };
}

/**
 * Main Entry Point for Composition Rule Evaluation.
 * Evaluates active priority cascade based on camera mode, returning the highest-priority
 * rule whose score meets or exceeds the trigger threshold (>= 70%).
 * Falls back to rule_of_thirds if no higher rule qualifies.
 */
export function evaluateCompositionRules(
  mode: AppMode | 'landscape',
  spatialLayout: SpatialLayoutResult | undefined,
  subjects: SubjectDetection[] = [],
  viewportWidth: number = 640,
  viewportHeight: number = 640
): CompositionRuleResult {
  const safeWidth = Math.max(1, viewportWidth);
  const safeHeight = Math.max(1, viewportHeight);
  const effectiveMode = mode === 'landscape' ? 'scene' : mode;
  const priorities = COMPOSITION_PRIORITIES[effectiveMode] || COMPOSITION_PRIORITIES.scene;

  for (const ruleType of priorities) {
    let result: CompositionRuleResult;

    switch (ruleType) {
      case 'symmetry_centering':
        result = evaluateSymmetry(spatialLayout, safeWidth, safeHeight, subjects);
        break;
      case 'leading_lines':
        result = evaluateLeadingLines(spatialLayout, safeWidth, safeHeight);
        break;
      case 'frame_in_frame':
        result = evaluateFrameInFrame(spatialLayout, subjects, safeWidth, safeHeight);
        break;
      case 'rule_of_thirds':
        result = evaluateRuleOfThirds(spatialLayout, subjects, safeWidth, safeHeight);
        break;
    }

    if (result.score >= RULE_TRIGGER_THRESHOLD) {
      return result;
    }
  }

  // Fallback to Rule of Thirds
  return evaluateRuleOfThirds(spatialLayout, subjects, safeWidth, safeHeight);
}
