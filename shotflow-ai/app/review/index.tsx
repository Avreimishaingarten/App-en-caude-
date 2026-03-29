import React, { useState, useMemo } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button, Badge } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import { useScanStore, useCleanupStore } from '../../store';
import { MediaGroup, MediaItem } from '../../types';
import { chooseBestShot } from '../../features/best-shot';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function ReviewScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useScanStore((s) => s.session);
  const { buildPlan, overrideKeep } = useCleanupStore();

  const reviewableGroups = useMemo(
    () => session?.groups.filter((g) => g.type === 'duplicate' || g.type === 'similar') ?? [],
    [session],
  );

  const [currentGroupIndex, setCurrentGroupIndex] = useState(0);

  const currentGroup = reviewableGroups[currentGroupIndex];

  if (!currentGroup || reviewableGroups.length === 0) {
    return (
      <ScreenContainer>
        <View style={styles.emptyContainer}>
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>
            No groups to review. Run a scan first.
          </Text>
          <Button title="Go Back" onPress={() => router.back()} variant="outline" />
        </View>
      </ScreenContainer>
    );
  }

  const bestShot = chooseBestShot(currentGroup.items);
  const [selectedKeepId, setSelectedKeepId] = useState(bestShot.itemId);

  const handleNext = () => {
    overrideKeep(currentGroup.id, selectedKeepId);

    if (currentGroupIndex < reviewableGroups.length - 1) {
      setCurrentGroupIndex(currentGroupIndex + 1);
      const nextGroup = reviewableGroups[currentGroupIndex + 1];
      const nextBest = chooseBestShot(nextGroup.items);
      setSelectedKeepId(nextBest.itemId);
    } else {
      buildPlan(reviewableGroups);
      router.push('/review/confirm');
    }
  };

  const renderItem = ({ item }: { item: MediaItem }) => {
    const isSelected = item.id === selectedKeepId;
    const isBest = item.id === bestShot.itemId;

    return (
      <TouchableOpacity
        onPress={() => setSelectedKeepId(item.id)}
        activeOpacity={0.7}
        style={[
          styles.photoCard,
          {
            borderColor: isSelected ? colors.success : colors.border,
            borderWidth: isSelected ? 2 : 1,
          },
        ]}
      >
        <Image source={{ uri: item.uri }} style={styles.photoImage} />
        <View style={styles.photoInfo}>
          <View style={styles.photoBadges}>
            {isBest && <Badge label="AI Best" color={colors.primary} />}
            {isSelected && <Badge label="Keep" color={colors.success} />}
            {!isSelected && (
              <Badge label="Remove" color={colors.danger} />
            )}
          </View>
          <Text style={[styles.photoScore, { color: colors.textSecondary }]}>
            Quality: {Math.round(item.qualityScore * 100)}%
          </Text>
          <Text style={[styles.photoSize, { color: colors.textTertiary }]}>
            {item.width}x{item.height} · {formatFileSize(item.fileSize)}
          </Text>
          {isBest && bestShot.reasons.length > 0 && (
            <Text style={[styles.photoReason, { color: colors.primary }]}>
              {bestShot.reasons[0]}
            </Text>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backBtn, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
        <Text style={[styles.counter, { color: colors.textSecondary }]}>
          {currentGroupIndex + 1} / {reviewableGroups.length}
        </Text>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>
        {currentGroup.type === 'duplicate' ? 'Duplicate Group' : 'Similar Shots'}
      </Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Tap to choose which photo to keep
      </Text>

      <FlatList
        data={currentGroup.items}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        scrollEnabled={false}
        contentContainerStyle={styles.photoList}
      />

      <Button
        title={
          currentGroupIndex < reviewableGroups.length - 1
            ? 'Next Group'
            : 'Review Cleanup'
        }
        onPress={handleNext}
        fullWidth
        size="lg"
      />
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  counter: {
    fontSize: FontSize.sm,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  photoList: {
    gap: Spacing.md,
    paddingBottom: Spacing.xl,
  },
  photoCard: {
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  photoImage: {
    width: 100,
    height: 120,
  },
  photoInfo: {
    flex: 1,
    padding: Spacing.md,
    gap: Spacing.xs,
  },
  photoBadges: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  photoScore: {
    fontSize: FontSize.sm,
  },
  photoSize: {
    fontSize: FontSize.xs,
  },
  photoReason: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xl,
  },
  emptyText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
});
