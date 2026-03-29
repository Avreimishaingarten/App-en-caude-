import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../hooks';
import { useUserStore } from '../store';
import { FontSize, FontWeight, Spacing } from '../constants/theme';

export default function SplashScreen() {
  const { colors } = useTheme();
  const router = useRouter();
  const hasCompletedOnboarding = useUserStore((s) => s.hasCompletedOnboarding);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (hasCompletedOnboarding) {
        router.replace('/(tabs)');
      } else {
        router.replace('/(onboarding)');
      }
    }, 1500);
    return () => clearTimeout(timer);
  }, [hasCompletedOnboarding]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.content}>
        <View style={[styles.iconContainer, { backgroundColor: colors.primary + '20' }]}>
          <Text style={styles.icon}>⚡</Text>
        </View>
        <Text style={[styles.title, { color: colors.text }]}>ShotFlow</Text>
        <Text style={[styles.subtitle, { color: colors.primary }]}>AI</Text>
      </View>
      <ActivityIndicator color={colors.primary} size="small" style={styles.loader} />
      <Text style={[styles.tagline, { color: colors.textTertiary }]}>
        Your AI photo curator
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  icon: {
    fontSize: 28,
  },
  title: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    letterSpacing: -1,
  },
  subtitle: {
    fontSize: FontSize.display,
    fontWeight: FontWeight.bold,
    marginLeft: Spacing.sm,
    letterSpacing: -1,
  },
  loader: {
    marginTop: Spacing.xxl,
  },
  tagline: {
    position: 'absolute',
    bottom: 60,
    fontSize: FontSize.sm,
  },
});
