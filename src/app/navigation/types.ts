import { NavigatorScreenParams } from '@react-navigation/native';
import { DayData } from '../../types';

// History Stack params
export type HistoryStackParamList = {
  HistoryMain: undefined;
  DayDetail: { day: DayData };
};

// Root Tab params
export type RootTabParamList = {
  HistoryTab: NavigatorScreenParams<HistoryStackParamList>;
  HomeTab: undefined;
  SettingsTab: undefined;
};

// Declare global navigation types for TypeScript
declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootTabParamList {}
  }
}
