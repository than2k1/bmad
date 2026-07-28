import React, { useEffect } from 'react';
import { StyleSheet, View, Text, AppState, AppStateStatus } from 'react-native';
import { Camera, useCameraDevice } from 'react-native-vision-camera';
import { useCameraStore } from '../../stores/useCameraStore';

export const CameraViewfinder: React.FC = () => {
  const device = useCameraDevice('back');
  const isAppActive = useCameraStore((state) => state.isAppActive);
  const setIsAppActive = useCameraStore((state) => state.setIsAppActive);

  // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
  useEffect(() => {
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
        <Text style={styles.loadingText}>Initializing Camera Device...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFill}
        device={device}
        isActive={isAppActive}
        enableFpsGraph={false}
        lowLightBoost={true}
        photo={true}
        video={false}
      />
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
  },
  loadingText: {
    color: '#8E8E93',
    fontSize: 14,
    fontWeight: '500',
  },
});
