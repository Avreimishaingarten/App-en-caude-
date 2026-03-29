import * as MediaLibrary from 'expo-media-library';
import { MediaItem, MediaType } from '../../types';
import { SCAN_BATCH_SIZE } from '../../constants';

function mapAssetToMediaItem(asset: MediaLibrary.Asset): MediaItem {
  return {
    id: asset.id,
    uri: asset.uri,
    filename: asset.filename,
    width: asset.width,
    height: asset.height,
    createdAt: asset.creationTime,
    modifiedAt: asset.modificationTime,
    fileSize: 0, // populated after getAssetInfoAsync
    mediaType: asset.mediaType === 'video' ? 'video' : 'photo',
    duration: asset.duration,
    isFavorite: false,
    isBlurry: false,
    sharpnessScore: 0,
    brightnessScore: 0,
    faceScore: 0,
    qualityScore: 0,
  };
}

export async function loadAllMedia(
  onProgress?: (loaded: number, total: number) => void,
): Promise<MediaItem[]> {
  const items: MediaItem[] = [];
  let hasMore = true;
  let endCursor: string | undefined;

  // First get total count
  const countResult = await MediaLibrary.getAssetsAsync({ first: 1 });
  const totalCount = countResult.totalCount;

  while (hasMore) {
    const page = await MediaLibrary.getAssetsAsync({
      first: SCAN_BATCH_SIZE,
      after: endCursor,
      sortBy: [MediaLibrary.SortBy.creationTime],
      mediaType: [MediaLibrary.MediaType.photo, MediaLibrary.MediaType.video],
    });

    for (const asset of page.assets) {
      const item = mapAssetToMediaItem(asset);

      // Get file size info
      try {
        const info = await MediaLibrary.getAssetInfoAsync(asset);
        if (info.localUri) {
          item.uri = info.localUri;
        }
        // fileSize comes from asset info on some platforms
        if ((info as any).fileSize) {
          item.fileSize = (info as any).fileSize;
        }
      } catch {
        // Continue without extra info
      }

      items.push(item);
    }

    onProgress?.(items.length, totalCount);

    hasMore = page.hasNextPage;
    endCursor = page.endCursor;
  }

  return items;
}

export async function deleteAssets(assetIds: string[]): Promise<boolean> {
  try {
    const result = await MediaLibrary.deleteAssetsAsync(assetIds);
    return result;
  } catch {
    return false;
  }
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const units = ['B', 'KB', 'MB', 'GB'];
  const k = 1024;
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${units[i]}`;
}

export function getMediaTypeLabel(type: MediaType): string {
  return type === 'photo' ? 'Photo' : 'Video';
}
