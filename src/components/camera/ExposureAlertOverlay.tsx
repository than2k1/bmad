import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraStore } from '../../stores/useCameraStore';
import { useLensGuidance } from '../../hooks/useLensGuidance';

export const ExposureAlertOverlay: React.FC = () => {
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const visionResult = useCameraStore((state) => state.visionResult);
  const activeLens = useCameraStore((state) => state.activeLens);
  const setActiveLens = useCameraStore((state) => state.setActiveLens);
  const insets = useSafeAreaInsets();

  // Guidance computed once via shared hook — eliminates duplicate engine call
  // with LensPresetChips; viewport height captured accurately via onViewportLayout
  // on the parent CameraViewfinder container.
  const { guidance } = useLensGuidance();

  if (!isFrozen || !visionResult || !guidance) {
    return null;
  }

  const { recommendedLens, lensReason, exposureGuidance } = guidance;
  const showLensRecommendation = recommendedLens === '3x' && activeLens !== '3x';
  const showExposureGuidance = exposureGuidance !== null;

  if (!showLensRecommendation && !showExposureGuidance) {
    return null;
  }

  // Anchor to right side of screen at the same upper zone as PositioningBadges.
  // Right-aligning separates it horizontally from the center-stacked badges
  // so both are visible without vertical stacking conflicts.
  const topOffset = Math.max(insets.top + 10, 54) + 48;

  return (
    <View style={[styles.container, { top: topOffset }]} pointerEvents="box-none">
      {/* High-Contrast Exposure Guidance Alert Chip */}
      {showExposureGuidance && (
        <View style={styles.exposureChip} accessibilityRole="text" accessibilityLabel={`Exposure alert: ${exposureGuidance}`}>
          <Text style={styles.exposureIcon}>☀️</Text>
          <Text style={styles.exposureText}>{exposureGuidance}</Text>
        </View>
      )}

      {/* 1-Tap Lens Recommendation Badge Overlay */}
      {showLensRecommendation && (
        <TouchableOpacity
          style={styles.lensBadge}
          onPress={() => setActiveLens('3x')}
          activeOpacity={0.75}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          accessibilityRole="button"
          accessibilityLabel="Switch to 3x Portrait Lens recommendation to prevent distortion"
        >
          <View style={styles.lensBadgeHeader}>
            <Text style={styles.lensBadgeIcon}>✨</Text>
            <Text style={styles.lensBadgeTitle}>[3x Portrait Lens] Recommended</Text>
          </View>
          {lensReason && <Text style={styles.lensBadgeReason}>{lensReason}</Text>}
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    right: 12,
    left: 12,
    alignItems: 'flex-end',
    zIndex: 26,
    gap: 8,
  },
  exposureChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1.5,
    borderColor: '#FF9500',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    gap: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  exposureIcon: {
    fontSize: 14,
  },
  exposureText: {
    color: '#FF9500',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  lensBadge: {
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    borderWidth: 1.5,
    borderColor: '#FFD60A',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#FFD60A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 5,
  },
  lensBadgeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  lensBadgeIcon: {
    fontSize: 14,
  },
  lensBadgeTitle: {
    color: '#FFD60A',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  lensBadgeReason: {
    color: 'rgba(255, 255, 255, 0.85)',
    fontSize: 11,
    fontWeight: '500',
    marginTop: 2,
  },
});
