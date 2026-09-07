export const color = {
  background: '#FBF7F1',
  surface: '#F4EDE2',
  surfaceElevated: '#FFFFFF',
  textPrimary: '#2B2622',
  textSecondary: '#6B6259',
  border: '#E6DCCC',
  accent: '#C97B4A',
  accentMuted: '#E8C9B3',
  success: '#6B8F71',
  warning: '#C99A4A',
  danger: '#B85C4A',
  glassFill: 'rgba(255, 255, 255, 0.55)',
  glassBorder: 'rgba(255, 255, 255, 0.35)',
} as const;

export const font = {
  headline: 'Fraunces_600SemiBold',
  headlineLight: 'Fraunces_400Regular',
  body: 'Inter_400Regular',
  bodyMedium: 'Inter_500Medium',
  bodySemiBold: 'Inter_600SemiBold',
} as const;

export const fontSize = {
  xs: 12, sm: 14, base: 16, lg: 18, xl: 22, '2xl': 28, '3xl': 34,
} as const;

export const space = {
  xs: 4, sm: 8, md: 16, lg: 24, xl: 32, '2xl': 48,
} as const;

export const radius = {
  sm: 8, md: 16, lg: 24, full: 999,
} as const;

export const elevation = { none: 0, low: 2, medium: 6, high: 12 } as const;
export const blur = { subtle: 20, medium: 40 } as const;