import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useTheme } from '../../hooks';

const ICON_MAP: Record<string, string> = {
  scan: '🔍',
  star: '⭐',
  trash: '🗑️',
  photo: '📷',
  video: '🎬',
  sparkle: '✨',
  palette: '🎨',
  shield: '🛡️',
  check: '✓',
  chevronRight: '›',
  close: '✕',
  settings: '⚙️',
  crown: '👑',
  storage: '💾',
  blur: '🌫️',
  sharp: '🔆',
  face: '😊',
  zap: '⚡',
  home: '🏠',
  image: '🖼️',
  wand: '🪄',
};

interface IconSymbolProps {
  name: string;
  size?: number;
  color?: string;
}

export function IconSymbol({ name, size = 24, color }: IconSymbolProps) {
  const { colors } = useTheme();
  const icon = ICON_MAP[name] ?? '•';

  return (
    <Text style={{ fontSize: size * 0.8, color: color ?? colors.text, textAlign: 'center' }}>
      {icon}
    </Text>
  );
}
