export * from './theme';
export * from './presets';
export * from './onboarding';

export const APP_NAME = 'ShotFlow AI';
export const APP_VERSION = '1.0.0';

export const SCAN_BATCH_SIZE = 50;
export const SIMILARITY_TIME_THRESHOLD_MS = 5000; // 5 seconds
export const SIMILARITY_SIZE_THRESHOLD_RATIO = 0.1; // 10% difference
export const BLUR_THRESHOLD = 0.3;
export const LARGE_VIDEO_THRESHOLD_MB = 100;

export const SUPABASE_URL = process.env.EXPO_PUBLIC_SUPABASE_URL ?? '';
export const SUPABASE_ANON_KEY = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '';
