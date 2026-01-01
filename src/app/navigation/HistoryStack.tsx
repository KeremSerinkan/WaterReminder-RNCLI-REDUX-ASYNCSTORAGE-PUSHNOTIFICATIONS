import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useTheme } from '../../theme';
import { HistoryStackParamList } from './types';

// Import screens (will be created next)
import HistoryScreen from '../../screens/HistoryScreen';
import DayDetailScreen from '../../screens/DayDetailScreen';

const Stack = createNativeStackNavigator<HistoryStackParamList>();

export const HistoryStack: React.FC = () => {
  const theme = useTheme();

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.colors.background },
        animation: 'slide_from_right',
      }}
    >
      <Stack.Screen name="HistoryMain" component={HistoryScreen} />
      <Stack.Screen name="DayDetail" component={DayDetailScreen} />
    </Stack.Navigator>
  );
};

export default HistoryStack;
