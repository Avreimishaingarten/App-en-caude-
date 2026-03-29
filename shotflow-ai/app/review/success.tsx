import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { useCleanupStore } from '../../store';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

export default function CleanupSuccessScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const lastSession = useCleanupStore((s) => s.lastSession);
  const reset = useCleanupStore((s) => s.reset);

  const handleDone = () => {
    reset();
    router.replace('/(tabs)');
  };

  return (
    <ScreenContainer scrollable={false}>
      <View style={styles.container}>
        <View style={[styles.successCircle, { backgroundColor: colors.success + '15' }]}>
          <IconSymbol name="check" size={64} color={colors.success} />
        </View>

        <Text style={[styles.title, { color: colors.text }]}>Cleanup Complete!</Text>
        <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
          Your gallery is now cleaner and more organized.
        </Text>

        {lastSession && (
          <View style={styles.stats}>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Photos kept</Text>
              <Text style={[styles.statValue, { color: colors.success }]}>
                {lastSession.keptIds.length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Items removed</Text>
              <Text style={[styles.statValue, { color: colors.text }]}>
                {lastSession.selectedForDeleteIds.length}
              </Text>
            </View>
            <View style={styles.statRow}>
              <Text style={[styles.statLabel, { color: colors.textSecondary }]}>Space freed</Text>
              <Text style={[styles.statValue, { color: colors.primary }]}>
                {formatFileSize(lastSession.actualSavedBytes ?? lastSession.estimatedSavedBytes)}
              </Text>
            </View>
          </View>
        )}

        <Button title="Done" onPress={handleDone} fullWidth size="lg" />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: Spacing.xxl,
  },
  successCircle: {
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
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: FontSize.md,
    textAlign: 'center',
    marginBottom: Spacing.xxl,
  },
  stats: {
    width: '100%',
    gap: Spacing.lg,
    marginBottom: Spacing.xxl,
  },
  statRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  statLabel: {
    fontSize: FontSize.md,
  },
  statValue: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.bold,
  },
});
