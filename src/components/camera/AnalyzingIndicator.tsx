import React, { useEffect } from 'react';
import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  withSequence,
  cancelAnimation,
  Easing,
} from 'react-native-reanimated';
import { useCameraStore } from '../../stores/useCameraStore';

export const AnalyzingIndicator: React.FC = () => {
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const isAnalyzing = useCameraStore((state) => state.isAnalyzing);
  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);

  const pulseOpacity = useSharedValue(0.6);

  useEffect(() => {
    if (isAnalyzing) {
      pulseOpacity.value = withRepeat(
        withSequence(
          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
        ),
        -1,
        true
      );
    } else {
      pulseOpacity.value = 0.6;
    }

    return () => {
      cancelAnimation(pulseOpacity);
    };
  }, [isAnalyzing, pulseOpacity]);

  const animatedPillStyle = useAnimatedStyle(() => {
    return {
      opacity: pulseOpacity.value,
    };
  });

  if (!isFrozen && !isAnalyzing) {
    return null;
  }

  return (
    <Pressable
      style={styles.overlay}
      onPress={toggleFreeze}
      accessibilityRole="button"
      accessibilityLabel="Unfreeze keyframe and resume live camera feed"
      accessibilityHint="Tapping anywhere on screen un-freezes the camera preview"
    >
      <Animated.View style={[styles.hudContainer, animatedPillStyle]}>
        <View style={styles.pill}>
          <ActivityIndicator size="small" color="#00E5FF" style={styles.spinner} />
          <Text style={styles.text}>Analyzing...</Text>
        </View>
        <Text style={styles.hintText}>Tap anywhere to resume live view</Text>
      </Animated.View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 20,
  },
  hudContainer: {
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(0, 229, 255, 0.3)',
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 6,
  },
  spinner: {
    marginRight: 8,
  },
  text: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  hintText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '400',
    marginTop: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
