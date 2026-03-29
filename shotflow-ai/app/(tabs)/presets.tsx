import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button, Badge } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { getAvailablePresets, applyPreset } from '../../features/presets';
import { useUserStore } from '../../store';
import { EnhancementPreset } from '../../types';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function PresetsScreen() {
  const { colors } = useTheme();
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [resultUri, setResultUri] = useState<string | null>(null);
  const [activePreset, setActivePreset] = useState<string | null>(null);
  const [isApplying, setIsApplying] = useState(false);
  const tier = useUserStore((s) => s.getTier());
  const presets = getAvailablePresets(tier === 'premium');

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });
    if (!result.canceled && result.assets[0]) {
      setSelectedUri(result.assets[0].uri);
      setResultUri(null);
      setActivePreset(null);
    }
  };

  const handleApplyPreset = async (preset: EnhancementPreset) => {
    if (!selectedUri) return;
    setIsApplying(true);
    setActivePreset(preset.id);
    try {
      const result = await applyPreset(selectedUri, preset.id);
      setResultUri(result.enhancedUri);
    } finally {
      setIsApplying(false);
    }
  };

  const renderPreset = ({ item }: { item: EnhancementPreset }) => (
    <TouchableOpacity
      onPress={() => handleApplyPreset(item)}
      activeOpacity={0.7}
      style={styles.presetItem}
    >
      <View
        style={[
          styles.presetColor,
          {
            backgroundColor: item.thumbnailColor,
            borderColor: activePreset === item.id ? colors.primary : 'transparent',
            borderWidth: activePreset === item.id ? 2 : 0,
          },
        ]}
      />
      <Text
        style={[
          styles.presetName,
          { color: activePreset === item.id ? colors.primary : colors.text },
        ]}
      >
        {item.name}
      </Text>
      {item.isPremium && <Badge label="PRO" color={colors.secondary} />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Style Presets</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Apply cinematic styles to your photos
      </Text>

      {selectedUri ? (
        <View style={styles.previewContainer}>
          <Image
            source={{ uri: resultUri ?? selectedUri }}
            style={styles.previewImage}
          />
          {activePreset && (
            <Text style={[styles.appliedLabel, { color: colors.primary }]}>
              {presets.find((p) => p.id === activePreset)?.name ?? ''} applied
            </Text>
          )}
        </View>
      ) : (
        <TouchableOpacity
          onPress={pickImage}
          style={[styles.pickArea, { borderColor: colors.border }]}
          activeOpacity={0.7}
        >
          <IconSymbol name="palette" size={48} color={colors.textTertiary} />
          <Text style={[styles.pickText, { color: colors.textSecondary }]}>
            Select a photo to style
          </Text>
        </TouchableOpacity>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text }]}>Presets</Text>
      <FlatList
        data={presets}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        renderItem={renderPreset}
        contentContainerStyle={styles.presetList}
      />

      {selectedUri && (
        <Button title="Choose Another Photo" onPress={pickImage} variant="outline" fullWidth />
      )}
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginTop: Spacing.lg,
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: FontSize.md,
    marginTop: Spacing.xs,
    marginBottom: Spacing.xl,
  },
  pickArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxxl * 2,
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  pickText: {
    fontSize: FontSize.md,
  },
  previewContainer: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 5,
    borderRadius: BorderRadius.xl,
  },
  appliedLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.sm,
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  presetList: {
    paddingBottom: Spacing.xl,
    gap: Spacing.lg,
  },
  presetItem: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  presetColor: {
    width: 64,
    height: 64,
    borderRadius: 32,
  },
  presetName: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
