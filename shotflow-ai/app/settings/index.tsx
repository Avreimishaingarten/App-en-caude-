import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Card } from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { Badge } from '../../components/ui/Badge';
import { useUserStore } from '../../store';
import { APP_NAME, APP_VERSION } from '../../constants';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

export default function SettingsScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const tier = useUserStore((s) => s.getTier());

  const SettingsRow = ({
    icon,
    label,
    value,
    onPress,
  }: {
    icon: string;
    label: string;
    value?: string;
    onPress?: () => void;
  }) => (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={onPress ? 0.7 : 1}
      style={[styles.settingsRow, { borderBottomColor: colors.border }]}
    >
      <IconSymbol name={icon} size={20} color={colors.textSecondary} />
      <Text style={[styles.settingsLabel, { color: colors.text }]}>{label}</Text>
      {value && (
        <Text style={[styles.settingsValue, { color: colors.textTertiary }]}>{value}</Text>
      )}
      {onPress && <IconSymbol name="chevronRight" size={16} color={colors.textTertiary} />}
    </TouchableOpacity>
  );

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.backBtn, { color: colors.primary }]}>← Back</Text>
        </TouchableOpacity>
      </View>

      <Text style={[styles.title, { color: colors.text }]}>Settings</Text>

      {tier === 'free' && (
        <TouchableOpacity onPress={() => router.push('/paywall')} activeOpacity={0.7}>
          <Card variant="elevated" style={StyleSheet.flatten([styles.upgradeCard, { borderColor: colors.secondary }])}>
            <IconSymbol name="crown" size={24} color={colors.secondary} />
            <View style={styles.upgradeText}>
              <Text style={[styles.upgradeTitle, { color: colors.text }]}>
                Upgrade to Premium
              </Text>
              <Text style={[styles.upgradeSubtitle, { color: colors.textSecondary }]}>
                Unlimited cleanup, enhancements, and all presets
              </Text>
            </View>
          </Card>
        </TouchableOpacity>
      )}

      <Card variant="glass" style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ACCOUNT</Text>
        <SettingsRow icon="face" label="Subscription" value={tier === 'premium' ? 'Premium' : 'Free'} />
      </Card>

      <Card variant="glass" style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.textTertiary }]}>ABOUT</Text>
        <SettingsRow icon="zap" label="App Version" value={APP_VERSION} />
        <SettingsRow icon="shield" label="Privacy Policy" onPress={() => {}} />
        <SettingsRow icon="settings" label="Terms of Service" onPress={() => {}} />
      </Card>

      <Text style={[styles.footer, { color: colors.textTertiary }]}>
        {APP_NAME} v{APP_VERSION}
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Spacing.md,
    marginBottom: Spacing.lg,
  },
  backBtn: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    marginBottom: Spacing.xl,
    letterSpacing: -0.5,
  },
  upgradeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
    borderWidth: 1,
  },
  upgradeText: {
    flex: 1,
  },
  upgradeTitle: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
  },
  upgradeSubtitle: {
    fontSize: FontSize.sm,
    marginTop: 2,
  },
  section: {
    marginBottom: Spacing.lg,
    padding: 0,
    overflow: 'hidden',
  },
  sectionTitle: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    letterSpacing: 1,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.md,
    paddingBottom: Spacing.sm,
  },
  settingsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.lg,
    gap: Spacing.md,
    borderBottomWidth: 0.5,
  },
  settingsLabel: {
    flex: 1,
    fontSize: FontSize.md,
  },
  settingsValue: {
    fontSize: FontSize.sm,
  },
  footer: {
    textAlign: 'center',
    fontSize: FontSize.xs,
    marginTop: Spacing.xl,
  },
});
