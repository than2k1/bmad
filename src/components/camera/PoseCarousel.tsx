import React, { useMemo, useEffect } from 'react';
import { StyleSheet, View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { useCameraStore } from '../../stores/useCameraStore';
import { filterPoseTemplates } from '../../utils/poseFilter';
import { POSE_CATALOG } from '../../data/poseCatalog';

export const PoseCarousel: React.FC = () => {
  const selectedFraming = useCameraStore((state) => state.selectedFraming);
  const visionResult = useCameraStore((state) => state.visionResult);
  const selectedPoseId = useCameraStore((state) => state.selectedPoseId);
  const setSelectedPoseId = useCameraStore((state) => state.setSelectedPoseId);

  const subjectCount = visionResult?.subjectCount ?? null;

  const filteredPoses = useMemo(
    () =>
      filterPoseTemplates(POSE_CATALOG, {
        framing: selectedFraming,
        subjectCount: subjectCount,
        category: 'person',
      }),
    [selectedFraming, subjectCount]
  );

  useEffect(() => {
    if (selectedPoseId && !filteredPoses.some((p) => p.id === selectedPoseId)) {
      setSelectedPoseId(null);
    }
  }, [filteredPoses, selectedPoseId, setSelectedPoseId]);

  return (
    <View style={styles.container}>
      {subjectCount && (
        <View style={styles.contextBadge}>
          <Text style={styles.contextBadgeText}>
            ⚡ Auto-Filtered for {subjectCount.toUpperCase()}
          </Text>
        </View>
      )}

      {filteredPoses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No pose templates matching current filters</Text>
        </View>
      ) : (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          accessibilityRole="scrollbar"
        >
          {filteredPoses.map((pose) => {
            const isSelected = selectedPoseId === pose.id;
            return (
              <TouchableOpacity
                key={pose.id}
                style={[styles.card, isSelected && styles.activeCard]}
                onPress={() => setSelectedPoseId(isSelected ? null : pose.id)}
                activeOpacity={0.8}
                accessibilityRole="button"
                accessibilityState={{ selected: isSelected }}
                accessibilityLabel={`Pose Template: ${pose.title}`}
              >
                <View style={styles.cardHeader}>
                  <Text style={[styles.cardTitle, isSelected && styles.activeCardTitle]} numberOfLines={1}>
                    {pose.title}
                  </Text>
                </View>

                <View style={styles.tagRow}>
                  {pose.subjectCountTag && (
                    <View style={styles.tagBadge}>
                      <Text style={styles.tagText}>{pose.subjectCountTag}</Text>
                    </View>
                  )}
                  <View style={styles.tagBadgeSecondary}>
                    <Text style={styles.tagTextSecondary}>{(pose.framing || '').replace(/_/g, ' ')}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginVertical: 6,
  },
  contextBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(0, 229, 255, 0.15)',
    borderColor: '#00E5FF',
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 3,
    marginBottom: 6,
  },
  contextBadgeText: {
    color: '#00E5FF',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.4,
  },
  scrollContent: {
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  card: {
    width: 130,
    height: 64,
    backgroundColor: 'rgba(20, 20, 25, 0.75)',
    borderRadius: 12,
    padding: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.15)',
    justifyContent: 'space-between',
  },
  activeCard: {
    borderColor: '#FFD60A',
    borderWidth: 2,
    backgroundColor: 'rgba(255, 214, 10, 0.15)',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardTitle: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  activeCardTitle: {
    color: '#FFD60A',
    fontWeight: '700',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  tagBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  tagText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  tagBadgeSecondary: {
    backgroundColor: 'rgba(255, 255, 255, 0.08)',
    borderRadius: 6,
    paddingHorizontal: 5,
    paddingVertical: 2,
  },
  tagTextSecondary: {
    color: 'rgba(255, 255, 255, 0.6)',
    fontSize: 9,
    fontWeight: '400',
    textTransform: 'capitalize',
  },
  emptyContainer: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyText: {
    color: 'rgba(255, 255, 255, 0.5)',
    fontSize: 12,
    fontStyle: 'italic',
  },
});
