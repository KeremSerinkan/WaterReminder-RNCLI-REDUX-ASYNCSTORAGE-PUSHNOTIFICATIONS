import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SettingsState, ThemeMode } from '../../types';

const initialState: SettingsState = {
  themeMode: 'system',
  notificationsEnabled: true,
  intervalMinutes: 120, // 2 hours default
};

// Valid interval values
const VALID_INTERVALS = [30, 45, 60, 120, 180, 360];

const isValidInterval = (interval: number): boolean => {
  return VALID_INTERVALS.includes(interval);
};

const settingsSlice = createSlice({
  name: 'settings',
  initialState,
  reducers: {
    setThemeMode: (state, action: PayloadAction<ThemeMode>) => {
      state.themeMode = action.payload;
    },

    setNotificationsEnabled: (state, action: PayloadAction<boolean>) => {
      state.notificationsEnabled = action.payload;
    },

    setIntervalMinutes: (state, action: PayloadAction<number>) => {
      const interval = action.payload;

      if (!isValidInterval(interval)) {
        console.warn('Invalid interval:', interval);
        return;
      }

      state.intervalMinutes = interval;
    },

    toggleNotifications: (state) => {
      state.notificationsEnabled = !state.notificationsEnabled;
    },

    resetSettings: () => initialState,
  },
});

export const {
  setThemeMode,
  setNotificationsEnabled,
  setIntervalMinutes,
  toggleNotifications,
  resetSettings,
} = settingsSlice.actions;

export default settingsSlice.reducer;

// Selectors
export const selectThemeMode = (state: { settings: SettingsState }) =>
  state.settings.themeMode;

export const selectNotificationsEnabled = (state: { settings: SettingsState }) =>
  state.settings.notificationsEnabled;

export const selectIntervalMinutes = (state: { settings: SettingsState }) =>
  state.settings.intervalMinutes;

export const selectSettings = (state: { settings: SettingsState }) => state.settings;
