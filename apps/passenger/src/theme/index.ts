export const Colors = {
  // Primary 60%
  primary: '#1B4F8A',
  primaryDark: '#0F3460',
  primaryLight: '#2563AB',
  primaryMid: '#1A5276',

  // Secondary 30%
  secondary: '#F5C518',
  secondaryDark: '#D4A017',
  secondaryLight: '#FFD740',

  // Accent 10%
  white: '#FFFFFF',
  backgroundLight: '#E8F4FD',
  backgroundCard: '#F0F8FF',

  // Neutrals
  gray100: '#F4F6F8',
  gray200: '#E2E8EF',
  gray300: '#C8D4DF',
  gray400: '#94A9BC',
  gray500: '#5E7A91',
  gray600: '#3D5A70',
  gray700: '#2C3E50',

  // Status
  success: '#27AE60',
  error: '#E74C3C',
  warning: '#F39C12',

  // Overlays
  overlay: 'rgba(27, 79, 138, 0.85)',
  overlayLight: 'rgba(27, 79, 138, 0.12)',
  shadowColor: 'rgba(27, 79, 138, 0.20)',
};

export const Typography = {
  fontSizes: {
    xs: 11,
    sm: 13,
    md: 15,
    lg: 17,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 38,
  },
  fontWeights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
    extrabold: '800' as const,
  },
  lineHeights: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
  },
};

export const Spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
};

export const BorderRadius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 999,
};

export const Shadows = {
  sm: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 1,
    shadowRadius: 4,
    elevation: 3,
  },
  md: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 1,
    shadowRadius: 12,
    elevation: 6,
  },
  lg: {
    shadowColor: Colors.shadowColor,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 1,
    shadowRadius: 24,
    elevation: 12,
  },
};