/**
 * Design tokens for Nearby — clean & modern.
 * Minimal palette, generous spacing, one accent color.
 */

export const colors = {
  // Surfaces
  background: '#FFFFFF',
  surface: '#F7F8FA',
  surfaceAlt: '#EEF0F4',
  card: '#FFFFFF',

  // Text
  text: '#16181D',
  textSecondary: '#6B7280',
  textTertiary: '#9CA3AF',

  // Accent (single)
  accent: '#4F46E5',
  accentSoft: '#EEF2FF',
  accentPressed: '#4338CA',

  // Lines & states
  border: '#E5E7EB',
  white: '#FFFFFF',
  black: '#000000',
  success: '#10B981',
  star: '#F59E0B',

  // Category colors
  sports: '#F97316',
  family: '#EC4899',
  community: '#10B981',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
} as const;

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  pill: 999,
} as const;

export const font = {
  size: {
    xs: 12,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    xxl: 26,
    display: 32,
  },
  weight: {
    regular: '400',
    medium: '500',
    semibold: '600',
    bold: '700',
  },
} as const;

export const shadow = {
  card: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.06,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  floating: {
    shadowColor: '#0B1220',
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 6 },
    elevation: 6,
  },
} as const;
