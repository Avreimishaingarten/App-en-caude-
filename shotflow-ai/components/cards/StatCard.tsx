import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useTheme } from '../../hooks';
import { Card } from '../ui/Card';
import { IconSymbol } from '../ui/IconSymbol';
import { FontSize, FontWeight, Spacing } from '../../constants/theme';

interface StatCardProps {
  icon: string;
  label: string;
  value: string | number;
  color?: string;
  onPress?: () => void;
}

export function StatCard({ icon, label, value, color, onPress }: StatCardProps) {
  const { colors } = useTheme();
  const accentColor = color ?? colors.primary;

  const content = (
    <Card variant="glass" style={styles.card}>
      <View style={[styles.iconContainer, { backgroundColor: accentColor + '15' }]}>
        <IconSymbol name={icon} size={22} color={accentColor} />
      </View>
      <Text style={[styles.value, { color: colors.text }]}>{value}</Text>
      <Text style={[styles.label, { color: colors.textSecondary }]}>{label}</Text>
    </Card>
  );

  if (onPress) {
    return <TouchableOpacity onPress={onPress} activeOpacity={0.7}>{content}</TouchableOpacity>;
  }

  return content;
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    minWidth: 100,
    flex: 1,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  value: {
    fontSize: FontSize.xl,
    fontWeight: FontWeight.bold,
    marginBottom: 2,
  },
  label: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.medium,
  },
});
