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

const Tab = createBottomTabNavigator();
function App() {
  return (
    <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator
          initialRouteName='Home'
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor: colors.waterColor,
            tabBarInactiveTintColor: 'gray',
            tabBarStyle:{
              backgroundColor: colors.appBG,
            }
            
          })}
        >
          <Tab.Screen name="History" component={HistoryScreen} />
          <Tab.Screen name="Home" component={HomeScreen} />
          <Tab.Screen name="Settings" component={SettingsScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
    </PersistGate>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
