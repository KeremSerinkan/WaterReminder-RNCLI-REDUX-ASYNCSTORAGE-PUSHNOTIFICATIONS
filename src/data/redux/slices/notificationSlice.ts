// redux/slices/notificationSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface NotificationState {
  intervalMinutes: number;
  enabled: boolean;
}

const initialState: NotificationState = {
  intervalMinutes: 60,
  enabled: false,
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setEnabled: (state, action: PayloadAction<boolean>) => {
      state.enabled = action.payload;
    },
    setIntervalMinutes: (state, action: PayloadAction<number>) => {
      state.intervalMinutes = action.payload;
    },
  },
});

export const { setEnabled, setIntervalMinutes } = notificationSlice.actions;
export default notificationSlice.reducer;
