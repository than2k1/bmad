import { AppMode } from '../types/camera';
import { CompositionRuleType } from '../types/composition';

export const RULE_SATISFIED_THRESHOLD = 85;
export const RULE_TRIGGER_THRESHOLD = 70;

export const COMPOSITION_PRIORITIES: Record<AppMode | 'landscape', CompositionRuleType[]> = {
  scene: ['symmetry_centering', 'leading_lines', 'frame_in_frame', 'rule_of_thirds'],
  landscape: ['symmetry_centering', 'leading_lines', 'frame_in_frame', 'rule_of_thirds'],
  person: ['frame_in_frame', 'leading_lines', 'symmetry_centering', 'rule_of_thirds'],
};
