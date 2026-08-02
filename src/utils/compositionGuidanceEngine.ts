import {
  CompositionRuleResult,
  CompositionDirectionalCue,
  CompositionRuleType,
} from '../types/composition';
import { KeyframeVisionResult, SpatialLayoutResult, Point2D } from '../types/vision';

export interface EvaluatedGuidanceOverlayState {
  activeRule: CompositionRuleType;
  score: number;
  isSatisfied: boolean;
  textCue: string;
  guideLines: Array<{ start: Point2D; end: Point2D }>;
  directionalBadges: string[];
  statusColor: string;
  statusText: string;
  spatialLayout?: SpatialLayoutResult;
}

export function getDirectionalBadges(cue: CompositionDirectionalCue): string[] {
  const badges: string[] = [];
  if (cue.pan === 'left') badges.push('PAN LEFT ◄');
  if (cue.pan === 'right') badges.push('PAN RIGHT ►');

  if (cue.tilt === 'up') badges.push('TILT UP ▲');
  if (cue.tilt === 'down') badges.push('TILT DOWN ▼');

  if (cue.distance === 'step_closer') badges.push('STEP CLOSER');
  if (cue.distance === 'step_back') badges.push('STEP BACK');

  return badges;
}

export function evaluateGuidanceOverlayState(state: {
  isFrozen: boolean;
  visionResult: KeyframeVisionResult | null;
}): EvaluatedGuidanceOverlayState | null {
  const { isFrozen, visionResult } = state;
  if (!isFrozen || !visionResult || !visionResult.compositionResult) {
    return null;
  }

  const result: CompositionRuleResult = visionResult.compositionResult;
  const directionalBadges = getDirectionalBadges(result.directionalCue);
  const statusColor = result.isSatisfied
    ? '#30D158'
    : result.score >= 70
    ? '#00E5FF'
    : '#FFD60A';
  const statusText = result.isSatisfied
    ? 'COMPOSITION SATISFIED'
    : 'ALIGNMENT IN PROGRESS';

  return {
    activeRule: result.activeRule,
    score: result.score,
    isSatisfied: result.isSatisfied,
    textCue: result.textCue,
    guideLines: result.guideLines,
    directionalBadges,
    statusColor,
    statusText,
    spatialLayout: visionResult.spatialLayout,
  };
}
