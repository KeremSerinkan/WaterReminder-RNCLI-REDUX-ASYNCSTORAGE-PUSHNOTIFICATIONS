import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { WaterState, WaterEntry, DayHistory } from '../../types';
import { getTodayKey, getCurrentTimestamp } from '../../utils/date';

const initialState: WaterState = {
  dailyGoal: 3000,
  history: [],
};

// Validation helpers
const isValidAmount = (amount: number): boolean => {
  return amount > 0 && amount <= 5000 && Number.isInteger(amount);
};

const isValidGoal = (goal: number): boolean => {
  return goal >= 500 && goal <= 10000 && Number.isInteger(goal);
};

const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state, action: PayloadAction<number>) => {
      const amount = action.payload;

      // Validate amount
      if (!isValidAmount(amount)) {
        console.warn('Invalid water amount:', amount);
        return;
      }

      const todayKey = getTodayKey();
      const newEntry: WaterEntry = {
        amount,
        time: getCurrentTimestamp(),
      };

      // Find or create today's history entry
      const todayIndex = state.history.findIndex((day) => day.date === todayKey);

      if (todayIndex >= 0) {
        state.history[todayIndex].entries.push(newEntry);
      } else {
        state.history.push({
          date: todayKey,
          entries: [newEntry],
        });
      }
    },

    removeLastEntry: (state) => {
      const todayKey = getTodayKey();
      const todayIndex = state.history.findIndex((day) => day.date === todayKey);

      if (todayIndex >= 0 && state.history[todayIndex].entries.length > 0) {
        state.history[todayIndex].entries.pop();

        // Remove the day entry if no entries left
        if (state.history[todayIndex].entries.length === 0) {
          state.history.splice(todayIndex, 1);
        }
      }
    },

    removeEntry: (
      state,
      action: PayloadAction<{ date: string; entryIndex: number }>
    ) => {
      const { date, entryIndex } = action.payload;
      const dayIndex = state.history.findIndex((day) => day.date === date);

      if (dayIndex >= 0 && state.history[dayIndex].entries[entryIndex]) {
        state.history[dayIndex].entries.splice(entryIndex, 1);

        // Remove the day entry if no entries left
        if (state.history[dayIndex].entries.length === 0) {
          state.history.splice(dayIndex, 1);
        }
      }
    },

    setDailyGoal: (state, action: PayloadAction<number>) => {
      const goal = action.payload;

      if (!isValidGoal(goal)) {
        console.warn('Invalid daily goal:', goal);
        return;
      }

      state.dailyGoal = goal;
    },

    clearHistory: (state) => {
      state.history = [];
    },
  },
});

export const {
  addWater,
  removeLastEntry,
  removeEntry,
  setDailyGoal,
  clearHistory,
} = waterSlice.actions;

export default waterSlice.reducer;

// Selectors
export const selectDailyGoal = (state: { water: WaterState }) => state.water.dailyGoal;

export const selectHistory = (state: { water: WaterState }) => state.water.history;

export const selectTodayHistory = (state: { water: WaterState }): DayHistory | undefined => {
  const todayKey = getTodayKey();
  return state.water.history.find((day) => day.date === todayKey);
};

export const selectTodayTotal = (state: { water: WaterState }): number => {
  const today = selectTodayHistory(state);
  if (!today) return 0;
  return today.entries.reduce((sum, entry) => sum + entry.amount, 0);
};

export const selectTodayProgress = (state: { water: WaterState }): number => {
  const total = selectTodayTotal(state);
  const goal = state.water.dailyGoal;
  return (total / goal) * 100;
};

export const selectLastEntry = (state: { water: WaterState }): WaterEntry | undefined => {
  const today = selectTodayHistory(state);
  if (!today || today.entries.length === 0) return undefined;
  return today.entries[today.entries.length - 1];
};
