# Learning Guide: React Native Architecture & Best Practices

A senior developer's explanation of this codebase for beginners.

---

## 1. Folder Structure - Why It Matters

### Old (Bad) Structure:
```
src/
├── screens/
│   ├── HomeScreen.tsx      # Everything in one file
│   ├── SettingsScreen.tsx
├── components/
│   ├── Button.tsx          # Flat, hard to find things
│   ├── ProgressCircle.tsx
├── styles/
│   └── colors.ts           # Just colors, no system
├── data/
│   └── redux/
│       └── store.ts        # Mixed concerns
```

### New (Good) Structure:
```
src/
├── app/                    # App-level concerns
│   ├── App.tsx
│   └── navigation/         # All navigation together
├── screens/
│   ├── HomeScreen/         # Each screen is a folder
│   │   ├── index.tsx       # Main component
│   │   └── components/     # Screen-specific components
├── components/             # SHARED components only
│   ├── Button/
│   │   ├── index.tsx
│   │   └── QuickAddButton.tsx
├── theme/                  # Complete design system
├── store/                  # State management
├── types/                  # TypeScript types
├── utils/                  # Helper functions
```

### Why Folders for Screens?

**Before:** `HomeScreen.tsx` - one giant file
**After:** `HomeScreen/index.tsx` - can add related files

Benefits:
- Add screen-specific components without polluting shared components
- Add screen-specific hooks, utils, types
- Easy to find everything related to a screen
- Scales better as app grows

---

## 2. Theme System - Why Not Just Hardcode Colors?

### Old (Bad) Approach:
```typescript
// Scattered throughout codebase
<View style={{ backgroundColor: '#0077B6' }}>
<Text style={{ color: '#333', fontSize: 16 }}>
```

Problems:
- Change a color = find/replace everywhere
- No dark mode support
- Inconsistent values (is it #333 or #2D3436?)
- No design system

### New (Good) Approach:
```typescript
// theme/colors.ts - Single source of truth
export const lightColors = {
  primary: '#6C5CE7',
  text: '#2D3436',
  background: '#F8F9FA',
};

export const darkColors = {
  primary: '#A29BFE',
  text: '#FFFFFF',
  background: '#1A1A2E',
};

// In components - use theme hook
const theme = useTheme();
<View style={{ backgroundColor: theme.colors.background }}>
<Text style={{ color: theme.colors.text }}>
```

Benefits:
- Change color once, updates everywhere
- Dark mode works automatically
- Consistent design language
- Easy to hand off to designers

---

## 3. TypeScript - Why Strong Typing?

### Old (Bad) Approach:
```typescript
// No types, anything goes
const addWater = (amount) => {
  dispatch({ type: 'ADD', payload: amount });
};

// Runtime error: amount might be string, undefined, etc.
```

### New (Good) Approach:
```typescript
// types/index.ts - Define once, use everywhere
export interface WaterEntry {
  amount: number;  // Must be number
  time: number;    // Unix timestamp
}

// Typed function - TypeScript catches errors at compile time
const addWater = (amount: number): void => {
  dispatch(addWaterAction(amount));
};

// IDE autocomplete works, errors caught before running
```

Benefits:
- Catch bugs before running app
- IDE autocomplete and documentation
- Self-documenting code
- Easier refactoring

---

## 4. Redux Slices - Why This Pattern?

### Old (Bad) Approach:
```typescript
// Separate files for actions, reducers, types
// actions/waterActions.ts
export const ADD_WATER = 'ADD_WATER';
export const addWater = (amount) => ({ type: ADD_WATER, payload: amount });

// reducers/waterReducer.ts
switch (action.type) {
  case ADD_WATER:
    // Complex mutation logic
}
```

Problems:
- Lots of boilerplate
- Easy to make typos in action strings
- State mutations prone to bugs

### New (Good) Approach - Redux Toolkit:
```typescript
// store/slices/waterSlice.ts - Everything in one place
const waterSlice = createSlice({
  name: 'water',
  initialState,
  reducers: {
    addWater: (state, action: PayloadAction<number>) => {
      // Can "mutate" directly - Immer handles immutability
      const today = getTodayKey();
      let dayHistory = state.history.find(d => d.date === today);
      if (!dayHistory) {
        dayHistory = { date: today, entries: [] };
        state.history.push(dayHistory);
      }
      dayHistory.entries.push({
        amount: action.payload,
        time: Date.now(),
      });
    },
  },
});

// Auto-generated action creators
export const { addWater } = waterSlice.actions;
```

Benefits:
- Less boilerplate
- Type-safe action creators
- Immer allows "mutable" syntax (actually immutable under hood)
- All related logic in one file

---

## 5. Custom Components - Why Wrap Everything?

### Old (Bad) Approach:
```typescript
// Using RN components directly everywhere
<TouchableOpacity
  style={{
    backgroundColor: '#0077B6',
    padding: 16,
    borderRadius: 8
  }}
  onPress={handlePress}
>
  <Text style={{ color: 'white', fontSize: 16 }}>Add Water</Text>
</TouchableOpacity>
```

Problems:
- Repeated styling everywhere
- Inconsistent look (some buttons different)
- Hard to add animations later
- No centralized control

### New (Good) Approach:
```typescript
// components/Button/index.tsx
export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
}) => {
  const theme = useTheme();
  const scale = useSharedValue(1);

  // Bouncy animation built-in
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      onPress={onPress}
      onPressIn={() => { scale.value = withSpring(0.95); }}
      onPressOut={() => { scale.value = withSpring(1); }}
      style={[styles.button, getVariantStyles(variant), animatedStyle]}
    >
      <Typography variant="button">{title}</Typography>
    </AnimatedPressable>
  );
};

// Usage - clean and consistent
<Button title="Add Water" onPress={handleAdd} variant="primary" />
```

Benefits:
- Consistent look everywhere
- Animation logic centralized
- Change button style = updates everywhere
- Props for variants (primary, outline, danger)

---

## 6. Selectors - Why Not Access State Directly?

### Old (Bad) Approach:
```typescript
// Calculating in component every render
const HomeScreen = () => {
  const history = useSelector(state => state.water.history);
  const todayKey = new Date().toISOString().split('T')[0];
  const todayHistory = history.find(d => d.date === todayKey);
  const total = todayHistory?.entries.reduce((sum, e) => sum + e.amount, 0) || 0;
  // ... same calculation repeated in other components
};
```

Problems:
- Duplicated logic
- Recalculates every render
- Easy to make mistakes

### New (Good) Approach:
```typescript
// store/slices/waterSlice.ts - Define selectors once
export const selectTodayHistory = (state: RootState) => {
  const today = getTodayKey();
  return state.water.history.find(d => d.date === today);
};

export const selectTodayTotal = (state: RootState) => {
  const today = selectTodayHistory(state);
  return today?.entries.reduce((sum, e) => sum + e.amount, 0) || 0;
};

// Usage - clean and reusable
const todayTotal = useAppSelector(selectTodayTotal);
```

Benefits:
- DRY (Don't Repeat Yourself)
- Can add memoization (reselect) for performance
- Single source of truth for derived data
- Easy to test

---

## 7. Date Handling - Why Use a Library?

### Old (Bad) Approach:
```typescript
// Manual date formatting - error-prone
const today = new Date();
const formatted = today.toLocaleDateString('en-US', {
  weekday: 'long',
  month: 'long',
  day: 'numeric'
});

// Timezone issues, inconsistent formats
const todayKey = new Date().toISOString().split('T')[0]; // Can be wrong timezone!
```

### New (Good) Approach - date-fns:
```typescript
// utils/date.ts
import { format, startOfDay } from 'date-fns';

export const getTodayKey = (): string => {
  return format(startOfDay(new Date()), 'yyyy-MM-dd');
};

export const formatDateFull = (dateStr: string): string => {
  return format(new Date(dateStr), 'EEEE, MMMM d');
};

export const getGreeting = (): string => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning!';
  if (hour < 17) return 'Good afternoon!';
  return 'Good evening!';
};
```

Benefits:
- Handles timezones correctly
- Consistent formatting
- Well-tested library
- Easy to read

---

## 8. What Was BAD in Old Code (Specific Examples)

### 1. Turkish Comments
```typescript
// Old - Turkish comment
// Bugünün tarihini al
const todayKey = new Date().toISOString().split('T')[0];

// New - English, self-documenting
const todayKey = getTodayKey(); // Function name explains itself
```

**Why bad:** Not everyone reads Turkish. Code should be international.

### 2. Console Logs Left In
```typescript
// Old
console.log("BootSplash has been hidden successfully");

// New - removed all console.logs
// Use proper logging service in production
```

**Why bad:** Console logs slow down production app, expose internal info.

### 3. Any Types
```typescript
// Old
const handlePress = (item: any) => { ... }

// New
const handlePress = (item: WaterEntry) => { ... }
```

**Why bad:** Defeats purpose of TypeScript, no type safety.

### 4. Inline Styles Everywhere
```typescript
// Old
<View style={{ justifyContent: 'center', alignItems: 'center', height: 60, paddingTop: 30 }}>

// New
<View style={styles.iconContainer}>
// With StyleSheet.create at bottom
```

**Why bad:**
- Creates new object every render (performance)
- No autocomplete
- Hard to maintain

### 5. Size Matters Library Overuse
```typescript
// Old
import { s, vs } from 'react-native-size-matters';
<Text style={{ fontSize: s(28), marginTop: vs(20) }}>

// New - custom scaling in theme
const scale = (size: number) => (screenWidth / 375) * size;
// Use sparingly, only where needed
```

**Why bad:** Adds dependency, makes code verbose, often unnecessary.

---

## 9. Key Takeaways

1. **Folder structure matters** - Group by feature, not by type
2. **Theme everything** - Colors, spacing, typography in one place
3. **Type everything** - TypeScript catches bugs early
4. **Component abstraction** - Wrap primitives in custom components
5. **Selectors for derived state** - Don't compute in components
6. **Use libraries for complex things** - Dates, animations
7. **English everywhere** - Comments, variable names
8. **No console.logs in production** - Use proper logging
9. **StyleSheet over inline styles** - Performance and maintainability
10. **Reanimated for animations** - Native performance, clean API

---

## 10. Resources to Learn More

- [React Native Official Docs](https://reactnative.dev)
- [Redux Toolkit Docs](https://redux-toolkit.js.org)
- [React Native Reanimated](https://docs.swmansion.com/react-native-reanimated/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/)
- [date-fns Documentation](https://date-fns.org)

---

*Written for beginners by a senior developer. The best code is code that's easy to understand, maintain, and extend.*
