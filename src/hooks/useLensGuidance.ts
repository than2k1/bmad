import { useState, useMemo, useCallback } from 'react';
import { LayoutChangeEvent } from 'react-native';
import { useCameraStore } from '../stores/useCameraStore';
import { evaluateRecommendations, GuidanceOutput } from '../utils/recommendationEngine';

/**
 * Shared hook for lens recommendation and exposure guidance evaluation.
 *
 * Computes guidance exactly once per frozen keyframe (AD-2: calculations run
 * on frozen keyframe results, not during live 60 FPS preview). Returns the
 * GuidanceOutput schema defined in Architecture Spine 3.2, plus an onLayout
 * callback that captures the real camera preview viewport height so the
 * bounding-box threshold and backlight ratio calculations use accurate
 * device-specific dimensions instead of a hardcoded default.
 */
export function useLensGuidance(): {
  guidance: GuidanceOutput | null;
  onViewportLayout: (event: LayoutChangeEvent) => void;
} {
  const [viewportHeight, setViewportHeight] = useState(1000);

  const isFrozen = useCameraStore((state) => state.isFrozen);
  const visionResult = useCameraStore((state) => state.visionResult);
  const selectedFraming = useCameraStore((state) => state.selectedFraming);
  const activeLens = useCameraStore((state) => state.activeLens);

  const guidance = useMemo<GuidanceOutput | null>(() => {
    if (!isFrozen || !visionResult) {
      return null;
    }
    return evaluateRecommendations(visionResult, selectedFraming, activeLens, viewportHeight);
  }, [isFrozen, visionResult, selectedFraming, activeLens, viewportHeight]);

  const onViewportLayout = useCallback((event: LayoutChangeEvent) => {
    const { height } = event.nativeEvent.layout;
    if (height > 0) {
      setViewportHeight(height);
    }
  }, []);

  return { guidance, onViewportLayout };
}
