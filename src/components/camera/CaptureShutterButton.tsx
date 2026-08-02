import React from 'react';

let StyleSheet: any, View: any, TouchableOpacity: any, ActivityIndicator: any;
try {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const RN = require('react-native');
  StyleSheet = RN.StyleSheet;
  View = RN.View;
  TouchableOpacity = RN.TouchableOpacity;
  ActivityIndicator = RN.ActivityIndicator;
} catch {
  StyleSheet = { create: (s: any) => s };
  View = 'div';
  TouchableOpacity = 'button';
  ActivityIndicator = 'span';
}

interface CaptureShutterButtonProps {
  onPress?: () => void;
  isCapturing?: boolean;
  disabled?: boolean;
}

export const CaptureShutterButton: React.FC<CaptureShutterButtonProps> = ({
  onPress,
  isCapturing = false,
  disabled = false,
}) => {
  return (
    <TouchableOpacity
      style={[styles.outerRing, disabled && styles.disabledRing]}
      onPress={onPress}
      disabled={disabled || isCapturing}
      activeOpacity={0.7}
      accessibilityRole="button"
      accessibilityLabel="Capture photo and save to gallery"
      accessibilityHint="Tap to take a high-resolution photo and save it to your device's photo gallery"
      accessibilityState={{ disabled: disabled || isCapturing }}
    >
      {isCapturing ? (
        <ActivityIndicator color="#000000" size="small" />
      ) : (
        <View style={styles.innerCircle} />
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  outerRing: {
    width: 80,
    height: 80,
    borderRadius: 40,
    borderWidth: 4,
    borderColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 6,
    elevation: 6,
  },
  disabledRing: {
    opacity: 0.5,
    borderColor: '#888888',
  },
  innerCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#FFFFFF',
  },
});
