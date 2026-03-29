import { EnhancementPreset, EnhancementSettings } from '../../types';
import { BUILT_IN_PRESETS } from '../../constants/presets';
import { enhancePhoto } from '../enhance';

export function getAvailablePresets(isPremium: boolean): EnhancementPreset[] {
  if (isPremium) return BUILT_IN_PRESETS;
  return BUILT_IN_PRESETS.filter((p) => !p.isPremium);
}

export function getPresetById(id: string): EnhancementPreset | undefined {
  return BUILT_IN_PRESETS.find((p) => p.id === id);
}

export async function applyPreset(uri: string, presetId: string) {
  const preset = getPresetById(presetId);
  if (!preset) throw new Error(`Preset "${presetId}" not found`);
  return enhancePhoto(uri, preset.settings);
}
