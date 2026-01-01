import { Platform, ViewStyle } from 'react-native';

type ShadowStyle = Pick<
  ViewStyle,
  'shadowColor' | 'shadowOffset' | 'shadowOpacity' | 'shadowRadius' | 'elevation'
>;

const createShadow = (
  offsetY: number,
  blur: number,
  opacity: number,
  elevation: number
): ShadowStyle => ({
  shadowColor: '#000000',
  shadowOffset: { width: 0, height: offsetY },
  shadowOpacity: opacity,
  shadowRadius: blur,
  elevation: Platform.OS === 'android' ? elevation : 0,
});

export const shadows = {
  none: createShadow(0, 0, 0, 0),

  // Subtle shadow for cards
  sm: createShadow(1, 2, 0.05, 1),

  // Default shadow
  md: createShadow(2, 4, 0.08, 3),

  // Elevated shadow for modals, floating buttons
  lg: createShadow(4, 8, 0.12, 6),

  // Heavy shadow for dropdowns, popovers
  xl: createShadow(8, 16, 0.16, 12),

  // Extra heavy shadow
  xxl: createShadow(12, 24, 0.2, 16),
} as const;

// Colored shadows for playful effects
export const coloredShadows = {
  primary: (opacity = 0.3): ShadowStyle => ({
    shadowColor: '#6C5CE7',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),

  secondary: (opacity = 0.3): ShadowStyle => ({
    shadowColor: '#00CEC9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),

  success: (opacity = 0.3): ShadowStyle => ({
    shadowColor: '#00B894',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),

  danger: (opacity = 0.3): ShadowStyle => ({
    shadowColor: '#FF7675',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),

  water: (opacity = 0.3): ShadowStyle => ({
    shadowColor: '#74B9FF',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: opacity,
    shadowRadius: 8,
    elevation: Platform.OS === 'android' ? 6 : 0,
  }),
};

export type Shadows = typeof shadows;
