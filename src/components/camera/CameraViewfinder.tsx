import React, { useEffect } from 'react';
import { StyleSheet, View, Text, AppState, AppStateStatus, Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useCameraStore } from '../../stores/useCameraStore';
import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
import { analyzeKeyframe } from '../../utils/visionInferencingEngine';
import { HorizonLevelBar } from './HorizonLevelBar';
import { ModeSwitcher } from './ModeSwitcher';
import { LensPresetChips } from './LensPresetChips';
import { ShutterButton } from './ShutterButton';
import { AnalyzingIndicator } from './AnalyzingIndicator';
import { useSafeCameraDevice } from '../../utils/cameraHooks';

// Dynamic load Camera component for native platforms only
let CameraComponent: any = null;
if (Platform.OS !== 'web') {
  try {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    CameraComponent = require('react-native-vision-camera').Camera;
  } catch {
    CameraComponent = null;
  }
}

export const CameraViewfinder: React.FC = () => {
  const device = useSafeCameraDevice('back');
  const isAppActive = useCameraStore((state) => state.isAppActive);
  const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
  const activeLens = useCameraStore((state) => state.activeLens);
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const setVisionResult = useCameraStore((state) => state.setVisionResult);
  const setIsAnalyzing = useCameraStore((state) => state.setIsAnalyzing);
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

  // Trigger keyframe local AI inferencing upon viewfinder freeze
  useEffect(() => {
    let isCancelled = false;

    if (isFrozen) {
      setIsAnalyzing(true);
      analyzeKeyframe()
        .then((outcome) => {
          // Verify effect has not been cleaned up and store is still in frozen state
          if (!isCancelled && useCameraStore.getState().isFrozen) {
            setVisionResult(outcome.result, outcome.latencyMs);
            setIsAnalyzing(false);
          }
        })
        .catch(() => {
          if (!isCancelled && useCameraStore.getState().isFrozen) {
            setIsAnalyzing(false);
          }
        });
    } else {
      setIsAnalyzing(false);
    }

    return () => {
      isCancelled = true;
    };
  }, [isFrozen, setIsAnalyzing, setVisionResult]);

  // Dynamic safe area positioning with fallbacks
  const topOffset = Math.max(insets.top + 10, 54);
  const bottomOffset = Math.max(insets.bottom + 16, 40);

  const targetZoom = getNumericZoom(activeLens);
  const zoomValue = device ? clampZoom(targetZoom, device.minZoom, device.maxZoom) : targetZoom;

  const isCameraActive = isAppActive && !isFrozen;

  return (
    <View style={styles.container}>
      {device && CameraComponent ? (
        <CameraComponent
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={isCameraActive}
          zoom={zoomValue}
          fps={60}
          enableFpsGraph={false}
          lowLightBoost={true}
          photo={true}
          video={false}
        />
      ) : (
        <View style={styles.simulatorPreviewCanvas}>
          <View style={[styles.simulatorBadge, isFrozen && styles.simulatorBadgeFrozen]}>
            <Text style={[styles.simulatorBadgeText, isFrozen && styles.simulatorBadgeTextFrozen]}>
              {isFrozen ? 'KEYFRAME FROZEN (KEYFRAME AI PAUSE)' : `SIMULATOR PREVIEW (${activeLens} • ${targetZoom}x)`}
            </Text>
          </View>
        </View>
      )}

      {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
      <AnalyzingIndicator />

      {/* Top HUD Overlay - Mode Switcher */}
      <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
        <ModeSwitcher />
      </View>

      {/* Center HUD Overlay - Horizon Leveling Bar */}
      <HorizonLevelBar />

      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
      <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
        <LensPresetChips />
        <View style={styles.shutterContainer}>
          <ShutterButton />
        </View>
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
  simulatorPreviewCanvas: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#121214',
    justifyContent: 'center',
    alignItems: 'center',
  },
  simulatorBadge: {
    backgroundColor: 'rgba(255, 214, 10, 0.2)',
    borderColor: '#FFD60A',
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  simulatorBadgeFrozen: {
    backgroundColor: 'rgba(0, 229, 255, 0.2)',
    borderColor: '#00E5FF',
  },
  simulatorBadgeText: {
    color: '#FFD60A',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  simulatorBadgeTextFrozen: {
    color: '#00E5FF',
  },
  shutterContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
});
