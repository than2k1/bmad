import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';
import { LensPreset } from '../../types/camera';
import { getLensChipLabel } from '../../utils/lensCalculator';

const PRESETS: LensPreset[] = ['0.5x', '1x', '3x'];

export const LensPresetChips: React.FC = () => {
  const activeLens = useCameraStore((state) => state.activeLens);
  const setActiveLens = useCameraStore((state) => state.setActiveLens);

  return (
    <View style={styles.container} accessibilityRole="toolbar">
      {PRESETS.map((lens) => {
        const isActive = activeLens === lens;
        const isPortrait = lens === '3x';
        const label = getLensChipLabel(lens);

        return (
          <TouchableOpacity
            key={lens}
            style={[
              styles.chip,
              isActive && styles.activeChip,
              isActive && isPortrait && styles.activePortraitChip,
            ]}
            onPress={() => setActiveLens(lens)}
            activeOpacity={0.7}
            hitSlop={{ top: 6, bottom: 6, left: 4, right: 4 }}
            accessibilityRole="button"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`Zoom level ${label}`}
          >
            <Text
              style={[
                styles.chipText,
                isActive && styles.activeChipText,
                isActive && isPortrait && styles.activePortraitChipText,
              ]}
            >
              {label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 24,
    padding: 4,
    alignSelf: 'center',
    gap: 6,
  },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 44,
    minHeight: 44,
  },
  activeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  activePortraitChip: {
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    borderWidth: 1.5,
    borderColor: '#FFD60A',
  },
  chipText: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontSize: 13,
    fontWeight: '500',
  },
  activeChipText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  activePortraitChipText: {
    color: '#FFD60A',
    fontWeight: '700',
  },
});
