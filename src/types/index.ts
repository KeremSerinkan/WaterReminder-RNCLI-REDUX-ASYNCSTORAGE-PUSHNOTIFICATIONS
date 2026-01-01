// Water tracking types
export interface WaterEntry {
  amount: number;
  time: string; // ISO timestamp
}

export interface DayHistory {
  date: string; // YYYY-MM-DD format
  entries: WaterEntry[];
}

// Computed day data for display
export interface DayData {
  date: string;
  total: number;
  goal: number;
  percentage: number;
  entries: WaterEntry[];
}

// Settings types
export type ThemeMode = 'light' | 'dark' | 'system';

export interface Settings {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  intervalMinutes: number;
}

// Navigation types
export type RootTabParamList = {
  History: undefined;
  Home: undefined;
  Settings: undefined;
};

export type HistoryStackParamList = {
  HistoryMain: undefined;
  DayDetail: { day: DayData };
};

// Redux state types
export interface WaterState {
  dailyGoal: number;
  history: DayHistory[];
}

export interface SettingsState {
  themeMode: ThemeMode;
  notificationsEnabled: boolean;
  intervalMinutes: number;
}

export interface RootState {
  water: WaterState;
  settings: SettingsState;
}

// Notification interval options
export interface IntervalOption {
  label: string;
  value: number;
}

export const INTERVAL_OPTIONS: IntervalOption[] = [
  { label: '30 minutes', value: 30 },
  { label: '45 minutes', value: 45 },
  { label: '1 hour', value: 60 },
  { label: '2 hours', value: 120 },
  { label: '3 hours', value: 180 },
  { label: '6 hours', value: 360 },
];

// Quick add button presets
export interface QuickAddPreset {
  amount: number;
  label: string;
  icon: 'glass' | 'bottle' | 'jug';
}

export const QUICK_ADD_PRESETS: QuickAddPreset[] = [
  { amount: 250, label: '+250', icon: 'glass' },
  { amount: 500, label: '+500', icon: 'bottle' },
  { amount: 750, label: '+750', icon: 'jug' },
];
