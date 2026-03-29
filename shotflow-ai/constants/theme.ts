export const Colors = {
  dark: {
    background: '#0A0E1A',
    surface: '#131825',
    surfaceElevated: '#1A2035',
    card: '#1E2540',
    border: '#2A3155',
    text: '#FFFFFF',
    textSecondary: '#9CA3C0',
    textTertiary: '#6B7294',
    primary: '#3B82F6',
    primaryLight: '#60A5FA',
    secondary: '#8B5CF6',
    secondaryLight: '#A78BFA',
    accent: '#06D6A0',
    highlight: '#22D3EE',
    highlightGlow: 'rgba(34, 211, 238, 0.15)',
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.15)',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.15)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.15)',
    glass: 'rgba(26, 32, 53, 0.7)',
    glassBorder: 'rgba(255, 255, 255, 0.08)',
    overlay: 'rgba(0, 0, 0, 0.6)',
  },
  light: {
    background: '#F8FAFC',
    surface: '#FFFFFF',
    surfaceElevated: '#FFFFFF',
    card: '#F1F5F9',
    border: '#E2E8F0',
    text: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    primary: '#3B82F6',
    primaryLight: '#DBEAFE',
    secondary: '#8B5CF6',
    secondaryLight: '#EDE9FE',
    accent: '#06D6A0',
    highlight: '#0891B2',
    highlightGlow: 'rgba(8, 145, 178, 0.1)',
    success: '#10B981',
    successLight: 'rgba(16, 185, 129, 0.1)',
    danger: '#EF4444',
    dangerLight: 'rgba(239, 68, 68, 0.1)',
    warning: '#F59E0B',
    warningLight: 'rgba(245, 158, 11, 0.1)',
    glass: 'rgba(255, 255, 255, 0.8)',
    glassBorder: 'rgba(0, 0, 0, 0.06)',
    overlay: 'rgba(0, 0, 0, 0.3)',
  },
};

export type ThemeColors = (typeof Colors)['dark'];

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
  xxxl: 48,
} as const;

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  xxl: 24,
  full: 9999,
} as const;

export const FontSize = {
  xs: 11,
  sm: 13,
  md: 15,
  lg: 17,
  xl: 20,
  xxl: 24,
  xxxl: 32,
  display: 40,
} as const;

export const FontWeight = {
  regular: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
};

export const Shadow = {
  sm: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  md: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  lg: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  glow: (color: string) => ({
    shadowColor: color,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 6,
  }),
} as const;
