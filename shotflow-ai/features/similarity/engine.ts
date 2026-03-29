import { MediaItem, MediaGroup, GroupType } from '../../types';
import {
  SIMILARITY_TIME_THRESHOLD_MS,
  SIMILARITY_SIZE_THRESHOLD_RATIO,
  BLUR_THRESHOLD,
  LARGE_VIDEO_THRESHOLD_MB,
} from '../../constants';
import { chooseBestShot } from '../best-shot';

let groupIdCounter = 0;
function nextGroupId(): string {
  return `group_${++groupIdCounter}_${Date.now()}`;
}

export function findExactDuplicates(items: MediaItem[]): MediaGroup[] {
  const groups: MediaGroup[] = [];
  const seen = new Map<string, MediaItem[]>();

  for (const item of items) {
    // Key by filename + dimensions + file size
    const key = `${item.filename}_${item.width}x${item.height}_${item.fileSize}`;
    const existing = seen.get(key);
    if (existing) {
      existing.push(item);
    } else {
      seen.set(key, [item]);
    }
  }

  for (const [, groupItems] of seen) {
    if (groupItems.length < 2) continue;

    const best = chooseBestShot(groupItems);
    const keptItem = groupItems.find((i) => i.id === best.itemId)!;
    const savings = groupItems
      .filter((i) => i.id !== best.itemId)
      .reduce((sum, i) => sum + i.fileSize, 0);

    groups.push({
      id: nextGroupId(),
      type: 'duplicate',
      items: groupItems,
      recommendedKeepId: keptItem.id,
      estimatedSavingsBytes: savings,
    });
  }

  return groups;
}

export function findSimilarPhotos(items: MediaItem[]): MediaGroup[] {
  const photos = items
    .filter((i) => i.mediaType === 'photo')
    .sort((a, b) => a.createdAt - b.createdAt);

  const groups: MediaGroup[] = [];
  const used = new Set<string>();

  for (let i = 0; i < photos.length; i++) {
    if (used.has(photos[i].id)) continue;

    const cluster: MediaItem[] = [photos[i]];

    for (let j = i + 1; j < photos.length; j++) {
      if (used.has(photos[j].id)) continue;

      const timeDiff = Math.abs(photos[j].createdAt - photos[i].createdAt);
      if (timeDiff > SIMILARITY_TIME_THRESHOLD_MS) break;

      const sizeDiff =
        Math.abs(photos[j].width * photos[j].height - photos[i].width * photos[i].height) /
        (photos[i].width * photos[i].height);

      if (sizeDiff <= SIMILARITY_SIZE_THRESHOLD_RATIO) {
        cluster.push(photos[j]);
        used.add(photos[j].id);
      }
    }

    if (cluster.length >= 2) {
      used.add(photos[i].id);
      const best = chooseBestShot(cluster);
      const savings = cluster
        .filter((item) => item.id !== best.itemId)
        .reduce((sum, item) => sum + item.fileSize, 0);

      groups.push({
        id: nextGroupId(),
        type: 'similar',
        items: cluster,
        recommendedKeepId: best.itemId,
        estimatedSavingsBytes: savings,
      });
    }
  }

  return groups;
}

export function findBlurryPhotos(items: MediaItem[]): MediaGroup[] {
  const blurry = items.filter(
    (i) => i.mediaType === 'photo' && i.isBlurry,
  );

  if (blurry.length === 0) return [];

  return [{
    id: nextGroupId(),
    type: 'blurry',
    items: blurry,
    recommendedKeepId: '',
    estimatedSavingsBytes: blurry.reduce((sum, i) => sum + i.fileSize, 0),
  }];
}

export function findLargeVideos(items: MediaItem[]): MediaGroup[] {
  const threshold = LARGE_VIDEO_THRESHOLD_MB * 1024 * 1024;
  const largeVids = items.filter(
    (i) => i.mediaType === 'video' && i.fileSize >= threshold,
  );

  if (largeVids.length === 0) return [];

  return [{
    id: nextGroupId(),
    type: 'large_video',
    items: largeVids,
    recommendedKeepId: '',
    estimatedSavingsBytes: largeVids.reduce((sum, i) => sum + i.fileSize, 0),
  }];
}

export function groupMediaByMoment(items: MediaItem[]): MediaGroup[] {
  // Combines all grouping strategies
  return [
    ...findExactDuplicates(items),
    ...findSimilarPhotos(items),
  ];
}
