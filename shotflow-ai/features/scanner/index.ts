import { MediaItem, MediaGroup, ScanSession } from '../../types';
import { loadAllMedia } from '../../lib/media';
import { scoreMediaItem } from '../best-shot';
import {
  findExactDuplicates,
  findSimilarPhotos,
  findBlurryPhotos,
  findLargeVideos,
} from '../similarity';

export interface ScanProgress {
  phase: 'loading' | 'scoring' | 'grouping' | 'complete';
  loaded: number;
  total: number;
  message: string;
}

export async function runFullScan(
  onProgress?: (progress: ScanProgress) => void,
): Promise<ScanSession> {
  const sessionId = `scan_${Date.now()}`;
  const startedAt = Date.now();

  // Phase 1: Load media
  onProgress?.({ phase: 'loading', loaded: 0, total: 0, message: 'Loading media library...' });

  const rawItems = await loadAllMedia((loaded, total) => {
    onProgress?.({
      phase: 'loading',
      loaded,
      total,
      message: `Loading media... ${loaded}/${total}`,
    });
  });

  // Phase 2: Score items
  onProgress?.({
    phase: 'scoring',
    loaded: 0,
    total: rawItems.length,
    message: 'Analyzing photo quality...',
  });

  const scoredItems: MediaItem[] = [];
  for (let i = 0; i < rawItems.length; i++) {
    scoredItems.push(scoreMediaItem(rawItems[i]));
    if (i % 20 === 0) {
      onProgress?.({
        phase: 'scoring',
        loaded: i + 1,
        total: rawItems.length,
        message: `Analyzing quality... ${i + 1}/${rawItems.length}`,
      });
    }
  }

  // Phase 3: Group items
  onProgress?.({
    phase: 'grouping',
    loaded: 0,
    total: 4,
    message: 'Finding duplicates and similar photos...',
  });

  const duplicates = findExactDuplicates(scoredItems);
  onProgress?.({ phase: 'grouping', loaded: 1, total: 4, message: 'Finding similar photos...' });

  const similar = findSimilarPhotos(scoredItems);
  onProgress?.({ phase: 'grouping', loaded: 2, total: 4, message: 'Detecting blurry photos...' });

  const blurry = findBlurryPhotos(scoredItems);
  onProgress?.({ phase: 'grouping', loaded: 3, total: 4, message: 'Checking large videos...' });

  const largeVideos = findLargeVideos(scoredItems);

  const allGroups = [...duplicates, ...similar, ...blurry, ...largeVideos];
  const totalSavings = allGroups.reduce((sum, g) => sum + g.estimatedSavingsBytes, 0);

  const session: ScanSession = {
    id: sessionId,
    startedAt,
    completedAt: Date.now(),
    totalScanned: scoredItems.length,
    duplicatesFound: duplicates.reduce((sum, g) => sum + g.items.length - 1, 0),
    similarGroupsFound: similar.length,
    blurryFound: blurry.reduce((sum, g) => sum + g.items.length, 0),
    largeVideosFound: largeVideos.reduce((sum, g) => sum + g.items.length, 0),
    estimatedSavingsBytes: totalSavings,
    groups: allGroups,
  };

  onProgress?.({
    phase: 'complete',
    loaded: scoredItems.length,
    total: scoredItems.length,
    message: 'Scan complete!',
  });

  return session;
}
