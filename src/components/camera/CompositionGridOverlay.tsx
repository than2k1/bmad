import React, { useState } from 'react';
import { StyleSheet, View, Text, LayoutChangeEvent } from 'react-native';
import Svg, { Line, Circle } from 'react-native-svg';
import { useCameraStore } from '../../stores/useCameraStore';
import {
  calculateRuleOfThirdsLines,
  calculateGoldenRatioLines,
  evaluateSceneGuidanceBadge,
} from '../../utils/sceneCompositionEngine';

export const CompositionGridOverlay: React.FC = () => {
  const mode = useCameraStore((state) => state.mode);
  const gridMode = useCameraStore((state) => state.gridMode);
  const isFrozen = useCameraStore((state) => state.isFrozen);
  const visionResult = useCameraStore((state) => state.visionResult);

  const [layoutDimensions, setLayoutDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });

  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout;
    if (width !== layoutDimensions.width || height !== layoutDimensions.height) {
      setLayoutDimensions({ width, height });
    }
  };

  // Only render in Scene mode when gridMode is active
  if (mode !== 'scene' || gridMode === 'none') {
    return null;
  }

  const { width, height } = layoutDimensions;

  const gridData =
    gridMode === 'rule_of_thirds'
      ? calculateRuleOfThirdsLines(width, height)
      : calculateGoldenRatioLines(width, height);

  // Both grid modes use the same spec-specified stroke: rgba(255,255,255,0.45)
  const strokeColor = 'rgba(255, 255, 255, 0.45)';

  const sceneBadge =
    isFrozen && visionResult?.sceneType != null
      ? evaluateSceneGuidanceBadge(visionResult.sceneType)
      : null;

  return (
    <View style={styles.container} pointerEvents="box-none" onLayout={handleLayout}>
      {width > 0 && height > 0 && (
        <Svg width={width} height={height} style={StyleSheet.absoluteFill}>
          {/* Vertical Grid Lines */}
          {gridData.verticalLines.map((x, index) => (
            <Line
              key={`v-line-${index}`}
              x1={x}
              y1={0}
              x2={x}
              y2={height}
              stroke={strokeColor}
              strokeWidth={1.5}
            />
          ))}

          {/* Horizontal Grid Lines */}
          {gridData.horizontalLines.map((y, index) => (
            <Line
              key={`h-line-${index}`}
              x1={0}
              y1={y}
              x2={width}
              y2={y}
              stroke={strokeColor}
              strokeWidth={1.5}
            />
          ))}

          {/* Power Point Intersections */}
          {gridData.powerPoints.map((point, index) => (
            <Circle
              key={`power-point-${index}`}
              cx={point.x}
              cy={point.y}
              r={3}
              fill={strokeColor}
              opacity={0.6}
            />
          ))}
        </Svg>
      )}

      {/* Floating Scene Guidance Badge Chip (when frozen & vision result present) */}
      {sceneBadge && (
        <View style={styles.badgeWrapper} pointerEvents="none">
          <View style={[styles.badgeChip, { borderColor: sceneBadge.accentColor }]}>
            <Text style={styles.badgeIcon}>🏞️</Text>
            <Text style={[styles.badgeText, { color: sceneBadge.accentColor }]}>
              {sceneBadge.text}
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 18,
  },
  badgeWrapper: {
    position: 'absolute',
    top: 140,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  badgeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.6,
    shadowRadius: 4,
    elevation: 5,
  },
  badgeIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});
