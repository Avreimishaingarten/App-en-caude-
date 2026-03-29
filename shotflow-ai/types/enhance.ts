export interface EnhancementSettings {
  exposure: number;    // -1 to 1
  contrast: number;    // -1 to 1
  saturation: number;  // -1 to 1
  sharpness: number;   // 0 to 1
  warmth: number;      // -1 to 1
}

export interface EnhancementPreset {
  id: string;
  name: string;
  description: string;
  settings: EnhancementSettings;
  isPremium: boolean;
  thumbnailColor: string;
}

export interface EnhancementResult {
  originalUri: string;
  enhancedUri: string;
  presetId?: string;
  settings: EnhancementSettings;
  appliedAt: number;
}
