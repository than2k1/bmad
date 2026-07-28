import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { useCameraPermission } from 'react-native-vision-camera';
import { useCameraStore } from '../stores/useCameraStore';
import { CameraPermissionScreen } from '../components/camera/CameraPermissionScreen';
import { CameraViewfinder } from '../components/camera/CameraViewfinder';

export default function MainApp() {
  const { hasPermission } = useCameraPermission();
  const permissionStatus = useCameraStore((state) => state.permissionStatus);
  const setPermissionStatus = useCameraStore((state) => state.setPermissionStatus);

  useEffect(() => {
    if (hasPermission) {
      setPermissionStatus('granted');
    }
  }, [hasPermission, setPermissionStatus]);

  const isGranted = hasPermission || permissionStatus === 'granted';

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      {isGranted ? (
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
