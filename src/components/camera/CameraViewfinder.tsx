import React, { useEffect } from 'react';
import { StyleSheet, View, Text, AppState, AppStateStatus } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraStore } from '../../stores/useCameraStore';
import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
import { HorizonLevelBar } from './HorizonLevelBar';
import { ModeSwitcher } from './ModeSwitcher';
import { LensPresetChips } from './LensPresetChips';

export const CameraViewfinder: React.FC = () => {
  const device = useCameraDevice('back');
  const isAppActive = useCameraStore((state) => state.isAppActive);
  const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
  const activeLens = useCameraStore((state) => state.activeLens);
  const insets = useSafeAreaInsets();

  // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
  useEffect(() => {
    // Initial sync on mount
    setIsAppActive(AppState.currentState === 'active');

    const subscription = AppState.addEventListener('change', (nextAppState: AppStateStatus) => {
      const active = nextAppState === 'active';
      setIsAppActive(active);
    });

    return () => {
      subscription.remove();
    };
  }, [setIsAppActive]);

  if (device == null) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>Camera Unavailable</Text>
        <Text style={styles.loadingText}>
          No back camera device found. Please test on a physical iOS or Android device.
        </Text>
      </View>
    );
  }

  // Safely clamp zoom based on active lens preset and hardware device capabilities (AC #4)
  const targetZoom = getNumericZoom(activeLens);
  const zoomValue = clampZoom(targetZoom, device.minZoom, device.maxZoom);

  // Dynamic safe area positioning with fallbacks
  const topOffset = Math.max(insets.top + 10, 54);
  const bottomOffset = Math.max(insets.bottom + 16, 40);

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isAppActive}
        zoom={zoomValue}
        fps={60}
        enableFpsGraph={false}
        lowLightBoost={true}
        photo={true}
        video={false}
      />

      {/* Top HUD Overlay - Mode Switcher */}
      <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
        <ModeSwitcher />
      </View>

      {/* Center HUD Overlay - Horizon Leveling Bar */}
      <HorizonLevelBar />

      {/* Bottom HUD Overlay - Lens Preset Chips */}
      <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
        <LensPresetChips />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#0F0F11',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '400',
    textAlign: 'center',
    lineHeight: 20,
  },
  topHudContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
  bottomHudContainer: {
    position: 'absolute',
    left: 0,
    right: 0,
    zIndex: 20,
    alignItems: 'center',
  },
});
