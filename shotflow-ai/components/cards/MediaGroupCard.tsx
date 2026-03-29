import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';
import { Card } from '../ui/Card';
import { Badge } from '../ui/Badge';
import { MediaGroup } from '../../types';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

interface MediaGroupCardProps {
  group: MediaGroup;
  onPress: () => void;
}

const GROUP_TYPE_LABELS: Record<MediaGroup['type'], string> = {
  duplicate: 'Duplicates',
  similar: 'Similar Shots',
  blurry: 'Blurry Photos',
  large_video: 'Large Videos',
};

const GROUP_TYPE_COLORS: Record<MediaGroup['type'], string> = {
  duplicate: '#EF4444',
  similar: '#F59E0B',
  blurry: '#8B5CF6',
  large_video: '#3B82F6',
};

export function MediaGroupCard({ group, onPress }: MediaGroupCardProps) {
  const { colors } = useTheme();
  const typeColor = GROUP_TYPE_COLORS[group.type];

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="glass" style={styles.card}>
        <View style={styles.thumbnails}>
          {group.items.slice(0, 3).map((item, i) => (
            <View
              key={item.id}
              style={[
                styles.thumbnail,
                {
                  borderColor: colors.border,
                  marginLeft: i > 0 ? -12 : 0,
                  zIndex: 3 - i,
                },
              ]}
            >
              <Image source={{ uri: item.uri }} style={styles.thumbnailImage} />
              {item.id === group.recommendedKeepId && (
                <View style={[styles.bestBadge, { backgroundColor: colors.success }]}>
                  <Text style={styles.bestBadgeText}>Best</Text>
                </View>
              )}
            </View>
          ))}
        </View>

        <View style={styles.info}>
          <View style={styles.header}>
            <Badge label={GROUP_TYPE_LABELS[group.type]} color={typeColor} />
            <Text style={[styles.count, { color: colors.textSecondary }]}>
              {group.items.length} items
            </Text>
          </View>
          <Text style={[styles.savings, { color: colors.textSecondary }]}>
            Save {formatFileSize(group.estimatedSavingsBytes)}
          </Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
  },
  thumbnails: {
    flexDirection: 'row',
    marginRight: Spacing.md,
  },
  thumbnail: {
    width: 56,
    height: 56,
    borderRadius: BorderRadius.sm,
    borderWidth: 2,
    overflow: 'hidden',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  bestBadge: {
    position: 'absolute',
    bottom: 2,
    left: 2,
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 4,
  },
  bestBadgeText: {
    color: '#FFF',
    fontSize: 8,
    fontWeight: FontWeight.bold,
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  count: {
    fontSize: FontSize.sm,
  },
  savings: {
    fontSize: FontSize.sm,
  },
});
