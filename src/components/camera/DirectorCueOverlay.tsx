import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraStore } from '../../stores/useCameraStore';
import { POSE_CATALOG } from '../../data/poseCatalog';
import { comparePoseToTemplate } from '../../utils/directorCueEngine';
import { getPrimarySubject } from '../../utils/visionInferencingEngine';

export const DirectorCueOverlay: React.FC = () => {
  const mode = useCameraStore((state) => state.mode);
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
  const visionResult = useCameraStore((state) => state.visionResult);
  const insets = useSafeAreaInsets();

  // useMemo must be called unconditionally before any early returns (Rules of Hooks)
  const activeTemplate = React.useMemo(
    () => POSE_CATALOG.find((p) => p.id === selectedPoseId),
    [selectedPoseId]
  );

  const primarySubject = visionResult ? getPrimarySubject(visionResult) : null;

  if (mode !== 'person' || !isFrozen || !selectedPoseId || !primarySubject || !activeTemplate) {
    return null;
  }

  const comparison = comparePoseToTemplate(
    primarySubject.keypoints,
    activeTemplate,
    primarySubject.boundingBox
  );

  const isGreen = comparison.isGreenBadge;
  const badgeColor = isGreen ? '#30D158' : '#FF9F0A';
  // Sit below PositioningBadgesOverlay (which occupies ~54+48 = ~102px zone)
  // Add enough gap for 3 stacked badge chips (~96px at 6px gap each) → +160
  const topOffset = Math.max(insets.top + 10, 54) + 160;

  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
      <View style={styles.card} pointerEvents="none">
        <View style={[styles.badge, { backgroundColor: badgeColor }]}>
          <Text style={styles.badgeText}>{comparison.alignmentScore}% MATCH</Text>
        </View>

        <View style={styles.cueChip}>
          <Text style={styles.cueText}>{comparison.cueText}</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
    zIndex: 25,
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 20, 0.88)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 6,
    elevation: 5,
  },
  badge: {
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 4,
    marginRight: 10,
  },
  badgeText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cueChip: {
    flexShrink: 1,
  },
  cueText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    letterSpacing: 0.2,
  },
});
