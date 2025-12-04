/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import HistoryScreen from './src/screens/HistoryScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/styles/colors';
import { Provider } from 'react-redux';
import { persistor, store } from './src/data/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useNotificationManager } from './src/services/useNotificationManager';
import { ReactNode, useEffect } from 'react';
import DayDetailScreen from './src/screens/DayDetailScreen';
import HistoryStackNavigator from './src/screens/HistoryStackNavigator';
import { enableScreens } from 'react-native-screens';
import AsyncStorage from '@react-native-async-storage/async-storage';
enableScreens();
const Tab = createBottomTabNavigator();
function App() {
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NotificationManagerWrapper>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName='Home'
                screenOptions={({ route }) => ({
                  headerShown: false,
                  tabBarActiveTintColor: colors.waterColor,
                  tabBarInactiveTintColor: 'gray',
                  tabBarStyle: { backgroundColor: colors.appBG },
                })}
              >
                <Tab.Screen name="History" component={HistoryStackNavigator} />
                <Tab.Screen name="Home" component={HomeScreen} />
                <Tab.Screen name="Settings" component={SettingsScreen} />
              </Tab.Navigator>
            </NavigationContainer>
          </NotificationManagerWrapper>
        </SafeAreaProvider>
      </PersistGate>
    </Provider>
  );
}
function NotificationManagerWrapper({ children }: { children: ReactNode }) {
  useNotificationManager();
  return <>{children}</>;
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
