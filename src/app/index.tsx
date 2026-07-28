import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useSafeCameraPermission } from '../utils/cameraHooks';
import { useCameraStore } from '../stores/useCameraStore';
import { CameraPermissionScreen } from '../components/camera/CameraPermissionScreen';
import { CameraViewfinder } from '../components/camera/CameraViewfinder';

export default function MainApp() {
  const { hasPermission } = useSafeCameraPermission();
  const setPermissionStatus = useCameraStore((state) => state.setPermissionStatus);

  useEffect(() => {
    setPermissionStatus(hasPermission ? 'granted' : 'not-determined');
  }, [hasPermission, setPermissionStatus]);

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {hasPermission ? (
        <CameraViewfinder />
      ) : (
        <CameraPermissionScreen onPermissionGranted={() => setPermissionStatus('granted')} />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
});
