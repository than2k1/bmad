import React, { useState, useMemo, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  PanResponder,
  LayoutChangeEvent,
} from 'react-native';
import Svg, { Line, Circle, G } from 'react-native-svg';
import { useCameraStore } from '../../stores/useCameraStore';
import { POSE_CATALOG } from '../../data/poseCatalog';
import {
  normalizeKeypointsToCanvas,
  getSkeletonConnectionLines,
  clampPoseTransform,
  PoseTransform,
  DEFAULT_TRANSFORM,
} from '../../utils/poseRenderer';

export const VectorPoseOverlay: React.FC = () => {
  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);
  const mode = useCameraStore((state) => state.mode);

  const [canvasDimensions, setCanvasDimensions] = useState({ width: 0, height: 0 });
  const [transform, setTransform] = useState<PoseTransform>(DEFAULT_TRANSFORM);

  // Store transform baseline during gesture start
  const baseTransformRef = useRef<PoseTransform>(DEFAULT_TRANSFORM);
  const initialTouchDistRef = useRef<number | null>(null);

  // Reset transform back to default when active pose template changes
  useEffect(() => {
    setTransform(DEFAULT_TRANSFORM);
  }, [selectedPoseId]);

  // Look up selected pose template from catalog
  const activePoseTemplate = useMemo(() => {
    if (!selectedPoseId) return null;
    return POSE_CATALOG.find((pose) => pose.id === selectedPoseId) || null;
  }, [selectedPoseId]);

  const getTouchDistance = (touches: any[]) => {
    if (!touches || touches.length < 2) return null;
    const [t1, t2] = touches;
    const dx = t1.pageX - t2.pageX;
    const dy = t1.pageY - t2.pageY;
    return Math.hypot(dx, dy);
  };

  // PanResponder for touch drag / translation and multi-touch pinch scale control
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => false,
      onMoveShouldSetPanResponder: (_evt, gestureState) =>
        Math.abs(gestureState.dx) > 2 || Math.abs(gestureState.dy) > 2 || gestureState.numberActiveTouches > 1,
      onPanResponderGrant: (evt) => {
        baseTransformRef.current = { ...transform };
        if (evt.nativeEvent.touches && evt.nativeEvent.touches.length >= 2) {
          initialTouchDistRef.current = getTouchDistance(evt.nativeEvent.touches);
        } else {
          initialTouchDistRef.current = null;
        }
      },
      onPanResponderMove: (evt, gestureState) => {
        const touches = evt.nativeEvent.touches;
        let nextScale = baseTransformRef.current.scale;

        if (touches && touches.length >= 2) {
          const currentDist = getTouchDistance(touches);
          if (currentDist && initialTouchDistRef.current && initialTouchDistRef.current > 0) {
            const scaleRatio = currentDist / initialTouchDistRef.current;
            nextScale = baseTransformRef.current.scale * scaleRatio;
          }
        }

        const newTransform: PoseTransform = {
          translateX: baseTransformRef.current.translateX + gestureState.dx,
          translateY: baseTransformRef.current.translateY + gestureState.dy,
          scale: nextScale,
        };

        setTransform((prev) =>
          clampPoseTransform(
            newTransform,
            canvasDimensions.width || 300,
            canvasDimensions.height || 600
          )
        );
      },
      onPanResponderRelease: () => {
        initialTouchDistRef.current = null;
      },
    })
  ).current;

  // Handle onLayout to dynamically calculate canvas pixel size
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width > 0 && height > 0) {
      setCanvasDimensions({ width, height });
    }
  };

  // Reset transform state back to centered 1.0x scale
  const handleResetTransform = () => {
    setTransform(DEFAULT_TRANSFORM);
  };

  // Clear selected pose overlay
  const handleDismissOverlay = () => {
    setSelectedPoseId(null);
    setTransform(DEFAULT_TRANSFORM);
  };

  // Quick zoom scale adjustments
  const handleZoomIn = () => {
    setTransform((prev) =>
      clampPoseTransform(
        { ...prev, scale: prev.scale + 0.2 },
        canvasDimensions.width || 300,
        canvasDimensions.height || 600
      )
    );
  };

  const handleZoomOut = () => {
    setTransform((prev) =>
      clampPoseTransform(
        { ...prev, scale: prev.scale - 0.2 },
        canvasDimensions.width || 300,
        canvasDimensions.height || 600
      )
    );
  };

  // Memoize skeleton connection lines and keypoint canvas mappings
  const connectionLines = useMemo(() => {
    if (canvasDimensions.width <= 0 || canvasDimensions.height <= 0 || !activePoseTemplate?.skeleton_connections) {
      return [];
    }
    return getSkeletonConnectionLines(
      activePoseTemplate.keypoints,
      activePoseTemplate.skeleton_connections,
      canvasDimensions.width,
      canvasDimensions.height
    );
  }, [activePoseTemplate, canvasDimensions.width, canvasDimensions.height]);

  const keypointPoints = useMemo(() => {
    if (canvasDimensions.width <= 0 || canvasDimensions.height <= 0 || !activePoseTemplate) {
      return {};
    }
    return normalizeKeypointsToCanvas(activePoseTemplate.keypoints, canvasDimensions.width, canvasDimensions.height);
  }, [activePoseTemplate, canvasDimensions.width, canvasDimensions.height]);

  // Only render if Person mode is active and a pose template is selected
  if (mode !== 'person' || !activePoseTemplate) {
    return null;
  }

  const { width, height } = canvasDimensions;

  return (
    <View style={styles.overlayContainer} onLayout={handleLayout} pointerEvents="box-none">
      {/* SVG Canvas with Gesture Responder */}
      <View style={styles.svgCanvasWrapper} {...panResponder.panHandlers}>
        {width > 0 && height > 0 && (
          <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
            <G
              transform={`translate(${transform.translateX}, ${transform.translateY}) scale(${transform.scale})`}
              origin={`${width / 2}, ${height / 2}`}
            >
              {/* Render Skeleton Lines */}
              {connectionLines.map((line) => (
                <Line
                  key={line.id}
                  x1={line.x1}
                  y1={line.y1}
                  x2={line.x2}
                  y2={line.y2}
                  stroke="#00E5FF"
                  strokeWidth={3}
                  strokeOpacity={0.8}
                  strokeLinecap="round"
                />
              ))}

              {/* Render Joint Circles */}
              {Object.entries(keypointPoints).map(([jointKey, pt]) => (
                <G key={jointKey}>
                  <Circle
                    cx={pt.x}
                    cy={pt.y}
                    r={6}
                    fill="#00E5FF"
                    fillOpacity={0.9}
                    stroke="#003B46"
                    strokeWidth={1.5}
                  />
                  <Circle cx={pt.x} cy={pt.y} r={2} fill="#FFFFFF" />
                </G>
              ))}
            </G>
          </Svg>
        )}
      </View>

      {/* Floating HUD Controls for Gesture Adjustment & Dismiss */}
      <View style={styles.hudControlsRow} pointerEvents="auto">
        <View style={styles.badgeContainer}>
          <Text style={styles.badgeText} numberOfLines={1}>
            {activePoseTemplate.title} ({transform.scale.toFixed(1)}x)
          </Text>
        </View>
        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomOut} activeOpacity={0.7}>
          <Text style={styles.controlBtnText}>-</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.controlBtn} onPress={handleZoomIn} activeOpacity={0.7}>
          <Text style={styles.controlBtnText}>+</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlBtn, styles.resetBtn]}
          onPress={handleResetTransform}
          activeOpacity={0.7}
        >
          <Text style={styles.controlBtnText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.controlBtn, styles.dismissBtn]}
          onPress={handleDismissOverlay}
          activeOpacity={0.7}
        >
          <Text style={styles.dismissBtnText}>✕</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  overlayContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 15,
  },
  svgCanvasWrapper: {
    ...StyleSheet.absoluteFillObject,
  },
  hudControlsRow: {
    position: 'absolute',
    top: 100,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 18, 20, 0.85)',
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderColor: '#00E5FF',
    borderWidth: 1,
    shadowColor: '#00E5FF',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeContainer: {
    marginRight: 8,
    maxWidth: 140,
  },
  badgeText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '700',
  },
  controlBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 4,
  },
  resetBtn: {
    width: 'auto',
    paddingHorizontal: 8,
  },
  dismissBtn: {
    backgroundColor: 'rgba(255, 59, 48, 0.3)',
    borderColor: '#FF3B30',
    borderWidth: 1,
  },
  controlBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  dismissBtnText: {
    color: '#FF3B30',
    fontSize: 12,
    fontWeight: '700',
  },
});
