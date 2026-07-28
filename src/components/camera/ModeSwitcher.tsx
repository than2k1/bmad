import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';
import { AppMode } from '../../types/camera';

interface ModeOption {
  value: AppMode;
  label: string;
}

const MODES: ModeOption[] = [
  { value: 'person', label: 'Person' },
  { value: 'scene', label: 'Scene' },
];

export const ModeSwitcher: React.FC = () => {
  const mode = useCameraStore((state) => state.mode);
  const setMode = useCameraStore((state) => state.setMode);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {MODES.map((item) => {
        const isActive = mode === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.pill, isActive && styles.activePill]}
            onPress={() => setMode(item.value)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${item.label} Mode`}
          >
            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
              {item.label}
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
  },
  pill: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activePill: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  label: {
    fontSize: 14,
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
  inactiveLabel: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontWeight: '400',
  },
});
