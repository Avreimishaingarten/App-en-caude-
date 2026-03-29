import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { BorderRadius, FontSize, FontWeight, Spacing } from '../../constants/theme';

interface BadgeProps {
  label: string;
  color?: string;
  style?: ViewStyle;
}

export function Badge({ label, color, style }: BadgeProps) {
  const { colors } = useTheme();
  const bgColor = color ?? colors.primary;

  return (
    <View style={[styles.badge, { backgroundColor: bgColor + '22' }, style]}>
      <Text style={[styles.text, { color: bgColor }]}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.sm,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: FontSize.xs,
    fontWeight: FontWeight.semibold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
