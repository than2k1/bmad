import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Linking, SafeAreaView } from 'react-native';
import { useSafeCameraPermission } from '../../utils/cameraHooks';
import { useCameraStore } from '../../stores/useCameraStore';

interface CameraPermissionScreenProps {
  onPermissionGranted?: () => void;
}

export const CameraPermissionScreen: React.FC<CameraPermissionScreenProps> = ({ onPermissionGranted }) => {
  const { hasPermission, requestPermission } = useSafeCameraPermission();
  const permissionStatus = useCameraStore((state) => state.permissionStatus);
  const setPermissionStatus = useCameraStore((state) => state.setPermissionStatus);

  const handleRequestPermission = async () => {
    try {
      const isGranted = await requestPermission();
      if (isGranted) {
        setPermissionStatus('granted');
        onPermissionGranted?.();
      } else {
        setPermissionStatus('denied');
      }
    } catch {
      setPermissionStatus('denied');
    }
  };

  const handleOpenSettings = async () => {
    try {
      await Linking.openSettings();
    } catch {
      // Fallback if openSettings fails
    }
  };

  const isDenied = permissionStatus === 'denied' || permissionStatus === 'restricted';

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.cameraIcon}>📷</Text>
        </View>

        <Text style={styles.title}>Camera Access Required</Text>
        
        <Text style={styles.description}>
          {isDenied 
            ? 'Camera permission has been denied. Please open system settings to enable camera access for PoseCam.' 
            : 'PoseCam needs access to your camera to display the live 60 FPS viewfinder and provide real-time AI pose framing guidance.'}
        </Text>

        <View style={styles.buttonContainer}>
          {!hasPermission && !isDenied ? (
            <TouchableOpacity 
              style={styles.primaryButton} 
              onPress={handleRequestPermission}
              activeOpacity={0.8}
            >
              <Text style={styles.primaryButtonText}>Enable Camera</Text>
            </TouchableOpacity>
          ) : null}

          <TouchableOpacity 
            style={isDenied ? styles.primaryButton : styles.secondaryButton} 
            onPress={handleOpenSettings}
            activeOpacity={0.8}
          >
            <Text style={isDenied ? styles.primaryButtonText : styles.secondaryButtonText}>Open System Settings</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.privacyNote}>
          <Text style={styles.privacyText}>
            🔒 100% On-Device Privacy: Your photos and video stream never leave your device.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F0F11',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  iconContainer: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: '#1E1E24',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#2A2A36',
  },
  cameraIcon: {
    fontSize: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 12,
    textAlign: 'center',
    letterSpacing: -0.5,
  },
  description: {
    fontSize: 15,
    color: '#A0A0B0',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  buttonContainer: {
    width: '100%',
    gap: 12,
  },
  primaryButton: {
    backgroundColor: '#3B82F6',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#3B82F6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#1E1E24',
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#2A2A36',
  },
  secondaryButtonText: {
    color: '#E0E0E8',
    fontSize: 16,
    fontWeight: '500',
  },
  privacyNote: {
    marginTop: 40,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#16161D',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#22222E',
  },
  privacyText: {
    fontSize: 12,
    color: '#71717A',
    textAlign: 'center',
    lineHeight: 16,
  },
});
