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
  const visionResult = useCameraStore((state) => state.visionResult);
  const inferenceLatencyMs = useCameraStore((state) => state.inferenceLatencyMs);
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
      pulseOpacity.value = 1.0;
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
        <View style={[styles.pill, visionResult && styles.pillComplete]}>
          {isAnalyzing ? (
            <>
              <ActivityIndicator size="small" color="#00E5FF" style={styles.spinner} />
              <Text style={styles.text}>Analyzing Keyframe...</Text>
            </>
          ) : visionResult && inferenceLatencyMs !== null ? (
            <>
              <View style={styles.completeDot} />
              <Text style={styles.completeText}>
                Analyzed in {inferenceLatencyMs}ms ({visionResult.subjectCount.toUpperCase()} • {visionResult.sceneType.toUpperCase()})
              </Text>
            </>
          ) : (
            <Text style={styles.text}>Keyframe Frozen</Text>
          )}
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
  pillComplete: {
    borderColor: 'rgba(52, 199, 89, 0.5)',
    shadowColor: '#34C759',
    backgroundColor: 'rgba(15, 23, 42, 0.92)',
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
  completeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#34C759',
    marginRight: 8,
  },
  completeText: {
    color: '#34C759',
    fontSize: 14,
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
