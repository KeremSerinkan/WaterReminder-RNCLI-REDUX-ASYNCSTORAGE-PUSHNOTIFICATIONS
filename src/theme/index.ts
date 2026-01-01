import React, { createContext, useContext, useMemo } from 'react';
import { useColorScheme } from 'react-native';
import { useSelector } from 'react-redux';
import { lightColors, darkColors, ColorTheme } from './colors';
import { spacing, layout, scale, verticalScale, moderateScale } from './spacing';
import { textStyles, fontFamilies, fontWeights, fontSizes } from './typography';
import { shadows, coloredShadows } from './shadows';

// Theme mode type
export type ThemeMode = 'light' | 'dark' | 'system';

// Full theme type
export interface Theme {
  colors: ColorTheme;
  spacing: typeof spacing;
  layout: typeof layout;
  textStyles: typeof textStyles;
  fonts: typeof fontFamilies;
  fontWeights: typeof fontWeights;
  fontSizes: typeof fontSizes;
  shadows: typeof shadows;
  coloredShadows: typeof coloredShadows;
  isDark: boolean;
}

// Create the light theme
export const lightTheme: Theme = {
  colors: lightColors,
  spacing,
  layout,
  textStyles,
  fonts: fontFamilies,
  fontWeights,
  fontSizes,
  shadows,
  coloredShadows,
  isDark: false,
};

// Create the dark theme
export const darkTheme: Theme = {
  colors: darkColors,
  spacing,
  layout,
  textStyles,
  fonts: fontFamilies,
  fontWeights,
  fontSizes,
  shadows,
  coloredShadows,
  isDark: true,
};

// Theme context
const ThemeContext = createContext<Theme>(lightTheme);

// Theme provider props
interface ThemeProviderProps {
  children: React.ReactNode;
}

// Theme provider component
export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const systemColorScheme = useColorScheme();

  // Get theme mode from Redux store (will be added later)
  // For now, default to 'system'
  const themeMode: ThemeMode = 'system';

  const theme = useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  return React.createElement(ThemeContext.Provider, { value: theme }, children);
};

// useTheme hook
export const useTheme = (): Theme => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

// Export all theme utilities
export {
  lightColors,
  darkColors,
  spacing,
  layout,
  scale,
  verticalScale,
  moderateScale,
  textStyles,
  fontFamilies,
  fontWeights,
  fontSizes,
  shadows,
  coloredShadows,
};

export type { ColorTheme };
