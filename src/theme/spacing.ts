import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 14 Pro as reference)
const BASE_WIDTH = 393;
const BASE_HEIGHT = 852;

// Scaling functions
export const scale = (size: number): number => {
  const ratio = SCREEN_WIDTH / BASE_WIDTH;
  return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
};

export const verticalScale = (size: number): number => {
  const ratio = SCREEN_HEIGHT / BASE_HEIGHT;
  return Math.round(PixelRatio.roundToNearestPixel(size * ratio));
};

export const moderateScale = (size: number, factor = 0.5): number => {
  return Math.round(size + (scale(size) - size) * factor);
};

// Spacing scale (4px base unit)
export const spacing = {
  none: 0,
  xxs: scale(2),
  xs: scale(4),
  sm: scale(8),
  md: scale(12),
  lg: scale(16),
  xl: scale(24),
  xxl: scale(32),
  xxxl: scale(48),
  huge: scale(64),
} as const;

// Layout helpers
export const layout = {
  screenWidth: SCREEN_WIDTH,
  screenHeight: SCREEN_HEIGHT,

  // Common paddings
  screenPadding: scale(20),
  cardPadding: scale(16),

  // Border radius
  radiusXs: scale(4),
  radiusSm: scale(8),
  radiusMd: scale(12),
  radiusLg: scale(16),
  radiusXl: scale(24),
  radiusFull: 9999,

  // Icon sizes
  iconSm: scale(16),
  iconMd: scale(24),
  iconLg: scale(32),
  iconXl: scale(48),

  // Button heights
  buttonSm: verticalScale(36),
  buttonMd: verticalScale(48),
  buttonLg: verticalScale(56),

  // Common component sizes
  progressRingSize: scale(200),
  quickAddButtonSize: scale(100),
  tabBarHeight: verticalScale(60),
} as const;

export type Spacing = typeof spacing;
export type Layout = typeof layout;
