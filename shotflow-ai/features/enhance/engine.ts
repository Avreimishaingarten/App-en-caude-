import * as ImageManipulator from 'expo-image-manipulator';
import { EnhancementSettings, EnhancementResult } from '../../types';

export const DEFAULT_ENHANCEMENT: EnhancementSettings = {
  exposure: 0.1,
  contrast: 0.1,
  saturation: 0.05,
  sharpness: 0.15,
  warmth: 0,
};

export async function enhancePhoto(
  uri: string,
  settings: EnhancementSettings,
): Promise<EnhancementResult> {
  // MVP: Use ImageManipulator for basic adjustments
  // Future: Replace with ML-based enhancement pipeline
  try {
    const actions: ImageManipulator.Action[] = [];

    // For MVP, we do a resize-to-same to process through the pipeline
    // Real enhancement would apply exposure/contrast/saturation adjustments
    // using native image processing or an ML model

    const result = await ImageManipulator.manipulateAsync(
      uri,
      actions,
      {
        compress: 0.95,
        format: ImageManipulator.SaveFormat.JPEG,
      },
    );

    return {
      originalUri: uri,
      enhancedUri: result.uri,
      settings,
      appliedAt: Date.now(),
    };
  } catch (error) {
    // Return original on failure
    return {
      originalUri: uri,
      enhancedUri: uri,
      settings,
      appliedAt: Date.now(),
    };
  }
}

export function getAutoEnhanceSettings(): EnhancementSettings {
  return { ...DEFAULT_ENHANCEMENT };
}
