# Blind Hunter Review Prompt

Invoke the mad-review-adversarial-general skill on this diff:

`diff
diff --git a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
index e9c0622..e88b8fa 100644
--- a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+++ b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
@@ -1,6 +1,9 @@
+---
+baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
+---
 # Story 3.1: Manual Framing Selector & Contextual Pose Filtering
 
-Status: ready-for-dev
+Status: done
 
 ## Story
 
@@ -25,24 +28,31 @@ so that the pose carousel displays templates that match my intended photo framin
 
 ## Tasks / Subtasks
 
-- [ ] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
-  - [ ] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
-  - [ ] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
-- [ ] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
-  - [ ] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
-  - [ ] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
-  - [ ] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
-- [ ] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
-  - [ ] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
-  - [ ] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
-  - [ ] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
-- [ ] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
-  - [ ] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
-  - [ ] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
-  - [ ] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
-- [ ] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
-  - [ ] Run TypeScript type checks (`npx tsc --noEmit`).
-  - [ ] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
+- [x] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
+  - [x] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
+  - [x] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
+- [x] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
+  - [x] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
+  - [x] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
+  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
+- [x] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
+  - [x] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
+  - [x] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
+  - [x] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
+- [x] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
+  - [x] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
+  - [x] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
+  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
+- [x] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
+  - [x] Run TypeScript type checks (`npx tsc --noEmit`).
+  - [x] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
+
+### Review Findings
+
+- [x] [Review][Patch] Stale selectedPoseId state when switching framing crops [src/stores/useCameraStore.ts:L50]
+- [x] [Review][Patch] Redundant subject count text formatting in PoseCarousel context badge [src/components/camera/PoseCarousel.tsx:L26]
+- [x] [Review][Patch] Lack of useMemo for filterPoseTemplates in PoseCarousel [src/components/camera/PoseCarousel.tsx:L15]
+- [x] [Review][Patch] Empty state UI missing in PoseCarousel when no poses match criteria [src/components/camera/PoseCarousel.tsx:L31]
 
 ## Dev Notes
 
@@ -97,22 +107,32 @@ Gemini 3.6 Flash (High)
 
 ### Debug Log References
 
+- `npx tsx src/stores/__tests__/useCameraStore.test.ts` -> PASSED
+- `npx tsx src/utils/__tests__/poseFilter.test.ts` -> PASSED
+- `npx tsc --noEmit` -> PASSED (0 errors)
+
 ### Completion Notes List
 
-- Story file generated by `bmad-create-story` workflow.
+- Defined framing crop types (`FramingCrop`), pose templates data contracts (`PoseTemplate`), and static COCO-17 pose catalog (`POSE_CATALOG`).
+- Expanded `useCameraStore` state with `selectedFraming` (default `'half_body'`) and `selectedPoseId` (default `null`).
+- Created pure, deterministic `poseFilter` utility supporting single framing crop filtering, dual framing + subject count filtering, and fallback behavior.
+- Built UI components `FramingSelector` and `PoseCarousel` with contextual subject count badge and integrated them into `CameraViewfinder` for `person` mode.
+- Verified 100% test pass rate across store unit tests, utility unit tests, and TypeScript compiler check.
 
 ### File List
 
-- `src/types/pose.ts`
-- `src/types/camera.ts`
-- `src/data/poseCatalog.ts`
-- `src/stores/useCameraStore.ts`
-- `src/utils/poseFilter.ts`
-- `src/utils/__tests__/poseFilter.test.ts`
-- `src/components/camera/FramingSelector.tsx`
-- `src/components/camera/PoseCarousel.tsx`
-- `src/components/camera/CameraViewfinder.tsx`
+- `src/types/pose.ts` (NEW)
+- `src/types/camera.ts` (MODIFIED)
+- `src/data/poseCatalog.ts` (NEW)
+- `src/stores/useCameraStore.ts` (MODIFIED)
+- `src/stores/__tests__/useCameraStore.test.ts` (MODIFIED)
+- `src/utils/poseFilter.ts` (NEW)
+- `src/utils/__tests__/poseFilter.test.ts` (NEW)
+- `src/components/camera/FramingSelector.tsx` (NEW)
+- `src/components/camera/PoseCarousel.tsx` (NEW)
+- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)
 
 ### Change Log
 
 - 2026-07-29: Created Story 3.1 context for Manual Framing Selector & Contextual Pose Filtering. Set status to ready-for-dev.
+- 2026-07-30: Completed implementation of Story 3.1: manual framing selector, pose catalog, camera store state expansion, contextual pose filtering, HUD integration, and unit test suite. Status updated to review.
diff --git a/_bmad-output/implementation-artifacts/prompt-acceptance-auditor.md b/_bmad-output/implementation-artifacts/prompt-acceptance-auditor.md
index e04190a..4cf51c0 100644
--- a/_bmad-output/implementation-artifacts/prompt-acceptance-auditor.md
+++ b/_bmad-output/implementation-artifacts/prompt-acceptance-auditor.md
@@ -1,128 +1,1021 @@
 # Acceptance Auditor Review Prompt
 
-You are an Acceptance Auditor. Review the provided diff against `_bmad-output/implementation-artifacts/2-1-shutter-keyframe-freeze-unfreeze-pipeline.md` and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
+You are an Acceptance Auditor. Review the provided diff against _bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md and any loaded context docs. Check for: violations of acceptance criteria, deviations from spec intent, missing implementation of specified behavior, contradictions between spec constraints and actual code. Output findings as a Markdown list. Each finding: one-line title, which AC/constraint it violates, and evidence from the diff.
 
 Diff:
-```diff
-diff --git a/src/types/camera.ts b/src/types/camera.ts
-index 4967157..39c10ce 100644
---- a/src/types/camera.ts
-+++ b/src/types/camera.ts
-@@ -21,9 +21,12 @@ export interface CameraState {
-   isAppActive: boolean;
-   setIsAppActive: (active: boolean) => void;
- 
--  // Frozen Keyframe State
-+  // Frozen Keyframe & Vision Analysis State
-   isFrozen: boolean;
-   setIsFrozen: (frozen: boolean) => void;
-+  isAnalyzing: boolean;
-+  setIsAnalyzing: (analyzing: boolean) => void;
-+  toggleFreeze: () => void;
+`diff
+diff --git a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+index e9c0622..0dec657 100644
+--- a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
++++ b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+@@ -1,6 +1,9 @@
++---
++baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
++---
+ # Story 3.1: Manual Framing Selector & Contextual Pose Filtering
  
-   // Horizon Leveling Bar State
-   showHorizonBar: boolean;
-
-diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
-index a9f0328..3728639 100644
---- a/src/stores/useCameraStore.ts
-+++ b/src/stores/useCameraStore.ts
-@@ -17,6 +17,18 @@ export const useCameraStore = create<CameraState>((set) => ({
-   isFrozen: false,
-   setIsFrozen: (frozen: boolean) => set({ isFrozen: frozen, isAnalyzing: frozen }),
- 
-+  isAnalyzing: false,
-+  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
-+
-+  toggleFreeze: () =>
-+    set((state) => {
-+      const nextFrozen = !state.isFrozen;
-+      return {
-+        isFrozen: nextFrozen,
-+        isAnalyzing: nextFrozen,
-+      };
-+    }),
+-Status: ready-for-dev
++Status: review
+ 
+ ## Story
+ 
+@@ -25,24 +28,24 @@ so that the pose carousel displays templates that match my intended photo framin
+ 
+ ## Tasks / Subtasks
+ 
+-- [ ] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
+-  - [ ] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
+-  - [ ] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
+-- [ ] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
+-  - [ ] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
+-  - [ ] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
+-  - [ ] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
+-- [ ] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
+-  - [ ] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
+-  - [ ] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
+-  - [ ] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
+-- [ ] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
+-  - [ ] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
+-  - [ ] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
+-  - [ ] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
+-- [ ] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
+-  - [ ] Run TypeScript type checks (`npx tsc --noEmit`).
+-  - [ ] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
++- [x] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
++  - [x] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
++  - [x] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
++- [x] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
++  - [x] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
++  - [x] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
++  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
++- [x] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
++  - [x] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
++  - [x] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
++  - [x] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
++- [x] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
++  - [x] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
++  - [x] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
++  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
++- [x] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
++  - [x] Run TypeScript type checks (`npx tsc --noEmit`).
++  - [x] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
+ 
+ ## Dev Notes
+ 
+@@ -97,22 +100,32 @@ Gemini 3.6 Flash (High)
+ 
+ ### Debug Log References
+ 
++- `npx tsx src/stores/__tests__/useCameraStore.test.ts` -> PASSED
++- `npx tsx src/utils/__tests__/poseFilter.test.ts` -> PASSED
++- `npx tsc --noEmit` -> PASSED (0 errors)
 +
-   showHorizonBar: true,
-   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
- }));
-
+ ### Completion Notes List
+ 
+-- Story file generated by `bmad-create-story` workflow.
++- Defined framing crop types (`FramingCrop`), pose templates data contracts (`PoseTemplate`), and static COCO-17 pose catalog (`POSE_CATALOG`).
++- Expanded `useCameraStore` state with `selectedFraming` (default `'half_body'`) and `selectedPoseId` (default `null`).
++- Created pure, deterministic `poseFilter` utility supporting single framing crop filtering, dual framing + subject count filtering, and fallback behavior.
++- Built UI components `FramingSelector` and `PoseCarousel` with contextual subject count badge and integrated them into `CameraViewfinder` for `person` mode.
++- Verified 100% test pass rate across store unit tests, utility unit tests, and TypeScript compiler check.
+ 
+ ### File List
+ 
+-- `src/types/pose.ts`
+-- `src/types/camera.ts`
+-- `src/data/poseCatalog.ts`
+-- `src/stores/useCameraStore.ts`
+-- `src/utils/poseFilter.ts`
+-- `src/utils/__tests__/poseFilter.test.ts`
+-- `src/components/camera/FramingSelector.tsx`
+-- `src/components/camera/PoseCarousel.tsx`
+-- `src/components/camera/CameraViewfinder.tsx`
++- `src/types/pose.ts` (NEW)
++- `src/types/camera.ts` (MODIFIED)
++- `src/data/poseCatalog.ts` (NEW)
++- `src/stores/useCameraStore.ts` (MODIFIED)
++- `src/stores/__tests__/useCameraStore.test.ts` (MODIFIED)
++- `src/utils/poseFilter.ts` (NEW)
++- `src/utils/__tests__/poseFilter.test.ts` (NEW)
++- `src/components/camera/FramingSelector.tsx` (NEW)
++- `src/components/camera/PoseCarousel.tsx` (NEW)
++- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)
+ 
+ ### Change Log
+ 
+ - 2026-07-29: Created Story 3.1 context for Manual Framing Selector & Contextual Pose Filtering. Set status to ready-for-dev.
++- 2026-07-30: Completed implementation of Story 3.1: manual framing selector, pose catalog, camera store state expansion, contextual pose filtering, HUD integration, and unit test suite. Status updated to review.
+diff --git a/_bmad-output/implementation-artifacts/sprint-status.yaml b/_bmad-output/implementation-artifacts/sprint-status.yaml
+index 7fdf6bc..57013d9 100644
+--- a/_bmad-output/implementation-artifacts/sprint-status.yaml
++++ b/_bmad-output/implementation-artifacts/sprint-status.yaml
+@@ -58,7 +58,7 @@ development_status:
+   2-2-local-on-device-vision-inferencing-engine: done
+   epic-2-retrospective: done
+   epic-3: in-progress
+-  3-1-manual-framing-selector-contextual-pose-filtering: ready-for-dev
++  3-1-manual-framing-selector-contextual-pose-filtering: review
+   3-2-coco-17-vector-pose-overlay-renderer: backlog
+   3-3-photographer-director-cues-alignment-feedback: backlog
+   epic-3-retrospective: optional
 diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
-index 5c976f3..0aefcce 100644
+index 1edcb6c..c555819 100644
 --- a/src/components/camera/CameraViewfinder.tsx
 +++ b/src/components/camera/CameraViewfinder.tsx
 @@ -6,6 +6,8 @@ import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
+ import { analyzeKeyframe } from '../../utils/visionInferencingEngine';
  import { HorizonLevelBar } from './HorizonLevelBar';
  import { ModeSwitcher } from './ModeSwitcher';
++import { FramingSelector } from './FramingSelector';
++import { PoseCarousel } from './PoseCarousel';
  import { LensPresetChips } from './LensPresetChips';
-+import { ShutterButton } from './ShutterButton';
-+import { AnalyzingIndicator } from './AnalyzingIndicator';
- import { useSafeCameraDevice } from '../../utils/cameraHooks';
+ import { ShutterButton } from './ShutterButton';
+ import { AnalyzingIndicator } from './AnalyzingIndicator';
+@@ -24,6 +26,7 @@ if (Platform.OS !== 'web') {
  
- // Dynamic load Camera component for native platforms only
-@@ -24,6 +26,7 @@ export const CameraViewfinder: React.FC = () => {
+ export const CameraViewfinder: React.FC = () => {
+   const device = useSafeCameraDevice('back');
++  const mode = useCameraStore((state) => state.mode);
    const isAppActive = useCameraStore((state) => state.isAppActive);
    const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
    const activeLens = useCameraStore((state) => state.activeLens);
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-   const insets = useSafeAreaInsets();
- 
-   // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
-@@ -48,13 +51,15 @@ export const CameraViewfinder: React.FC = () => {
-   const targetZoom = getNumericZoom(activeLens);
-   const zoomValue = device ? clampZoom(targetZoom, device.minZoom, device.maxZoom) : targetZoom;
- 
-+  const isCameraActive = isAppActive && !isFrozen;
-+
-   return (
-     <View style={styles.container}>
-       {device && CameraComponent ? (
-         <CameraComponent
-           style={StyleSheet.absoluteFill}
-           device={device}
--          isActive={isAppActive}
-+          isActive={isCameraActive}
-           zoom={zoomValue}
-           fps={60}
-           enableFpsGraph={false}
-@@ -64,12 +69,17 @@ export const CameraViewfinder: React.FC = () => {
-         />
-       ) : (
-         <View style={styles.simulatorPreviewCanvas}>
--          <View style={styles.simulatorBadge}>
--            <Text style={styles.simulatorBadgeText}>SIMULATOR PREVIEW ({activeLens} • {targetZoom}x)</Text>
-+          <View style={[styles.simulatorBadge, isFrozen && styles.simulatorBadgeFrozen]}>
-+            <Text style={[styles.simulatorBadgeText, isFrozen && styles.simulatorBadgeTextFrozen]}>
-+              {isFrozen ? 'KEYFRAME FROZEN (KEYFRAME AI PAUSE)' : `SIMULATOR PREVIEW (${activeLens} • ${targetZoom}x)`}
-+            </Text>
-           </View>
-         </View>
-       )}
- 
-+      {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
-+      <AnalyzingIndicator />
-+
-       {/* Top HUD Overlay - Mode Switcher */}
-       <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
-         <ModeSwitcher />
-@@ -78,9 +88,12 @@ export const CameraViewfinder: React.FC = () => {
+@@ -125,8 +128,14 @@ export const CameraViewfinder: React.FC = () => {
        {/* Center HUD Overlay - Horizon Leveling Bar */}
        <HorizonLevelBar />
  
--      {/* Bottom HUD Overlay - Lens Preset Chips */}
-+      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
+-      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
++      {/* Bottom HUD Overlay - Framing Selector, Pose Carousel, Lens Preset Chips & Shutter Button */}
        <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
++        {mode === 'person' && (
++          <View style={styles.personHudLayer}>
++            <FramingSelector />
++            <PoseCarousel />
++          </View>
++        )}
          <LensPresetChips />
-+        <View style={styles.shutterContainer}>
-+          <ShutterButton />
+         <View style={styles.shutterContainer}>
+           <ShutterButton />
+@@ -141,26 +150,6 @@ const styles = StyleSheet.create({
+     flex: 1,
+     backgroundColor: '#000000',
+   },
+-  loadingContainer: {
+-    flex: 1,
+-    backgroundColor: '#0F0F11',
+-    justifyContent: 'center',
+-    alignItems: 'center',
+-    paddingHorizontal: 24,
+-  },
+-  loadingTitle: {
+-    color: '#FFFFFF',
+-    fontSize: 18,
+-    fontWeight: '600',
+-    marginBottom: 8,
+-  },
+-  loadingText: {
+-    color: '#8E8E93',
+-    fontSize: 14,
+-    fontWeight: '400',
+-    textAlign: 'center',
+-    lineHeight: 20,
+-  },
+   topHudContainer: {
+     position: 'absolute',
+     left: 0,
+@@ -175,6 +164,11 @@ const styles = StyleSheet.create({
+     zIndex: 20,
+     alignItems: 'center',
+   },
++  personHudLayer: {
++    width: '100%',
++    alignItems: 'center',
++    marginBottom: 8,
++  },
+   simulatorPreviewCanvas: {
+     ...StyleSheet.absoluteFillObject,
+     backgroundColor: '#121214',
+@@ -203,7 +197,7 @@ const styles = StyleSheet.create({
+     color: '#00E5FF',
+   },
+   shutterContainer: {
+-    marginTop: 20,
++    marginTop: 16,
+     alignItems: 'center',
+   },
+ });
+diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
+index bdeff94..973d02e 100644
+--- a/src/stores/__tests__/useCameraStore.test.ts
++++ b/src/stores/__tests__/useCameraStore.test.ts
+@@ -15,6 +15,27 @@ export function runCameraStoreTests() {
+   assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
+   assert(store.visionResult === null, 'visionResult initial value should be null');
+   assert(store.inferenceLatencyMs === null, 'inferenceLatencyMs initial value should be null');
++  assert(store.selectedFraming === 'half_body', 'selectedFraming default value should be half_body');
++  assert(store.selectedPoseId === null, 'selectedPoseId default value should be null');
++
++  // Test framing crop updates
++  store.setSelectedFraming('headshot');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'setSelectedFraming(headshot) failed');
++  store.setSelectedFraming('full_body');
++  assert(useCameraStore.getState().selectedFraming === 'full_body', 'setSelectedFraming(full_body) failed');
++  store.setSelectedFraming('half_body');
++
++  // Test active pose selection
++  store.setSelectedPoseId('half-body-solo-arms-crossed');
++  assert(useCameraStore.getState().selectedPoseId === 'half-body-solo-arms-crossed', 'setSelectedPoseId failed');
++  store.setSelectedPoseId(null);
++  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedPoseId(null) failed');
++
++  // Test mode switching does not corrupt framing state
++  store.setSelectedFraming('headshot');
++  store.setMode('scene');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'selectedFraming should persist across mode switches');
++  store.setMode('person');
+ 
+   // Test setIsAnalyzing
+   store.setIsAnalyzing(true);
+diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
+index 13b0f4f..b2099e7 100644
+--- a/src/stores/useCameraStore.ts
++++ b/src/stores/useCameraStore.ts
+@@ -1,6 +1,7 @@
+ import { create } from 'zustand';
+ import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';
+ import { KeyframeVisionResult } from '../types/vision';
++import { FramingCrop } from '../types/pose';
+ 
+ export const useCameraStore = create<CameraState>((set) => ({
+   mode: 'person',
+@@ -44,4 +45,10 @@ export const useCameraStore = create<CameraState>((set) => ({
+ 
+   showHorizonBar: true,
+   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
++
++  selectedFraming: 'half_body',
++  setSelectedFraming: (framing: FramingCrop) => set({ selectedFraming: framing }),
++
++  selectedPoseId: null,
++  setSelectedPoseId: (id: string | null) => set({ selectedPoseId: id }),
+ }));
+diff --git a/src/types/camera.ts b/src/types/camera.ts
+index 1c088be..4fd687a 100644
+--- a/src/types/camera.ts
++++ b/src/types/camera.ts
+@@ -1,4 +1,5 @@
+ import { KeyframeVisionResult } from './vision';
++import { FramingCrop } from './pose';
+ 
+ export type AppMode = 'person' | 'scene';
+ 
+@@ -39,4 +40,10 @@ export interface CameraState {
+   // Horizon Leveling Bar State
+   showHorizonBar: boolean;
+   setShowHorizonBar: (show: boolean) => void;
++
++  // Framing Crop & Selected Pose State
++  selectedFraming: FramingCrop;
++  setSelectedFraming: (framing: FramingCrop) => void;
++  selectedPoseId: string | null;
++  setSelectedPoseId: (id: string | null) => void;
+ }
+diff --git a/src/components/camera/FramingSelector.tsx b/src/components/camera/FramingSelector.tsx
+new file mode 100644
+index 0000000..eca852c
+--- /dev/null
++++ b/src/components/camera/FramingSelector.tsx
+@@ -0,0 +1,78 @@
++import React from 'react';
++import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
++import { useCameraStore } from '../../stores/useCameraStore';
++import { FramingCrop } from '../../types/pose';
++
++interface FramingOption {
++  value: FramingCrop;
++  label: string;
++}
++
++const FRAMING_OPTIONS: FramingOption[] = [
++  { value: 'headshot', label: 'Headshot' },
++  { value: 'half_body', label: 'Half-Body' },
++  { value: 'full_body', label: 'Full-Body' },
++];
++
++export const FramingSelector: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const setSelectedFraming = useCameraStore((state) => state.setSelectedFraming);
++
++  return (
++    <View style={styles.container} accessibilityRole="tablist">
++      {FRAMING_OPTIONS.map((item) => {
++        const isActive = selectedFraming === item.value;
++        return (
++          <TouchableOpacity
++            key={item.value}
++            style={[styles.chip, isActive && styles.activeChip]}
++            onPress={() => setSelectedFraming(item.value)}
++            activeOpacity={0.7}
++            accessibilityRole="tab"
++            accessibilityState={{ selected: isActive }}
++            accessibilityLabel={`${item.label} Framing`}
++          >
++            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
++              {item.label}
++            </Text>
++          </TouchableOpacity>
++        );
++      })}
++    </View>
++  );
++};
++
++const styles = StyleSheet.create({
++  container: {
++    flexDirection: 'row',
++    backgroundColor: 'rgba(0, 0, 0, 0.55)',
++    borderRadius: 20,
++    padding: 3,
++    alignSelf: 'center',
++    marginBottom: 8,
++  },
++  chip: {
++    paddingVertical: 6,
++    paddingHorizontal: 14,
++    borderRadius: 16,
++    justifyContent: 'center',
++    alignItems: 'center',
++  },
++  activeChip: {
++    backgroundColor: 'rgba(0, 229, 255, 0.25)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++  },
++  label: {
++    fontSize: 12,
++    letterSpacing: 0.3,
++  },
++  activeLabel: {
++    color: '#00E5FF',
++    fontWeight: '700',
++  },
++  inactiveLabel: {
++    color: 'rgba(255, 255, 255, 0.65)',
++    fontWeight: '400',
++  },
++});
+diff --git a/src/components/camera/PoseCarousel.tsx b/src/components/camera/PoseCarousel.tsx
+new file mode 100644
+index 0000000..27d5d96
+--- /dev/null
++++ b/src/components/camera/PoseCarousel.tsx
+@@ -0,0 +1,157 @@
++import React from 'react';
++import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
++import { useCameraStore } from '../../stores/useCameraStore';
++import { filterPoseTemplates } from '../../utils/poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
++
++export const PoseCarousel: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const visionResult = useCameraStore((state) => state.visionResult);
++  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
++  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
++
++  const subjectCount = visionResult?.subjectCount ?? null;
++
++  const filteredPoses = filterPoseTemplates(POSE_CATALOG, {
++    framing: selectedFraming,
++    subjectCount: subjectCount,
++    category: 'person',
++  });
++
++  return (
++    <View style={styles.container}>
++      {subjectCount && (
++        <View style={styles.contextBadge}>
++          <Text style={styles.contextBadgeText}>
++            ⚡ Auto-Filtered for {subjectCount.toUpperCase()} ({visionResult?.subjectCount})
++          </Text>
 +        </View>
-       </View>
-     </View>
-   );
-
-diff --git a/src/components/camera/ShutterButton.tsx b/src/components/camera/ShutterButton.tsx
++      )}
++
++      <ScrollView
++        horizontal
++        showsHorizontalScrollIndicator={false}
++        contentContainerStyle={styles.scrollContent}
++        accessibilityRole="scrollbar"
++      >
++        {filteredPoses.map((pose) => {
++          const isSelected = selectedPoseId === pose.id;
++          return (
++            <TouchableOpacity
++              key={pose.id}
++              style={[styles.card, isSelected && styles.activeCard]}
++              onPress={() => setSelectedPoseId(isSelected ? null : pose.id)}
++              activeOpacity={0.8}
++              accessibilityRole="button"
++              accessibilityState={{ selected: isSelected }}
++              accessibilityLabel={`Pose Template: ${pose.title}`}
++            >
++              <View style={styles.cardHeader}>
++                <Text style={[styles.cardTitle, isSelected && styles.activeCardTitle]} numberOfLines={1}>
++                  {pose.title}
++                </Text>
++              </View>
++
++              <View style={styles.tagRow}>
++                {pose.subjectCountTag && (
++                  <View style={styles.tagBadge}>
++                    <Text style={styles.tagText}>{pose.subjectCountTag}</Text>
++                  </View>
++                )}
++                <View style={styles.tagBadgeSecondary}>
++                  <Text style={styles.tagTextSecondary}>{pose.framing.replace('_', ' ')}</Text>
++                </View>
++              </View>
++            </TouchableOpacity>
++          );
++        })}
++      </ScrollView>
++    </View>
++  );
++};
++
++const styles = StyleSheet.create({
++  container: {
++    width: '100%',
++    marginVertical: 6,
++  },
++  contextBadge: {
++    alignSelf: 'center',
++    backgroundColor: 'rgba(0, 229, 255, 0.15)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++    borderRadius: 12,
++    paddingHorizontal: 10,
++    paddingVertical: 3,
++    marginBottom: 6,
++  },
++  contextBadgeText: {
++    color: '#00E5FF',
++    fontSize: 11,
++    fontWeight: '600',
++    letterSpacing: 0.4,
++  },
++  scrollContent: {
++    paddingHorizontal: 16,
++    alignItems: 'center',
++  },
++  card: {
++    width: 130,
++    height: 64,
++    backgroundColor: 'rgba(20, 20, 25, 0.75)',
++    borderRadius: 12,
++    padding: 8,
++    marginRight: 10,
++    borderWidth: 1,
++    borderColor: 'rgba(255, 255, 255, 0.15)',
++    justifyContent: 'space-between',
++  },
++  activeCard: {
++    borderColor: '#FFD60A',
++    borderWidth: 2,
++    backgroundColor: 'rgba(255, 214, 10, 0.15)',
++  },
++  cardHeader: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    justifyContent: 'space-between',
++  },
++  cardTitle: {
++    color: '#FFFFFF',
++    fontSize: 12,
++    fontWeight: '600',
++  },
++  activeCardTitle: {
++    color: '#FFD60A',
++    fontWeight: '700',
++  },
++  tagRow: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    gap: 4,
++  },
++  tagBadge: {
++    backgroundColor: 'rgba(255, 255, 255, 0.15)',
++    borderRadius: 6,
++    paddingHorizontal: 6,
++    paddingVertical: 2,
++  },
++  tagText: {
++    color: '#FFFFFF',
++    fontSize: 9,
++    fontWeight: '600',
++    textTransform: 'uppercase',
++  },
++  tagBadgeSecondary: {
++    backgroundColor: 'rgba(255, 255, 255, 0.08)',
++    borderRadius: 6,
++    paddingHorizontal: 5,
++    paddingVertical: 2,
++  },
++  tagTextSecondary: {
++    color: 'rgba(255, 255, 255, 0.6)',
++    fontSize: 9,
++    fontWeight: '400',
++    textTransform: 'capitalize',
++  },
++});
+diff --git a/src/data/poseCatalog.ts b/src/data/poseCatalog.ts
+new file mode 100644
+index 0000000..f08c61f
+--- /dev/null
++++ b/src/data/poseCatalog.ts
+@@ -0,0 +1,283 @@
++import { PoseTemplate } from '../types/pose';
++
++const DEFAULT_SKELETON_CONNECTIONS: [string, string][] = [
++  ['nose', 'left_eye'],
++  ['nose', 'right_eye'],
++  ['left_shoulder', 'right_shoulder'],
++  ['left_shoulder', 'left_elbow'],
++  ['left_elbow', 'left_wrist'],
++  ['right_shoulder', 'right_elbow'],
++  ['right_elbow', 'right_wrist'],
++  ['left_shoulder', 'left_hip'],
++  ['right_shoulder', 'right_hip'],
++  ['left_hip', 'right_hip'],
++  ['left_hip', 'left_knee'],
++  ['left_knee', 'left_ankle'],
++  ['right_hip', 'right_knee'],
++  ['right_knee', 'right_ankle'],
++];
++
++export const POSE_CATALOG: PoseTemplate[] = [
++  // --- HEADSHOT POSES ---
++  {
++    id: 'headshot-solo-classic',
++    title: 'Classic Headshot',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'portrait', 'professional'],
++    keypoints: {
++      nose: [0.5, 0.35],
++      left_eye: [0.46, 0.32],
++      right_eye: [0.54, 0.32],
++      left_shoulder: [0.35, 0.65],
++      right_shoulder: [0.65, 0.65],
++      left_hip: [0.4, 0.95],
++      right_hip: [0.6, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-solo-tilt',
++    title: 'Engaged Head Tilt',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'casual', 'friendly'],
++    keypoints: {
++      nose: [0.52, 0.36],
++      left_eye: [0.47, 0.31],
++      right_eye: [0.55, 0.34],
++      left_shoulder: [0.32, 0.68],
++      right_shoulder: [0.68, 0.62],
++      left_hip: [0.38, 0.95],
++      right_hip: [0.62, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-couple-shoulder',
++    title: 'Couple Shoulder-to-Shoulder',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'headshot', 'close', 'warm'],
++    keypoints: {
++      nose: [0.38, 0.35],
++      left_eye: [0.34, 0.32],
++      right_eye: [0.42, 0.32],
++      left_shoulder: [0.22, 0.65],
++      right_shoulder: [0.52, 0.65],
++      left_hip: [0.28, 0.95],
++      right_hip: [0.48, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- HALF-BODY POSES ---
++  {
++    id: 'half-body-solo-arms-crossed',
++    title: 'Confident Arms Crossed',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'business', 'confident'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.36, 0.38],
++      right_shoulder: [0.64, 0.38],
++      left_elbow: [0.42, 0.52],
++      right_elbow: [0.58, 0.52],
++      left_wrist: [0.56, 0.54],
++      right_wrist: [0.44, 0.54],
++      left_hip: [0.42, 0.78],
++      right_hip: [0.58, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-solo-casual-hand-hip',
++    title: 'Casual Hand on Hip',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'lifestyle', 'relaxed'],
++    keypoints: {
++      nose: [0.5, 0.2],
++      left_eye: [0.47, 0.17],
++      right_eye: [0.53, 0.17],
++      left_shoulder: [0.35, 0.36],
++      right_shoulder: [0.65, 0.36],
++      left_elbow: [0.28, 0.52],
++      right_elbow: [0.72, 0.52],
++      left_wrist: [0.38, 0.68],
++      right_wrist: [0.62, 0.68],
++      left_hip: [0.4, 0.76],
++      right_hip: [0.6, 0.76],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-couple-embrace',
++    title: 'Side-by-Side Couple Lean',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'half_body', 'romantic', 'candid'],
++    keypoints: {
++      nose: [0.42, 0.22],
++      left_eye: [0.39, 0.19],
++      right_eye: [0.45, 0.19],
++      left_shoulder: [0.28, 0.38],
++      right_shoulder: [0.52, 0.38],
++      left_elbow: [0.24, 0.54],
++      right_elbow: [0.58, 0.54],
++      left_wrist: [0.32, 0.7],
++      right_wrist: [0.66, 0.7],
++      left_hip: [0.34, 0.78],
++      right_hip: [0.54, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-group-lineup',
++    title: 'Team/Group Half-Body Lineup',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 3,
++    subjectCountTag: 'group',
++    tags: ['group', 'half_body', 'team', 'friends'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.22, 0.4],
++      right_shoulder: [0.78, 0.4],
++      left_elbow: [0.18, 0.56],
++      right_elbow: [0.82, 0.56],
++      left_wrist: [0.25, 0.72],
++      right_wrist: [0.75, 0.72],
++      left_hip: [0.3, 0.8],
++      right_hip: [0.7, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- FULL-BODY POSES ---
++  {
++    id: 'full-body-solo-power-stance',
++    title: 'Full-Body Power Stance',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'fashion', 'bold'],
++    keypoints: {
++      nose: [0.5, 0.15],
++      left_eye: [0.48, 0.13],
++      right_eye: [0.52, 0.13],
++      left_shoulder: [0.38, 0.26],
++      right_shoulder: [0.62, 0.26],
++      left_elbow: [0.32, 0.4],
++      right_elbow: [0.68, 0.4],
++      left_wrist: [0.35, 0.54],
++      right_wrist: [0.65, 0.54],
++      left_hip: [0.42, 0.52],
++      right_hip: [0.58, 0.52],
++      left_knee: [0.38, 0.72],
++      right_knee: [0.62, 0.72],
++      left_ankle: [0.36, 0.92],
++      right_ankle: [0.64, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-solo-walking-stride',
++    title: 'Dynamic Streetwear Stride',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'action', 'streetstyle'],
++    keypoints: {
++      nose: [0.5, 0.16],
++      left_eye: [0.48, 0.14],
++      right_eye: [0.52, 0.14],
++      left_shoulder: [0.36, 0.28],
++      right_shoulder: [0.64, 0.28],
++      left_elbow: [0.3, 0.42],
++      right_elbow: [0.7, 0.42],
++      left_wrist: [0.28, 0.56],
++      right_wrist: [0.72, 0.56],
++      left_hip: [0.42, 0.54],
++      right_hip: [0.58, 0.54],
++      left_knee: [0.44, 0.7],
++      right_knee: [0.6, 0.74],
++      left_ankle: [0.46, 0.9],
++      right_ankle: [0.62, 0.94],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-couple-holding-hands',
++    title: 'Couple Stroll Holding Hands',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'full_body', 'romantic', 'walk'],
++    keypoints: {
++      nose: [0.4, 0.16],
++      left_eye: [0.38, 0.14],
++      right_eye: [0.42, 0.14],
++      left_shoulder: [0.28, 0.28],
++      right_shoulder: [0.52, 0.28],
++      left_elbow: [0.22, 0.42],
++      right_elbow: [0.58, 0.42],
++      left_wrist: [0.25, 0.56],
++      right_wrist: [0.55, 0.56],
++      left_hip: [0.32, 0.54],
++      right_hip: [0.48, 0.54],
++      left_knee: [0.3, 0.72],
++      right_knee: [0.5, 0.72],
++      left_ankle: [0.28, 0.92],
++      right_ankle: [0.52, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-group-fun-jump',
++    title: 'Group Mid-Air Celebration',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 4,
++    subjectCountTag: 'group',
++    tags: ['group', 'full_body', 'energetic', 'fun'],
++    keypoints: {
++      nose: [0.5, 0.12],
++      left_eye: [0.47, 0.1],
++      right_eye: [0.53, 0.1],
++      left_shoulder: [0.2, 0.24],
++      right_shoulder: [0.8, 0.24],
++      left_elbow: [0.15, 0.14],
++      right_elbow: [0.85, 0.14],
++      left_wrist: [0.12, 0.05],
++      right_wrist: [0.88, 0.05],
++      left_hip: [0.3, 0.48],
++      right_hip: [0.7, 0.48],
++      left_knee: [0.25, 0.64],
++      right_knee: [0.75, 0.64],
++      left_ankle: [0.22, 0.8],
++      right_ankle: [0.78, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++];
+diff --git a/src/types/pose.ts b/src/types/pose.ts
+new file mode 100644
+index 0000000..68842a0
+--- /dev/null
++++ b/src/types/pose.ts
+@@ -0,0 +1,36 @@
++import { AppMode } from './camera';
++import { SubjectCount } from './vision';
++
++export type FramingCrop = 'headshot' | 'half_body' | 'full_body';
++
++export interface PoseKeypointsMap {
++  nose: [number, number];
++  left_eye?: [number, number];
++  right_eye?: [number, number];
++  left_ear?: [number, number];
++  right_ear?: [number, number];
++  left_shoulder: [number, number];
++  right_shoulder: [number, number];
++  left_elbow?: [number, number];
++  right_elbow?: [number, number];
++  left_wrist?: [number, number];
++  right_wrist?: [number, number];
++  left_hip: [number, number];
++  right_hip: [number, number];
++  left_knee?: [number, number];
++  right_knee?: [number, number];
++  left_ankle?: [number, number];
++  right_ankle?: [number, number];
++}
++
++export interface PoseTemplate {
++  id: string;
++  title: string;
++  category: AppMode;
++  framing: FramingCrop;
++  subject_count?: number; // 1 for solo, 2 for couple, >=3 for group
++  subjectCountTag?: SubjectCount;
++  tags: string[];
++  keypoints: PoseKeypointsMap;
++  skeleton_connections?: [string, string][];
++}
+diff --git a/src/utils/__tests__/poseFilter.test.ts b/src/utils/__tests__/poseFilter.test.ts
 new file mode 100644
+index 0000000..2d5a1c7
 --- /dev/null
-+++ b/src/components/camera/ShutterButton.tsx
-@@ -0,0 line 1-62
-```
++++ b/src/utils/__tests__/poseFilter.test.ts
+@@ -0,0 +1,81 @@
++import { filterPoseTemplates, matchesSubjectCount } from '../poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
++import { PoseTemplate } from '../../types/pose';
++
++function assert(condition: boolean, message: string) {
++  if (!condition) {
++    throw new Error(`Assertion failed: ${message}`);
++  }
++}
++
++export function runPoseFilterTests() {
++  // Test 1: Framing filtering alone (headshot)
++  const headshots = filterPoseTemplates(POSE_CATALOG, { framing: 'headshot' });
++  assert(headshots.length > 0, 'Should return headshot templates');
++  assert(
++    headshots.every((t) => t.framing === 'headshot'),
++    'All returned templates must have framing === headshot'
++  );
++
++  // Test 2: Framing filtering alone (half_body)
++  const halfBody = filterPoseTemplates(POSE_CATALOG, { framing: 'half_body' });
++  assert(halfBody.length > 0, 'Should return half_body templates');
++  assert(
++    halfBody.every((t) => t.framing === 'half_body'),
++    'All returned templates must have framing === half_body'
++  );
++
++  // Test 3: Dual filtering (framing: half_body + subjectCount: couple)
++  const coupleHalfBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'half_body',
++    subjectCount: 'couple',
++  });
++  assert(coupleHalfBody.length > 0, 'Should return couple half_body templates');
++  assert(
++    coupleHalfBody.every((t) => t.framing === 'half_body' && matchesSubjectCount(t, 'couple')),
++    'Dual filter should match both framing and subject count'
++  );
++
++  // Test 4: Dual filtering (framing: full_body + subjectCount: solo)
++  const soloFullBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'full_body',
++    subjectCount: 'solo',
++  });
++  assert(soloFullBody.length > 0, 'Should return solo full_body templates');
++  assert(
++    soloFullBody.every((t) => t.framing === 'full_body' && matchesSubjectCount(t, 'solo')),
++    'Dual filter should match full_body and solo subject count'
++  );
++
++  // Test 5: Fallback scenario - when no template matches specific subject count in framing crop
++  const mockTemplates: PoseTemplate[] = [
++    {
++      id: 'headshot-solo-1',
++      title: 'Solo Headshot',
++      category: 'person',
++      framing: 'headshot',
++      subject_count: 1,
++      subjectCountTag: 'solo',
++      tags: ['solo'],
++      keypoints: { nose: [0.5, 0.3], left_shoulder: [0.3, 0.6], right_shoulder: [0.7, 0.6], left_hip: [0.35, 0.9], right_hip: [0.65, 0.9] },
++    },
++  ];
++  // Ask for headshot + group subject count (no group headshots in mockTemplates)
++  const fallbackResults = filterPoseTemplates(mockTemplates, {
++    framing: 'headshot',
++    subjectCount: 'group',
++  });
++  assert(fallbackResults.length === 1, 'Should fallback to return framing matched templates when no subject count match exists');
++  assert(fallbackResults[0].id === 'headshot-solo-1', 'Fallback should return available framing template');
++
++  // Test 6: Empty catalog / invalid inputs
++  assert(filterPoseTemplates([], { framing: 'half_body' }).length === 0, 'Empty catalog should return empty array');
++
++  console.log('All poseFilter unit tests passed successfully!');
++}
++
++if (typeof require !== 'undefined' && require.main === module) {
++  runPoseFilterTests();
++} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseFilter.test')) {
++  runPoseFilterTests();
++}
+diff --git a/src/utils/poseFilter.ts b/src/utils/poseFilter.ts
+new file mode 100644
+index 0000000..0d4726d
+--- /dev/null
++++ b/src/utils/poseFilter.ts
+@@ -0,0 +1,67 @@
++import { PoseTemplate, FramingCrop } from '../types/pose';
++import { SubjectCount } from '../types/vision';
++import { AppMode } from '../types/camera';
++
++export interface FilterPoseOptions {
++  framing: FramingCrop;
++  subjectCount?: SubjectCount | null;
++  category?: AppMode;
++}
++
++/**
++ * Checks if a pose template matches the target SubjectCount ('solo' | 'couple' | 'group')
++ */
++export function matchesSubjectCount(template: PoseTemplate, subjectCount: SubjectCount): boolean {
++  if (template.subjectCountTag === subjectCount) {
++    return true;
++  }
++  if (template.tags && template.tags.includes(subjectCount)) {
++    return true;
++  }
++  if (template.subject_count !== undefined) {
++    if (subjectCount === 'solo' && template.subject_count === 1) return true;
++    if (subjectCount === 'couple' && template.subject_count === 2) return true;
++    if (subjectCount === 'group' && template.subject_count >= 3) return true;
++  }
++  return false;
++}
++
++/**
++ * Pure utility function to filter pose templates based on active framing crop,
++ * auto-detected subject count, and app category mode.
++ */
++export function filterPoseTemplates(
++  templates: PoseTemplate[],
++  options: FilterPoseOptions
++): PoseTemplate[] {
++  if (!templates || templates.length === 0) {
++    return [];
++  }
++
++  const { framing, subjectCount, category = 'person' } = options;
++
++  // 1. Filter by category & framing crop
++  const framingMatched = templates.filter((template) => {
++    const categoryMatch = !template.category || template.category === category;
++    const framingMatch = template.framing === framing;
++    return categoryMatch && framingMatch;
++  });
++
++  if (framingMatched.length === 0) {
++    return [];
++  }
++
++  // 2. If subjectCount is available, refine by subjectCount
++  if (subjectCount) {
++    const dualMatched = framingMatched.filter((template) =>
++      matchesSubjectCount(template, subjectCount)
++    );
++
++    // Fallback scenario: If no dual match exists for this subject count, return all framing-matched templates
++    if (dualMatched.length > 0) {
++      return dualMatched;
++    }
++  }
++
++  return framingMatched;
++}
+
+`
diff --git a/_bmad-output/implementation-artifacts/prompt-blind-hunter.md b/_bmad-output/implementation-artifacts/prompt-blind-hunter.md
index 132e306..aec3644 100644
--- a/_bmad-output/implementation-artifacts/prompt-blind-hunter.md
+++ b/_bmad-output/implementation-artifacts/prompt-blind-hunter.md
@@ -1,242 +1,870 @@
 # Blind Hunter Review Prompt
 
-Invoke the `bmad-review-adversarial-general` skill on this diff:
+Invoke the mad-review-adversarial-general skill on this diff:
 
-```diff
-diff --git a/src/types/camera.ts b/src/types/camera.ts
-index 4967157..39c10ce 100644
---- a/src/types/camera.ts
-+++ b/src/types/camera.ts
-@@ -21,9 +21,12 @@ export interface CameraState {
-   isAppActive: boolean;
-   setIsAppActive: (active: boolean) => void;
+`diff
+diff --git a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+index e9c0622..0dec657 100644
+--- a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
++++ b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+@@ -1,6 +1,9 @@
++---
++baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
++---
+ # Story 3.1: Manual Framing Selector & Contextual Pose Filtering
  
--  // Frozen Keyframe State
-+  // Frozen Keyframe & Vision Analysis State
-   isFrozen: boolean;
-   setIsFrozen: (frozen: boolean) => void;
-+  isAnalyzing: boolean;
-+  setIsAnalyzing: (analyzing: boolean) => void;
-+  toggleFreeze: () => void;
+-Status: ready-for-dev
++Status: review
  
-   // Horizon Leveling Bar State
-   showHorizonBar: boolean;
-
-diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
-index a9f0328..3728639 100644
---- a/src/stores/useCameraStore.ts
-+++ b/src/stores/useCameraStore.ts
-@@ -17,6 +17,18 @@ export const useCameraStore = create<CameraState>((set) => ({
-   isFrozen: false,
-   setIsFrozen: (frozen: boolean) => set({ isFrozen: frozen, isAnalyzing: frozen }),
+ ## Story
+ 
+@@ -25,24 +28,24 @@ so that the pose carousel displays templates that match my intended photo framin
+ 
+ ## Tasks / Subtasks
+ 
+-- [ ] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
+-  - [ ] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
+-  - [ ] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
+-- [ ] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
+-  - [ ] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
+-  - [ ] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
+-  - [ ] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
+-- [ ] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
+-  - [ ] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
+-  - [ ] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
+-  - [ ] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
+-- [ ] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
+-  - [ ] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
+-  - [ ] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
+-  - [ ] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
+-- [ ] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
+-  - [ ] Run TypeScript type checks (`npx tsc --noEmit`).
+-  - [ ] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
++- [x] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
++  - [x] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
++  - [x] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
++- [x] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
++  - [x] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
++  - [x] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
++  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
++- [x] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
++  - [x] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
++  - [x] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
++  - [x] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
++- [x] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
++  - [x] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
++  - [x] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
++  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
++- [x] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
++  - [x] Run TypeScript type checks (`npx tsc --noEmit`).
++  - [x] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
+ 
+ ## Dev Notes
+ 
+@@ -97,22 +100,32 @@ Gemini 3.6 Flash (High)
+ 
+ ### Debug Log References
  
-+  isAnalyzing: false,
-+  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
-+
-+  toggleFreeze: () =>
-+    set((state) => {
-+      const nextFrozen = !state.isFrozen;
-+      return {
-+        isFrozen: nextFrozen,
-+        isAnalyzing: nextFrozen,
-+      };
-+    }),
++- `npx tsx src/stores/__tests__/useCameraStore.test.ts` -> PASSED
++- `npx tsx src/utils/__tests__/poseFilter.test.ts` -> PASSED
++- `npx tsc --noEmit` -> PASSED (0 errors)
 +
-   showHorizonBar: true,
-   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
- }));
-
+ ### Completion Notes List
+ 
+-- Story file generated by `bmad-create-story` workflow.
++- Defined framing crop types (`FramingCrop`), pose templates data contracts (`PoseTemplate`), and static COCO-17 pose catalog (`POSE_CATALOG`).
++- Expanded `useCameraStore` state with `selectedFraming` (default `'half_body'`) and `selectedPoseId` (default `null`).
++- Created pure, deterministic `poseFilter` utility supporting single framing crop filtering, dual framing + subject count filtering, and fallback behavior.
++- Built UI components `FramingSelector` and `PoseCarousel` with contextual subject count badge and integrated them into `CameraViewfinder` for `person` mode.
++- Verified 100% test pass rate across store unit tests, utility unit tests, and TypeScript compiler check.
+ 
+ ### File List
+ 
+-- `src/types/pose.ts`
+-- `src/types/camera.ts`
+-- `src/data/poseCatalog.ts`
+-- `src/stores/useCameraStore.ts`
+-- `src/utils/poseFilter.ts`
+-- `src/utils/__tests__/poseFilter.test.ts`
+-- `src/components/camera/FramingSelector.tsx`
+-- `src/components/camera/PoseCarousel.tsx`
+-- `src/components/camera/CameraViewfinder.tsx`
++- `src/types/pose.ts` (NEW)
++- `src/types/camera.ts` (MODIFIED)
++- `src/data/poseCatalog.ts` (NEW)
++- `src/stores/useCameraStore.ts` (MODIFIED)
++- `src/stores/__tests__/useCameraStore.test.ts` (MODIFIED)
++- `src/utils/poseFilter.ts` (NEW)
++- `src/utils/__tests__/poseFilter.test.ts` (NEW)
++- `src/components/camera/FramingSelector.tsx` (NEW)
++- `src/components/camera/PoseCarousel.tsx` (NEW)
++- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)
+ 
+ ### Change Log
+ 
+ - 2026-07-29: Created Story 3.1 context for Manual Framing Selector & Contextual Pose Filtering. Set status to ready-for-dev.
++- 2026-07-30: Completed implementation of Story 3.1: manual framing selector, pose catalog, camera store state expansion, contextual pose filtering, HUD integration, and unit test suite. Status updated to review.
+diff --git a/_bmad-output/implementation-artifacts/sprint-status.yaml b/_bmad-output/implementation-artifacts/sprint-status.yaml
+index 7fdf6bc..57013d9 100644
+--- a/_bmad-output/implementation-artifacts/sprint-status.yaml
++++ b/_bmad-output/implementation-artifacts/sprint-status.yaml
+@@ -58,7 +58,7 @@ development_status:
+   2-2-local-on-device-vision-inferencing-engine: done
+   epic-2-retrospective: done
+   epic-3: in-progress
+-  3-1-manual-framing-selector-contextual-pose-filtering: ready-for-dev
++  3-1-manual-framing-selector-contextual-pose-filtering: review
+   3-2-coco-17-vector-pose-overlay-renderer: backlog
+   3-3-photographer-director-cues-alignment-feedback: backlog
+   epic-3-retrospective: optional
 diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
-index 5c976f3..0aefcce 100644
+index 1edcb6c..c555819 100644
 --- a/src/components/camera/CameraViewfinder.tsx
 +++ b/src/components/camera/CameraViewfinder.tsx
 @@ -6,6 +6,8 @@ import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
+ import { analyzeKeyframe } from '../../utils/visionInferencingEngine';
  import { HorizonLevelBar } from './HorizonLevelBar';
  import { ModeSwitcher } from './ModeSwitcher';
++import { FramingSelector } from './FramingSelector';
++import { PoseCarousel } from './PoseCarousel';
  import { LensPresetChips } from './LensPresetChips';
-+import { ShutterButton } from './ShutterButton';
-+import { AnalyzingIndicator } from './AnalyzingIndicator';
- import { useSafeCameraDevice } from '../../utils/cameraHooks';
+ import { ShutterButton } from './ShutterButton';
+ import { AnalyzingIndicator } from './AnalyzingIndicator';
+@@ -24,6 +26,7 @@ if (Platform.OS !== 'web') {
  
- // Dynamic load Camera component for native platforms only
-@@ -24,6 +26,7 @@ export const CameraViewfinder: React.FC = () => {
+ export const CameraViewfinder: React.FC = () => {
+   const device = useSafeCameraDevice('back');
++  const mode = useCameraStore((state) => state.mode);
    const isAppActive = useCameraStore((state) => state.isAppActive);
    const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
    const activeLens = useCameraStore((state) => state.activeLens);
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-   const insets = useSafeAreaInsets();
- 
-   // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
-@@ -48,13 +51,15 @@ export const CameraViewfinder: React.FC = () => {
-   const targetZoom = getNumericZoom(activeLens);
-   const zoomValue = device ? clampZoom(targetZoom, device.minZoom, device.maxZoom) : targetZoom;
- 
-+  const isCameraActive = isAppActive && !isFrozen;
-+
-   return (
-     <View style={styles.container}>
-       {device && CameraComponent ? (
-         <CameraComponent
-           style={StyleSheet.absoluteFill}
-           device={device}
--          isActive={isAppActive}
-+          isActive={isCameraActive}
-           zoom={zoomValue}
-           fps={60}
-           enableFpsGraph={false}
-@@ -64,12 +69,17 @@ export const CameraViewfinder: React.FC = () => {
-         />
-       ) : (
-         <View style={styles.simulatorPreviewCanvas}>
--          <View style={styles.simulatorBadge}>
--            <Text style={styles.simulatorBadgeText}>SIMULATOR PREVIEW ({activeLens} • {targetZoom}x)</Text>
-+          <View style={[styles.simulatorBadge, isFrozen && styles.simulatorBadgeFrozen]}>
-+            <Text style={[styles.simulatorBadgeText, isFrozen && styles.simulatorBadgeTextFrozen]}>
-+              {isFrozen ? 'KEYFRAME FROZEN (KEYFRAME AI PAUSE)' : `SIMULATOR PREVIEW (${activeLens} • ${targetZoom}x)`}
-+            </Text>
-           </View>
-         </View>
-       )}
- 
-+      {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
-+      <AnalyzingIndicator />
-+
-       {/* Top HUD Overlay - Mode Switcher */}
-       <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
-         <ModeSwitcher />
-@@ -78,9 +88,12 @@ export const CameraViewfinder: React.FC = () => {
+@@ -125,8 +128,14 @@ export const CameraViewfinder: React.FC = () => {
        {/* Center HUD Overlay - Horizon Leveling Bar */}
        <HorizonLevelBar />
  
--      {/* Bottom HUD Overlay - Lens Preset Chips */}
-+      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
+-      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
++      {/* Bottom HUD Overlay - Framing Selector, Pose Carousel, Lens Preset Chips & Shutter Button */}
        <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
++        {mode === 'person' && (
++          <View style={styles.personHudLayer}>
++            <FramingSelector />
++            <PoseCarousel />
++          </View>
++        )}
          <LensPresetChips />
-+        <View style={styles.shutterContainer}>
-+          <ShutterButton />
-+        </View>
-       </View>
-     </View>
-   );
-
-diff --git a/src/components/camera/ShutterButton.tsx b/src/components/camera/ShutterButton.tsx
+         <View style={styles.shutterContainer}>
+           <ShutterButton />
+@@ -141,26 +150,6 @@ const styles = StyleSheet.create({
+     flex: 1,
+     backgroundColor: '#000000',
+   },
+-  loadingContainer: {
+-    flex: 1,
+-    backgroundColor: '#0F0F11',
+-    justifyContent: 'center',
+-    alignItems: 'center',
+-    paddingHorizontal: 24,
+-  },
+-  loadingTitle: {
+-    color: '#FFFFFF',
+-    fontSize: 18,
+-    fontWeight: '600',
+-    marginBottom: 8,
+-  },
+-  loadingText: {
+-    color: '#8E8E93',
+-    fontSize: 14,
+-    fontWeight: '400',
+-    textAlign: 'center',
+-    lineHeight: 20,
+-  },
+   topHudContainer: {
+     position: 'absolute',
+     left: 0,
+@@ -175,6 +164,11 @@ const styles = StyleSheet.create({
+     zIndex: 20,
+     alignItems: 'center',
+   },
++  personHudLayer: {
++    width: '100%',
++    alignItems: 'center',
++    marginBottom: 8,
++  },
+   simulatorPreviewCanvas: {
+     ...StyleSheet.absoluteFillObject,
+     backgroundColor: '#121214',
+@@ -203,7 +197,7 @@ const styles = StyleSheet.create({
+     color: '#00E5FF',
+   },
+   shutterContainer: {
+-    marginTop: 20,
++    marginTop: 16,
+     alignItems: 'center',
+   },
+ });
+diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
+index bdeff94..973d02e 100644
+--- a/src/stores/__tests__/useCameraStore.test.ts
++++ b/src/stores/__tests__/useCameraStore.test.ts
+@@ -15,6 +15,27 @@ export function runCameraStoreTests() {
+   assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
+   assert(store.visionResult === null, 'visionResult initial value should be null');
+   assert(store.inferenceLatencyMs === null, 'inferenceLatencyMs initial value should be null');
++  assert(store.selectedFraming === 'half_body', 'selectedFraming default value should be half_body');
++  assert(store.selectedPoseId === null, 'selectedPoseId default value should be null');
++
++  // Test framing crop updates
++  store.setSelectedFraming('headshot');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'setSelectedFraming(headshot) failed');
++  store.setSelectedFraming('full_body');
++  assert(useCameraStore.getState().selectedFraming === 'full_body', 'setSelectedFraming(full_body) failed');
++  store.setSelectedFraming('half_body');
++
++  // Test active pose selection
++  store.setSelectedPoseId('half-body-solo-arms-crossed');
++  assert(useCameraStore.getState().selectedPoseId === 'half-body-solo-arms-crossed', 'setSelectedPoseId failed');
++  store.setSelectedPoseId(null);
++  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedPoseId(null) failed');
++
++  // Test mode switching does not corrupt framing state
++  store.setSelectedFraming('headshot');
++  store.setMode('scene');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'selectedFraming should persist across mode switches');
++  store.setMode('person');
+ 
+   // Test setIsAnalyzing
+   store.setIsAnalyzing(true);
+diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
+index 13b0f4f..b2099e7 100644
+--- a/src/stores/useCameraStore.ts
++++ b/src/stores/useCameraStore.ts
+@@ -1,6 +1,7 @@
+ import { create } from 'zustand';
+ import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';
+ import { KeyframeVisionResult } from '../types/vision';
++import { FramingCrop } from '../types/pose';
+ 
+ export const useCameraStore = create<CameraState>((set) => ({
+   mode: 'person',
+@@ -44,4 +45,10 @@ export const useCameraStore = create<CameraState>((set) => ({
+ 
+   showHorizonBar: true,
+   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
++
++  selectedFraming: 'half_body',
++  setSelectedFraming: (framing: FramingCrop) => set({ selectedFraming: framing }),
++
++  selectedPoseId: null,
++  setSelectedPoseId: (id: string | null) => set({ selectedPoseId: id }),
+ }));
+diff --git a/src/types/camera.ts b/src/types/camera.ts
+index 1c088be..4fd687a 100644
+--- a/src/types/camera.ts
++++ b/src/types/camera.ts
+@@ -1,4 +1,5 @@
+ import { KeyframeVisionResult } from './vision';
++import { FramingCrop } from './pose';
+ 
+ export type AppMode = 'person' | 'scene';
+ 
+@@ -39,4 +40,10 @@ export interface CameraState {
+   // Horizon Leveling Bar State
+   showHorizonBar: boolean;
+   setShowHorizonBar: (show: boolean) => void;
++
++  // Framing Crop & Selected Pose State
++  selectedFraming: FramingCrop;
++  setSelectedFraming: (framing: FramingCrop) => void;
++  selectedPoseId: string | null;
++  setSelectedPoseId: (id: string | null) => void;
+ }
+diff --git a/src/components/camera/FramingSelector.tsx b/src/components/camera/FramingSelector.tsx
 new file mode 100644
+index 0000000..eca852c
 --- /dev/null
-+++ b/src/components/camera/ShutterButton.tsx
-@@ -0,0 +1,62 @@
++++ b/src/components/camera/FramingSelector.tsx
+@@ -0,0 +1,78 @@
 +import React from 'react';
-+import { StyleSheet, View, TouchableOpacity } from 'react-native';
++import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
 +import { useCameraStore } from '../../stores/useCameraStore';
++import { FramingCrop } from '../../types/pose';
 +
-+interface ShutterButtonProps {
-+  onPress?: () => void;
++interface FramingOption {
++  value: FramingCrop;
++  label: string;
 +}
 +
-+export const ShutterButton: React.FC<ShutterButtonProps> = ({ onPress }) => {
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
++const FRAMING_OPTIONS: FramingOption[] = [
++  { value: 'headshot', label: 'Headshot' },
++  { value: 'half_body', label: 'Half-Body' },
++  { value: 'full_body', label: 'Full-Body' },
++];
 +
-+  const handlePress = () => {
-+    toggleFreeze();
-+    if (onPress) {
-+      onPress();
-+    }
-+  };
++export const FramingSelector: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const setSelectedFraming = useCameraStore((state) => state.setSelectedFraming);
 +
 +  return (
-+    <TouchableOpacity
-+      style={styles.outerRing}
-+      onPress={handlePress}
-+      activeOpacity={0.7}
-+      accessibilityRole="button"
-+      accessibilityLabel="Analyze and freeze keyframe"
-+      accessibilityHint={isFrozen ? "Tap to unfreeze camera feed" : "Tap to freeze frame for analysis"}
-+      accessibilityState={{ selected: isFrozen }}
-+    >
-+      <View style={[styles.innerCircle, isFrozen && styles.innerCircleFrozen]} />
-+    </TouchableOpacity>
++    <View style={styles.container} accessibilityRole="tablist">
++      {FRAMING_OPTIONS.map((item) => {
++        const isActive = selectedFraming === item.value;
++        return (
++          <TouchableOpacity
++            key={item.value}
++            style={[styles.chip, isActive && styles.activeChip]}
++            onPress={() => setSelectedFraming(item.value)}
++            activeOpacity={0.7}
++            accessibilityRole="tab"
++            accessibilityState={{ selected: isActive }}
++            accessibilityLabel={`${item.label} Framing`}
++          >
++            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
++              {item.label}
++            </Text>
++          </TouchableOpacity>
++        );
++      })}
++    </View>
 +  );
 +};
-
-diff --git a/src/components/camera/AnalyzingIndicator.tsx b/src/components/camera/AnalyzingIndicator.tsx
++
++const styles = StyleSheet.create({
++  container: {
++    flexDirection: 'row',
++    backgroundColor: 'rgba(0, 0, 0, 0.55)',
++    borderRadius: 20,
++    padding: 3,
++    alignSelf: 'center',
++    marginBottom: 8,
++  },
++  chip: {
++    paddingVertical: 6,
++    paddingHorizontal: 14,
++    borderRadius: 16,
++    justifyContent: 'center',
++    alignItems: 'center',
++  },
++  activeChip: {
++    backgroundColor: 'rgba(0, 229, 255, 0.25)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++  },
++  label: {
++    fontSize: 12,
++    letterSpacing: 0.3,
++  },
++  activeLabel: {
++    color: '#00E5FF',
++    fontWeight: '700',
++  },
++  inactiveLabel: {
++    color: 'rgba(255, 255, 255, 0.65)',
++    fontWeight: '400',
++  },
++});
+diff --git a/src/components/camera/PoseCarousel.tsx b/src/components/camera/PoseCarousel.tsx
 new file mode 100644
+index 0000000..27d5d96
 --- /dev/null
-+++ b/src/components/camera/AnalyzingIndicator.tsx
-@@ -0,0 +1,115 @@
-+import React, { useEffect } from 'react';
-+import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
-+import Animated, {
-+  useSharedValue,
-+  useAnimatedStyle,
-+  withRepeat,
-+  withTiming,
-+  withSequence,
-+  cancelAnimation,
-+  Easing,
-+} from 'react-native-reanimated';
++++ b/src/components/camera/PoseCarousel.tsx
+@@ -0,0 +1,157 @@
++import React from 'react';
++import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
 +import { useCameraStore } from '../../stores/useCameraStore';
++import { filterPoseTemplates } from '../../utils/poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
 +
-+export const AnalyzingIndicator: React.FC = () => {
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-+  const isAnalyzing = useCameraStore((state) => state.isAnalyzing);
-+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
-+
-+  const pulseOpacity = useSharedValue(0.6);
-+
-+  useEffect(() => {
-+    if (isAnalyzing) {
-+      pulseOpacity.value = withRepeat(
-+        withSequence(
-+          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
-+          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
-+        ),
-+        -1,
-+        true
-+      );
-+    } else {
-+      pulseOpacity.value = 0.6;
-+    }
++export const PoseCarousel: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const visionResult = useCameraStore((state) => state.visionResult);
++  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
++  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
 +
-+    return () => {
-+      cancelAnimation(pulseOpacity);
-+    };
-+  }, [isAnalyzing, pulseOpacity]);
++  const subjectCount = visionResult?.subjectCount ?? null;
 +
-+  const animatedPillStyle = useAnimatedStyle(() => {
-+    return {
-+      opacity: pulseOpacity.value,
-+    };
++  const filteredPoses = filterPoseTemplates(POSE_CATALOG, {
++    framing: selectedFraming,
++    subjectCount: subjectCount,
++    category: 'person',
 +  });
 +
-+  if (!isFrozen && !isAnalyzing) {
-+    return null;
-+  }
-+
 +  return (
-+    <Pressable
-+      style={styles.overlay}
-+      onPress={toggleFreeze}
-+      accessibilityRole="button"
-+      accessibilityLabel="Unfreeze keyframe and resume live camera feed"
-+      accessibilityHint="Tapping anywhere on screen un-freezes the camera preview"
-+    >
-+      <Animated.View style={[styles.hudContainer, animatedPillStyle]}>
-+        <View style={styles.pill}>
-+          <ActivityIndicator size="small" color="#00E5FF" style={styles.spinner} />
-+          <Text style={styles.text}>Analyzing...</Text>
++    <View style={styles.container}>
++      {subjectCount && (
++        <View style={styles.contextBadge}>
++          <Text style={styles.contextBadgeText}>
++            ⚡ Auto-Filtered for {subjectCount.toUpperCase()} ({visionResult?.subjectCount})
++          </Text>
 +        </View>
-+        <Text style={styles.hintText}>Tap anywhere to resume live view</Text>
-+      </Animated.View>
-+    </Pressable>
++      )}
++
++      <ScrollView
++        horizontal
++        showsHorizontalScrollIndicator={false}
++        contentContainerStyle={styles.scrollContent}
++        accessibilityRole="scrollbar"
++      >
++        {filteredPoses.map((pose) => {
++          const isSelected = selectedPoseId === pose.id;
++          return (
++            <TouchableOpacity
++              key={pose.id}
++              style={[styles.card, isSelected && styles.activeCard]}
++              onPress={() => setSelectedPoseId(isSelected ? null : pose.id)}
++              activeOpacity={0.8}
++              accessibilityRole="button"
++              accessibilityState={{ selected: isSelected }}
++              accessibilityLabel={`Pose Template: ${pose.title}`}
++            >
++              <View style={styles.cardHeader}>
++                <Text style={[styles.cardTitle, isSelected && styles.activeCardTitle]} numberOfLines={1}>
++                  {pose.title}
++                </Text>
++              </View>
++
++              <View style={styles.tagRow}>
++                {pose.subjectCountTag && (
++                  <View style={styles.tagBadge}>
++                    <Text style={styles.tagText}>{pose.subjectCountTag}</Text>
++                  </View>
++                )}
++                <View style={styles.tagBadgeSecondary}>
++                  <Text style={styles.tagTextSecondary}>{pose.framing.replace('_', ' ')}</Text>
++                </View>
++              </View>
++            </TouchableOpacity>
++          );
++        })}
++      </ScrollView>
++    </View>
 +  );
 +};
-
-diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
++
++const styles = StyleSheet.create({
++  container: {
++    width: '100%',
++    marginVertical: 6,
++  },
++  contextBadge: {
++    alignSelf: 'center',
++    backgroundColor: 'rgba(0, 229, 255, 0.15)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++    borderRadius: 12,
++    paddingHorizontal: 10,
++    paddingVertical: 3,
++    marginBottom: 6,
++  },
++  contextBadgeText: {
++    color: '#00E5FF',
++    fontSize: 11,
++    fontWeight: '600',
++    letterSpacing: 0.4,
++  },
++  scrollContent: {
++    paddingHorizontal: 16,
++    alignItems: 'center',
++  },
++  card: {
++    width: 130,
++    height: 64,
++    backgroundColor: 'rgba(20, 20, 25, 0.75)',
++    borderRadius: 12,
++    padding: 8,
++    marginRight: 10,
++    borderWidth: 1,
++    borderColor: 'rgba(255, 255, 255, 0.15)',
++    justifyContent: 'space-between',
++  },
++  activeCard: {
++    borderColor: '#FFD60A',
++    borderWidth: 2,
++    backgroundColor: 'rgba(255, 214, 10, 0.15)',
++  },
++  cardHeader: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    justifyContent: 'space-between',
++  },
++  cardTitle: {
++    color: '#FFFFFF',
++    fontSize: 12,
++    fontWeight: '600',
++  },
++  activeCardTitle: {
++    color: '#FFD60A',
++    fontWeight: '700',
++  },
++  tagRow: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    gap: 4,
++  },
++  tagBadge: {
++    backgroundColor: 'rgba(255, 255, 255, 0.15)',
++    borderRadius: 6,
++    paddingHorizontal: 6,
++    paddingVertical: 2,
++  },
++  tagText: {
++    color: '#FFFFFF',
++    fontSize: 9,
++    fontWeight: '600',
++    textTransform: 'uppercase',
++  },
++  tagBadgeSecondary: {
++    backgroundColor: 'rgba(255, 255, 255, 0.08)',
++    borderRadius: 6,
++    paddingHorizontal: 5,
++    paddingVertical: 2,
++  },
++  tagTextSecondary: {
++    color: 'rgba(255, 255, 255, 0.6)',
++    fontSize: 9,
++    fontWeight: '400',
++    textTransform: 'capitalize',
++  },
++});
+diff --git a/src/data/poseCatalog.ts b/src/data/poseCatalog.ts
 new file mode 100644
+index 0000000..f08c61f
 --- /dev/null
-+++ b/src/stores/__tests__/useCameraStore.test.ts
-@@ -0,0 +1,48 @@
-+import { useCameraStore } from '../useCameraStore';
++++ b/src/data/poseCatalog.ts
+@@ -0,0 +1,283 @@
++import { PoseTemplate } from '../types/pose';
++
++const DEFAULT_SKELETON_CONNECTIONS: [string, string][] = [
++  ['nose', 'left_eye'],
++  ['nose', 'right_eye'],
++  ['left_shoulder', 'right_shoulder'],
++  ['left_shoulder', 'left_elbow'],
++  ['left_elbow', 'left_wrist'],
++  ['right_shoulder', 'right_elbow'],
++  ['right_elbow', 'right_wrist'],
++  ['left_shoulder', 'left_hip'],
++  ['right_shoulder', 'right_hip'],
++  ['left_hip', 'right_hip'],
++  ['left_hip', 'left_knee'],
++  ['left_knee', 'left_ankle'],
++  ['right_hip', 'right_knee'],
++  ['right_knee', 'right_ankle'],
++];
++
++export const POSE_CATALOG: PoseTemplate[] = [
++  // --- HEADSHOT POSES ---
++  {
++    id: 'headshot-solo-classic',
++    title: 'Classic Headshot',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'portrait', 'professional'],
++    keypoints: {
++      nose: [0.5, 0.35],
++      left_eye: [0.46, 0.32],
++      right_eye: [0.54, 0.32],
++      left_shoulder: [0.35, 0.65],
++      right_shoulder: [0.65, 0.65],
++      left_hip: [0.4, 0.95],
++      right_hip: [0.6, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-solo-tilt',
++    title: 'Engaged Head Tilt',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'casual', 'friendly'],
++    keypoints: {
++      nose: [0.52, 0.36],
++      left_eye: [0.47, 0.31],
++      right_eye: [0.55, 0.34],
++      left_shoulder: [0.32, 0.68],
++      right_shoulder: [0.68, 0.62],
++      left_hip: [0.38, 0.95],
++      right_hip: [0.62, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-couple-shoulder',
++    title: 'Couple Shoulder-to-Shoulder',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'headshot', 'close', 'warm'],
++    keypoints: {
++      nose: [0.38, 0.35],
++      left_eye: [0.34, 0.32],
++      right_eye: [0.42, 0.32],
++      left_shoulder: [0.22, 0.65],
++      right_shoulder: [0.52, 0.65],
++      left_hip: [0.28, 0.95],
++      right_hip: [0.48, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- HALF-BODY POSES ---
++  {
++    id: 'half-body-solo-arms-crossed',
++    title: 'Confident Arms Crossed',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'business', 'confident'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.36, 0.38],
++      right_shoulder: [0.64, 0.38],
++      left_elbow: [0.42, 0.52],
++      right_elbow: [0.58, 0.52],
++      left_wrist: [0.56, 0.54],
++      right_wrist: [0.44, 0.54],
++      left_hip: [0.42, 0.78],
++      right_hip: [0.58, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-solo-casual-hand-hip',
++    title: 'Casual Hand on Hip',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'lifestyle', 'relaxed'],
++    keypoints: {
++      nose: [0.5, 0.2],
++      left_eye: [0.47, 0.17],
++      right_eye: [0.53, 0.17],
++      left_shoulder: [0.35, 0.36],
++      right_shoulder: [0.65, 0.36],
++      left_elbow: [0.28, 0.52],
++      right_elbow: [0.72, 0.52],
++      left_wrist: [0.38, 0.68],
++      right_wrist: [0.62, 0.68],
++      left_hip: [0.4, 0.76],
++      right_hip: [0.6, 0.76],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-couple-embrace',
++    title: 'Side-by-Side Couple Lean',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'half_body', 'romantic', 'candid'],
++    keypoints: {
++      nose: [0.42, 0.22],
++      left_eye: [0.39, 0.19],
++      right_eye: [0.45, 0.19],
++      left_shoulder: [0.28, 0.38],
++      right_shoulder: [0.52, 0.38],
++      left_elbow: [0.24, 0.54],
++      right_elbow: [0.58, 0.54],
++      left_wrist: [0.32, 0.7],
++      right_wrist: [0.66, 0.7],
++      left_hip: [0.34, 0.78],
++      right_hip: [0.54, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-group-lineup',
++    title: 'Team/Group Half-Body Lineup',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 3,
++    subjectCountTag: 'group',
++    tags: ['group', 'half_body', 'team', 'friends'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.22, 0.4],
++      right_shoulder: [0.78, 0.4],
++      left_elbow: [0.18, 0.56],
++      right_elbow: [0.82, 0.56],
++      left_wrist: [0.25, 0.72],
++      right_wrist: [0.75, 0.72],
++      left_hip: [0.3, 0.8],
++      right_hip: [0.7, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- FULL-BODY POSES ---
++  {
++    id: 'full-body-solo-power-stance',
++    title: 'Full-Body Power Stance',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'fashion', 'bold'],
++    keypoints: {
++      nose: [0.5, 0.15],
++      left_eye: [0.48, 0.13],
++      right_eye: [0.52, 0.13],
++      left_shoulder: [0.38, 0.26],
++      right_shoulder: [0.62, 0.26],
++      left_elbow: [0.32, 0.4],
++      right_elbow: [0.68, 0.4],
++      left_wrist: [0.35, 0.54],
++      right_wrist: [0.65, 0.54],
++      left_hip: [0.42, 0.52],
++      right_hip: [0.58, 0.52],
++      left_knee: [0.38, 0.72],
++      right_knee: [0.62, 0.72],
++      left_ankle: [0.36, 0.92],
++      right_ankle: [0.64, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-solo-walking-stride',
++    title: 'Dynamic Streetwear Stride',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'action', 'streetstyle'],
++    keypoints: {
++      nose: [0.5, 0.16],
++      left_eye: [0.48, 0.14],
++      right_eye: [0.52, 0.14],
++      left_shoulder: [0.36, 0.28],
++      right_shoulder: [0.64, 0.28],
++      left_elbow: [0.3, 0.42],
++      right_elbow: [0.7, 0.42],
++      left_wrist: [0.28, 0.56],
++      right_wrist: [0.72, 0.56],
++      left_hip: [0.42, 0.54],
++      right_hip: [0.58, 0.54],
++      left_knee: [0.44, 0.7],
++      right_knee: [0.6, 0.74],
++      left_ankle: [0.46, 0.9],
++      right_ankle: [0.62, 0.94],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-couple-holding-hands',
++    title: 'Couple Stroll Holding Hands',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'full_body', 'romantic', 'walk'],
++    keypoints: {
++      nose: [0.4, 0.16],
++      left_eye: [0.38, 0.14],
++      right_eye: [0.42, 0.14],
++      left_shoulder: [0.28, 0.28],
++      right_shoulder: [0.52, 0.28],
++      left_elbow: [0.22, 0.42],
++      right_elbow: [0.58, 0.42],
++      left_wrist: [0.25, 0.56],
++      right_wrist: [0.55, 0.56],
++      left_hip: [0.32, 0.54],
++      right_hip: [0.48, 0.54],
++      left_knee: [0.3, 0.72],
++      right_knee: [0.5, 0.72],
++      left_ankle: [0.28, 0.92],
++      right_ankle: [0.52, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-group-fun-jump',
++    title: 'Group Mid-Air Celebration',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 4,
++    subjectCountTag: 'group',
++    tags: ['group', 'full_body', 'energetic', 'fun'],
++    keypoints: {
++      nose: [0.5, 0.12],
++      left_eye: [0.47, 0.1],
++      right_eye: [0.53, 0.1],
++      left_shoulder: [0.2, 0.24],
++      right_shoulder: [0.8, 0.24],
++      left_elbow: [0.15, 0.14],
++      right_elbow: [0.85, 0.14],
++      left_wrist: [0.12, 0.05],
++      right_wrist: [0.88, 0.05],
++      left_hip: [0.3, 0.48],
++      right_hip: [0.7, 0.48],
++      left_knee: [0.25, 0.64],
++      right_knee: [0.75, 0.64],
++      left_ankle: [0.22, 0.8],
++      right_ankle: [0.78, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++];
+diff --git a/src/types/pose.ts b/src/types/pose.ts
+new file mode 100644
+index 0000000..68842a0
+--- /dev/null
++++ b/src/types/pose.ts
+@@ -0,0 +1,36 @@
++import { AppMode } from './camera';
++import { SubjectCount } from './vision';
++
++export type FramingCrop = 'headshot' | 'half_body' | 'full_body';
++
++export interface PoseKeypointsMap {
++  nose: [number, number];
++  left_eye?: [number, number];
++  right_eye?: [number, number];
++  left_ear?: [number, number];
++  right_ear?: [number, number];
++  left_shoulder: [number, number];
++  right_shoulder: [number, number];
++  left_elbow?: [number, number];
++  right_elbow?: [number, number];
++  left_wrist?: [number, number];
++  right_wrist?: [number, number];
++  left_hip: [number, number];
++  right_hip: [number, number];
++  left_knee?: [number, number];
++  right_knee?: [number, number];
++  left_ankle?: [number, number];
++  right_ankle?: [number, number];
++}
++
++export interface PoseTemplate {
++  id: string;
++  title: string;
++  category: AppMode;
++  framing: FramingCrop;
++  subject_count?: number; // 1 for solo, 2 for couple, >=3 for group
++  subjectCountTag?: SubjectCount;
++  tags: string[];
++  keypoints: PoseKeypointsMap;
++  skeleton_connections?: [string, string][];
++}
+diff --git a/src/utils/__tests__/poseFilter.test.ts b/src/utils/__tests__/poseFilter.test.ts
+new file mode 100644
+index 0000000..2d5a1c7
+--- /dev/null
++++ b/src/utils/__tests__/poseFilter.test.ts
+@@ -0,0 +1,81 @@
++import { filterPoseTemplates, matchesSubjectCount } from '../poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
++import { PoseTemplate } from '../../types/pose';
 +
 +function assert(condition: boolean, message: string) {
 +  if (!condition) {
@@ -244,43 +872,149 @@ new file mode 100644
 +  }
 +}
 +
-+export function runCameraStoreTests() {
-+  const store = useCameraStore.getState();
-+
-+  // Test initial state
-+  assert(store.isFrozen === false, 'isFrozen initial value should be false');
-+  assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
-+
-+  // Test setIsAnalyzing
-+  store.setIsAnalyzing(true);
-+  assert(useCameraStore.getState().isAnalyzing === true, 'setIsAnalyzing(true) failed');
-+  store.setIsAnalyzing(false);
-+  assert(useCameraStore.getState().isAnalyzing === false, 'setIsAnalyzing(false) failed');
-+
-+  // Test toggleFreeze - freeze state transition
-+  store.toggleFreeze();
-+  let state = useCameraStore.getState();
-+  assert(state.isFrozen === true, 'toggleFreeze() should set isFrozen to true when false');
-+  assert(state.isAnalyzing === true, 'toggleFreeze() should set isAnalyzing to true when freezing');
-+
-+  // Test toggleFreeze - unfreeze state transition
-+  store.toggleFreeze();
-+  state = useCameraStore.getState();
-+  assert(state.isFrozen === false, 'toggleFreeze() should set isFrozen to false when true');
-+  assert(state.isAnalyzing === false, 'toggleFreeze() should set isAnalyzing to false when un-freezing');
-+
-+  // Test setIsFrozen directly
-+  store.setIsFrozen(true);
-+  assert(useCameraStore.getState().isFrozen === true, 'setIsFrozen(true) failed');
-+  store.setIsFrozen(false);
-+  assert(useCameraStore.getState().isFrozen === false, 'setIsFrozen(false) failed');
-+
-+  console.log('All useCameraStore unit tests passed successfully!');
++export function runPoseFilterTests() {
++  // Test 1: Framing filtering alone (headshot)
++  const headshots = filterPoseTemplates(POSE_CATALOG, { framing: 'headshot' });
++  assert(headshots.length > 0, 'Should return headshot templates');
++  assert(
++    headshots.every((t) => t.framing === 'headshot'),
++    'All returned templates must have framing === headshot'
++  );
++
++  // Test 2: Framing filtering alone (half_body)
++  const halfBody = filterPoseTemplates(POSE_CATALOG, { framing: 'half_body' });
++  assert(halfBody.length > 0, 'Should return half_body templates');
++  assert(
++    halfBody.every((t) => t.framing === 'half_body'),
++    'All returned templates must have framing === half_body'
++  );
++
++  // Test 3: Dual filtering (framing: half_body + subjectCount: couple)
++  const coupleHalfBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'half_body',
++    subjectCount: 'couple',
++  });
++  assert(coupleHalfBody.length > 0, 'Should return couple half_body templates');
++  assert(
++    coupleHalfBody.every((t) => t.framing === 'half_body' && matchesSubjectCount(t, 'couple')),
++    'Dual filter should match both framing and subject count'
++  );
++
++  // Test 4: Dual filtering (framing: full_body + subjectCount: solo)
++  const soloFullBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'full_body',
++    subjectCount: 'solo',
++  });
++  assert(soloFullBody.length > 0, 'Should return solo full_body templates');
++  assert(
++    soloFullBody.every((t) => t.framing === 'full_body' && matchesSubjectCount(t, 'solo')),
++    'Dual filter should match full_body and solo subject count'
++  );
++
++  // Test 5: Fallback scenario - when no template matches specific subject count in framing crop
++  const mockTemplates: PoseTemplate[] = [
++    {
++      id: 'headshot-solo-1',
++      title: 'Solo Headshot',
++      category: 'person',
++      framing: 'headshot',
++      subject_count: 1,
++      subjectCountTag: 'solo',
++      tags: ['solo'],
++      keypoints: { nose: [0.5, 0.3], left_shoulder: [0.3, 0.6], right_shoulder: [0.7, 0.6], left_hip: [0.35, 0.9], right_hip: [0.65, 0.9] },
++    },
++  ];
++  // Ask for headshot + group subject count (no group headshots in mockTemplates)
++  const fallbackResults = filterPoseTemplates(mockTemplates, {
++    framing: 'headshot',
++    subjectCount: 'group',
++  });
++  assert(fallbackResults.length === 1, 'Should fallback to return framing matched templates when no subject count match exists');
++  assert(fallbackResults[0].id === 'headshot-solo-1', 'Fallback should return available framing template');
++
++  // Test 6: Empty catalog / invalid inputs
++  assert(filterPoseTemplates([], { framing: 'half_body' }).length === 0, 'Empty catalog should return empty array');
++
++  console.log('All poseFilter unit tests passed successfully!');
 +}
 +
 +if (typeof require !== 'undefined' && require.main === module) {
-+  runCameraStoreTests();
-+} else if (typeof process !== 'undefined' && process.argv[1]?.includes('useCameraStore.test')) {
-+  runCameraStoreTests();
++  runPoseFilterTests();
++} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseFilter.test')) {
++  runPoseFilterTests();
++}
+diff --git a/src/utils/poseFilter.ts b/src/utils/poseFilter.ts
+new file mode 100644
+index 0000000..0d4726d
+--- /dev/null
++++ b/src/utils/poseFilter.ts
+@@ -0,0 +1,67 @@
++import { PoseTemplate, FramingCrop } from '../types/pose';
++import { SubjectCount } from '../types/vision';
++import { AppMode } from '../types/camera';
++
++export interface FilterPoseOptions {
++  framing: FramingCrop;
++  subjectCount?: SubjectCount | null;
++  category?: AppMode;
++}
++
++/**
++ * Checks if a pose template matches the target SubjectCount ('solo' | 'couple' | 'group')
++ */
++export function matchesSubjectCount(template: PoseTemplate, subjectCount: SubjectCount): boolean {
++  if (template.subjectCountTag === subjectCount) {
++    return true;
++  }
++  if (template.tags && template.tags.includes(subjectCount)) {
++    return true;
++  }
++  if (template.subject_count !== undefined) {
++    if (subjectCount === 'solo' && template.subject_count === 1) return true;
++    if (subjectCount === 'couple' && template.subject_count === 2) return true;
++    if (subjectCount === 'group' && template.subject_count >= 3) return true;
++  }
++  return false;
 +}
-```
++
++/**
++ * Pure utility function to filter pose templates based on active framing crop,
++ * auto-detected subject count, and app category mode.
++ */
++export function filterPoseTemplates(
++  templates: PoseTemplate[],
++  options: FilterPoseOptions
++): PoseTemplate[] {
++  if (!templates || templates.length === 0) {
++    return [];
++  }
++
++  const { framing, subjectCount, category = 'person' } = options;
++
++  // 1. Filter by category & framing crop
++  const framingMatched = templates.filter((template) => {
++    const categoryMatch = !template.category || template.category === category;
++    const framingMatch = template.framing === framing;
++    return categoryMatch && framingMatch;
++  });
++
++  if (framingMatched.length === 0) {
++    return [];
++  }
++
++  // 2. If subjectCount is available, refine by subjectCount
++  if (subjectCount) {
++    const dualMatched = framingMatched.filter((template) =>
++      matchesSubjectCount(template, subjectCount)
++    );
++
++    // Fallback scenario: If no dual match exists for this subject count, return all framing-matched templates
++    if (dualMatched.length > 0) {
++      return dualMatched;
++    }
++  }
++
++  return framingMatched;
++}
+
+`
diff --git a/_bmad-output/implementation-artifacts/prompt-edge-case-hunter.md b/_bmad-output/implementation-artifacts/prompt-edge-case-hunter.md
index e5b0fae..a34a8fd 100644
--- a/_bmad-output/implementation-artifacts/prompt-edge-case-hunter.md
+++ b/_bmad-output/implementation-artifacts/prompt-edge-case-hunter.md
@@ -1,242 +1,870 @@
 # Edge Case Hunter Review Prompt
 
-Invoke the `bmad-review-edge-case-hunter` skill on this diff:
+Invoke the mad-review-edge-case-hunter skill on this diff:
 
-```diff
-diff --git a/src/types/camera.ts b/src/types/camera.ts
-index 4967157..39c10ce 100644
---- a/src/types/camera.ts
-+++ b/src/types/camera.ts
-@@ -21,9 +21,12 @@ export interface CameraState {
-   isAppActive: boolean;
-   setIsAppActive: (active: boolean) => void;
+`diff
+diff --git a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+index e9c0622..0dec657 100644
+--- a/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
++++ b/_bmad-output/implementation-artifacts/3-1-manual-framing-selector-contextual-pose-filtering.md
+@@ -1,6 +1,9 @@
++---
++baseline_commit: 4a3b95e4748658bd555b27b352c7f1d7e651de91
++---
+ # Story 3.1: Manual Framing Selector & Contextual Pose Filtering
  
--  // Frozen Keyframe State
-+  // Frozen Keyframe & Vision Analysis State
-   isFrozen: boolean;
-   setIsFrozen: (frozen: boolean) => void;
-+  isAnalyzing: boolean;
-+  setIsAnalyzing: (analyzing: boolean) => void;
-+  toggleFreeze: () => void;
+-Status: ready-for-dev
++Status: review
  
-   // Horizon Leveling Bar State
-   showHorizonBar: boolean;
-
-diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
-index a9f0328..3728639 100644
---- a/src/stores/useCameraStore.ts
-+++ b/src/stores/useCameraStore.ts
-@@ -17,6 +17,18 @@ export const useCameraStore = create<CameraState>((set) => ({
-   isFrozen: false,
-   setIsFrozen: (frozen: boolean) => set({ isFrozen: frozen, isAnalyzing: frozen }),
+ ## Story
+ 
+@@ -25,24 +28,24 @@ so that the pose carousel displays templates that match my intended photo framin
+ 
+ ## Tasks / Subtasks
+ 
+-- [ ] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
+-  - [ ] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
+-  - [ ] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
+-- [ ] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
+-  - [ ] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
+-  - [ ] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
+-  - [ ] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
+-- [ ] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
+-  - [ ] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
+-  - [ ] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
+-  - [ ] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
+-- [ ] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
+-  - [ ] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
+-  - [ ] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
+-  - [ ] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
+-- [ ] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
+-  - [ ] Run TypeScript type checks (`npx tsc --noEmit`).
+-  - [ ] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
++- [x] Task 1: Pose & Framing Data Contracts & Catalog Definition (AC: #1, #2, #3)
++  - [x] Create `src/types/pose.ts` defining `FramingCrop` (`'headshot'` | `'half_body'` | `'full_body'`), `PoseTemplate` interface conforming to `PoseTemplate.json` schema (`ARCHITECTURE-SPINE.md` section 3.1), and catalog data types.
++  - [x] Create `src/data/poseCatalog.ts` containing a set of pre-defined COCO-17 pose templates for Headshot, Half-Body, and Full-Body poses across `solo`, `couple`, and `group` subjects.
++- [x] Task 2: Camera Store State Expansion for Framing & Active Pose (AC: #1, #4)
++  - [x] Update `src/types/camera.ts` to include `selectedFraming: FramingCrop`, `setSelectedFraming: (framing: FramingCrop) => void`, `selectedPoseId: string | null`, and `setSelectedPoseId: (id: string | null) => void`.
++  - [x] Update `src/stores/useCameraStore.ts` with `selectedFraming` defaulting to `'half_body'` and `selectedPoseId` defaulting to `null`.
++  - [x] Add unit test assertions in `src/stores/__tests__/useCameraStore.test.ts` verifying state initialization, framing updates, and active pose selection.
++- [x] Task 3: Contextual Pose Filtering Utility & Automated Unit Tests (AC: #2, #3)
++  - [x] Create `src/utils/poseFilter.ts` implementing `filterPoseTemplates(templates: PoseTemplate[], options: { framing: FramingCrop; subjectCount?: SubjectCount | null; category?: AppMode }): PoseTemplate[]`.
++  - [x] Handle fallback when no templates match specific subject count by returning templates matching the framing crop.
++  - [x] Create `src/utils/__tests__/poseFilter.test.ts` with unit test cases validating framing filtering, dual framing + subject count filtering, and fallback scenarios.
++- [x] Task 4: UI Components for Manual Framing Selector & Pose Carousel (AC: #1, #2, #3, #4)
++  - [x] Create `src/components/camera/FramingSelector.tsx`: Horizontal chip / segment control overlay (`Headshot`, `Half-Body`, `Full-Body`) updating `useCameraStore`.
++  - [x] Create `src/components/camera/PoseCarousel.tsx`: Horizontal scrollable carousel rendering filtered pose cards with title, tags, and active state indicator.
++  - [x] Update `src/components/camera/CameraViewfinder.tsx` to conditionally render `FramingSelector` and `PoseCarousel` when `mode === 'person'`.
++- [x] Task 5: Automated Verification & Integration Testing (AC: #1, #2, #3, #4)
++  - [x] Run TypeScript type checks (`npx tsc --noEmit`).
++  - [x] Run store and utility unit tests (`npx tsx src/stores/__tests__/useCameraStore.test.ts`, `npx tsx src/utils/__tests__/poseFilter.test.ts`).
+ 
+ ## Dev Notes
+ 
+@@ -97,22 +100,32 @@ Gemini 3.6 Flash (High)
+ 
+ ### Debug Log References
  
-+  isAnalyzing: false,
-+  setIsAnalyzing: (analyzing: boolean) => set({ isAnalyzing: analyzing }),
-+
-+  toggleFreeze: () =>
-+    set((state) => {
-+      const nextFrozen = !state.isFrozen;
-+      return {
-+        isFrozen: nextFrozen,
-+        isAnalyzing: nextFrozen,
-+      };
-+    }),
++- `npx tsx src/stores/__tests__/useCameraStore.test.ts` -> PASSED
++- `npx tsx src/utils/__tests__/poseFilter.test.ts` -> PASSED
++- `npx tsc --noEmit` -> PASSED (0 errors)
 +
-   showHorizonBar: true,
-   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
- }));
-
+ ### Completion Notes List
+ 
+-- Story file generated by `bmad-create-story` workflow.
++- Defined framing crop types (`FramingCrop`), pose templates data contracts (`PoseTemplate`), and static COCO-17 pose catalog (`POSE_CATALOG`).
++- Expanded `useCameraStore` state with `selectedFraming` (default `'half_body'`) and `selectedPoseId` (default `null`).
++- Created pure, deterministic `poseFilter` utility supporting single framing crop filtering, dual framing + subject count filtering, and fallback behavior.
++- Built UI components `FramingSelector` and `PoseCarousel` with contextual subject count badge and integrated them into `CameraViewfinder` for `person` mode.
++- Verified 100% test pass rate across store unit tests, utility unit tests, and TypeScript compiler check.
+ 
+ ### File List
+ 
+-- `src/types/pose.ts`
+-- `src/types/camera.ts`
+-- `src/data/poseCatalog.ts`
+-- `src/stores/useCameraStore.ts`
+-- `src/utils/poseFilter.ts`
+-- `src/utils/__tests__/poseFilter.test.ts`
+-- `src/components/camera/FramingSelector.tsx`
+-- `src/components/camera/PoseCarousel.tsx`
+-- `src/components/camera/CameraViewfinder.tsx`
++- `src/types/pose.ts` (NEW)
++- `src/types/camera.ts` (MODIFIED)
++- `src/data/poseCatalog.ts` (NEW)
++- `src/stores/useCameraStore.ts` (MODIFIED)
++- `src/stores/__tests__/useCameraStore.test.ts` (MODIFIED)
++- `src/utils/poseFilter.ts` (NEW)
++- `src/utils/__tests__/poseFilter.test.ts` (NEW)
++- `src/components/camera/FramingSelector.tsx` (NEW)
++- `src/components/camera/PoseCarousel.tsx` (NEW)
++- `src/components/camera/CameraViewfinder.tsx` (MODIFIED)
+ 
+ ### Change Log
+ 
+ - 2026-07-29: Created Story 3.1 context for Manual Framing Selector & Contextual Pose Filtering. Set status to ready-for-dev.
++- 2026-07-30: Completed implementation of Story 3.1: manual framing selector, pose catalog, camera store state expansion, contextual pose filtering, HUD integration, and unit test suite. Status updated to review.
+diff --git a/_bmad-output/implementation-artifacts/sprint-status.yaml b/_bmad-output/implementation-artifacts/sprint-status.yaml
+index 7fdf6bc..57013d9 100644
+--- a/_bmad-output/implementation-artifacts/sprint-status.yaml
++++ b/_bmad-output/implementation-artifacts/sprint-status.yaml
+@@ -58,7 +58,7 @@ development_status:
+   2-2-local-on-device-vision-inferencing-engine: done
+   epic-2-retrospective: done
+   epic-3: in-progress
+-  3-1-manual-framing-selector-contextual-pose-filtering: ready-for-dev
++  3-1-manual-framing-selector-contextual-pose-filtering: review
+   3-2-coco-17-vector-pose-overlay-renderer: backlog
+   3-3-photographer-director-cues-alignment-feedback: backlog
+   epic-3-retrospective: optional
 diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
-index 5c976f3..0aefcce 100644
+index 1edcb6c..c555819 100644
 --- a/src/components/camera/CameraViewfinder.tsx
 +++ b/src/components/camera/CameraViewfinder.tsx
 @@ -6,6 +6,8 @@ import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
+ import { analyzeKeyframe } from '../../utils/visionInferencingEngine';
  import { HorizonLevelBar } from './HorizonLevelBar';
  import { ModeSwitcher } from './ModeSwitcher';
++import { FramingSelector } from './FramingSelector';
++import { PoseCarousel } from './PoseCarousel';
  import { LensPresetChips } from './LensPresetChips';
-+import { ShutterButton } from './ShutterButton';
-+import { AnalyzingIndicator } from './AnalyzingIndicator';
- import { useSafeCameraDevice } from '../../utils/cameraHooks';
+ import { ShutterButton } from './ShutterButton';
+ import { AnalyzingIndicator } from './AnalyzingIndicator';
+@@ -24,6 +26,7 @@ if (Platform.OS !== 'web') {
  
- // Dynamic load Camera component for native platforms only
-@@ -24,6 +26,7 @@ export const CameraViewfinder: React.FC = () => {
+ export const CameraViewfinder: React.FC = () => {
+   const device = useSafeCameraDevice('back');
++  const mode = useCameraStore((state) => state.mode);
    const isAppActive = useCameraStore((state) => state.isAppActive);
    const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
    const activeLens = useCameraStore((state) => state.activeLens);
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-   const insets = useSafeAreaInsets();
- 
-   // Monitor AppState to pause camera when backgrounded (AD-2, Thermal stability)
-@@ -48,13 +51,15 @@ export const CameraViewfinder: React.FC = () => {
-   const targetZoom = getNumericZoom(activeLens);
-   const zoomValue = device ? clampZoom(targetZoom, device.minZoom, device.maxZoom) : targetZoom;
- 
-+  const isCameraActive = isAppActive && !isFrozen;
-+
-   return (
-     <View style={styles.container}>
-       {device && CameraComponent ? (
-         <CameraComponent
-           style={StyleSheet.absoluteFill}
-           device={device}
--          isActive={isAppActive}
-+          isActive={isCameraActive}
-           zoom={zoomValue}
-           fps={60}
-           enableFpsGraph={false}
-@@ -64,12 +69,17 @@ export const CameraViewfinder: React.FC = () => {
-         />
-       ) : (
-         <View style={styles.simulatorPreviewCanvas}>
--          <View style={styles.simulatorBadge}>
--            <Text style={styles.simulatorBadgeText}>SIMULATOR PREVIEW ({activeLens} • {targetZoom}x)</Text>
-+          <View style={[styles.simulatorBadge, isFrozen && styles.simulatorBadgeFrozen]}>
-+            <Text style={[styles.simulatorBadgeText, isFrozen && styles.simulatorBadgeTextFrozen]}>
-+              {isFrozen ? 'KEYFRAME FROZEN (KEYFRAME AI PAUSE)' : `SIMULATOR PREVIEW (${activeLens} • ${targetZoom}x)`}
-+            </Text>
-           </View>
-         </View>
-       )}
- 
-+      {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
-+      <AnalyzingIndicator />
-+
-       {/* Top HUD Overlay - Mode Switcher */}
-       <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
-         <ModeSwitcher />
-@@ -78,9 +88,12 @@ export const CameraViewfinder: React.FC = () => {
+@@ -125,8 +128,14 @@ export const CameraViewfinder: React.FC = () => {
        {/* Center HUD Overlay - Horizon Leveling Bar */}
        <HorizonLevelBar />
  
--      {/* Bottom HUD Overlay - Lens Preset Chips */}
-+      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
+-      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
++      {/* Bottom HUD Overlay - Framing Selector, Pose Carousel, Lens Preset Chips & Shutter Button */}
        <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
++        {mode === 'person' && (
++          <View style={styles.personHudLayer}>
++            <FramingSelector />
++            <PoseCarousel />
++          </View>
++        )}
          <LensPresetChips />
-+        <View style={styles.shutterContainer}>
-+          <ShutterButton />
-+        </View>
-       </View>
-     </View>
-   );
-
-diff --git a/src/components/camera/ShutterButton.tsx b/src/components/camera/ShutterButton.tsx
+         <View style={styles.shutterContainer}>
+           <ShutterButton />
+@@ -141,26 +150,6 @@ const styles = StyleSheet.create({
+     flex: 1,
+     backgroundColor: '#000000',
+   },
+-  loadingContainer: {
+-    flex: 1,
+-    backgroundColor: '#0F0F11',
+-    justifyContent: 'center',
+-    alignItems: 'center',
+-    paddingHorizontal: 24,
+-  },
+-  loadingTitle: {
+-    color: '#FFFFFF',
+-    fontSize: 18,
+-    fontWeight: '600',
+-    marginBottom: 8,
+-  },
+-  loadingText: {
+-    color: '#8E8E93',
+-    fontSize: 14,
+-    fontWeight: '400',
+-    textAlign: 'center',
+-    lineHeight: 20,
+-  },
+   topHudContainer: {
+     position: 'absolute',
+     left: 0,
+@@ -175,6 +164,11 @@ const styles = StyleSheet.create({
+     zIndex: 20,
+     alignItems: 'center',
+   },
++  personHudLayer: {
++    width: '100%',
++    alignItems: 'center',
++    marginBottom: 8,
++  },
+   simulatorPreviewCanvas: {
+     ...StyleSheet.absoluteFillObject,
+     backgroundColor: '#121214',
+@@ -203,7 +197,7 @@ const styles = StyleSheet.create({
+     color: '#00E5FF',
+   },
+   shutterContainer: {
+-    marginTop: 20,
++    marginTop: 16,
+     alignItems: 'center',
+   },
+ });
+diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
+index bdeff94..973d02e 100644
+--- a/src/stores/__tests__/useCameraStore.test.ts
++++ b/src/stores/__tests__/useCameraStore.test.ts
+@@ -15,6 +15,27 @@ export function runCameraStoreTests() {
+   assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
+   assert(store.visionResult === null, 'visionResult initial value should be null');
+   assert(store.inferenceLatencyMs === null, 'inferenceLatencyMs initial value should be null');
++  assert(store.selectedFraming === 'half_body', 'selectedFraming default value should be half_body');
++  assert(store.selectedPoseId === null, 'selectedPoseId default value should be null');
++
++  // Test framing crop updates
++  store.setSelectedFraming('headshot');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'setSelectedFraming(headshot) failed');
++  store.setSelectedFraming('full_body');
++  assert(useCameraStore.getState().selectedFraming === 'full_body', 'setSelectedFraming(full_body) failed');
++  store.setSelectedFraming('half_body');
++
++  // Test active pose selection
++  store.setSelectedPoseId('half-body-solo-arms-crossed');
++  assert(useCameraStore.getState().selectedPoseId === 'half-body-solo-arms-crossed', 'setSelectedPoseId failed');
++  store.setSelectedPoseId(null);
++  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedPoseId(null) failed');
++
++  // Test mode switching does not corrupt framing state
++  store.setSelectedFraming('headshot');
++  store.setMode('scene');
++  assert(useCameraStore.getState().selectedFraming === 'headshot', 'selectedFraming should persist across mode switches');
++  store.setMode('person');
+ 
+   // Test setIsAnalyzing
+   store.setIsAnalyzing(true);
+diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
+index 13b0f4f..b2099e7 100644
+--- a/src/stores/useCameraStore.ts
++++ b/src/stores/useCameraStore.ts
+@@ -1,6 +1,7 @@
+ import { create } from 'zustand';
+ import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';
+ import { KeyframeVisionResult } from '../types/vision';
++import { FramingCrop } from '../types/pose';
+ 
+ export const useCameraStore = create<CameraState>((set) => ({
+   mode: 'person',
+@@ -44,4 +45,10 @@ export const useCameraStore = create<CameraState>((set) => ({
+ 
+   showHorizonBar: true,
+   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
++
++  selectedFraming: 'half_body',
++  setSelectedFraming: (framing: FramingCrop) => set({ selectedFraming: framing }),
++
++  selectedPoseId: null,
++  setSelectedPoseId: (id: string | null) => set({ selectedPoseId: id }),
+ }));
+diff --git a/src/types/camera.ts b/src/types/camera.ts
+index 1c088be..4fd687a 100644
+--- a/src/types/camera.ts
++++ b/src/types/camera.ts
+@@ -1,4 +1,5 @@
+ import { KeyframeVisionResult } from './vision';
++import { FramingCrop } from './pose';
+ 
+ export type AppMode = 'person' | 'scene';
+ 
+@@ -39,4 +40,10 @@ export interface CameraState {
+   // Horizon Leveling Bar State
+   showHorizonBar: boolean;
+   setShowHorizonBar: (show: boolean) => void;
++
++  // Framing Crop & Selected Pose State
++  selectedFraming: FramingCrop;
++  setSelectedFraming: (framing: FramingCrop) => void;
++  selectedPoseId: string | null;
++  setSelectedPoseId: (id: string | null) => void;
+ }
+diff --git a/src/components/camera/FramingSelector.tsx b/src/components/camera/FramingSelector.tsx
 new file mode 100644
+index 0000000..eca852c
 --- /dev/null
-+++ b/src/components/camera/ShutterButton.tsx
-@@ -0,0 +1,62 @@
++++ b/src/components/camera/FramingSelector.tsx
+@@ -0,0 +1,78 @@
 +import React from 'react';
-+import { StyleSheet, View, TouchableOpacity } from 'react-native';
++import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
 +import { useCameraStore } from '../../stores/useCameraStore';
++import { FramingCrop } from '../../types/pose';
 +
-+interface ShutterButtonProps {
-+  onPress?: () => void;
++interface FramingOption {
++  value: FramingCrop;
++  label: string;
 +}
 +
-+export const ShutterButton: React.FC<ShutterButtonProps> = ({ onPress }) => {
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
++const FRAMING_OPTIONS: FramingOption[] = [
++  { value: 'headshot', label: 'Headshot' },
++  { value: 'half_body', label: 'Half-Body' },
++  { value: 'full_body', label: 'Full-Body' },
++];
 +
-+  const handlePress = () => {
-+    toggleFreeze();
-+    if (onPress) {
-+      onPress();
-+    }
-+  };
++export const FramingSelector: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const setSelectedFraming = useCameraStore((state) => state.setSelectedFraming);
 +
 +  return (
-+    <TouchableOpacity
-+      style={styles.outerRing}
-+      onPress={handlePress}
-+      activeOpacity={0.7}
-+      accessibilityRole="button"
-+      accessibilityLabel="Analyze and freeze keyframe"
-+      accessibilityHint={isFrozen ? "Tap to unfreeze camera feed" : "Tap to freeze frame for analysis"}
-+      accessibilityState={{ selected: isFrozen }}
-+    >
-+      <View style={[styles.innerCircle, isFrozen && styles.innerCircleFrozen]} />
-+    </TouchableOpacity>
++    <View style={styles.container} accessibilityRole="tablist">
++      {FRAMING_OPTIONS.map((item) => {
++        const isActive = selectedFraming === item.value;
++        return (
++          <TouchableOpacity
++            key={item.value}
++            style={[styles.chip, isActive && styles.activeChip]}
++            onPress={() => setSelectedFraming(item.value)}
++            activeOpacity={0.7}
++            accessibilityRole="tab"
++            accessibilityState={{ selected: isActive }}
++            accessibilityLabel={`${item.label} Framing`}
++          >
++            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
++              {item.label}
++            </Text>
++          </TouchableOpacity>
++        );
++      })}
++    </View>
 +  );
 +};
-
-diff --git a/src/components/camera/AnalyzingIndicator.tsx b/src/components/camera/AnalyzingIndicator.tsx
++
++const styles = StyleSheet.create({
++  container: {
++    flexDirection: 'row',
++    backgroundColor: 'rgba(0, 0, 0, 0.55)',
++    borderRadius: 20,
++    padding: 3,
++    alignSelf: 'center',
++    marginBottom: 8,
++  },
++  chip: {
++    paddingVertical: 6,
++    paddingHorizontal: 14,
++    borderRadius: 16,
++    justifyContent: 'center',
++    alignItems: 'center',
++  },
++  activeChip: {
++    backgroundColor: 'rgba(0, 229, 255, 0.25)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++  },
++  label: {
++    fontSize: 12,
++    letterSpacing: 0.3,
++  },
++  activeLabel: {
++    color: '#00E5FF',
++    fontWeight: '700',
++  },
++  inactiveLabel: {
++    color: 'rgba(255, 255, 255, 0.65)',
++    fontWeight: '400',
++  },
++});
+diff --git a/src/components/camera/PoseCarousel.tsx b/src/components/camera/PoseCarousel.tsx
 new file mode 100644
+index 0000000..27d5d96
 --- /dev/null
-+++ b/src/components/camera/AnalyzingIndicator.tsx
-@@ -0,0 +1,115 @@
-+import React, { useEffect } from 'react';
-+import { StyleSheet, View, Text, Pressable, ActivityIndicator } from 'react-native';
-+import Animated, {
-+  useSharedValue,
-+  useAnimatedStyle,
-+  withRepeat,
-+  withTiming,
-+  withSequence,
-+  cancelAnimation,
-+  Easing,
-+} from 'react-native-reanimated';
++++ b/src/components/camera/PoseCarousel.tsx
+@@ -0,0 +1,157 @@
++import React from 'react';
++import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
 +import { useCameraStore } from '../../stores/useCameraStore';
++import { filterPoseTemplates } from '../../utils/poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
 +
-+export const AnalyzingIndicator: React.FC = () => {
-+  const isFrozen = useCameraStore((state) => state.isFrozen);
-+  const isAnalyzing = useCameraStore((state) => state.isAnalyzing);
-+  const toggleFreeze = useCameraStore((state) => state.toggleFreeze);
-+
-+  const pulseOpacity = useSharedValue(0.6);
-+
-+  useEffect(() => {
-+    if (isAnalyzing) {
-+      pulseOpacity.value = withRepeat(
-+        withSequence(
-+          withTiming(1.0, { duration: 800, easing: Easing.inOut(Easing.ease) }),
-+          withTiming(0.6, { duration: 800, easing: Easing.inOut(Easing.ease) })
-+        ),
-+        -1,
-+        true
-+      );
-+    } else {
-+      pulseOpacity.value = 0.6;
-+    }
++export const PoseCarousel: React.FC = () => {
++  const selectedFraming = useCameraStore((state) => state.selectedFraming);
++  const visionResult = useCameraStore((state) => state.visionResult);
++  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
++  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
 +
-+    return () => {
-+      cancelAnimation(pulseOpacity);
-+    };
-+  }, [isAnalyzing, pulseOpacity]);
++  const subjectCount = visionResult?.subjectCount ?? null;
 +
-+  const animatedPillStyle = useAnimatedStyle(() => {
-+    return {
-+      opacity: pulseOpacity.value,
-+    };
++  const filteredPoses = filterPoseTemplates(POSE_CATALOG, {
++    framing: selectedFraming,
++    subjectCount: subjectCount,
++    category: 'person',
 +  });
 +
-+  if (!isFrozen && !isAnalyzing) {
-+    return null;
-+  }
-+
 +  return (
-+    <Pressable
-+      style={styles.overlay}
-+      onPress={toggleFreeze}
-+      accessibilityRole="button"
-+      accessibilityLabel="Unfreeze keyframe and resume live camera feed"
-+      accessibilityHint="Tapping anywhere on screen un-freezes the camera preview"
-+    >
-+      <Animated.View style={[styles.hudContainer, animatedPillStyle]}>
-+        <View style={styles.pill}>
-+          <ActivityIndicator size="small" color="#00E5FF" style={styles.spinner} />
-+          <Text style={styles.text}>Analyzing...</Text>
++    <View style={styles.container}>
++      {subjectCount && (
++        <View style={styles.contextBadge}>
++          <Text style={styles.contextBadgeText}>
++            ⚡ Auto-Filtered for {subjectCount.toUpperCase()} ({visionResult?.subjectCount})
++          </Text>
 +        </View>
-+        <Text style={styles.hintText}>Tap anywhere to resume live view</Text>
-+      </Animated.View>
-+    </Pressable>
++      )}
++
++      <ScrollView
++        horizontal
++        showsHorizontalScrollIndicator={false}
++        contentContainerStyle={styles.scrollContent}
++        accessibilityRole="scrollbar"
++      >
++        {filteredPoses.map((pose) => {
++          const isSelected = selectedPoseId === pose.id;
++          return (
++            <TouchableOpacity
++              key={pose.id}
++              style={[styles.card, isSelected && styles.activeCard]}
++              onPress={() => setSelectedPoseId(isSelected ? null : pose.id)}
++              activeOpacity={0.8}
++              accessibilityRole="button"
++              accessibilityState={{ selected: isSelected }}
++              accessibilityLabel={`Pose Template: ${pose.title}`}
++            >
++              <View style={styles.cardHeader}>
++                <Text style={[styles.cardTitle, isSelected && styles.activeCardTitle]} numberOfLines={1}>
++                  {pose.title}
++                </Text>
++              </View>
++
++              <View style={styles.tagRow}>
++                {pose.subjectCountTag && (
++                  <View style={styles.tagBadge}>
++                    <Text style={styles.tagText}>{pose.subjectCountTag}</Text>
++                  </View>
++                )}
++                <View style={styles.tagBadgeSecondary}>
++                  <Text style={styles.tagTextSecondary}>{pose.framing.replace('_', ' ')}</Text>
++                </View>
++              </View>
++            </TouchableOpacity>
++          );
++        })}
++      </ScrollView>
++    </View>
 +  );
 +};
-
-diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
++
++const styles = StyleSheet.create({
++  container: {
++    width: '100%',
++    marginVertical: 6,
++  },
++  contextBadge: {
++    alignSelf: 'center',
++    backgroundColor: 'rgba(0, 229, 255, 0.15)',
++    borderColor: '#00E5FF',
++    borderWidth: 1,
++    borderRadius: 12,
++    paddingHorizontal: 10,
++    paddingVertical: 3,
++    marginBottom: 6,
++  },
++  contextBadgeText: {
++    color: '#00E5FF',
++    fontSize: 11,
++    fontWeight: '600',
++    letterSpacing: 0.4,
++  },
++  scrollContent: {
++    paddingHorizontal: 16,
++    alignItems: 'center',
++  },
++  card: {
++    width: 130,
++    height: 64,
++    backgroundColor: 'rgba(20, 20, 25, 0.75)',
++    borderRadius: 12,
++    padding: 8,
++    marginRight: 10,
++    borderWidth: 1,
++    borderColor: 'rgba(255, 255, 255, 0.15)',
++    justifyContent: 'space-between',
++  },
++  activeCard: {
++    borderColor: '#FFD60A',
++    borderWidth: 2,
++    backgroundColor: 'rgba(255, 214, 10, 0.15)',
++  },
++  cardHeader: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    justifyContent: 'space-between',
++  },
++  cardTitle: {
++    color: '#FFFFFF',
++    fontSize: 12,
++    fontWeight: '600',
++  },
++  activeCardTitle: {
++    color: '#FFD60A',
++    fontWeight: '700',
++  },
++  tagRow: {
++    flexDirection: 'row',
++    alignItems: 'center',
++    gap: 4,
++  },
++  tagBadge: {
++    backgroundColor: 'rgba(255, 255, 255, 0.15)',
++    borderRadius: 6,
++    paddingHorizontal: 6,
++    paddingVertical: 2,
++  },
++  tagText: {
++    color: '#FFFFFF',
++    fontSize: 9,
++    fontWeight: '600',
++    textTransform: 'uppercase',
++  },
++  tagBadgeSecondary: {
++    backgroundColor: 'rgba(255, 255, 255, 0.08)',
++    borderRadius: 6,
++    paddingHorizontal: 5,
++    paddingVertical: 2,
++  },
++  tagTextSecondary: {
++    color: 'rgba(255, 255, 255, 0.6)',
++    fontSize: 9,
++    fontWeight: '400',
++    textTransform: 'capitalize',
++  },
++});
+diff --git a/src/data/poseCatalog.ts b/src/data/poseCatalog.ts
 new file mode 100644
+index 0000000..f08c61f
 --- /dev/null
-+++ b/src/stores/__tests__/useCameraStore.test.ts
-@@ -0,0 +1,48 @@
-+import { useCameraStore } from '../useCameraStore';
++++ b/src/data/poseCatalog.ts
+@@ -0,0 +1,283 @@
++import { PoseTemplate } from '../types/pose';
++
++const DEFAULT_SKELETON_CONNECTIONS: [string, string][] = [
++  ['nose', 'left_eye'],
++  ['nose', 'right_eye'],
++  ['left_shoulder', 'right_shoulder'],
++  ['left_shoulder', 'left_elbow'],
++  ['left_elbow', 'left_wrist'],
++  ['right_shoulder', 'right_elbow'],
++  ['right_elbow', 'right_wrist'],
++  ['left_shoulder', 'left_hip'],
++  ['right_shoulder', 'right_hip'],
++  ['left_hip', 'right_hip'],
++  ['left_hip', 'left_knee'],
++  ['left_knee', 'left_ankle'],
++  ['right_hip', 'right_knee'],
++  ['right_knee', 'right_ankle'],
++];
++
++export const POSE_CATALOG: PoseTemplate[] = [
++  // --- HEADSHOT POSES ---
++  {
++    id: 'headshot-solo-classic',
++    title: 'Classic Headshot',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'portrait', 'professional'],
++    keypoints: {
++      nose: [0.5, 0.35],
++      left_eye: [0.46, 0.32],
++      right_eye: [0.54, 0.32],
++      left_shoulder: [0.35, 0.65],
++      right_shoulder: [0.65, 0.65],
++      left_hip: [0.4, 0.95],
++      right_hip: [0.6, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-solo-tilt',
++    title: 'Engaged Head Tilt',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'headshot', 'casual', 'friendly'],
++    keypoints: {
++      nose: [0.52, 0.36],
++      left_eye: [0.47, 0.31],
++      right_eye: [0.55, 0.34],
++      left_shoulder: [0.32, 0.68],
++      right_shoulder: [0.68, 0.62],
++      left_hip: [0.38, 0.95],
++      right_hip: [0.62, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'headshot-couple-shoulder',
++    title: 'Couple Shoulder-to-Shoulder',
++    category: 'person',
++    framing: 'headshot',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'headshot', 'close', 'warm'],
++    keypoints: {
++      nose: [0.38, 0.35],
++      left_eye: [0.34, 0.32],
++      right_eye: [0.42, 0.32],
++      left_shoulder: [0.22, 0.65],
++      right_shoulder: [0.52, 0.65],
++      left_hip: [0.28, 0.95],
++      right_hip: [0.48, 0.95],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- HALF-BODY POSES ---
++  {
++    id: 'half-body-solo-arms-crossed',
++    title: 'Confident Arms Crossed',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'business', 'confident'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.36, 0.38],
++      right_shoulder: [0.64, 0.38],
++      left_elbow: [0.42, 0.52],
++      right_elbow: [0.58, 0.52],
++      left_wrist: [0.56, 0.54],
++      right_wrist: [0.44, 0.54],
++      left_hip: [0.42, 0.78],
++      right_hip: [0.58, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-solo-casual-hand-hip',
++    title: 'Casual Hand on Hip',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'half_body', 'lifestyle', 'relaxed'],
++    keypoints: {
++      nose: [0.5, 0.2],
++      left_eye: [0.47, 0.17],
++      right_eye: [0.53, 0.17],
++      left_shoulder: [0.35, 0.36],
++      right_shoulder: [0.65, 0.36],
++      left_elbow: [0.28, 0.52],
++      right_elbow: [0.72, 0.52],
++      left_wrist: [0.38, 0.68],
++      right_wrist: [0.62, 0.68],
++      left_hip: [0.4, 0.76],
++      right_hip: [0.6, 0.76],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-couple-embrace',
++    title: 'Side-by-Side Couple Lean',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'half_body', 'romantic', 'candid'],
++    keypoints: {
++      nose: [0.42, 0.22],
++      left_eye: [0.39, 0.19],
++      right_eye: [0.45, 0.19],
++      left_shoulder: [0.28, 0.38],
++      right_shoulder: [0.52, 0.38],
++      left_elbow: [0.24, 0.54],
++      right_elbow: [0.58, 0.54],
++      left_wrist: [0.32, 0.7],
++      right_wrist: [0.66, 0.7],
++      left_hip: [0.34, 0.78],
++      right_hip: [0.54, 0.78],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'half-body-group-lineup',
++    title: 'Team/Group Half-Body Lineup',
++    category: 'person',
++    framing: 'half_body',
++    subject_count: 3,
++    subjectCountTag: 'group',
++    tags: ['group', 'half_body', 'team', 'friends'],
++    keypoints: {
++      nose: [0.5, 0.22],
++      left_eye: [0.47, 0.19],
++      right_eye: [0.53, 0.19],
++      left_shoulder: [0.22, 0.4],
++      right_shoulder: [0.78, 0.4],
++      left_elbow: [0.18, 0.56],
++      right_elbow: [0.82, 0.56],
++      left_wrist: [0.25, 0.72],
++      right_wrist: [0.75, 0.72],
++      left_hip: [0.3, 0.8],
++      right_hip: [0.7, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++
++  // --- FULL-BODY POSES ---
++  {
++    id: 'full-body-solo-power-stance',
++    title: 'Full-Body Power Stance',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'fashion', 'bold'],
++    keypoints: {
++      nose: [0.5, 0.15],
++      left_eye: [0.48, 0.13],
++      right_eye: [0.52, 0.13],
++      left_shoulder: [0.38, 0.26],
++      right_shoulder: [0.62, 0.26],
++      left_elbow: [0.32, 0.4],
++      right_elbow: [0.68, 0.4],
++      left_wrist: [0.35, 0.54],
++      right_wrist: [0.65, 0.54],
++      left_hip: [0.42, 0.52],
++      right_hip: [0.58, 0.52],
++      left_knee: [0.38, 0.72],
++      right_knee: [0.62, 0.72],
++      left_ankle: [0.36, 0.92],
++      right_ankle: [0.64, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-solo-walking-stride',
++    title: 'Dynamic Streetwear Stride',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 1,
++    subjectCountTag: 'solo',
++    tags: ['solo', 'full_body', 'action', 'streetstyle'],
++    keypoints: {
++      nose: [0.5, 0.16],
++      left_eye: [0.48, 0.14],
++      right_eye: [0.52, 0.14],
++      left_shoulder: [0.36, 0.28],
++      right_shoulder: [0.64, 0.28],
++      left_elbow: [0.3, 0.42],
++      right_elbow: [0.7, 0.42],
++      left_wrist: [0.28, 0.56],
++      right_wrist: [0.72, 0.56],
++      left_hip: [0.42, 0.54],
++      right_hip: [0.58, 0.54],
++      left_knee: [0.44, 0.7],
++      right_knee: [0.6, 0.74],
++      left_ankle: [0.46, 0.9],
++      right_ankle: [0.62, 0.94],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-couple-holding-hands',
++    title: 'Couple Stroll Holding Hands',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 2,
++    subjectCountTag: 'couple',
++    tags: ['couple', 'full_body', 'romantic', 'walk'],
++    keypoints: {
++      nose: [0.4, 0.16],
++      left_eye: [0.38, 0.14],
++      right_eye: [0.42, 0.14],
++      left_shoulder: [0.28, 0.28],
++      right_shoulder: [0.52, 0.28],
++      left_elbow: [0.22, 0.42],
++      right_elbow: [0.58, 0.42],
++      left_wrist: [0.25, 0.56],
++      right_wrist: [0.55, 0.56],
++      left_hip: [0.32, 0.54],
++      right_hip: [0.48, 0.54],
++      left_knee: [0.3, 0.72],
++      right_knee: [0.5, 0.72],
++      left_ankle: [0.28, 0.92],
++      right_ankle: [0.52, 0.92],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++  {
++    id: 'full-body-group-fun-jump',
++    title: 'Group Mid-Air Celebration',
++    category: 'person',
++    framing: 'full_body',
++    subject_count: 4,
++    subjectCountTag: 'group',
++    tags: ['group', 'full_body', 'energetic', 'fun'],
++    keypoints: {
++      nose: [0.5, 0.12],
++      left_eye: [0.47, 0.1],
++      right_eye: [0.53, 0.1],
++      left_shoulder: [0.2, 0.24],
++      right_shoulder: [0.8, 0.24],
++      left_elbow: [0.15, 0.14],
++      right_elbow: [0.85, 0.14],
++      left_wrist: [0.12, 0.05],
++      right_wrist: [0.88, 0.05],
++      left_hip: [0.3, 0.48],
++      right_hip: [0.7, 0.48],
++      left_knee: [0.25, 0.64],
++      right_knee: [0.75, 0.64],
++      left_ankle: [0.22, 0.8],
++      right_ankle: [0.78, 0.8],
++    },
++    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
++  },
++];
+diff --git a/src/types/pose.ts b/src/types/pose.ts
+new file mode 100644
+index 0000000..68842a0
+--- /dev/null
++++ b/src/types/pose.ts
+@@ -0,0 +1,36 @@
++import { AppMode } from './camera';
++import { SubjectCount } from './vision';
++
++export type FramingCrop = 'headshot' | 'half_body' | 'full_body';
++
++export interface PoseKeypointsMap {
++  nose: [number, number];
++  left_eye?: [number, number];
++  right_eye?: [number, number];
++  left_ear?: [number, number];
++  right_ear?: [number, number];
++  left_shoulder: [number, number];
++  right_shoulder: [number, number];
++  left_elbow?: [number, number];
++  right_elbow?: [number, number];
++  left_wrist?: [number, number];
++  right_wrist?: [number, number];
++  left_hip: [number, number];
++  right_hip: [number, number];
++  left_knee?: [number, number];
++  right_knee?: [number, number];
++  left_ankle?: [number, number];
++  right_ankle?: [number, number];
++}
++
++export interface PoseTemplate {
++  id: string;
++  title: string;
++  category: AppMode;
++  framing: FramingCrop;
++  subject_count?: number; // 1 for solo, 2 for couple, >=3 for group
++  subjectCountTag?: SubjectCount;
++  tags: string[];
++  keypoints: PoseKeypointsMap;
++  skeleton_connections?: [string, string][];
++}
+diff --git a/src/utils/__tests__/poseFilter.test.ts b/src/utils/__tests__/poseFilter.test.ts
+new file mode 100644
+index 0000000..2d5a1c7
+--- /dev/null
++++ b/src/utils/__tests__/poseFilter.test.ts
+@@ -0,0 +1,81 @@
++import { filterPoseTemplates, matchesSubjectCount } from '../poseFilter';
++import { POSE_CATALOG } from '../../data/poseCatalog';
++import { PoseTemplate } from '../../types/pose';
 +
 +function assert(condition: boolean, message: string) {
 +  if (!condition) {
@@ -244,43 +872,149 @@ new file mode 100644
 +  }
 +}
 +
-+export function runCameraStoreTests() {
-+  const store = useCameraStore.getState();
-+
-+  // Test initial state
-+  assert(store.isFrozen === false, 'isFrozen initial value should be false');
-+  assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
-+
-+  // Test setIsAnalyzing
-+  store.setIsAnalyzing(true);
-+  assert(useCameraStore.getState().isAnalyzing === true, 'setIsAnalyzing(true) failed');
-+  store.setIsAnalyzing(false);
-+  assert(useCameraStore.getState().isAnalyzing === false, 'setIsAnalyzing(false) failed');
-+
-+  // Test toggleFreeze - freeze state transition
-+  store.toggleFreeze();
-+  let state = useCameraStore.getState();
-+  assert(state.isFrozen === true, 'toggleFreeze() should set isFrozen to true when false');
-+  assert(state.isAnalyzing === true, 'toggleFreeze() should set isAnalyzing to true when freezing');
-+
-+  // Test toggleFreeze - unfreeze state transition
-+  store.toggleFreeze();
-+  state = useCameraStore.getState();
-+  assert(state.isFrozen === false, 'toggleFreeze() should set isFrozen to false when true');
-+  assert(state.isAnalyzing === false, 'toggleFreeze() should set isAnalyzing to false when un-freezing');
-+
-+  // Test setIsFrozen directly
-+  store.setIsFrozen(true);
-+  assert(useCameraStore.getState().isFrozen === true, 'setIsFrozen(true) failed');
-+  store.setIsFrozen(false);
-+  assert(useCameraStore.getState().isFrozen === false, 'setIsFrozen(false) failed');
-+
-+  console.log('All useCameraStore unit tests passed successfully!');
++export function runPoseFilterTests() {
++  // Test 1: Framing filtering alone (headshot)
++  const headshots = filterPoseTemplates(POSE_CATALOG, { framing: 'headshot' });
++  assert(headshots.length > 0, 'Should return headshot templates');
++  assert(
++    headshots.every((t) => t.framing === 'headshot'),
++    'All returned templates must have framing === headshot'
++  );
++
++  // Test 2: Framing filtering alone (half_body)
++  const halfBody = filterPoseTemplates(POSE_CATALOG, { framing: 'half_body' });
++  assert(halfBody.length > 0, 'Should return half_body templates');
++  assert(
++    halfBody.every((t) => t.framing === 'half_body'),
++    'All returned templates must have framing === half_body'
++  );
++
++  // Test 3: Dual filtering (framing: half_body + subjectCount: couple)
++  const coupleHalfBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'half_body',
++    subjectCount: 'couple',
++  });
++  assert(coupleHalfBody.length > 0, 'Should return couple half_body templates');
++  assert(
++    coupleHalfBody.every((t) => t.framing === 'half_body' && matchesSubjectCount(t, 'couple')),
++    'Dual filter should match both framing and subject count'
++  );
++
++  // Test 4: Dual filtering (framing: full_body + subjectCount: solo)
++  const soloFullBody = filterPoseTemplates(POSE_CATALOG, {
++    framing: 'full_body',
++    subjectCount: 'solo',
++  });
++  assert(soloFullBody.length > 0, 'Should return solo full_body templates');
++  assert(
++    soloFullBody.every((t) => t.framing === 'full_body' && matchesSubjectCount(t, 'solo')),
++    'Dual filter should match full_body and solo subject count'
++  );
++
++  // Test 5: Fallback scenario - when no template matches specific subject count in framing crop
++  const mockTemplates: PoseTemplate[] = [
++    {
++      id: 'headshot-solo-1',
++      title: 'Solo Headshot',
++      category: 'person',
++      framing: 'headshot',
++      subject_count: 1,
++      subjectCountTag: 'solo',
++      tags: ['solo'],
++      keypoints: { nose: [0.5, 0.3], left_shoulder: [0.3, 0.6], right_shoulder: [0.7, 0.6], left_hip: [0.35, 0.9], right_hip: [0.65, 0.9] },
++    },
++  ];
++  // Ask for headshot + group subject count (no group headshots in mockTemplates)
++  const fallbackResults = filterPoseTemplates(mockTemplates, {
++    framing: 'headshot',
++    subjectCount: 'group',
++  });
++  assert(fallbackResults.length === 1, 'Should fallback to return framing matched templates when no subject count match exists');
++  assert(fallbackResults[0].id === 'headshot-solo-1', 'Fallback should return available framing template');
++
++  // Test 6: Empty catalog / invalid inputs
++  assert(filterPoseTemplates([], { framing: 'half_body' }).length === 0, 'Empty catalog should return empty array');
++
++  console.log('All poseFilter unit tests passed successfully!');
 +}
 +
 +if (typeof require !== 'undefined' && require.main === module) {
-+  runCameraStoreTests();
-+} else if (typeof process !== 'undefined' && process.argv[1]?.includes('useCameraStore.test')) {
-+  runCameraStoreTests();
++  runPoseFilterTests();
++} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseFilter.test')) {
++  runPoseFilterTests();
++}
+diff --git a/src/utils/poseFilter.ts b/src/utils/poseFilter.ts
+new file mode 100644
+index 0000000..0d4726d
+--- /dev/null
++++ b/src/utils/poseFilter.ts
+@@ -0,0 +1,67 @@
++import { PoseTemplate, FramingCrop } from '../types/pose';
++import { SubjectCount } from '../types/vision';
++import { AppMode } from '../types/camera';
++
++export interface FilterPoseOptions {
++  framing: FramingCrop;
++  subjectCount?: SubjectCount | null;
++  category?: AppMode;
++}
++
++/**
++ * Checks if a pose template matches the target SubjectCount ('solo' | 'couple' | 'group')
++ */
++export function matchesSubjectCount(template: PoseTemplate, subjectCount: SubjectCount): boolean {
++  if (template.subjectCountTag === subjectCount) {
++    return true;
++  }
++  if (template.tags && template.tags.includes(subjectCount)) {
++    return true;
++  }
++  if (template.subject_count !== undefined) {
++    if (subjectCount === 'solo' && template.subject_count === 1) return true;
++    if (subjectCount === 'couple' && template.subject_count === 2) return true;
++    if (subjectCount === 'group' && template.subject_count >= 3) return true;
++  }
++  return false;
 +}
-+```
++
++/**
++ * Pure utility function to filter pose templates based on active framing crop,
++ * auto-detected subject count, and app category mode.
++ */
++export function filterPoseTemplates(
++  templates: PoseTemplate[],
++  options: FilterPoseOptions
++): PoseTemplate[] {
++  if (!templates || templates.length === 0) {
++    return [];
++  }
++
++  const { framing, subjectCount, category = 'person' } = options;
++
++  // 1. Filter by category & framing crop
++  const framingMatched = templates.filter((template) => {
++    const categoryMatch = !template.category || template.category === category;
++    const framingMatch = template.framing === framing;
++    return categoryMatch && framingMatch;
++  });
++
++  if (framingMatched.length === 0) {
++    return [];
++  }
++
++  // 2. If subjectCount is available, refine by subjectCount
++  if (subjectCount) {
++    const dualMatched = framingMatched.filter((template) =>
++      matchesSubjectCount(template, subjectCount)
++    );
++
++    // Fallback scenario: If no dual match exists for this subject count, return all framing-matched templates
++    if (dualMatched.length > 0) {
++      return dualMatched;
++    }
++  }
++
++  return framingMatched;
++}
+
+`
diff --git a/_bmad-output/implementation-artifacts/sprint-status.yaml b/_bmad-output/implementation-artifacts/sprint-status.yaml
index 7fdf6bc..3175294 100644
--- a/_bmad-output/implementation-artifacts/sprint-status.yaml
+++ b/_bmad-output/implementation-artifacts/sprint-status.yaml
@@ -41,7 +41,7 @@
 # - Retrospective appends its action items to action_items; sprint-status surfaces open ones
 
 generated: 2026-07-28
-last_updated: 2026-07-29
+last_updated: 2026-07-30
 project: bmad
 project_key: NOKEY
 tracking_system: file-system
@@ -58,8 +58,8 @@ development_status:
   2-2-local-on-device-vision-inferencing-engine: done
   epic-2-retrospective: done
   epic-3: in-progress
-  3-1-manual-framing-selector-contextual-pose-filtering: ready-for-dev
-  3-2-coco-17-vector-pose-overlay-renderer: backlog
+  3-1-manual-framing-selector-contextual-pose-filtering: done
+  3-2-coco-17-vector-pose-overlay-renderer: review
   3-3-photographer-director-cues-alignment-feedback: backlog
   epic-3-retrospective: optional
   epic-4: backlog
diff --git a/src/components/camera/CameraViewfinder.tsx b/src/components/camera/CameraViewfinder.tsx
index 1edcb6c..d2a8740 100644
--- a/src/components/camera/CameraViewfinder.tsx
+++ b/src/components/camera/CameraViewfinder.tsx
@@ -6,6 +6,9 @@ import { getNumericZoom, clampZoom } from '../../utils/lensCalculator';
 import { analyzeKeyframe } from '../../utils/visionInferencingEngine';
 import { HorizonLevelBar } from './HorizonLevelBar';
 import { ModeSwitcher } from './ModeSwitcher';
+import { VectorPoseOverlay } from './VectorPoseOverlay';
+import { FramingSelector } from './FramingSelector';
+import { PoseCarousel } from './PoseCarousel';
 import { LensPresetChips } from './LensPresetChips';
 import { ShutterButton } from './ShutterButton';
 import { AnalyzingIndicator } from './AnalyzingIndicator';
@@ -24,6 +27,7 @@ if (Platform.OS !== 'web') {
 
 export const CameraViewfinder: React.FC = () => {
   const device = useSafeCameraDevice('back');
+  const mode = useCameraStore((state) => state.mode);
   const isAppActive = useCameraStore((state) => state.isAppActive);
   const setIsAppActive = useCameraStore((state) => state.setIsAppActive);
   const activeLens = useCameraStore((state) => state.activeLens);
@@ -117,6 +121,9 @@ export const CameraViewfinder: React.FC = () => {
       {/* Analyzing HUD & Keyframe Unfreeze Tap Listener */}
       <AnalyzingIndicator />
 
+      {/* COCO-17 Vector Pose Overlay Layer */}
+      <VectorPoseOverlay />
+
       {/* Top HUD Overlay - Mode Switcher */}
       <View style={[styles.topHudContainer, { top: topOffset }]} pointerEvents="box-none">
         <ModeSwitcher />
@@ -125,8 +132,14 @@ export const CameraViewfinder: React.FC = () => {
       {/* Center HUD Overlay - Horizon Leveling Bar */}
       <HorizonLevelBar />
 
-      {/* Bottom HUD Overlay - Lens Preset Chips & Shutter Button */}
+      {/* Bottom HUD Overlay - Framing Selector, Pose Carousel, Lens Preset Chips & Shutter Button */}
       <View style={[styles.bottomHudContainer, { bottom: bottomOffset }]} pointerEvents="box-none">
+        {mode === 'person' && (
+          <View style={styles.personHudLayer}>
+            <FramingSelector />
+            <PoseCarousel />
+          </View>
+        )}
         <LensPresetChips />
         <View style={styles.shutterContainer}>
           <ShutterButton />
@@ -141,26 +154,6 @@ const styles = StyleSheet.create({
     flex: 1,
     backgroundColor: '#000000',
   },
-  loadingContainer: {
-    flex: 1,
-    backgroundColor: '#0F0F11',
-    justifyContent: 'center',
-    alignItems: 'center',
-    paddingHorizontal: 24,
-  },
-  loadingTitle: {
-    color: '#FFFFFF',
-    fontSize: 18,
-    fontWeight: '600',
-    marginBottom: 8,
-  },
-  loadingText: {
-    color: '#8E8E93',
-    fontSize: 14,
-    fontWeight: '400',
-    textAlign: 'center',
-    lineHeight: 20,
-  },
   topHudContainer: {
     position: 'absolute',
     left: 0,
@@ -175,6 +168,11 @@ const styles = StyleSheet.create({
     zIndex: 20,
     alignItems: 'center',
   },
+  personHudLayer: {
+    width: '100%',
+    alignItems: 'center',
+    marginBottom: 8,
+  },
   simulatorPreviewCanvas: {
     ...StyleSheet.absoluteFillObject,
     backgroundColor: '#121214',
@@ -203,7 +201,7 @@ const styles = StyleSheet.create({
     color: '#00E5FF',
   },
   shutterContainer: {
-    marginTop: 20,
+    marginTop: 16,
     alignItems: 'center',
   },
 });
diff --git a/src/stores/__tests__/useCameraStore.test.ts b/src/stores/__tests__/useCameraStore.test.ts
index bdeff94..c5a0953 100644
--- a/src/stores/__tests__/useCameraStore.test.ts
+++ b/src/stores/__tests__/useCameraStore.test.ts
@@ -15,6 +15,32 @@ export function runCameraStoreTests() {
   assert(store.isAnalyzing === false, 'isAnalyzing initial value should be false');
   assert(store.visionResult === null, 'visionResult initial value should be null');
   assert(store.inferenceLatencyMs === null, 'inferenceLatencyMs initial value should be null');
+  assert(store.selectedFraming === 'half_body', 'selectedFraming default value should be half_body');
+  assert(store.selectedPoseId === null, 'selectedPoseId default value should be null');
+
+  // Test framing crop updates
+  store.setSelectedFraming('headshot');
+  assert(useCameraStore.getState().selectedFraming === 'headshot', 'setSelectedFraming(headshot) failed');
+  store.setSelectedFraming('full_body');
+  assert(useCameraStore.getState().selectedFraming === 'full_body', 'setSelectedFraming(full_body) failed');
+  store.setSelectedFraming('half_body');
+
+  // Test active pose selection
+  store.setSelectedPoseId('half-body-solo-arms-crossed');
+  assert(useCameraStore.getState().selectedPoseId === 'half-body-solo-arms-crossed', 'setSelectedPoseId failed');
+
+  // Changing framing should reset selectedPoseId to null
+  store.setSelectedFraming('headshot');
+  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedFraming should reset selectedPoseId to null');
+
+  store.setSelectedPoseId(null);
+  assert(useCameraStore.getState().selectedPoseId === null, 'setSelectedPoseId(null) failed');
+
+  // Test mode switching does not corrupt framing state
+  store.setSelectedFraming('headshot');
+  store.setMode('scene');
+  assert(useCameraStore.getState().selectedFraming === 'headshot', 'selectedFraming should persist across mode switches');
+  store.setMode('person');
 
   // Test setIsAnalyzing
   store.setIsAnalyzing(true);
diff --git a/src/stores/useCameraStore.ts b/src/stores/useCameraStore.ts
index 13b0f4f..564f4dd 100644
--- a/src/stores/useCameraStore.ts
+++ b/src/stores/useCameraStore.ts
@@ -1,6 +1,7 @@
 import { create } from 'zustand';
 import { CameraState, AppMode, CameraPermissionStatus, LensPreset } from '../types/camera';
 import { KeyframeVisionResult } from '../types/vision';
+import { FramingCrop } from '../types/pose';
 
 export const useCameraStore = create<CameraState>((set) => ({
   mode: 'person',
@@ -44,4 +45,10 @@ export const useCameraStore = create<CameraState>((set) => ({
 
   showHorizonBar: true,
   setShowHorizonBar: (show: boolean) => set({ showHorizonBar: show }),
+
+  selectedFraming: 'half_body',
+  setSelectedFraming: (framing: FramingCrop) => set({ selectedFraming: framing, selectedPoseId: null }),
+
+  selectedPoseId: null,
+  setSelectedPoseId: (id: string | null) => set({ selectedPoseId: id }),
 }));
diff --git a/src/types/camera.ts b/src/types/camera.ts
index 1c088be..4fd687a 100644
--- a/src/types/camera.ts
+++ b/src/types/camera.ts
@@ -1,4 +1,5 @@
 import { KeyframeVisionResult } from './vision';
+import { FramingCrop } from './pose';
 
 export type AppMode = 'person' | 'scene';
 
@@ -39,4 +40,10 @@ export interface CameraState {
   // Horizon Leveling Bar State
   showHorizonBar: boolean;
   setShowHorizonBar: (show: boolean) => void;
+
+  // Framing Crop & Selected Pose State
+  selectedFraming: FramingCrop;
+  setSelectedFraming: (framing: FramingCrop) => void;
+  selectedPoseId: string | null;
+  setSelectedPoseId: (id: string | null) => void;
 }

diff --git a/src/components/camera/VectorPoseOverlay.tsx b/src/components/camera/VectorPoseOverlay.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/camera/VectorPoseOverlay.tsx
@@ -0,0 +1,267 @@
+import React, { useState, useMemo, useRef } from 'react';
+import {
+  StyleSheet,
+  View,
+  Text,
+  TouchableOpacity,
+  PanResponder,
+  LayoutChangeEvent,
+} from 'react-native';
+import Svg, { Line, Circle, G } from 'react-native-svg';
+import { useCameraStore } from '../../stores/useCameraStore';
+import { POSE_CATALOG } from '../../data/poseCatalog';
+import {
+  normalizeKeypointsToCanvas,
+  getSkeletonConnectionLines,
+  clampPoseTransform,
+  PoseTransform,
+  DEFAULT_TRANSFORM,
+} from '../../utils/poseRenderer';
+
+export const VectorPoseOverlay: React.FC = () => {
+  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
+  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
+  const mode = useCameraStore((state) => state.mode);
+
+  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
+  const [transform, setTransform] = useState<PoseTransform>(DEFAULT_TRANSFORM);
+
+  // Store transform baseline during gesture start
+  const baseTransformRef = useRef<PoseTransform>(DEFAULT_TRANSFORM);
+
+  // Look up selected pose template from catalog
+  const activePoseTemplate = useMemo(() => {
+    if (!selectedPoseId) return null;
+    return POSE_CATALOG.find((pose) => pose.id === selectedPoseId) || null;
+  }, [selectedPoseId]);
+
+  // PanResponder for touch drag / translation and scaling control
+  const panResponder = useRef(
+    PanResponder.create({
+      onStartShouldSetPanResponder: () => true,
+      onMoveShouldSetPanResponder: () => true,
+      onPanResponderGrant: () => {
+        baseTransformRef.current = { ...transform };
+      },
+      onPanResponderMove: (_evt, gestureState) => {
+        const newTransform: PoseTransform = {
+          translateX: baseTransformRef.current.translateX + gestureState.dx,
+          translateY: baseTransformRef.current.translateY + gestureState.dy,
+          scale: baseTransformRef.current.scale,
+        };
+
+        setTransform((prev) =>
+          clampPoseTransform(
+            newTransform,
+            canvasDimensions.width || 300,
+            canvasDimensions.height || 600
+          )
+        );
+      },
+    })
+  ).current;
+
+  // Handle onLayout to dynamically calculate canvas pixel size
+  const handleLayout = (event: LayoutChangeEvent) => {
+    const { width, height } = event.nativeEvent.layout;
+    if (width > 0 && height > 0) {
+      setCanvasDimensions({ width, height });
+    }
+  };
+
+  // Reset transform state back to centered 1.0x scale
+  const handleResetTransform = () => {
+    setTransform(DEFAULT_TRANSFORM);
+  };
+
+  // Clear selected pose overlay
+  const handleDismissOverlay = () => {
+    setSelectedPoseId(null);
+    setTransform(DEFAULT_TRANSFORM);
+  };
+
+  // Quick zoom scale adjustments
+  const handleZoomIn = () => {
+    setTransform((prev) =>
+      clampPoseTransform(
+        { ...prev, scale: prev.scale + 0.2 },
+        canvasDimensions.width || 300,
+        canvasDimensions.height || 600
+      )
+    );
+  };
+
+  const handleZoomOut = () => {
+    setTransform((prev) =>
+      clampPoseTransform(
+        { ...prev, scale: prev.scale - 0.2 },
+        canvasDimensions.width || 300,
+        canvasDimensions.height || 600
+      )
+    );
+  };
+
+  // Only render if Person mode is active and a pose template is selected
+  if (mode !== 'person' || !activePoseTemplate) {
+    return null;
+  }
+
+  const { width, height } = canvasDimensions;
+
+  // Pre-calculate line connections and keypoint circles if canvas dimensions are ready
+  const connectionLines =
+    width > 0 && height > 0 && activePoseTemplate.skeleton_connections
+      ? getSkeletonConnectionLines(
+          activePoseTemplate.keypoints,
+          activePoseTemplate.skeleton_connections,
+          width,
+          height
+        )
+      : [];
+
+  const keypointPoints =
+    width > 0 && height > 0
+      ? normalizeKeypointsToCanvas(activePoseTemplate.keypoints, width, height)
+      : {};
+
+  return (
+    <View style={styles.overlayContainer} onLayout={handleLayout} pointerEvents="box-none">
+      {/* SVG Canvas with Gesture Responder */}
+      <View style={styles.svgCanvasWrapper} {...panResponder.panHandlers}>
+        {width > 0 && height > 0 && (
+          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
+            <G
+              transform={`translate(${transform.translateX}, ${transform.translateY}) scale(${transform.scale})`}
+              origin={`${width / 2}, ${height / 2}`}
+            >
+              {/* Render Skeleton Lines */}
+              {connectionLines.map((line) => (
+                <Line
+                  key={line.id}
+                  x1={line.x1}
+                  y1={line.y1}
+                  x2={line.x2}
+                  y2={line.y2}
+                  stroke="#00E5FF"
+                  strokeWidth={3}
+                  strokeOpacity={0.8}
+                  strokeLinecap="round"
+                />
+              ))}
+
+              {/* Render Joint Circles */}
+              {Object.entries(keypointPoints).map(([jointKey, pt]) => (
+                <G key={jointKey}>
+                  <Circle
+                    cx={pt.x}
+                    cy={pt.y}
+                    r={6}
+                    fill="#00E5FF"
+                    fillOpacity={0.9}
+                    stroke="#003B46"
+                    strokeWidth={1.5}
+                  />
+                  <Circle cx={pt.x} cy={pt.y} r={2} fill="#FFFFFF" />
+                </G>
+              ))}
+            </G>
+          </Svg>
+        )}
+      </View>
+
+      {/* Floating HUD Controls for Gesture Adjustment & Dismiss */}
+      <View style={styles.hudControlsRow} pointerEvents="auto">
+        <View style={styles.badgeContainer}>
+          <Text style={styles.badgeText} numberOfLines={1}>
+            {activePoseTemplate.title} ({transform.scale.toFixed(1)}x)
+          </Text>
+        </View>
+        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomOut} activeOpacity={0.7}>
+          <Text style={styles.controlBtnText}>-</Text>
+        </TouchableOpacity>
+        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomIn} activeOpacity={0.7}>
+          <Text style={styles.controlBtnText}>+</Text>
+        </TouchableOpacity>
+        <TouchableOpacity
+          style={[styles.controlBtn, styles.resetBtn]}
+          onPress={handleResetTransform}
+          activeOpacity={0.7}
+        >
+          <Text style={styles.controlBtnText}>Reset</Text>
+        </TouchableOpacity>
+        <TouchableOpacity
+          style={[styles.controlBtn, styles.dismissBtn]}
+          onPress={handleDismissOverlay}
+          activeOpacity={0.7}
+        >
+          <Text style={styles.dismissBtnText}>✕</Text>
+        </TouchableOpacity>
+      </View>
+    </View>
+  );
+};
+
+const styles = StyleSheet.create({
+  overlayContainer: {
+    ...StyleSheet.absoluteFillObject,
+    zIndex: 15,
+  },
+  svgCanvasWrapper: {
+    ...StyleSheet.absoluteFillObject,
+  },
+  hudControlsRow: {
+    position: 'absolute',
+    top: 100,
+    right: 16,
+    flexDirection: 'row',
+    alignItems: 'center',
+    backgroundColor: 'rgba(18, 18, 20, 0.85)',
+    borderRadius: 20,
+    paddingHorizontal: 10,
+    paddingVertical: 6,
+    borderColor: '#00E5FF',
+    borderWidth: 1,
+    shadowColor: '#00E5FF',
+    shadowOffset: { width: 0, height: 2 },
+    shadowOpacity: 0.2,
+    shadowRadius: 4,
+    elevation: 5,
+  },
+  badgeContainer: {
+    marginRight: 8,
+    maxWidth: 140,
+  },
+  badgeText: {
+    color: '#00E5FF',
+    fontSize: 11,
+    fontWeight: '700',
+  },
+  controlBtn: {
+    width: 28,
+    height: 28,
+    borderRadius: 14,
+    backgroundColor: 'rgba(255, 255, 255, 0.15)',
+    justifyContent: 'center',
+    alignItems: 'center',
+    marginLeft: 4,
+  },
+  resetBtn: {
+    width: 'auto',
+    paddingHorizontal: 8,
+  },
+  dismissBtn: {
+    backgroundColor: 'rgba(255, 59, 48, 0.3)',
+    borderColor: '#FF3B30',
+    borderWidth: 1,
+  },
+  controlBtnText: {
+    color: '#FFFFFF',
+    fontSize: 12,
+    fontWeight: '600',
+  },
+  dismissBtnText: {
+    color: '#FF3B30',
+    fontSize: 12,
+    fontWeight: '700',
+  },
+});

diff --git a/src/utils/poseRenderer.ts b/src/utils/poseRenderer.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/poseRenderer.ts
@@ -0,0 +1,116 @@
+import { PoseKeypointsMap } from '../types/pose';
+
+export interface CanvasPoint {
+  x: number;
+  y: number;
+}
+
+export interface SkeletonLine {
+  id: string;
+  fromKey: string;
+  toKey: string;
+  x1: number;
+  y1: number;
+  x2: number;
+  y2: number;
+}
+
+export interface PoseTransform {
+  translateX: number;
+  translateY: number;
+  scale: number;
+}
+
+export const DEFAULT_TRANSFORM: PoseTransform = {
+  translateX: 0,
+  translateY: 0,
+  scale: 1.0,
+};
+
+/**
+ * Maps normalized COCO-17 keypoint coordinates (0.0 .. 1.0) into absolute canvas pixel dimensions.
+ */
+export function normalizeKeypointsToCanvas(
+  keypoints: PoseKeypointsMap,
+  canvasWidth: number,
+  canvasHeight: number
+): Record<string, CanvasPoint> {
+  const result: Record<string, CanvasPoint> = {};
+
+  if (!keypoints) return result;
+
+  for (const [jointName, coords] of Object.entries(keypoints)) {
+    if (Array.isArray(coords) && coords.length >= 2) {
+      const [nx, ny] = coords;
+      if (typeof nx === 'number' && typeof ny === 'number' && !isNaN(nx) && !isNaN(ny)) {
+        result[jointName] = {
+          x: Math.round(nx * canvasWidth),
+          y: Math.round(ny * canvasHeight),
+        };
+      }
+    }
+  }
+
+  return result;
+}
+
+/**
+ * Generates SVG line segment specifications for valid skeleton connections.
+ * Skips connection lines if either endpoint keypoint is omitted or missing.
+ */
+export function getSkeletonConnectionLines(
+  keypoints: PoseKeypointsMap,
+  connections: [string, string][],
+  canvasWidth: number,
+  canvasHeight: number
+): SkeletonLine[] {
+  const mappedPoints = normalizeKeypointsToCanvas(keypoints, canvasWidth, canvasHeight);
+  const lines: SkeletonLine[] = [];
+
+  if (!connections || !Array.isArray(connections)) {
+    return lines;
+  }
+
+  for (const [fromKey, toKey] of connections) {
+    const fromPt = mappedPoints[fromKey];
+    const toPt = mappedPoints[toKey];
+
+    if (fromPt && toPt) {
+      lines.push({
+        id: `${fromKey}-${toKey}`,
+        fromKey,
+        toKey,
+        x1: fromPt.x,
+        y1: fromPt.y,
+        x2: toPt.x,
+        y2: toPt.y,
+      });
+    }
+  }
+
+  return lines;
+}
+
+/**
+ * Clamps scale factor (0.5x .. 3.0x) and translation boundaries to ensure vector overlay stays visible.
+ */
+export function clampPoseTransform(
+  transform: PoseTransform,
+  canvasWidth: number,
+  canvasHeight: number
+): PoseTransform {
+  const minScale = 0.5;
+  const maxScale = 3.0;
+  const maxTransX = canvasWidth * 0.75;
+  const maxTransY = canvasHeight * 0.75;
+
+  const clampedScale = Math.min(Math.max(transform.scale, minScale), maxScale);
+  const clampedX = Math.min(Math.max(transform.translateX, -maxTransX), maxTransX);
+  const clampedY = Math.min(Math.max(transform.translateY, -maxTransY), maxTransY);
+
+  return {
+    translateX: clampedX,
+    translateY: clampedY,
+    scale: clampedScale,
+  };
+}

diff --git a/src/utils/__tests__/poseRenderer.test.ts b/src/utils/__tests__/poseRenderer.test.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/__tests__/poseRenderer.test.ts
@@ -0,0 +1,82 @@
+import {
+  normalizeKeypointsToCanvas,
+  getSkeletonConnectionLines,
+  clampPoseTransform,
+} from '../poseRenderer';
+import { PoseKeypointsMap } from '../../types/pose';
+
+function assert(condition: boolean, message: string) {
+  if (!condition) {
+    throw new Error(`Assertion failed: ${message}`);
+  }
+}
+
+export function runPoseRendererTests() {
+  const sampleKeypoints: PoseKeypointsMap = {
+    nose: [0.5, 0.2],
+    left_shoulder: [0.3, 0.4],
+    right_shoulder: [0.7, 0.4],
+    left_elbow: [0.2, 0.6],
+    left_hip: [0.4, 0.8],
+    right_hip: [0.6, 0.8],
+  };
+
+  const canvasWidth = 400;
+  const canvasHeight = 800;
+
+  // Test 1: normalizeKeypointsToCanvas maps coordinates accurately
+  const mapped = normalizeKeypointsToCanvas(sampleKeypoints, canvasWidth, canvasHeight);
+  assert(mapped.nose.x === 200 && mapped.nose.y === 160, 'nose should map to (200, 160)');
+  assert(mapped.left_shoulder.x === 120 && mapped.left_shoulder.y === 320, 'left_shoulder should map to (120, 320)');
+  assert(mapped.right_shoulder.x === 280 && mapped.right_shoulder.y === 320, 'right_shoulder should map to (280, 320)');
+  assert(mapped.left_elbow.x === 80 && mapped.left_elbow.y === 480, 'left_elbow should map to (80, 480)');
+
+  // Test 2: normalizeKeypointsToCanvas handles missing optional keypoints safely
+  const partialKeypoints: PoseKeypointsMap = {
+    nose: [0.5, 0.2],
+    left_shoulder: [0.3, 0.4],
+    right_shoulder: [0.7, 0.4],
+    left_hip: [0.4, 0.8],
+    right_hip: [0.6, 0.8],
+  };
+  const partialMapped = normalizeKeypointsToCanvas(partialKeypoints, canvasWidth, canvasHeight);
+  assert(partialMapped.left_elbow === undefined, 'missing left_elbow should be undefined');
+
+  // Test 3: getSkeletonConnectionLines generates valid lines
+  const connections: [string, string][] = [
+    ['left_shoulder', 'right_shoulder'],
+    ['left_shoulder', 'left_elbow'],
+  ];
+  const lines = getSkeletonConnectionLines(sampleKeypoints, connections, canvasWidth, canvasHeight);
+  assert(lines.length === 2, 'Should generate 2 connection lines');
+  assert(lines[0].id === 'left_shoulder-right_shoulder', 'First line id match');
+  assert(lines[0].x1 === 120 && lines[0].y1 === 320 && lines[0].x2 === 280 && lines[0].y2 === 320, 'Line 1 coordinates match');
+  assert(lines[1].id === 'left_shoulder-left_elbow', 'Second line id match');
+
+  // Test 4: getSkeletonConnectionLines skips connections with missing keypoints
+  const incompleteConnections: [string, string][] = [
+    ['left_shoulder', 'right_shoulder'],
+    ['left_elbow', 'left_wrist'], // left_wrist missing
+  ];
+  const filteredLines = getSkeletonConnectionLines(sampleKeypoints, incompleteConnections, canvasWidth, canvasHeight);
+  assert(filteredLines.length === 1, 'Should skip incomplete connection line');
+
+  // Test 5: clampPoseTransform scale and translation bounds
+  const tooSmall = clampPoseTransform({ translateX: 0, translateY: 0, scale: 0.2 }, canvasWidth, canvasHeight);
+  assert(tooSmall.scale === 0.5, 'Min scale should clamp to 0.5');
+
+  const tooLarge = clampPoseTransform({ translateX: 0, translateY: 0, scale: 5.0 }, canvasWidth, canvasHeight);
+  assert(tooLarge.scale === 3.0, 'Max scale should clamp to 3.0');
+
+  const overflowTrans = clampPoseTransform({ translateX: 1000, translateY: -1000, scale: 1.0 }, canvasWidth, canvasHeight);
+  assert(overflowTrans.translateX === canvasWidth * 0.75, 'TranslateX should clamp to max margin');
+  assert(overflowTrans.translateY === -canvasHeight * 0.75, 'TranslateY should clamp to min margin');
+
+  console.log('All poseRenderer unit tests passed successfully!');
+}
+
+if (typeof require !== 'undefined' && require.main === module) {
+  runPoseRendererTests();
+} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseRenderer.test')) {
+  runPoseRendererTests();
+}

diff --git a/src/types/pose.ts b/src/types/pose.ts
new file mode 100644
--- /dev/null
+++ b/src/types/pose.ts
@@ -0,0 +1,36 @@
+import { AppMode } from './camera';
+import { SubjectCount } from './vision';
+
+export type FramingCrop = 'headshot' | 'half_body' | 'full_body';
+
+export interface PoseKeypointsMap {
+  nose: [number, number];
+  left_eye?: [number, number];
+  right_eye?: [number, number];
+  left_ear?: [number, number];
+  right_ear?: [number, number];
+  left_shoulder: [number, number];
+  right_shoulder: [number, number];
+  left_elbow?: [number, number];
+  right_elbow?: [number, number];
+  left_wrist?: [number, number];
+  right_wrist?: [number, number];
+  left_hip: [number, number];
+  right_hip: [number, number];
+  left_knee?: [number, number];
+  right_knee?: [number, number];
+  left_ankle?: [number, number];
+  right_ankle?: [number, number];
+}
+
+export interface PoseTemplate {
+  id: string;
+  title: string;
+  category: AppMode;
+  framing: FramingCrop;
+  subject_count?: number; // 1 for solo, 2 for couple, >=3 for group
+  subjectCountTag?: SubjectCount;
+  tags: string[];
+  keypoints: PoseKeypointsMap;
+  skeleton_connections?: [string, string][];
+}

diff --git a/src/data/poseCatalog.ts b/src/data/poseCatalog.ts
new file mode 100644
--- /dev/null
+++ b/src/data/poseCatalog.ts
@@ -0,0 +1,283 @@
+import { PoseTemplate } from '../types/pose';
+
+const DEFAULT_SKELETON_CONNECTIONS: [string, string][] = [
+  ['nose', 'left_eye'],
+  ['nose', 'right_eye'],
+  ['left_shoulder', 'right_shoulder'],
+  ['left_shoulder', 'left_elbow'],
+  ['left_elbow', 'left_wrist'],
+  ['right_shoulder', 'right_elbow'],
+  ['right_elbow', 'right_wrist'],
+  ['left_shoulder', 'left_hip'],
+  ['right_shoulder', 'right_hip'],
+  ['left_hip', 'right_hip'],
+  ['left_hip', 'left_knee'],
+  ['left_knee', 'left_ankle'],
+  ['right_hip', 'right_knee'],
+  ['right_knee', 'right_ankle'],
+];
+
+export const POSE_CATALOG: PoseTemplate[] = [
+  // --- HEADSHOT POSES ---
+  {
+    id: 'headshot-solo-classic',
+    title: 'Classic Headshot',
+    category: 'person',
+    framing: 'headshot',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'headshot', 'portrait', 'professional'],
+    keypoints: {
+      nose: [0.5, 0.35],
+      left_eye: [0.46, 0.32],
+      right_eye: [0.54, 0.32],
+      left_shoulder: [0.35, 0.65],
+      right_shoulder: [0.65, 0.65],
+      left_hip: [0.4, 0.95],
+      right_hip: [0.6, 0.95],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'headshot-solo-tilt',
+    title: 'Engaged Head Tilt',
+    category: 'person',
+    framing: 'headshot',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'headshot', 'casual', 'friendly'],
+    keypoints: {
+      nose: [0.52, 0.36],
+      left_eye: [0.47, 0.31],
+      right_eye: [0.55, 0.34],
+      left_shoulder: [0.32, 0.68],
+      right_shoulder: [0.68, 0.62],
+      left_hip: [0.38, 0.95],
+      right_hip: [0.62, 0.95],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'headshot-couple-shoulder',
+    title: 'Couple Shoulder-to-Shoulder',
+    category: 'person',
+    framing: 'headshot',
+    subject_count: 2,
+    subjectCountTag: 'couple',
+    tags: ['couple', 'headshot', 'close', 'warm'],
+    keypoints: {
+      nose: [0.38, 0.35],
+      left_eye: [0.34, 0.32],
+      right_eye: [0.42, 0.32],
+      left_shoulder: [0.22, 0.65],
+      right_shoulder: [0.52, 0.65],
+      left_hip: [0.28, 0.95],
+      right_hip: [0.48, 0.95],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+
+  // --- HALF-BODY POSES ---
+  {
+    id: 'half-body-solo-arms-crossed',
+    title: 'Confident Arms Crossed',
+    category: 'person',
+    framing: 'half_body',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'half_body', 'business', 'confident'],
+    keypoints: {
+      nose: [0.5, 0.22],
+      left_eye: [0.47, 0.19],
+      right_eye: [0.53, 0.19],
+      left_shoulder: [0.36, 0.38],
+      right_shoulder: [0.64, 0.38],
+      left_elbow: [0.42, 0.52],
+      right_elbow: [0.58, 0.52],
+      left_wrist: [0.56, 0.54],
+      right_wrist: [0.44, 0.54],
+      left_hip: [0.42, 0.78],
+      right_hip: [0.58, 0.78],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'half-body-solo-casual-hand-hip',
+    title: 'Casual Hand on Hip',
+    category: 'person',
+    framing: 'half_body',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'half_body', 'lifestyle', 'relaxed'],
+    keypoints: {
+      nose: [0.5, 0.2],
+      left_eye: [0.47, 0.17],
+      right_eye: [0.53, 0.17],
+      left_shoulder: [0.35, 0.36],
+      right_shoulder: [0.65, 0.36],
+      left_elbow: [0.28, 0.52],
+      right_elbow: [0.72, 0.52],
+      left_wrist: [0.38, 0.68],
+      right_wrist: [0.62, 0.68],
+      left_hip: [0.4, 0.76],
+      right_hip: [0.6, 0.76],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'half-body-couple-embrace',
+    title: 'Side-by-Side Couple Lean',
+    category: 'person',
+    framing: 'half_body',
+    subject_count: 2,
+    subjectCountTag: 'couple',
+    tags: ['couple', 'half_body', 'romantic', 'candid'],
+    keypoints: {
+      nose: [0.42, 0.22],
+      left_eye: [0.39, 0.19],
+      right_eye: [0.45, 0.19],
+      left_shoulder: [0.28, 0.38],
+      right_shoulder: [0.52, 0.38],
+      left_elbow: [0.24, 0.54],
+      right_elbow: [0.58, 0.54],
+      left_wrist: [0.32, 0.7],
+      right_wrist: [0.66, 0.7],
+      left_hip: [0.34, 0.78],
+      right_hip: [0.54, 0.78],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'half-body-group-lineup',
+    title: 'Team/Group Half-Body Lineup',
+    category: 'person',
+    framing: 'half_body',
+    subject_count: 3,
+    subjectCountTag: 'group',
+    tags: ['group', 'half_body', 'team', 'friends'],
+    keypoints: {
+      nose: [0.5, 0.22],
+      left_eye: [0.47, 0.19],
+      right_eye: [0.53, 0.19],
+      left_shoulder: [0.22, 0.4],
+      right_shoulder: [0.78, 0.4],
+      left_elbow: [0.18, 0.56],
+      right_elbow: [0.82, 0.56],
+      left_wrist: [0.25, 0.72],
+      right_wrist: [0.75, 0.72],
+      left_hip: [0.3, 0.8],
+      right_hip: [0.7, 0.8],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+
+  // --- FULL-BODY POSES ---
+  {
+    id: 'full-body-solo-power-stance',
+    title: 'Full-Body Power Stance',
+    category: 'person',
+    framing: 'full_body',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'full_body', 'fashion', 'bold'],
+    keypoints: {
+      nose: [0.5, 0.15],
+      left_eye: [0.48, 0.13],
+      right_eye: [0.52, 0.13],
+      left_shoulder: [0.38, 0.26],
+      right_shoulder: [0.62, 0.26],
+      left_elbow: [0.32, 0.4],
+      right_elbow: [0.68, 0.4],
+      left_wrist: [0.35, 0.54],
+      right_wrist: [0.65, 0.54],
+      left_hip: [0.42, 0.52],
+      right_hip: [0.58, 0.52],
+      left_knee: [0.38, 0.72],
+      right_knee: [0.62, 0.72],
+      left_ankle: [0.36, 0.92],
+      right_ankle: [0.64, 0.92],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'full-body-solo-walking-stride',
+    title: 'Dynamic Streetwear Stride',
+    category: 'person',
+    framing: 'full_body',
+    subject_count: 1,
+    subjectCountTag: 'solo',
+    tags: ['solo', 'full_body', 'action', 'streetstyle'],
+    keypoints: {
+      nose: [0.5, 0.16],
+      left_eye: [0.48, 0.14],
+      right_eye: [0.52, 0.14],
+      left_shoulder: [0.36, 0.28],
+      right_shoulder: [0.64, 0.28],
+      left_elbow: [0.3, 0.42],
+      right_elbow: [0.7, 0.42],
+      left_wrist: [0.28, 0.56],
+      right_wrist: [0.72, 0.56],
+      left_hip: [0.42, 0.54],
+      right_hip: [0.58, 0.54],
+      left_knee: [0.44, 0.7],
+      right_knee: [0.6, 0.74],
+      left_ankle: [0.46, 0.9],
+      right_ankle: [0.62, 0.94],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'full-body-couple-holding-hands',
+    title: 'Couple Stroll Holding Hands',
+    category: 'person',
+    framing: 'full_body',
+    subject_count: 2,
+    subjectCountTag: 'couple',
+    tags: ['couple', 'full_body', 'romantic', 'walk'],
+    keypoints: {
+      nose: [0.4, 0.16],
+      left_eye: [0.38, 0.14],
+      right_eye: [0.42, 0.14],
+      left_shoulder: [0.28, 0.28],
+      right_shoulder: [0.52, 0.28],
+      left_elbow: [0.22, 0.42],
+      right_elbow: [0.58, 0.42],
+      left_wrist: [0.25, 0.56],
+      right_wrist: [0.55, 0.56],
+      left_hip: [0.32, 0.54],
+      right_hip: [0.48, 0.54],
+      left_knee: [0.3, 0.72],
+      right_knee: [0.5, 0.72],
+      left_ankle: [0.28, 0.92],
+      right_ankle: [0.52, 0.92],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+  {
+    id: 'full-body-group-fun-jump',
+    title: 'Group Mid-Air Celebration',
+    category: 'person',
+    framing: 'full_body',
+    subject_count: 4,
+    subjectCountTag: 'group',
+    tags: ['group', 'full_body', 'energetic', 'fun'],
+    keypoints: {
+      nose: [0.5, 0.12],
+      left_eye: [0.47, 0.1],
+      right_eye: [0.53, 0.1],
+      left_shoulder: [0.2, 0.24],
+      right_shoulder: [0.8, 0.24],
+      left_elbow: [0.15, 0.14],
+      right_elbow: [0.85, 0.14],
+      left_wrist: [0.12, 0.05],
+      right_wrist: [0.88, 0.05],
+      left_hip: [0.3, 0.48],
+      right_hip: [0.7, 0.48],
+      left_knee: [0.25, 0.64],
+      right_knee: [0.75, 0.64],
+      left_ankle: [0.22, 0.8],
+      right_ankle: [0.78, 0.8],
+    },
+    skeleton_connections: DEFAULT_SKELETON_CONNECTIONS,
+  },
+];

diff --git a/src/utils/poseFilter.ts b/src/utils/poseFilter.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/poseFilter.ts
@@ -0,0 +1,67 @@
+import { PoseTemplate, FramingCrop } from '../types/pose';
+import { SubjectCount } from '../types/vision';
+import { AppMode } from '../types/camera';
+
+export interface FilterPoseOptions {
+  framing: FramingCrop;
+  subjectCount?: SubjectCount | null;
+  category?: AppMode;
+}
+
+/**
+ * Checks if a pose template matches the target SubjectCount ('solo' | 'couple' | 'group')
+ */
+export function matchesSubjectCount(template: PoseTemplate, subjectCount: SubjectCount): boolean {
+  if (template.subjectCountTag === subjectCount) {
+    return true;
+  }
+  if (template.tags && template.tags.includes(subjectCount)) {
+    return true;
+  }
+  if (template.subject_count !== undefined) {
+    if (subjectCount === 'solo' && template.subject_count === 1) return true;
+    if (subjectCount === 'couple' && template.subject_count === 2) return true;
+    if (subjectCount === 'group' && template.subject_count >= 3) return true;
+  }
+  return false;
+}
+
+/**
+ * Pure utility function to filter pose templates based on active framing crop,
+ * auto-detected subject count, and app category mode.
+ */
+export function filterPoseTemplates(
+  templates: PoseTemplate[],
+  options: FilterPoseOptions
+): PoseTemplate[] {
+  if (!templates || templates.length === 0) {
+    return [];
+  }
+
+  const { framing, subjectCount, category = 'person' } = options;
+
+  // 1. Filter by category & framing crop
+  const framingMatched = templates.filter((template) => {
+    const categoryMatch = !template.category || template.category === category;
+    const framingMatch = template.framing === framing;
+    return categoryMatch && framingMatch;
+  });
+
+  if (framingMatched.length === 0) {
+    return [];
+  }
+
+  // 2. If subjectCount is available, refine by subjectCount
+  if (subjectCount) {
+    const dualMatched = framingMatched.filter((template) =>
+      matchesSubjectCount(template, subjectCount)
+    );
+
+    // Fallback scenario: If no dual match exists for this subject count, return all framing-matched templates
+    if (dualMatched.length > 0) {
+      return dualMatched;
+    }
+  }
+
+  return framingMatched;
+}

diff --git a/src/utils/__tests__/poseFilter.test.ts b/src/utils/__tests__/poseFilter.test.ts
new file mode 100644
--- /dev/null
+++ b/src/utils/__tests__/poseFilter.test.ts
@@ -0,0 +1,81 @@
+import { filterPoseTemplates, matchesSubjectCount } from '../poseFilter';
+import { POSE_CATALOG } from '../../data/poseCatalog';
+import { PoseTemplate } from '../../types/pose';
+
+function assert(condition: boolean, message: string) {
+  if (!condition) {
+    throw new Error(`Assertion failed: ${message}`);
+  }
+}
+
+export function runPoseFilterTests() {
+  // Test 1: Framing filtering alone (headshot)
+  const headshots = filterPoseTemplates(POSE_CATALOG, { framing: 'headshot' });
+  assert(headshots.length > 0, 'Should return headshot templates');
+  assert(
+    headshots.every((t) => t.framing === 'headshot'),
+    'All returned templates must have framing === headshot'
+  );
+
+  // Test 2: Framing filtering alone (half_body)
+  const halfBody = filterPoseTemplates(POSE_CATALOG, { framing: 'half_body' });
+  assert(halfBody.length > 0, 'Should return half_body templates');
+  assert(
+    halfBody.every((t) => t.framing === 'half_body'),
+    'All returned templates must have framing === half_body'
+  );
+
+  // Test 3: Dual filtering (framing: half_body + subjectCount: couple)
+  const coupleHalfBody = filterPoseTemplates(POSE_CATALOG, {
+    framing: 'half_body',
+    subjectCount: 'couple',
+  });
+  assert(coupleHalfBody.length > 0, 'Should return couple half_body templates');
+  assert(
+    coupleHalfBody.every((t) => t.framing === 'half_body' && matchesSubjectCount(t, 'couple')),
+    'Dual filter should match both framing and subject count'
+  );
+
+  // Test 4: Dual filtering (framing: full_body + subjectCount: solo)
+  const soloFullBody = filterPoseTemplates(POSE_CATALOG, {
+    framing: 'full_body',
+    subjectCount: 'solo',
+  });
+  assert(soloFullBody.length > 0, 'Should return solo full_body templates');
+  assert(
+    soloFullBody.every((t) => t.framing === 'full_body' && matchesSubjectCount(t, 'solo')),
+    'Dual filter should match full_body and solo subject count'
+  );
+
+  // Test 5: Fallback scenario - when no template matches specific subject count in framing crop
+  const mockTemplates: PoseTemplate[] = [
+    {
+      id: 'headshot-solo-1',
+      title: 'Solo Headshot',
+      category: 'person',
+      framing: 'headshot',
+      subject_count: 1,
+      subjectCountTag: 'solo',
+      tags: ['solo'],
+      keypoints: { nose: [0.5, 0.3], left_shoulder: [0.3, 0.6], right_shoulder: [0.7, 0.6], left_hip: [0.35, 0.9], right_hip: [0.65, 0.9] },
+    },
+  ];
+  // Ask for headshot + group subject count (no group headshots in mockTemplates)
+  const fallbackResults = filterPoseTemplates(mockTemplates, {
+    framing: 'headshot',
+    subjectCount: 'group',
+  });
+  assert(fallbackResults.length === 1, 'Should fallback to return framing matched templates when no subject count match exists');
+  assert(fallbackResults[0].id === 'headshot-solo-1', 'Fallback should return available framing template');
+
+  // Test 6: Empty catalog / invalid inputs
+  assert(filterPoseTemplates([], { framing: 'half_body' }).length === 0, 'Empty catalog should return empty array');
+
+  console.log('All poseFilter unit tests passed successfully!');
+}
+
+if (typeof require !== 'undefined' && require.main === module) {
+  runPoseFilterTests();
+} else if (typeof process !== 'undefined' && process.argv[1]?.includes('poseFilter.test')) {
+  runPoseFilterTests();
+}

diff --git a/src/components/camera/FramingSelector.tsx b/src/components/camera/FramingSelector.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/camera/FramingSelector.tsx
@@ -0,0 +1,78 @@
+import React from 'react';
+import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
+import { useCameraStore } from '../../stores/useCameraStore';
+import { FramingCrop } from '../../types/pose';
+
+interface FramingOption {
+  value: FramingCrop;
+  label: string;
+}
+
+const FRAMING_OPTIONS: FramingOption[] = [
+  { value: 'headshot', label: 'Headshot' },
+  { value: 'half_body', label: 'Half-Body' },
+  { value: 'full_body', label: 'Full-Body' },
+];
+
+export const FramingSelector: React.FC = () => {
+  const selectedFraming = useCameraStore((state) => state.selectedFraming);
+  const setSelectedFraming = useCameraStore((state) => state.setSelectedFraming);
+
+  return (
+    <View style={styles.container} accessibilityRole="tablist">
+      {FRAMING_OPTIONS.map((item) => {
+        const isActive = selectedFraming === item.value;
+        return (
+          <TouchableOpacity
+            key={item.value}
+            style={[styles.chip, isActive && styles.activeChip]}
+            onPress={() => setSelectedFraming(item.value)}
+            activeOpacity={0.7}
+            accessibilityRole="tab"
+            accessibilityState={{ selected: isActive }}
+            accessibilityLabel={`${item.label} Framing`}
+          >
+            <Text style={[styles.label, isActive ? styles.activeLabel : styles.inactiveLabel]}>
+              {item.label}
+            </Text>
+          </TouchableOpacity>
+        );
+      })}
+    </View>
+  );
+};
+
+const styles = StyleSheet.create({
+  container: {
+    flexDirection: 'row',
+    backgroundColor: 'rgba(0, 0, 0, 0.55)',
+    borderRadius: 20,
+    padding: 3,
+    alignSelf: 'center',
+    marginBottom: 8,
+  },
+  chip: {
+    paddingVertical: 6,
+    paddingHorizontal: 14,
+    borderRadius: 16,
+    justifyContent: 'center',
+    alignItems: 'center',
+  },
+  activeChip: {
+    backgroundColor: 'rgba(0, 229, 255, 0.25)',
+    borderColor: '#00E5FF',
+    borderWidth: 1,
+  },
+  label: {
+    fontSize: 12,
+    letterSpacing: 0.3,
+  },
+  activeLabel: {
+    color: '#00E5FF',
+    fontWeight: '700',
+  },
+  inactiveLabel: {
+    color: 'rgba(255, 255, 255, 0.65)',
+    fontWeight: '400',
+  },
+});

diff --git a/src/components/camera/PoseCarousel.tsx b/src/components/camera/PoseCarousel.tsx
new file mode 100644
--- /dev/null
+++ b/src/components/camera/PoseCarousel.tsx
@@ -0,0 +1,177 @@
+import React, { useMemo } from 'react';
+import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
+import { useCameraStore } from '../../stores/useCameraStore';
+import { filterPoseTemplates } from '../../utils/poseFilter';
+import { POSE_CATALOG } from '../../data/poseCatalog';
+
+export const PoseCarousel: React.FC = () => {
+  const selectedFraming = useCameraStore((state) => state.selectedFraming);
+  const visionResult = useCameraStore((state) => state.visionResult);
+  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
+  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
+
+  const subjectCount = visionResult?.subjectCount ?? null;
+
+  const filteredPoses = useMemo(
+    () =>
+      filterPoseTemplates(POSE_CATALOG, {
+        framing: selectedFraming,
+        subjectCount: subjectCount,
+        category: 'person',
+      }),
+    [selectedFraming, subjectCount]
+  );
+
+  return (
+    <View style={styles.container}>
+      {subjectCount && (
+        <View style={styles.contextBadge}>
+          <Text style={styles.contextBadgeText}>
+            ⚡ Auto-Filtered for {subjectCount.toUpperCase()}
+          </Text>
+        </View>
+      )}
+
+      {filteredPoses.length === 0 ? (
+        <View style={styles.emptyContainer}>
+          <Text style={styles.emptyText}>No pose templates matching current filters</Text>
+        </View>
+      ) : (
+        <ScrollView
+          horizontal
+          showsHorizontalScrollIndicator={false}
+          contentContainerStyle={styles.scrollContent}
+          accessibilityRole="scrollbar"
+        >
+          {filteredPoses.map((pose) => {
+            const isSelected = selectedPoseId === pose.id;
+            return (
+              <TouchableOpacity
+                key={pose.id}
+                style={[styles.card, isSelected && styles.activeCard]}
+                onPress={() => setSelectedPoseId(isSelected ? null : pose.id)}
+                activeOpacity={0.8}
+                accessibilityRole="button"
+                accessibilityState={{ selected: isSelected }}
+                accessibilityLabel={`Pose Template: ${pose.title}`}
+              >
+                <View style={styles.cardHeader}>
+                  <Text style={[styles.cardTitle, isSelected && styles.activeCardTitle]} numberOfLines={1}>
+                    {pose.title}
+                  </Text>
+                </View>
+
+                <View style={styles.tagRow}>
+                  {pose.subjectCountTag && (
+                    <View style={styles.tagBadge}>
+                      <Text style={styles.tagText}>{pose.subjectCountTag}</Text>
+                    </View>
+                  )}
+                  <View style={styles.tagBadgeSecondary}>
+                    <Text style={styles.tagTextSecondary}>{pose.framing.replace('_', ' ')}</Text>
+                  </View>
+                </View>
+              </TouchableOpacity>
+            );
+          })}
+        </ScrollView>
+      )}
+    </View>
+  );
+};
+
+const styles = StyleSheet.create({
+  container: {
+    width: '100%',
+    marginVertical: 6,
+  },
+  contextBadge: {
+    alignSelf: 'center',
+    backgroundColor: 'rgba(0, 229, 255, 0.15)',
+    borderColor: '#00E5FF',
+    borderWidth: 1,
+    borderRadius: 12,
+    paddingHorizontal: 10,
+    paddingVertical: 3,
+    marginBottom: 6,
+  },
+  contextBadgeText: {
+    color: '#00E5FF',
+    fontSize: 11,
+    fontWeight: '600',
+    letterSpacing: 0.4,
+  },
+  scrollContent: {
+    paddingHorizontal: 16,
+    alignItems: 'center',
+  },
+  card: {
+    width: 130,
+    height: 64,
+    backgroundColor: 'rgba(20, 20, 25, 0.75)',
+    borderRadius: 12,
+    padding: 8,
+    marginRight: 10,
+    borderWidth: 1,
+    borderColor: 'rgba(255, 255, 255, 0.15)',
+    justifyContent: 'space-between',
+  },
+  activeCard: {
+    borderColor: '#FFD60A',
+    borderWidth: 2,
+    backgroundColor: 'rgba(255, 214, 10, 0.15)',
+  },
+  cardHeader: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    justifyContent: 'space-between',
+  },
+  cardTitle: {
+    color: '#FFFFFF',
+    fontSize: 12,
+    fontWeight: '600',
+  },
+  activeCardTitle: {
+    color: '#FFD60A',
+    fontWeight: '700',
+  },
+  tagRow: {
+    flexDirection: 'row',
+    alignItems: 'center',
+    gap: 4,
+  },
+  tagBadge: {
+    backgroundColor: 'rgba(255, 255, 255, 0.15)',
+    borderRadius: 6,
+    paddingHorizontal: 6,
+    paddingVertical: 2,
+  },
+  tagText: {
+    color: '#FFFFFF',
+    fontSize: 9,
+    fontWeight: '600',
+    textTransform: 'uppercase',
+  },
+  tagBadgeSecondary: {
+    backgroundColor: 'rgba(255, 255, 255, 0.08)',
+    borderRadius: 6,
+    paddingHorizontal: 5,
+    paddingVertical: 2,
+  },
+  tagTextSecondary: {
+    color: 'rgba(255, 255, 255, 0.6)',
+    fontSize: 9,
+    fontWeight: '400',
+    textTransform: 'capitalize',
+  },
+  emptyContainer: {
+    paddingVertical: 16,
+    alignItems: 'center',
+    justifyContent: 'center',
+  },
+  emptyText: {
+    color: 'rgba(255, 255, 255, 0.5)',
+    fontSize: 12,
+    fontStyle: 'italic',
+  },
+});

`
