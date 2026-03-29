export type MediaType = 'photo' | 'video';
export type GroupType = 'duplicate' | 'similar' | 'blurry' | 'large_video';

export interface MediaItem {
  id: string;
  uri: string;
  filename: string;
  width: number;
  height: number;
  createdAt: number;
  modifiedAt: number;
  fileSize: number;
  mediaType: MediaType;
  duration?: number;
  thumbnailUri?: string;
  isFavorite: boolean;
  isBlurry: boolean;
  sharpnessScore: number;
  brightnessScore: number;
  faceScore: number;
  qualityScore: number;
}

export interface MediaGroup {
  id: string;
  type: GroupType;
  items: MediaItem[];
  recommendedKeepId: string;
  estimatedSavingsBytes: number;
}

export interface BestShotRecommendation {
  itemId: string;
  groupId: string;
  score: number;
  reasons: BestShotReason[];
}

export type BestShotReason =
  | 'Sharpest image'
  | 'Best lighting'
  | 'Best facial expression'
  | 'Highest resolution'
  | 'Highest overall quality'
  | 'Least blurry'
  | 'Best composition';

export interface ScanSession {
  id: string;
  startedAt: number;
  completedAt?: number;
  totalScanned: number;
  duplicatesFound: number;
  similarGroupsFound: number;
  blurryFound: number;
  largeVideosFound: number;
  estimatedSavingsBytes: number;
  groups: MediaGroup[];
}

export interface CleanupSession {
  id: string;
  scanSessionId: string;
  selectedForDeleteIds: string[];
  keptIds: string[];
  estimatedSavedBytes: number;
  actualSavedBytes?: number;
  startedAt: number;
  completedAt?: number;
}
