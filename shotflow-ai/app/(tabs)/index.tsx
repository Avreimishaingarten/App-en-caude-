import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { StatCard } from '../../components/cards/StatCard';
import { ActionCard } from '../../components/cards/ActionCard';
import { useScanStore } from '../../store';
import { formatFileSize } from '../../lib/media';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

export default function DashboardScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const session = useScanStore((s) => s.session);

  const hasResults = session != null;

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View>
          <Text style={[styles.greeting, { color: colors.textSecondary }]}>Welcome to</Text>
          <Text style={[styles.title, { color: colors.text }]}>ShotFlow AI</Text>
        </View>
        <View style={[styles.settingsBtn, { backgroundColor: colors.card }]}>
          <Text
            style={{ fontSize: 20 }}
            onPress={() => router.push('/settings')}
          >
            ⚙️
          </Text>
        </View>
      </View>

      {hasResults ? (
        <>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Scan Results</Text>
          <View style={styles.statsGrid}>
            <StatCard
              icon="photo"
              label="Scanned"
              value={session.totalScanned}
              color={colors.primary}
            />
            <StatCard
              icon="scan"
              label="Duplicates"
              value={session.duplicatesFound}
              color={colors.danger}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="image"
              label="Similar"
              value={session.similarGroupsFound}
              color={colors.warning}
            />
            <StatCard
              icon="blur"
              label="Blurry"
              value={session.blurryFound}
              color={colors.secondary}
            />
          </View>
          <View style={styles.statsGrid}>
            <StatCard
              icon="video"
              label="Large Videos"
              value={session.largeVideosFound}
              color={colors.highlight}
            />
            <StatCard
              icon="storage"
              label="Can Free"
              value={formatFileSize(session.estimatedSavingsBytes)}
              color={colors.success}
            />
          </View>
        </>
      ) : (
        <View style={[styles.emptyState, { backgroundColor: colors.card }]}>
          <Text style={styles.emptyIcon}>📱</Text>
          <Text style={[styles.emptyTitle, { color: colors.text }]}>
            No scan yet
          </Text>
          <Text style={[styles.emptySubtitle, { color: colors.textSecondary }]}>
            Scan your gallery to discover duplicates, similar shots, and free up storage.
          </Text>
        </View>
      )}

      <Text style={[styles.sectionTitle, { color: colors.text, marginTop: Spacing.xl }]}>
        Quick Actions
      </Text>

      <View style={styles.actions}>
        <ActionCard
          icon="scan"
          title={hasResults ? 'Scan Again' : 'Scan Gallery'}
          subtitle="Find duplicates and similar photos"
          color={colors.primary}
          onPress={() => router.push('/(tabs)/scan')}
        />
        {hasResults && session.groups.length > 0 && (
          <ActionCard
            icon="star"
            title="Review Best Shots"
            subtitle={`${session.similarGroupsFound} groups to review`}
            color={colors.warning}
            onPress={() => router.push('/review')}
          />
        )}
        <ActionCard
          icon="sparkle"
          title="Enhance Photos"
          subtitle="Auto-improve your best photos"
          color={colors.secondary}
          onPress={() => router.push('/(tabs)/enhance')}
        />
        <ActionCard
          icon="palette"
          title="Apply Styles"
          subtitle="6 premium presets available"
          color={colors.highlight}
          onPress={() => router.push('/(tabs)/presets')}
        />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: Spacing.lg,
    marginBottom: Spacing.xl,
  },
  greeting: {
    fontSize: FontSize.sm,
    fontWeight: FontWeight.medium,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
    letterSpacing: -0.5,
  },
  settingsBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.md,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  emptyState: {
    borderRadius: 16,
    padding: Spacing.xxl,
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: Spacing.md,
  },
  emptyTitle: {
    fontSize: FontSize.lg,
    fontWeight: FontWeight.semibold,
    marginBottom: Spacing.sm,
  },
  emptySubtitle: {
    fontSize: FontSize.sm,
    textAlign: 'center',
    lineHeight: 20,
  },
  actions: {
    gap: Spacing.md,
    paddingBottom: Spacing.xxl,
  },
});
