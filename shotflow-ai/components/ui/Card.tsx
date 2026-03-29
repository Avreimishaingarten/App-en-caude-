import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { BorderRadius, Spacing, Shadow } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass' | 'elevated';
  style?: ViewStyle;
}

export function Card({ children, variant = 'default', style }: CardProps) {
  const { colors } = useTheme();

  const variantStyles: Record<string, ViewStyle> = {
    default: {
      backgroundColor: colors.card,
      borderWidth: 1,
      borderColor: colors.border,
    },
    glass: {
      backgroundColor: colors.glass,
      borderWidth: 1,
      borderColor: colors.glassBorder,
    },
    elevated: {
      backgroundColor: colors.surfaceElevated,
      ...Shadow.md,
    },
  };

  return (
    <View style={[styles.base, variantStyles[variant], style]}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: BorderRadius.lg,
    padding: Spacing.lg,
  },
});
