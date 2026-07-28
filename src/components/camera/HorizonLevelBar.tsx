import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { DeviceMotion } from 'expo-sensors';
import Animated, { useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { useCameraStore } from '../../stores/useCameraStore';

const LEVEL_THRESHOLD_RAD = (1.0 * Math.PI) / 180; // 1.0 degree in radians

export const HorizonLevelBar: React.FC = () => {
  const isAppActive = useCameraStore((state) => state.isAppActive);
  const showHorizonBar = useCameraStore((state) => state.showHorizonBar);

  // Reanimated shared values on UI thread
  const rollRad = useSharedValue(0);
  const isLevel = useSharedValue(true);

  useEffect(() => {
    if (!isAppActive || !showHorizonBar) {
      return;
    }

    // Set 60Hz update interval (16ms)
    DeviceMotion.setUpdateInterval(16);

    const subscription = DeviceMotion.addListener((motionData) => {
      if (motionData && motionData.rotation && typeof motionData.rotation.gamma === 'number') {
        const gamma = motionData.rotation.gamma;
        // Invert rotation angle so bar stays horizontal relative to horizon
        rollRad.value = -gamma;
        isLevel.value = Math.abs(gamma) <= LEVEL_THRESHOLD_RAD;
      }
    });

    return () => {
      subscription.remove();
    };
  }, [isAppActive, showHorizonBar, rollRad, isLevel]);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rollRad.value}rad` }],
      backgroundColor: isLevel.value ? '#30D158' : 'rgba(255, 255, 255, 0.8)',
    };
  });

  const animatedCenterDotStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: isLevel.value ? '#30D158' : 'rgba(255, 255, 255, 0.9)',
    };
  });

  if (!showHorizonBar) {
    return null;
  }

  return (
    <View pointerEvents="none" style={styles.container}>
      {/* Center Reticle Dot */}
      <Animated.View style={[styles.centerDot, animatedCenterDotStyle]} />

      {/* Rotating 2D Horizon Level Line */}
      <Animated.View style={[styles.levelLine, animatedStyle]}>
        <View style={[styles.endTick, styles.leftTick]} />
        <View style={[styles.endTick, styles.rightTick]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  centerDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    position: 'absolute',
  },
  levelLine: {
    width: 180,
    height: 2,
    borderRadius: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  endTick: {
    position: 'absolute',
    width: 2,
    height: 8,
    backgroundColor: 'inherit',
  },
  leftTick: {
    left: 0,
  },
  rightTick: {
    right: 0,
  },
});
