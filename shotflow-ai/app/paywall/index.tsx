import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

const FEATURES = [
  { icon: 'scan', text: 'Unlimited gallery cleanup' },
  { icon: 'star', text: 'Unlimited best-shot reviews' },
  { icon: 'sparkle', text: 'Unlimited AI enhancements' },
  { icon: 'palette', text: 'All 6 premium style presets' },
  { icon: 'wand', text: 'Future smart albums (coming soon)' },
];

export default function PaywallScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  const handleSubscribe = () => {
    // RevenueCat integration point
    // For MVP, just close the modal
    router.back();
  };

  const handleOneTime = () => {
    // RevenueCat one-time purchase integration point
    router.back();
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={[styles.closeBtn, { color: colors.textSecondary }]}>✕</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.hero}>
        <View style={[styles.crownCircle, { backgroundColor: colors.secondary + '20' }]}>
          <IconSymbol name="crown" size={48} color={colors.secondary} />
        </View>
        <Text style={[styles.title, { color: colors.text }]}>ShotFlow Premium</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Unlock the full power of AI photo curation
        </Text>
      </View>

      <Card variant="glass" style={styles.featuresCard}>
        {FEATURES.map((feature, i) => (
          <View key={i} style={styles.featureRow}>
            <IconSymbol name={feature.icon} size={20} color={colors.primary} />
            <Text style={[styles.featureText, { color: colors.text }]}>{feature.text}</Text>
          </View>
        ))}
      </Card>

      <View style={styles.pricing}>
        <TouchableOpacity
          onPress={handleSubscribe}
          activeOpacity={0.7}
          style={[styles.priceCard, {
            backgroundColor: colors.primary,
            borderColor: colors.primary,
          }]}
        >
          <Text style={styles.priceLabel}>Weekly</Text>
          <Text style={styles.priceValue}>$2.99/wk</Text>
          <Text style={styles.priceTrial}>3-day free trial</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleOneTime}
          activeOpacity={0.7}
          style={[styles.priceCard, {
            backgroundColor: colors.card,
            borderColor: colors.secondary,
            borderWidth: 2,
          }]}
        >
          <Text style={[styles.priceLabel, { color: colors.secondary }]}>Lifetime</Text>
          <Text style={[styles.priceValue, { color: colors.text }]}>$29.99</Text>
          <Text style={[styles.priceTrial, { color: colors.textSecondary }]}>One-time purchase</Text>
        </TouchableOpacity>
      </View>

      <Button title="Start Free Trial" onPress={handleSubscribe} fullWidth size="lg" />

      <Text style={[styles.terms, { color: colors.textTertiary }]}>
        Cancel anytime. Subscription auto-renews.{'\n'}
        Restore purchases · Privacy Policy · Terms
      </Text>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    alignItems: 'flex-end',
    paddingTop: Spacing.md,
  },
  closeBtn: {
    fontSize: 24,
    padding: Spacing.sm,
  },
  hero: {
    alignItems: 'center',
    paddingVertical: Spacing.xxl,
  },
  crownCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  featuresCard: {
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  featureText: {
    fontSize: FontSize.md,
  },
  pricing: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.xl,
  },
  priceCard: {
    flex: 1,
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
    alignItems: 'center',
    gap: Spacing.xs,
  },
  priceLabel: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.semibold,
    color: '#FFF',
    opacity: 0.8,
  },
  priceValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    color: '#FFF',
  },
  priceTrial: {
    fontSize: FontSize.xs,
    color: '#FFF',
    opacity: 0.7,
  },
  terms: {
    fontSize: FontSize.xs,
    textAlign: 'center',
    lineHeight: 18,
    marginTop: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
});
