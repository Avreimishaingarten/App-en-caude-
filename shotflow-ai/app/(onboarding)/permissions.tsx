import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme, useMediaPermissions } from '../../hooks';
import { useUserStore } from '../../store';
import { Button } from '../../components/ui';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Card } from '../../components/ui/Card';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';
import { openAppSettings } from '../../lib/permissions';

export default function PermissionsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { request, isDenied } = useMediaPermissions();
  const completeOnboarding = useUserStore((s) => s.completeOnboarding);

  const handleGrant = async () => {
    const granted = await request();
    if (granted) {
      completeOnboarding();
      router.replace('/(tabs)');
    }
  };

  const handleOpenSettings = () => {
    openAppSettings();
  };

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.primary + '15' }]}>
          <IconSymbol name="photo" size={64} color={colors.primary} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>
          Access Your Photos
        </Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          ShotFlow AI needs access to your photo library to scan for duplicates, find your best shots, and help you free up storage.
        </Text>

        <Card variant="glass" style={styles.infoCard}>
          <View style={styles.infoRow}>
            <IconSymbol name="shield" size={20} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Your photos never leave your device
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="shield" size={20} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              Nothing is deleted without your approval
            </Text>
          </View>
          <View style={styles.infoRow}>
            <IconSymbol name="shield" size={20} color={colors.success} />
            <Text style={[styles.infoText, { color: colors.textSecondary }]}>
              All processing happens locally on your phone
            </Text>
          </View>
        </Card>
      </View>

      <View style={styles.footer}>
        {isDenied ? (
          <>
            <Text style={[styles.deniedText, { color: colors.danger }]}>
              Permission was denied. Please enable photo access in Settings.
            </Text>
            <Button title="Open Settings" onPress={handleOpenSettings} fullWidth size="lg" />
          </>
        ) : (
          <Button title="Allow Photo Access" onPress={handleGrant} fullWidth size="lg" />
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xxl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: Spacing.xxl,
  },
  infoCard: {
    width: '100%',
    gap: Spacing.md,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  infoText: {
    fontSize: FontSize.sm,
    flex: 1,
  },
  footer: {
    paddingHorizontal: Spacing.xl,
    paddingBottom: Spacing.xxxl,
  },
  deniedText: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    marginBottom: Spacing.lg,
  },
});
