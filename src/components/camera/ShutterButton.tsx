import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';

interface ShutterButtonProps {
  onPress?: () => void;
}

export const ShutterButton: React.FC<ShutterButtonProps> = ({ onPress }) => {
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);

  const handlePress = () => {
    toggleFreeze();
    if (onPress) {
      onPress();
    }
  };

  return (
    <TouchableOpacity
      style={styles.outerRing}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Analyze and freeze keyframe"
      accessibilityHint={isFrozen ? "Tap to unfreeze camera feed" : "Tap to freeze frame for analysis"}
      accessibilityState={{ selected: isFrozen }}
    >
      <View style={[styles.innerCircle, isFrozen && styles.innerCircleFrozen]} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 72,
    height: 72,
    borderRadius: 36,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.4,
    shadowRadius: 4,
    elevation: 4,
  },
  innerCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFFFFF',
  },
  innerCircleFrozen: {
    backgroundColor: '#00E5FF',
    transform: [{ scale: 0.9 }],
  },
});
