import { EnhancementPreset } from '../types';

export const BUILT_IN_PRESETS: EnhancementPreset[] = [
  {
    id: 'natural',
    name: 'Natural',
    description: 'Subtle enhancement that preserves the original feel',
    settings: { exposure: 0.05, contrast: 0.1, saturation: 0.05, sharpness: 0.15, warmth: 0 },
    isPremium: false,
    thumbnailColor: '#10B981',
  },
  {
    id: 'warm',
    name: 'Warm',
    description: 'Golden warm tones for a cozy look',
    settings: { exposure: 0.1, contrast: 0.05, saturation: 0.15, sharpness: 0.1, warmth: 0.35 },
    isPremium: false,
    thumbnailColor: '#F59E0B',
  },
  {
    id: 'cinematic',
    name: 'Cinematic',
    description: 'Film-like contrast with muted colors',
    settings: { exposure: -0.05, contrast: 0.3, saturation: -0.15, sharpness: 0.1, warmth: 0.1 },
    isPremium: true,
    thumbnailColor: '#8B5CF6',
  },
  {
    id: 'vibrant',
    name: 'Vibrant',
    description: 'Bold, punchy colors that pop',
    settings: { exposure: 0.1, contrast: 0.15, saturation: 0.4, sharpness: 0.2, warmth: 0.05 },
    isPremium: true,
    thumbnailColor: '#EF4444',
  },
  {
    id: 'soft-portrait',
    name: 'Soft Portrait',
    description: 'Flattering soft light for portraits',
    settings: { exposure: 0.15, contrast: -0.1, saturation: 0.05, sharpness: 0.05, warmth: 0.15 },
    isPremium: true,
    thumbnailColor: '#EC4899',
  },
  {
    id: 'cool-clean',
    name: 'Cool Clean',
    description: 'Crisp cool tones with clean whites',
    settings: { exposure: 0.1, contrast: 0.1, saturation: -0.1, sharpness: 0.25, warmth: -0.25 },
    isPremium: true,
    thumbnailColor: '#22D3EE',
  },
];
