import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useTheme } from '../../hooks';
import { ScreenContainer } from '../../components/layout';
import { Button } from '../../components/ui';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

export default function EnhanceModalScreen() {
  const { colors } = useTheme();
  const router = useRouter();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={[styles.title, { color: colors.text }]}>Enhance Photo</Text>
        <Button title="Done" onPress={() => router.back()} variant="ghost" size="sm" />
      </View>
      <Text style={[styles.info, { color: colors.textSecondary }]}>
        Select a photo from the Enhance tab to apply AI enhancements.
      </Text>
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
  title: {
    fontSize: FontSize.xxl,
    fontWeight: FontWeight.bold,
  },
  info: {
    fontSize: FontSize.md,
    lineHeight: 24,
  },
});
