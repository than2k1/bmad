import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';
import { GridMode } from '../../types/camera';

const GRID_LABELS: Record<GridMode, string> = {
  none: 'Grid: Off',
  rule_of_thirds: 'Grid: 1/3',
  golden_ratio: 'Grid: Phi',
};

export const GridModeToggle: React.FC = () => {
  const mode = useCameraStore((state) => state.mode);
  const gridMode = useCameraStore((state) => state.gridMode);
  const cycleGridMode = useCameraStore((state) => state.cycleGridMode);

  if (mode !== 'scene') {
    return null;
  }

  const isActive = gridMode !== 'none';

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={[styles.chip, isActive && styles.activeChip]}
        onPress={cycleGridMode}
        activeOpacity={0.7}
        accessibilityRole="button"
        accessibilityLabel={`Composition Grid Mode: ${GRID_LABELS[gridMode]}`}
      >
        <Text style={styles.icon}>🌐</Text>
        <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
          {GRID_LABELS[gridMode]}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    marginBottom: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.65)',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  activeChip: {
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
  },
  icon: {
    fontSize: 12,
    marginRight: 6,
  },
  label: {
    fontSize: 13,
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  inactiveLabel: {
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
  },
});
