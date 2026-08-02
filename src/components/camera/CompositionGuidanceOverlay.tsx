import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent, Animated, Vibration } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Line, Rect, Circle, G } from 'react-native-svg';
import { useCameraStore } from '../../stores/useCameraStore';
import { evaluateGuidanceOverlayState } from '../../utils/compositionGuidanceEngine';
import { Point2D } from '../../types/vision';

export const CompositionGuidanceOverlay: React.FC = () => {
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const visionResult = useCameraStore((state) => state.visionResult);
  const insets = useSafeAreaInsets();

  const [layoutDimensions, setLayoutDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  // Animated value for the green border flash on satisfaction
  const borderOpacity = useRef(new Animated.Value(0)).current;
  const prevSatisfied = useRef(false);

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== layoutDimensions.width || height !== layoutDimensions.height) {
      setLayoutDimensions({ width, height });
    }
  };

  const overlayState = evaluateGuidanceOverlayState({ isFrozen, visionResult });

  const isSatisfied = overlayState?.isSatisfied ?? false;

  // Trigger border flash + vibration exactly once when transitioning to satisfied
  useEffect(() => {
    if (isSatisfied && !prevSatisfied.current) {
      // Brief haptic pulse — silently no-ops on web
      Vibration.vibrate(80);
      // Animate border: fade in fast, hold briefly, fade out
      borderOpacity.setValue(0);
      Animated.sequence([
        Animated.timing(borderOpacity, { toValue: 1, duration: 150, useNativeDriver: true }),
        Animated.delay(500),
        Animated.timing(borderOpacity, { toValue: 0, duration: 550, useNativeDriver: true }),
      ]).start();
    }
    prevSatisfied.current = isSatisfied;
  }, [isSatisfied, borderOpacity]);

  if (!overlayState) {
    return null;
  }

  const {
    activeRule,
    score,
    textCue,
    guideLines,
    directionalBadges,
    statusColor,
    statusText,
    spatialLayout,
  } = overlayState;

  const { width, height } = layoutDimensions;
  // Position below both PositioningBadgesOverlay (+48) and DirectorCueOverlay (+160)
  // so the composition banner has its own clear mid-zone with no overlap.
  const topOffset = Math.max(insets.top + 10, 54) + 220;

  // Power points for Rule of Thirds
  const powerPoints: Point2D[] =
    width > 0 && height > 0
      ? [
          { x: width / 3, y: height / 3 },
          { x: (2 * width) / 3, y: height / 3 },
          { x: width / 3, y: (2 * height) / 3 },
          { x: (2 * width) / 3, y: (2 * height) / 3 },
        ]
      : [];

  const vanishingPoint = spatialLayout?.vanishingPoint;
  const boundingBoxes = spatialLayout?.boundingBoxes || [];

  return (
    <View style={styles.container} pointerEvents="box-none" onLayout={handleLayout}>
      {/* SVG Canvas for Vector Lines, Target Frames, and Crosshairs */}
      {width > 0 && height > 0 && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill} pointerEvents="none">
          {/* Render Guide Lines */}
          {guideLines.map((line, index) => (
            <Line
              key={`guideline-${index}`}
              x1={line.start.x}
              y1={line.start.y}
              x2={line.end.x}
              y2={line.end.y}
              stroke={statusColor}
              strokeWidth={2}
              strokeDasharray={activeRule === 'rule_of_thirds' ? '5,5' : undefined}
              opacity={0.85}
            />
          ))}

          {/* Rule-specific target SVG overlays */}
          {activeRule === 'frame_in_frame' &&
            boundingBoxes.map((box) => {
              const isNormalized = box.x <= 1.0 && box.width <= 1.0;
              const boxX = isNormalized ? box.x * width : box.x;
              const boxY = isNormalized ? box.y * height : box.y;
              const boxW = isNormalized ? box.width * width : box.width;
              const boxH = isNormalized ? box.height * height : box.height;
              return (
                <Rect
                  key={`structural-frame-${box.id}`}
                  x={boxX}
                  y={boxY}
                  width={boxW}
                  height={boxH}
                  fill={isSatisfied ? 'rgba(48, 209, 88, 0.15)' : 'rgba(0, 229, 255, 0.15)'}
                  stroke={statusColor}
                  strokeWidth={2}
                  strokeDasharray="6,4"
                  rx={6}
                />
              );
            })}

          {activeRule === 'leading_lines' && vanishingPoint && (
            <G key="vp-group">
              <Circle
                key="vp-circle"
                cx={vanishingPoint.x}
                cy={vanishingPoint.y}
                r={10}
                stroke={statusColor}
                strokeWidth={2}
                fill={isSatisfied ? 'rgba(48, 209, 88, 0.25)' : 'rgba(255, 214, 10, 0.25)'}
              />
              <Line
                key="vp-ch-h"
                x1={vanishingPoint.x - 14}
                y1={vanishingPoint.y}
                x2={vanishingPoint.x + 14}
                y2={vanishingPoint.y}
                stroke={statusColor}
                strokeWidth={1.5}
              />
              <Line
                key="vp-ch-v"
                x1={vanishingPoint.x}
                y1={vanishingPoint.y - 14}
                x2={vanishingPoint.x}
                y2={vanishingPoint.y + 14}
                stroke={statusColor}
                strokeWidth={1.5}
              />
            </G>
          )}

          {activeRule === 'symmetry_centering' && (
            <G key="symmetry-center-group">
              <Circle
                key="center-circle"
                cx={width / 2}
                cy={height / 2}
                r={12}
                stroke={statusColor}
                strokeWidth={2}
                fill="none"
              />
              <Line
                key="center-ch-h"
                x1={width / 2 - 16}
                y1={height / 2}
                x2={width / 2 + 16}
                y2={height / 2}
                stroke={statusColor}
                strokeWidth={1.5}
              />
              <Line
                key="center-ch-v"
                x1={width / 2}
                y1={height / 2 - 16}
                x2={width / 2}
                y2={height / 2 + 16}
                stroke={statusColor}
                strokeWidth={1.5}
              />
            </G>
          )}

          {activeRule === 'rule_of_thirds' &&
            powerPoints.map((pt, index) => (
              <Circle
                key={`powerpoint-${index}`}
                cx={pt.x}
                cy={pt.y}
                r={6}
                fill={statusColor}
                opacity={0.8}
              />
            ))}
        </Svg>
      )}

      {/* Animated Green Border Flash — shown only when composition is satisfied */}
      <Animated.View
        style={[styles.satisfiedBorder, { opacity: borderOpacity }]}
        pointerEvents="none"
      />

      {/* Banner HUD — shown only while alignment is still in progress */}
      {!isSatisfied && (
        <View style={[styles.bannerWrapper, { top: topOffset }]} pointerEvents="none">
          <View style={[styles.bannerCard, { borderColor: statusColor }]}>
            <View style={styles.bannerHeader}>
              <View style={[styles.scoreBadge, { backgroundColor: statusColor }]}>
                <Text style={styles.scoreText}>{score}%</Text>
              </View>
              <Text style={[styles.statusTitle, { color: statusColor }]}>{statusText}</Text>
            </View>

            <Text style={styles.textCue}>{textCue}</Text>

            {/* Directional Badges Stack */}
            {directionalBadges.length > 0 && (
              <View style={styles.badgeRow}>
                {directionalBadges.map((badgeText, idx) => (
                  <View key={`badge-${idx}`} style={styles.directionalBadgeChip}>
                    <Text style={styles.directionalBadgeText}>{badgeText}</Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 22,
  },
  // Green border outline that flashes briefly on composition satisfaction
  satisfiedBorder: {
    ...StyleSheet.absoluteFillObject,
    borderWidth: 3,
    borderColor: '#30D158',
    borderRadius: 10,
    pointerEvents: 'none',
  },
  bannerWrapper: {
    position: 'absolute',
    left: 16,
    right: 16,
    alignItems: 'center',
  },
  bannerCard: {
    width: '100%',
    backgroundColor: 'rgba(18, 18, 20, 0.9)',
    borderRadius: 16,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderWidth: 1.5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 6,
    elevation: 6,
  },
  bannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  scoreBadge: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 3,
    marginRight: 8,
  },
  scoreText: {
    color: '#000000',
    fontSize: 12,
    fontWeight: '800',
    letterSpacing: 0.4,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  textCue: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
    lineHeight: 18,
  },
  badgeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 8,
  },
  directionalBadgeChip: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  directionalBadgeText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});
