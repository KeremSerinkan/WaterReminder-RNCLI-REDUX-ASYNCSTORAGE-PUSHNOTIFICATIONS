import React, { useEffect } from 'react';
import { StatusBar, useColorScheme } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import BootSplash from 'react-native-bootsplash';

import { store, persistor, useAppSelector } from '../store';
import { selectThemeMode } from '../store/slices/settingsSlice';
import { ThemeProvider, useTheme, lightTheme, darkTheme } from '../theme';
import RootNavigator from './navigation/RootNavigator';
import { useNotifications } from '../services/notifications/useNotifications';

// Inner app component that uses theme
const AppContent: React.FC = () => {
  const theme = useTheme();
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector(selectThemeMode);

  // Initialize notifications
  useNotifications();

  // Determine if dark mode
  const isDark =
    themeMode === 'dark' ||
    (themeMode === 'system' && systemColorScheme === 'dark');

  useEffect(() => {
    // Hide splash screen after app is ready
    const hideSplash = async () => {
      await BootSplash.hide({ fade: true });
    };
    hideSplash();
  }, []);

  return (
    <>
      <StatusBar
        barStyle={isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <NavigationContainer>
        <RootNavigator />
      </NavigationContainer>
    </>
  );
};

// Theme wrapper that provides context based on Redux state
const ThemedApp: React.FC = () => {
  const systemColorScheme = useColorScheme();
  const themeMode = useAppSelector(selectThemeMode);

  // Determine which theme to use
  const currentTheme = React.useMemo(() => {
    if (themeMode === 'system') {
      return systemColorScheme === 'dark' ? darkTheme : lightTheme;
    }
    return themeMode === 'dark' ? darkTheme : lightTheme;
  }, [themeMode, systemColorScheme]);

  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
};

// Root App component
const App: React.FC = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <Provider store={store}>
          <PersistGate loading={null} persistor={persistor}>
            <ThemedApp />
          </PersistGate>
        </Provider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default App;
