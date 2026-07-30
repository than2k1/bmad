import { PoseTemplate, FramingCrop } from '../types/pose';
import { SubjectCount } from '../types/vision';
import { AppMode } from '../types/camera';

export interface FilterPoseOptions {
  framing: FramingCrop;
  subjectCount?: SubjectCount | null;
  category?: AppMode;
}

/**
 * Checks if a pose template matches the target SubjectCount ('solo' | 'couple' | 'group')
 */
export function matchesSubjectCount(template: PoseTemplate, subjectCount: SubjectCount): boolean {
  if (template.subjectCountTag === subjectCount) {
    return true;
  }
  if (template.tags && template.tags.includes(subjectCount)) {
    return true;
  }
  if (template.subject_count !== undefined) {
    if (subjectCount === 'solo' && template.subject_count === 1) return true;
    if (subjectCount === 'couple' && template.subject_count === 2) return true;
    if (subjectCount === 'group' && template.subject_count >= 3) return true;
  }
  return false;
}

/**
 * Pure utility function to filter pose templates based on active framing crop,
 * auto-detected subject count, and app category mode.
 */
export function filterPoseTemplates(
  templates: PoseTemplate[],
  options: FilterPoseOptions
): PoseTemplate[] {
  if (!templates || templates.length === 0) {
    return [];
  }

  const { framing, subjectCount, category = 'person' } = options || {};

  // 1. Filter by category & framing crop
  const framingMatched = templates.filter((template) => {
    if (!template) return false;
    const categoryMatch = !template.category || template.category === category;
    const framingMatch = template.framing === framing;
    return categoryMatch && framingMatch;
  });

  if (framingMatched.length === 0) {
    return [];
  }

  // 2. If subjectCount is available, refine by subjectCount
  if (subjectCount) {
    const dualMatched = framingMatched.filter((template) =>
      matchesSubjectCount(template, subjectCount)
    );

    // Fallback scenario: If no dual match exists for this subject count, return all framing-matched templates
    if (dualMatched.length > 0) {
      return dualMatched;
    }
  }

  return framingMatched;
}
