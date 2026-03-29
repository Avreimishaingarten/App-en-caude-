import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button, ProgressBar } from '../../components/ui';
import { Card } from '../../components/ui/Card';
import { IconSymbol } from '../../components/ui/IconSymbol';
import { MediaGroupCard } from '../../components/cards/MediaGroupCard';
import { useScanStore } from '../../store';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

export default function ScanScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const { isScanning, progress, session, error, startScan, reset } = useScanStore();

  const progressFraction =
    progress && progress.total > 0 ? progress.loaded / progress.total : 0;

  return (
    <ScreenContainer>
      <Text style={[styles.title, { color: colors.text }]}>Gallery Scan</Text>
      <Text style={[styles.subtitle, { color: colors.textSecondary }]}>
        Find duplicates, similar shots, and free up storage
      </Text>

      {/* Idle state */}
      {!isScanning && !session && !error && (
        <View style={styles.startContainer}>
          <View style={[styles.scanIcon, { backgroundColor: colors.primary + '15' }]}>
            <IconSymbol name="scan" size={72} color={colors.primary} />
          </View>
          <Text style={[styles.startText, { color: colors.textSecondary }]}>
            Scan your entire photo library to find clutter and pick the best shots.
          </Text>
          <Button title="Start Scan" onPress={startScan} fullWidth size="lg" />
        </View>
      )}

      {/* Scanning state */}
      {isScanning && progress && (
        <Card variant="glass" style={styles.progressCard}>
          <IconSymbol name="scan" size={32} color={colors.primary} />
          <Text style={[styles.progressPhase, { color: colors.text }]}>
            {progress.message}
          </Text>
          <ProgressBar progress={progressFraction} />
          <Text style={[styles.progressDetail, { color: colors.textTertiary }]}>
            {progress.loaded} / {progress.total}
          </Text>
        </Card>
      )}

      {/* Error state */}
      {error && (
        <Card variant="glass" style={styles.errorCard}>
          <Text style={[styles.errorText, { color: colors.danger }]}>{error}</Text>
          <Button title="Try Again" onPress={startScan} variant="outline" />
        </Card>
      )}

      {/* Results state */}
      {session && !isScanning && (
        <View style={styles.results}>
          <Card variant="elevated" style={styles.summaryCard}>
            <Text style={[styles.summaryTitle, { color: colors.text }]}>Scan Complete</Text>
            <Text style={[styles.summaryDetail, { color: colors.textSecondary }]}>
              {session.totalScanned} items scanned
            </Text>
            <View style={styles.summaryStats}>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: colors.danger }]}>
                  {session.duplicatesFound}
                </Text>
                <Text style={[styles.summaryStatLabel, { color: colors.textTertiary }]}>
                  Duplicates
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: colors.warning }]}>
                  {session.similarGroupsFound}
                </Text>
                <Text style={[styles.summaryStatLabel, { color: colors.textTertiary }]}>
                  Similar Groups
                </Text>
              </View>
              <View style={styles.summaryStat}>
                <Text style={[styles.summaryStatValue, { color: colors.success }]}>
                  {formatFileSize(session.estimatedSavingsBytes)}
                </Text>
                <Text style={[styles.summaryStatLabel, { color: colors.textTertiary }]}>
                  Can Free
                </Text>
              </View>
            </View>
          </Card>

          {session.groups.length > 0 && (
            <>
              <Text style={[styles.groupsTitle, { color: colors.text }]}>
                Groups Found ({session.groups.length})
              </Text>
              {session.groups.map((group) => (
                <MediaGroupCard
                  key={group.id}
                  group={group}
                  onPress={() =>
                    router.push({
                      pathname: '/review',
                      params: { groupId: group.id },
                    })
                  }
                />
              ))}
            </>
          )}

          <View style={styles.resultActions}>
            {session.groups.length > 0 && (
              <Button
                title="Review & Clean Up"
                onPress={() => router.push('/review')}
                fullWidth
                size="lg"
              />
            )}
            <Button
              title="Scan Again"
              onPress={() => { reset(); startScan(); }}
              variant="outline"
              fullWidth
            />
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
  startContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.xxxl,
    gap: Spacing.xl,
  },
  scanIcon: {
    width: 140,
    height: 140,
    borderRadius: 70,
    alignItems: 'center',
    justifyContent: 'center',
  },
  startText: {
    fontSize: FontSize.md,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: Spacing.lg,
  },
  progressCard: {
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xxl,
    padding: Spacing.xxl,
  },
  progressPhase: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
  },
  progressDetail: {
    fontSize: FontSize.sm,
  },
  errorCard: {
    alignItems: 'center',
    gap: Spacing.lg,
    marginTop: Spacing.xxl,
  },
  errorText: {
    fontSize: FontSize.md,
    textAlign: 'center',
  },
  results: {
    gap: Spacing.lg,
    paddingBottom: Spacing.xxl,
  },
  summaryCard: {
    alignItems: 'center',
    gap: Spacing.md,
  },
  summaryTitle: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  summaryDetail: {
    fontSize: FontSize.sm,
  },
  summaryStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: Spacing.md,
  },
  summaryStat: {
    alignItems: 'center',
  },
  summaryStatValue: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
  },
  summaryStatLabel: {
    fontSize: FontSize.xs,
    marginTop: 2,
  },
  groupsTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginTop: Spacing.md,
  },
  resultActions: {
    gap: Spacing.md,
    marginTop: Spacing.md,
  },
});
