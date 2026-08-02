import React from 'react';
import { useCameraStore } from '../../stores/useCameraStore';

let StyleSheet: any, View: any, Text: any, TouchableOpacity: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RN = require('react-native');
  StyleSheet = RN.StyleSheet;
  View = RN.View;
  Text = RN.Text;
  TouchableOpacity = RN.TouchableOpacity;
} catch {
  StyleSheet = { create: (s: any) => s };
  View = 'div';
  Text = 'span';
  TouchableOpacity = 'button';
}

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
      style={[styles.outerRing, isFrozen && styles.outerRingFrozen]}
      onPress={handlePress}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="AI Keyframe Freeze & Analyze"
      accessibilityHint={isFrozen ? "Tap to unfreeze camera feed" : "Tap to freeze frame for AI composition analysis"}
      accessibilityState={{ selected: isFrozen }}
    >
      <View style={[styles.innerCircle, isFrozen && styles.innerCircleFrozen]}>
        <Text style={styles.badgeText}>{isFrozen ? 'UNFREEZE' : 'AI FREEZE'}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 54,
    height: 54,
    borderRadius: 27,
    borderWidth: 2,
    borderColor: '#00E5FF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  outerRingFrozen: {
    borderColor: '#FFD60A',
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    shadowColor: '#FFD60A',
  },
  innerCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: 'rgba(0, 229, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  innerCircleFrozen: {
    backgroundColor: '#FFD60A',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 8,
    fontWeight: '800',
    letterSpacing: 0.5,
    textAlign: 'center',
  },
});
