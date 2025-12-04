import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WaterState {
  water: number;
  history: number[];
  dailyGoal: number;
}

const initialState: WaterState = {
  water: 0,
  history: [],
  dailyGoal: 2000,
};

export const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state, action: PayloadAction<number>) => {
      const amount = action.payload;
      const newWater = state.water + amount;

      state.water = newWater; 
      state.history.push(amount);
    },
    undo: (state) => {
      if (state.history.length === 0) return;

      const last = state.history.pop()!;
      state.water = Math.max(state.water - last, 0);
    },
    setDailyGoal: (state, action: PayloadAction<number>) => {
      state.dailyGoal = action.payload;

      
    }
  }
});

export const { addWater, undo, setDailyGoal } = waterSlice.actions;

export default waterSlice.reducer;
