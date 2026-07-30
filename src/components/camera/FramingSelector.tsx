import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';
import { FramingCrop } from '../../types/pose';

interface FramingOption {
  value: FramingCrop;
  label: string;
}

const FRAMING_OPTIONS: FramingOption[] = [
  { value: 'headshot', label: 'Headshot' },
  { value: 'half_body', label: 'Half-Body' },
  { value: 'full_body', label: 'Full-Body' },
];

export const FramingSelector: React.FC = () => {
  const selectedFraming = useCameraStore((state) => state.selectedFraming);
  const setSelectedFraming = useCameraStore((state) => state.setSelectedFraming);

  return (
    <View style={styles.container} accessibilityRole="tablist">
      {FRAMING_OPTIONS.map((item) => {
        const isActive = selectedFraming === item.value;
        return (
          <TouchableOpacity
            key={item.value}
            style={[styles.chip, isActive && styles.activeChip]}
            onPress={() => setSelectedFraming(item.value)}
            activeOpacity={0.7}
            accessibilityRole="tab"
            accessibilityState={{ selected: isActive }}
            accessibilityLabel={`${item.label} Framing`}
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
    backgroundColor: 'rgba(0, 0, 0, 0.55)',
    borderRadius: 20,
    padding: 3,
    alignSelf: 'center',
    marginBottom: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  activeChip: {
    backgroundColor: 'rgba(0, 229, 255, 0.25)',
    borderColor: '#00E5FF',
    borderWidth: 1,
  },
  label: {
    fontSize: 12,
    letterSpacing: 0.3,
  },
  activeLabel: {
    color: '#00E5FF',
    fontWeight: '700',
  },
  inactiveLabel: {
    color: 'rgba(255, 255, 255, 0.65)',
    fontWeight: '400',
  },
});
