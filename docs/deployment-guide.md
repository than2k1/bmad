# Deployment Guide — PoseCam (bmad-camera-app)

## Deployment Overview

**PoseCam** is an Expo-based React Native mobile application supporting native deployment to **iOS (App Store)** and **Android (Google Play Store)**.

---

## Native Permissions & Configuration

### iOS Configuration (`app.json` & `Info.plist`)
Camera access is mandatory for live viewfinder framing and local vision inferencing:
```json
{
  "expo": {
    "ios": {
      "supportsTablet": true,
      "infoPlist": {
        "NSCameraUsageDescription": "Camera access is required for real-time viewfinder framing and AI pose suggestions."
      }
    }
  }
}
```

### Android Configuration (`app.json` & `AndroidManifest.xml`)
Camera permission request:
```json
{
  "expo": {
    "android": {
      "permissions": [
        "android.permission.CAMERA"
      ]
    }
  }
}
```

---

## On-Device AI Model Assets

PoseCam relies on an offline ONNX model for zero-latency local inferencing:
- **Model File:** `assets/models/yolov8n-pose.onnx`
- **Inference Runtime:** `react-native-vision-camera` + `onnxruntime-web` / `onnxruntime-node`
- **Packaging:** Ensure `assets/models/` is included in the native bundle assets so ONNX can instantiate offline without internet access.

---

## Production Build Workflow (EAS Build)

### 1. Install Expo Application Services (EAS) CLI
```bash
npm install -g eas-cli
eas login
```

### 2. Configure EAS (`eas.json`)
Initialize EAS configuration:
```bash
eas build:configure
```

Sample `eas.json`:
```json
{
  "cli": {
    "version": ">= 7.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal"
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {
      "autoIncrement": true
    }
  },
  "submit": {
    "production": {}
  }
}
```

### 3. Build for Android (APK / AAB)
Generate production Android App Bundle (AAB):
```bash
eas build --platform android --profile production
```

### 4. Build for iOS (IPA)
Generate production iOS Archive (IPA):
```bash
eas build --platform ios --profile production
```

---

## App Store Submission

- **Google Play Console:** Upload the generated `.aab` file via EAS Submit:
  ```bash
  eas submit --platform android
  ```
- **Apple App Store Connect:** Submit the generated `.ipa` file via EAS Submit or Transporter:
  ```bash
  eas submit --platform ios
  ```

---

## Performance & Thermal Stability Guidelines (NFR Compliance)

- **NFR-1.1:** Keyframe local AI inferencing runs in under **200ms** on modern mobile hardware.
- **NFR-2.1:** Camera feed auto-pauses when the application goes to background (`AppState.currentState !== 'active'`) to prevent device thermal throttling and preserve battery life.
- **NFR-3.1:** Memory buffers (`Float32Array`) are pre-allocated and reused to eliminate garbage collection pauses during live inferencing.
