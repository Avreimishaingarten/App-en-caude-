import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useCleanupStore, useUserStore } from '../../store';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

export default function ConfirmCleanupScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { plan, execute, isExecuting } = useCleanupStore();
  const { canPerformCleanup, incrementCleanupUsage } = useUserStore();

  if (!plan) {
    router.back();
    return null;
  }

  const handleConfirm = async () => {
    if (!canPerformCleanup()) {
      router.push('/paywall');
      return;
    }
    incrementCleanupUsage();
    await execute();
    router.replace('/review/success');
  };

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Confirm Cleanup</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Review what will happen before confirming
      </Text>

      <Card variant="elevated" style={styles.summaryCard}>
        <View style={styles.summaryRow}>
          <IconSymbol name="check" size={20} color={colors.success} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {plan.totalItemsToKeep} photos will be kept
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <IconSymbol name="trash" size={20} color={colors.danger} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {plan.totalItemsToDelete} items will be removed
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <IconSymbol name="storage" size={20} color={colors.primary} />
          <Text style={[styles.summaryText, { color: colors.text }]}>
            {formatFileSize(plan.estimatedSavingsBytes)} will be freed
          </Text>
        </View>
      </Card>

      <Card variant="glass" style={styles.warningCard}>
        <IconSymbol name="shield" size={20} color={colors.warning} />
        <Text style={[styles.warningText, { color: colors.textSecondary }]}>
          Deleted items may be recoverable from your device's "Recently Deleted" folder for a limited time.
        </Text>
      </Card>

      <View style={styles.actions}>
        <Button
          title="Confirm & Clean Up"
          onPress={handleConfirm}
          loading={isExecuting}
          variant="danger"
          fullWidth
          size="lg"
        />
        <Button
          title="Go Back & Review"
          onPress={() => router.back()}
          variant="outline"
          fullWidth
        />
      </View>
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
    marginBottom: Spacing.xxl,
  },
  summaryCard: {
    gap: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryText: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.medium,
  },
  warningCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  warningText: {
    fontSize: FontSize.sm,
    flex: 1,
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.md,
  },
});
