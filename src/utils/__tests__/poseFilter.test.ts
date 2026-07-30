import { filterPoseTemplates, matchesSubjectCount } from '../poseFilter';
import { POSE_CATALOG } from '../../data/poseCatalog';
import { PoseTemplate } from '../../types/pose';

function assert(condition: boolean, message: string) {
  if (!condition) {
    throw new Error(`Assertion failed: ${message}`);
  }
}

export function runPoseFilterTests() {
  // Test 1: Framing filtering alone (headshot)
  const headshots = filterPoseTemplates(POSE_CATALOG, { framing: 'headshot' });
  assert(headshots.length > 0, 'Should return headshot templates');
  assert(
    headshots.every((t) => t.framing === 'headshot'),
    'All returned templates must have framing === headshot'
  );

  // Test 2: Framing filtering alone (half_body)
  const halfBody = filterPoseTemplates(POSE_CATALOG, { framing: 'half_body' });
  assert(halfBody.length > 0, 'Should return half_body templates');
  assert(
    halfBody.every((t) => t.framing === 'half_body'),
    'All returned templates must have framing === half_body'
  );

  // Test 3: Dual filtering (framing: half_body + subjectCount: couple)
  const coupleHalfBody = filterPoseTemplates(POSE_CATALOG, {
    framing: 'half_body',
    subjectCount: 'couple',
  });
  assert(coupleHalfBody.length > 0, 'Should return couple half_body templates');
  assert(
    coupleHalfBody.every((t) => t.framing === 'half_body' && matchesSubjectCount(t, 'couple')),
    'Dual filter should match both framing and subject count'
  );

  // Test 4: Dual filtering (framing: full_body + subjectCount: solo)
  const soloFullBody = filterPoseTemplates(POSE_CATALOG, {
    framing: 'full_body',
    subjectCount: 'solo',
  });
  assert(soloFullBody.length > 0, 'Should return solo full_body templates');
  assert(
    soloFullBody.every((t) => t.framing === 'full_body' && matchesSubjectCount(t, 'solo')),
    'Dual filter should match full_body and solo subject count'
  );

  // Test 5: Fallback scenario - when no template matches specific subject count in framing crop
  const mockTemplates: PoseTemplate[] = [
    {
      id: 'headshot-solo-1',
      title: 'Solo Headshot',
      category: 'person',
      framing: 'headshot',
      subject_count: 1,
      subjectCountTag: 'solo',
      tags: ['solo'],
      keypoints: { nose: [0.5, 0.3], left_shoulder: [0.3, 0.6], right_shoulder: [0.7, 0.6], left_hip: [0.35, 0.9], right_hip: [0.65, 0.9] },
    },
  ];
  // Ask for headshot + group subject count (no group headshots in mockTemplates)
  const fallbackResults = filterPoseTemplates(mockTemplates, {
    framing: 'headshot',
    subjectCount: 'group',
  });
  assert(fallbackResults.length === 1, 'Should fallback to return framing matched templates when no subject count match exists');
  assert(fallbackResults[0].id === 'headshot-solo-1', 'Fallback should return available framing template');

  // Test 6: Empty catalog / invalid inputs
  assert(filterPoseTemplates([], { framing: 'half_body' }).length === 0, 'Empty catalog should return empty array');
  assert(filterPoseTemplates(POSE_CATALOG, null as any).length === 0, 'Null options should return empty array safely without throwing');
  assert(
    filterPoseTemplates([null as any, ...mockTemplates], { framing: 'headshot' }).length === 1,
    'Null element in templates array should be safely filtered out'
  );

  console.log('All poseFilter unit tests passed successfully!');
}

if (typeof require !== 'undefined' && require.main === module) {
  runPoseFilterTests();
} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseFilter.test')) {
  runPoseFilterTests();
}
