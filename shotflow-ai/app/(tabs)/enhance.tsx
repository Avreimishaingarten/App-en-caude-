import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button, Card } from '../../components/ui';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { enhancePhoto, getAutoEnhanceSettings } from '../../features/enhance';
import { useUserStore } from '../../store';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function EnhanceScreen() {
  const { colors } = useTheme();
  const [selectedUri, setSelectedUri] = useState<string | null>(null);
  const [enhancedUri, setEnhancedUri] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const { canPerformEnhancement, incrementEnhancementUsage } = useUserStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 1,
    });

    if (!result.canceled && result.assets[0]) {
      setSelectedUri(result.assets[0].uri);
      setEnhancedUri(null);
    }
  };

  const handleEnhance = async () => {
    if (!selectedUri || !canPerformEnhancement()) return;

    setIsProcessing(true);
    try {
      const settings = getAutoEnhanceSettings();
      const result = await enhancePhoto(selectedUri, settings);
      setEnhancedUri(result.enhancedUri);
      incrementEnhancementUsage();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>AI Enhance</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Auto-improve your photos with one tap
      </Text>

      {!selectedUri ? (
        <View style={styles.pickContainer}>
          <TouchableOpacity
            onPress={pickImage}
            style={[styles.pickArea, { borderColor: colors.border }]}
            activeOpacity={0.7}
          >
            <IconSymbol name="image" size={48} color={colors.textTertiary} />
            <Text style={[styles.pickText, { color: colors.textSecondary }]}>
              Tap to select a photo
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.previewContainer}>
          <View style={styles.imageRow}>
            <View style={styles.imageContainer}>
              <Text style={[styles.imageLabel, { color: colors.textSecondary }]}>Original</Text>
              <Image source={{ uri: selectedUri }} style={styles.previewImage} />
            </View>
            {enhancedUri && (
              <View style={styles.imageContainer}>
                <Text style={[styles.imageLabel, { color: colors.primary }]}>Enhanced</Text>
                <Image source={{ uri: enhancedUri }} style={styles.previewImage} />
              </View>
            )}
          </View>

          <View style={styles.actions}>
            {!enhancedUri ? (
              <Button
                title="Auto Enhance"
                onPress={handleEnhance}
                loading={isProcessing}
                disabled={!canPerformEnhancement()}
                fullWidth
                size="lg"
              />
            ) : (
              <Card variant="glass" style={styles.successCard}>
                <IconSymbol name="check" size={24} color={colors.success} />
                <Text style={[styles.successText, { color: colors.success }]}>
                  Photo enhanced successfully!
                </Text>
              </Card>
            )}
            <Button title="Choose Another" onPress={pickImage} variant="outline" fullWidth />
          </View>
        </View>
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
  pickContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
  },
  pickArea: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: BorderRadius.xl,
    paddingVertical: Spacing.xxxl * 2,
    alignItems: 'center',
    gap: Spacing.md,
  },
  pickText: {
    fontSize: FontSize.md,
  },
  previewContainer: {
    gap: Spacing.xl,
    paddingBottom: Spacing.xxl,
  },
  imageRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  imageContainer: {
    flex: 1,
    gap: Spacing.sm,
  },
  imageLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    textAlign: 'center',
  },
  previewImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: BorderRadius.lg,
  },
  actions: {
    gap: Spacing.md,
  },
  successCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.sm,
  },
  successText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
});
