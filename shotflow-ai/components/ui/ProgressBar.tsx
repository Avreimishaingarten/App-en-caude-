import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { useTheme } from '../../hooks';
import { BorderRadius } from '../../constants/theme';

interface ProgressBarProps {
  progress: number; // 0 to 1
  color?: string;
  height?: number;
  style?: ViewStyle;
}

export function ProgressBar({ progress, color, height = 6, style }: ProgressBarProps) {
  const { colors } = useTheme();
  const fillColor = color ?? colors.primary;
  const clampedProgress = Math.max(0, Math.min(1, progress));

  return (
    <View style={[styles.track, { height, backgroundColor: colors.border }, style]}>
      <View
        style={[
          styles.fill,
          {
            height,
            backgroundColor: fillColor,
            width: `${clampedProgress * 100}%`,
          },
        ]}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    width: '100%',
  },
  fill: {
    borderRadius: BorderRadius.full,
  },
});
