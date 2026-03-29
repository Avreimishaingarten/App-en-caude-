import { MediaItem, BestShotRecommendation, BestShotReason } from '../../types';

const WEIGHTS = {
  sharpness: 0.3,
  brightness: 0.15,
  face: 0.2,
  blur: 0.15,
  resolution: 0.1,
  favorite: 0.1,
};

export function calculateSharpnessScore(item: MediaItem): number {
  // MVP heuristic: higher resolution images tend to be sharper
  // Real implementation would use Laplacian variance or ML model
  const megapixels = (item.width * item.height) / 1_000_000;
  return Math.min(1, megapixels / 12); // Normalize to 12MP as baseline
}

export function calculateBrightnessScore(_item: MediaItem): number {
  // MVP: return neutral score. Real implementation would analyze pixel data
  // or use image histogram analysis
  return 0.6;
}

export function calculateFaceScore(_item: MediaItem): number {
  // MVP: return neutral score. Real implementation would use face detection
  // to evaluate face visibility, smile, eyes open
  return 0.5;
}

export function calculateBlurPenalty(item: MediaItem): number {
  // MVP: penalize very small images (often thumbnails/screenshots)
  if (item.width < 500 || item.height < 500) return 0.5;
  return 0;
}

export function calculateResolutionScore(item: MediaItem): number {
  const megapixels = (item.width * item.height) / 1_000_000;
  if (megapixels >= 12) return 1.0;
  if (megapixels >= 8) return 0.8;
  if (megapixels >= 4) return 0.6;
  if (megapixels >= 2) return 0.4;
  return 0.2;
}

export function calculateOverallQualityScore(item: MediaItem): number {
  const sharpness = calculateSharpnessScore(item);
  const brightness = calculateBrightnessScore(item);
  const face = calculateFaceScore(item);
  const blurPenalty = calculateBlurPenalty(item);
  const resolution = calculateResolutionScore(item);
  const favoriteBonus = item.isFavorite ? 1 : 0;

  const score =
    sharpness * WEIGHTS.sharpness +
    brightness * WEIGHTS.brightness +
    face * WEIGHTS.face +
    (1 - blurPenalty) * WEIGHTS.blur +
    resolution * WEIGHTS.resolution +
    favoriteBonus * WEIGHTS.favorite;

  return Math.round(score * 100) / 100;
}

export function scoreMediaItem(item: MediaItem): MediaItem {
  return {
    ...item,
    sharpnessScore: calculateSharpnessScore(item),
    brightnessScore: calculateBrightnessScore(item),
    faceScore: calculateFaceScore(item),
    isBlurry: calculateBlurPenalty(item) > 0.3,
    qualityScore: calculateOverallQualityScore(item),
  };
}

function getTopReasons(item: MediaItem, allItems: MediaItem[]): BestShotReason[] {
  const reasons: BestShotReason[] = [];

  const isSharpest = allItems.every((o) => item.sharpnessScore >= o.sharpnessScore);
  if (isSharpest) reasons.push('Sharpest image');

  const bestLight = allItems.every((o) => item.brightnessScore >= o.brightnessScore);
  if (bestLight) reasons.push('Best lighting');

  const bestFace = allItems.every((o) => item.faceScore >= o.faceScore);
  if (bestFace && item.faceScore > 0.5) reasons.push('Best facial expression');

  const highestRes = allItems.every(
    (o) => item.width * item.height >= o.width * o.height,
  );
  if (highestRes) reasons.push('Highest resolution');

  if (reasons.length === 0) reasons.push('Highest overall quality');

  return reasons.slice(0, 2);
}

export function chooseBestShot(items: MediaItem[]): BestShotRecommendation {
  if (items.length === 0) throw new Error('Cannot choose best shot from empty array');

  const scored = items.map(scoreMediaItem);
  const sorted = [...scored].sort((a, b) => b.qualityScore - a.qualityScore);
  const best = sorted[0];

  return {
    itemId: best.id,
    groupId: '',
    score: best.qualityScore,
    reasons: getTopReasons(best, scored),
  };
}
