export const lightColors = {
  // Primary brand colors
  primary: '#6C5CE7',
  primaryLight: '#A29BFE',
  primaryDark: '#5541D9',

  // Secondary accent
  secondary: '#00CEC9',
  secondaryLight: '#81ECEC',
  secondaryDark: '#00A8A3',

  // Semantic colors
  success: '#00B894',
  successLight: '#55EFC4',
  warning: '#FDCB6E',
  warningLight: '#FFEAA7',
  danger: '#FF7675',
  dangerLight: '#FAB1A0',

  // Water-specific colors (for progress visualization)
  water: '#74B9FF',
  waterLight: '#A8D8FF',
  waterDark: '#0984E3',

  // Backgrounds
  background: '#FFFFFF',
  backgroundSecondary: '#F8F9FA',
  backgroundTertiary: '#F1F3F4',

  // Surfaces (cards, modals)
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',

  // Text
  text: '#2D3436',
  textSecondary: '#636E72',
  textTertiary: '#B2BEC3',
  textInverse: '#FFFFFF',

  // Borders & Dividers
  border: '#DFE6E9',
  borderLight: '#F1F3F4',
  divider: '#E9ECEF',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.5)',
  overlayLight: 'rgba(0, 0, 0, 0.3)',

  // Tab bar
  tabBarBackground: '#FFFFFF',
  tabBarActive: '#6C5CE7',
  tabBarInactive: '#B2BEC3',
};

export const darkColors = {
  // Primary brand colors
  primary: '#A29BFE',
  primaryLight: '#D0CDFE',
  primaryDark: '#6C5CE7',

  // Secondary accent
  secondary: '#81ECEC',
  secondaryLight: '#B4F5F5',
  secondaryDark: '#00CEC9',

  // Semantic colors
  success: '#55EFC4',
  successLight: '#88F5D8',
  warning: '#FFEAA7',
  warningLight: '#FFF4CC',
  danger: '#FAB1A0',
  dangerLight: '#FCCFC6',

  // Water-specific colors
  water: '#74B9FF',
  waterLight: '#A8D8FF',
  waterDark: '#5DADE2',

  // Backgrounds
  background: '#1A1A2E',
  backgroundSecondary: '#16213E',
  backgroundTertiary: '#0F3460',

  // Surfaces
  surface: '#16213E',
  surfaceElevated: '#1E2A4A',

  // Text
  text: '#FFFFFF',
  textSecondary: '#B2BEC3',
  textTertiary: '#636E72',
  textInverse: '#2D3436',

  // Borders & Dividers
  border: '#2D3A5A',
  borderLight: '#243350',
  divider: '#2D3A5A',

  // Overlays
  overlay: 'rgba(0, 0, 0, 0.7)',
  overlayLight: 'rgba(0, 0, 0, 0.5)',

  // Tab bar
  tabBarBackground: '#16213E',
  tabBarActive: '#A29BFE',
  tabBarInactive: '#636E72',
};

export type ColorTheme = typeof lightColors;
