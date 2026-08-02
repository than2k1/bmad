import { Point2D } from './vision';

export type CompositionRuleType =
  | 'frame_in_frame'
  | 'leading_lines'
  | 'symmetry_centering'
  | 'rule_of_thirds';

export type PanDirection = 'left' | 'right' | 'centered';
export type TiltDirection = 'up' | 'down' | 'level';
export type DistanceDirection = 'step_closer' | 'step_back' | 'perfect';

export interface CompositionDirectionalCue {
  pan: PanDirection;
  tilt: TiltDirection;
  distance: DistanceDirection;
}

export interface CompositionGuideLine {
  start: Point2D;
  end: Point2D;
}

export interface CompositionRuleResult {
  activeRule: CompositionRuleType;
  /** Alignment score percentage [0 - 100] */
  score: number;
  /** true when score >= 85 */
  isSatisfied: boolean;
  directionalCue: CompositionDirectionalCue;
  guideLines: CompositionGuideLine[];
  /** Human readable photographer instruction string */
  textCue: string;
}
