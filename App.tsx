/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import { NavigationContainer } from '@react-navigation/native';
import * as React from 'react';
import { StyleSheet, Text, View, } from 'react-native';
import {
  SafeAreaProvider,
} from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from './src/screens/HomeScreen';
import SettingsScreen from './src/screens/SettingsScreen';
import { colors } from './src/styles/colors';
import { Provider } from 'react-redux';
import { persistor, store } from './src/data/redux/store';
import { PersistGate } from 'redux-persist/integration/react';
import { useNotificationManager } from './src/services/useNotificationManager';
import { ReactNode, useEffect } from 'react';
import HistoryStackNavigator from './src/screens/HistoryStackNavigator';
import { enableScreens } from 'react-native-screens';
import { TabBarHomeIcon } from './src/assets/icons/tabHomeIcon';
import { TabBarHistoryIcon } from './src/assets/icons/tabHistoryIcon';
import { TabBarSettingsIcon } from './src/assets/icons/tabSettingsIcon';
import { s, vs } from 'react-native-size-matters';
import BootSplash from "react-native-bootsplash";
enableScreens();
const Tab = createBottomTabNavigator();
function App() {
  useEffect(() => {
    const init = async () => {
      // …do multiple sync or async tasks
    };

    init().finally(async () => {
      await BootSplash.hide({ fade: true });
      console.log("BootSplash has been hidden successfully");
    });
  }, []);
  return (
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <SafeAreaProvider>
          <NotificationManagerWrapper>
            <NavigationContainer>
              <Tab.Navigator
                initialRouteName="Home"
                screenOptions={{
                  headerShown: false,
                  tabBarShowLabel: false,
                  tabBarActiveTintColor: colors.waterColor,
                  tabBarInactiveTintColor: 'gray',
                  tabBarStyle: { backgroundColor: colors.appBG },
                }}
              >
                <Tab.Screen
                  name="History"
                  component={HistoryStackNavigator}
                  options={{
                    tabBarIcon: ({ color }) => (
                      // Diğer ikon için örnek, boyutu da 60 verdik
                      <View style={{ justifyContent: 'center', alignItems: 'center', height: 60, paddingTop: 30 }}>
                        <TabBarHistoryIcon width={s(45)} height={vs(45)} stroke={color} />
                      </View>
                    ),
                  }}
                />
                <Tab.Screen
                  name="Home"
                  component={HomeScreen}
                  options={{
                    tabBarIcon: ({ color }) => (
                      <View style={{ justifyContent: 'center', alignItems: 'center', height: 60, paddingTop: 30 }}>
                        <TabBarHomeIcon width={s(45)} height={vs(45)} stroke={color} />
                      </View>
                    ),
                  }}
                />
                <Tab.Screen
                  name="Settings"
                  component={SettingsScreen}
                  options={{
                    tabBarIcon: ({ color }) => (
                      // Örnek, aynı ikon kullanabilirsiniz veya farklı ikon
                      <View style={{ justifyContent: 'center', alignItems: 'center', height: 60, paddingTop: 30 }}>
                        <TabBarSettingsIcon width={s(40)} height={vs(40)} stroke={color} />
                      </View>
                    ),
                  }}
                />
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
