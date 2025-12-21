import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaterEntry {
  amount: number;
  time: string; // ISO string
}

interface DayHistory {
  date: string; // YYYY-MM-DD
  entries: WaterEntry[];
}

interface WaterState {
  dailyGoal: number;
  history: DayHistory[];
}

const initialState: WaterState = {
  dailyGoal: 3000,
  history: [],
};

export const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state, action: PayloadAction<number>) => {
      const amount = action.payload;
      const now = new Date();
      const offset = now.getTimezoneOffset(); // dakika
      const localNow = new Date(now.getTime() - offset * 60 * 1000);
      const dateKey = localNow.toISOString().split('T')[0]; // artık lokal tarih
      const time = localNow.toISOString(); // artık lokal saat

      let day = state.history.find((d) => d.date === dateKey);
      if (!day) {
        day = { date: dateKey, entries: [] };
        state.history.push(day);
      }
      day.entries.push({ amount, time });
    },
    undo: (state) => {
      if (state.history.length === 0) return;

      const todayKey = new Date().toISOString().split('T')[0];
      const today = state.history.find((d) => d.date === todayKey);
      if (!today || today.entries.length === 0) return;

      today.entries.pop();
      if (today.entries.length === 0) {
        state.history = state.history.filter((d) => d.date !== todayKey);
      }
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;
    },
  },
});

export const { addWater, undo, setDailyGoal } = waterSlice.actions;
export default waterSlice.reducer;
