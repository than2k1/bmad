# Development Guide — PoseCam (bmad-camera-app)

## Technical Prerequisites

Before developing or building **PoseCam**, ensure your environment meets the following requirements:

- **Node.js:** `v18.x` or `v20.x` LTS
- **Package Manager:** `npm` (v9+) or `yarn` / `pnpm`
- **Expo CLI:** Expo SDK `~51.0.0`
- **iOS Development (macOS only):** Xcode 15+, CocoaPods, iOS Simulator
- **Android Development:** Android Studio, Android SDK (API 34+), Android Emulator with Camera support
- **TypeScript:** `v5.1.3+`

---

## Local Environment Setup

1. **Clone the Repository:**
   ```bash
   git clone <repository-url>
   cd bmad-camera-app
   ```

2. **Install Dependencies:**
   ```bash
   npm install
   ```

3. **Verify Configuration:**
   Check `app.json` and ensure camera permissions are specified:
   - iOS: `NSCameraUsageDescription`
   - Android: `android.permission.CAMERA`

---

## Running the Application

### Development Server (Expo Metro Bundler)
Start the interactive Expo Metro development server:
```bash
npm start
# or
npx expo start
```

### Platform-Specific Launch Options

- **iOS Simulator:**
  ```bash
  npm run ios
  ```
- **Android Emulator / Device:**
  ```bash
  npm run android
  ```
- **Web Preview (Simulator Fallback Mode):**
  ```bash
  npm run web
  ```

> **Note on Web / Simulator Preview:** On platforms without native hardware camera support (such as web browsers or desktop simulators), PoseCam automatically switches to **Simulator Canvas Mode**. In this mode, synthetic image tensors and simulated pose data are generated for development testing without requiring native hardware camera access.

---

## Project Scripts Summary

| Command | Action |
|---|---|
| `npm start` | Launches the Expo Metro bundler server |
| `npm run android` | Launches the Expo app on an attached Android device / emulator |
| `npm run ios` | Launches the Expo app on an iOS simulator |
| `npm run web` | Launches the web preview server using Metro bundler |
| `npx jest` | Runs unit test suites across store, hook, and utility modules |

---

## Unit & Integration Testing Strategy

The project contains unit test suites co-located under `__tests__` directories:

- **Store Tests:** `src/stores/__tests__/useCameraStore.test.ts`
- **Hook Tests:** `src/hooks/__tests__/usePhotoCapture.test.ts`
- **Component Tests:** `src/components/camera/__tests__/CameraViewfinder.test.tsx`
- **Engine Tests:** `src/utils/__tests__/` (testing ONNX parsing, composition scoring, spatial extraction)

Run all unit tests with Jest:
```bash
npx jest
```

---

## Key Architecture Conventions

1. **State Management:** Use `useCameraStore` (Zustand) for global application state. Avoid passing deeply nested props across overlay components.
2. **Camera Hardware Abstraction:** Always check `Platform.OS !== 'web'` and use `useSafeCameraDevice` for safe hardware device resolution.
3. **AI Inferencing Safety:** Keep ONNX inference calls asynchronous and bound to `isFrozen` state with clean-up flags to prevent memory leaks and state updates on unmounted components.
4. **Layout & Safe Areas:** Always compute HUD top and bottom offsets using `useSafeAreaInsets()` to guarantee compatibility across notched iPhone screens and Android edge-to-edge displays.
