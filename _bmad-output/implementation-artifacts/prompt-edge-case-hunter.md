# Edge Case Hunter Review Prompt

Invoke the `bmad-review-edge-case-hunter` skill on this diff:

```diff
diff --git a/src/types/camera.ts b/src/types/camera.ts
index 4967157..39c10ce 100644
--- a/src/types/camera.ts
+++ b/src/types/camera.ts
@@ -21,9 +21,12 @@ export interface CameraState {
   isAppActive: boolean;
   setIsAppActive: (active: boolean) => void;
 
-  // Frozen Keyframe State
+  // Frozen Keyframe & Vision Analysis State
   isFrozen: boolean;
   setIsFrozen: (frozen: boolean) => void;
+  isAnalyzing: boolean;
+  setIsAnalyzing: (analyzing: boolean) => void;
+  toggleFreeze: () => void;
 
   // Horizon Leveling Bar State
   showHorizonBar: boolean;

diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
index a9f0328..3728639 100644
--- a/src/stores/useCameraStore.ts
+++ b/src/stores/useCameraStore.ts
@@ -17,6 +17,18 @@ export const useCameraStore = create<CameraState>((set) => ({
   isFrozen: false,
   setIsFrozen: (frozen: boolean) => set({ isFrozen: frozen, isAnalyzing: frozen }),
 
+  isAnalyzing: false,
+  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
+
+  toggleFreeze: () =>
+    set((state) => {
+      const nextFrozen = !state.isFrozen;
+      return {
+        isFrozen: nextFrozen,
+        isAnalyzing: nextFrozen,
+      };
+    }),
+
   showHorizonBar: true,
   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
 }));

diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
index 5c976f3..0aefcce 100644
--- a/src/components/camera/CameraViewfinder.tsx
+++ b/src/components/camera/CameraViewfinder.tsx
@@ -6,6 +6,8 @@ import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
 import { HorizonLevelBar } from './HorizonLevelBar';
 import { ModeSwitcher } from './ModeSwitcher';
 import { LensPresetChips } from './LensPresetChips';
+import { ShutterButton } from './ShutterButton';
+import { AnalyzingIndicator } from './AnalyzingIndicator';
 import { useSafeCameraDevice } from '../../utils/cameraHooks';
 
 // Dynamic load Camera component for native platforms only
@@ -24,6 +26,7 @@ export const CameraViewfinder: React.FC = () => {
   const isAppActive = useCameraStore((state) => state.isAppActive);
   const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
   const activeLens = useCameraStore((state) => state.activeLens);
+  const isFrozen = useCameraStore((state) => state.isFrozen);
   const insets = useSafeAreaInsets();
 
   // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
@@ -48,13 +51,15 @@ export const CameraViewfinder: React.FC = () => {
   const targetZoom = getNumericZoom(activeLens);
   const zoomValue = device ? clampZoom(targetZoom, device.minZoom, device.maxZoom) : targetZoom;
 
+  const isCameraActive = isAppActive && !isFrozen;
+
   return (
     <View style={styles.container}>
       {device && CameraComponent ? (
         <CameraComponent
           style={StyleSheet.absoluteFill}
           device={device}
-          isActive={isAppActive}
+          isActive={isCameraActive}
           zoom={zoomValue}
           fps={60}
           enableFpsGraph={false}
@@ -64,12 +69,17 @@ export const CameraViewfinder: React.FC = () => {
         />
       ) : (
         <View style={styles.simulatorPreviewCanvas}>
-          <View style={styles.simulatorBadge}>
-            <Text style={styles.simulatorBadgeText}>SIMULATOR PREVIEW ({activeLens} • {targetZoom}x)</Text>
+          <View style={[styles.simulatorBadge, isFrozen && styles.simulatorBadgeFrozen]}>
+            <Text style={[styles.simulatorBadgeText, isFrozen && styles.simulatorBadgeTextFrozen]}>
+              {isFrozen ? 'KEYFRAME FROZEN (KEYFRAME AI PAUSE)' : `SIMULATOR PREVIEW (${activeLens} • ${targetZoom}x)`}
+            </Text>
           </View>
         </View>
       )}
 
+      {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
+      <AnalyzingIndicator />
+
       {/* Top HUD Overlay - Mode Switcher */}
       <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
         <ModeSwitcher />
@@ -78,9 +88,12 @@ export const CameraViewfinder: React.FC = () => {
       {/* Center HUD Overlay - Horizon Leveling Bar */}
       <HorizonLevelBar />
 
-      {/* Bottom HUD Overlay - Lens Preset Chips */}
+      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
       <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
         <LensPresetChips />
+        <View style={styles.shutterContainer}>
+          <ShutterButton />
+        </View>
       </View>
     </View>
   );

diff --git a/src/components/camera/ShutterButton.tsx b/src/components/camera/ShutterButton.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/camera/ShutterButton.tsx
@@ -0,0 +1,62 @@
+import React from 'react';
+import { StyleSheet, View, TouchableOpacity } from 'react-native';
+import { useCameraStore } from '../../stores/useCameraStore';
+
+interface ShutterButtonProps {
+  onPress?: () => void;
+}
+
+export const ShutterButton: React.FC<ShutterButtonProps> = ({ onPress }) => {
+  const isFrozen = useCameraStore((state) => state.isFrozen);
+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
+
+  const handlePress = () => {
+    toggleFreeze();
+    if (onPress) {
+      onPress();
+    }
+  };
+
+  return (
+    <TouchableOpacity
+      style={styles.outerRing}
+      onPress={handlePress}
+      activeOpacity={0.7}
+      accessibilityRole="button"
+      accessibilityLabel="Analyze and freeze keyframe"
+      accessibilityHint={isFrozen ? "Tap to unfreeze camera feed" : "Tap to freeze frame for analysis"}
+      accessibilityState={{ selected: isFrozen }}
+    >
+      <View style={[styles.innerCircle, isFrozen && styles.innerCircleFrozen]} />
+    </TouchableOpacity>
+  );
+};

diff --git a/src/components/camera/AnalyzingIndicator.tsx b/src/components/camera/AnalyzingIndicator.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/camera/AnalyzingIndicator.tsx
@@ -0,0 +1,115 @@
+import React, { useEffect } from 'react';
+import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
+import Animated, {
+  useSharedValue,
+  useAnimatedStyle,
+  withRepeat,
+  withTiming,
+  withSequence,
+  cancelAnimation,
+  Easing,
+} from 'react-native-reanimated';
+import { useCameraStore } from '../../stores/useCameraStore';
+
+export const AnalyzingIndicator: React.FC = () => {
+  const isFrozen = useCameraStore((state) => state.isFrozen);
+  const isAnalyzing = useCameraStore((state) => state.isAnalyzing);
+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
+
+  const pulseOpacity = useSharedValue(0.6);
+
+  useEffect(() => {
+    if (isAnalyzing) {
+      pulseOpacity.value = withRepeat(
+        withSequence(
+          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
+          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
+        ),
+        -1,
+        true
+      );
+    } else {
+      pulseOpacity.value = 0.6;
+    }
+
+    return () => {
+      cancelAnimation(pulseOpacity);
+    };
+  }, [isAnalyzing, pulseOpacity]);
+
+  const animatedPillStyle = useAnimatedStyle(() => {
+    return {
+      opacity: pulseOpacity.value,
+    };
+  });
+
+  if (!isFrozen && !isAnalyzing) {
+    return null;
+  }
+
+  return (
+    <Pressable
+      style={styles.overlay}
+      onPress={toggleFreeze}
+      accessibilityRole="button"
+      accessibilityLabel="Unfreeze keyframe and resume live camera feed"
+      accessibilityHint="Tapping anywhere on screen un-freezes the camera preview"
+    >
+      <Animated.View style={[styles.hudContainer, animatedPillStyle]}>
+        <View style={styles.pill}>
+          <ActivityIndicator size="small" color="#00E5FF" style={styles.spinner} />
+          <Text style={styles.text}>Analyzing...</Text>
+        </View>
+        <Text style={styles.hintText}>Tap anywhere to resume live view</Text>
+      </Animated.View>
+    </Pressable>
+  );
+};

diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
new file mode 100644
--- /dev/null
+++ b/src/stores/__tests__/useCameraStore.test.ts
@@ -0,0 +1,48 @@
+import { useCameraStore } from '../useCameraStore';
+
+function assert(condition: boolean, message: string) {
+  if (!condition) {
+    throw new Error(`Assertion failed: ${message}`);
+  }
+}
+
+export function runCameraStoreTests() {
+  const store = useCameraStore.getState();
+
+  // Test initial state
+  assert(store.isFrozen === false, 'isFrozen initial value should be false');
+  assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
+
+  // Test setIsAnalyzing
+  store.setIsAnalyzing(true);
+  assert(useCameraStore.getState().isAnalyzing === true, 'setIsAnalyzing(true) failed');
+  store.setIsAnalyzing(false);
+  assert(useCameraStore.getState().isAnalyzing === false, 'setIsAnalyzing(false) failed');
+
+  // Test toggleFreeze - freeze state transition
+  store.toggleFreeze();
+  let state = useCameraStore.getState();
+  assert(state.isFrozen === true, 'toggleFreeze() should set isFrozen to true when false');
+  assert(state.isAnalyzing === true, 'toggleFreeze() should set isAnalyzing to true when freezing');
+
+  // Test toggleFreeze - unfreeze state transition
+  store.toggleFreeze();
+  state = useCameraStore.getState();
+  assert(state.isFrozen === false, 'toggleFreeze() should set isFrozen to false when true');
+  assert(state.isAnalyzing === false, 'toggleFreeze() should set isAnalyzing to false when un-freezing');
+
+  // Test setIsFrozen directly
+  store.setIsFrozen(true);
+  assert(useCameraStore.getState().isFrozen === true, 'setIsFrozen(true) failed');
+  store.setIsFrozen(false);
+  assert(useCameraStore.getState().isFrozen === false, 'setIsFrozen(false) failed');
+
+  console.log('All useCameraStore unit tests passed successfully!');
+}
+
+if (typeof require !== 'undefined' && require.main === module) {
+  runCameraStoreTests();
+} else if (typeof process !== 'undefined' && process.argv[1]?.includes('useCameraStore.test')) {
+  runCameraStoreTests();
+}
+```
