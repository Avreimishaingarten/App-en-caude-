import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';
import { Card } from '../ui/Card';
import { IconSymbol } from '../ui/IconSymbol';
import { FontSize, FontWeight, Spacing, BorderRadius } from '../../constants/theme';

interface ActionCardProps {
  icon: string;
  title: string;
  subtitle: string;
  color?: string;
  onPress: () => void;
}

export function ActionCard({ icon, title, subtitle, color, onPress }: ActionCardProps) {
  const { colors } = useTheme();
  const accentColor = color ?? colors.primary;

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <Card variant="glass" style={styles.card}>
        <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
          <IconSymbol name={icon} size={24} color={accentColor} />
        </View>
        <View style={styles.textContainer}>
          <Text style={[styles.title, { color: colors.text }]}>{title}</Text>
          <Text style={[styles.subtitle, { color: colors.textSecondary }]}>{subtitle}</Text>
        </View>
        <IconSymbol name="chevronRight" size={20} color={colors.textTertiary} />
      </Card>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.lg,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: FontSize.md,
    fontWeight: FontWeight.semibold,
    marginBottom: 2,
  },
  subtitle: {
    fontSize: FontSize.sm,
  },
});
