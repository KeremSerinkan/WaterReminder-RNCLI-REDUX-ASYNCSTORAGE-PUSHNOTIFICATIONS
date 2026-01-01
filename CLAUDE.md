# Water Reminder App

React Native CLI app for tracking daily water intake with push notification reminders.

## Current Status (Jan 1, 2026)

**Branch:** `rebuild/v2` (pushed to origin)
**Status:** v2 rebuild COMPLETE and working

### What Was Done:
1. Complete UI rebuild with playful theme (bright colors, bouncy animations)
2. Dark mode support with system toggle
3. New folder-based architecture
4. Custom animated components (ProgressRing, QuickAddButton with icons)
5. Theme system with light/dark palettes
6. Firebase Functions optimization (5-min scheduler, 80% cost reduction)
7. Time-based diverse notification messages
8. Fixed missing `react-native-worklets` dependency for Reanimated v4

### Remaining Tasks:
- Run ESLint and fix any issues
- Test on physical devices
- Merge `rebuild/v2` into `main` when ready

---

## Tech Stack

- **React Native CLI** (not Expo)
- **TypeScript** for type safety
- **Redux Toolkit** + Redux Persist + AsyncStorage for state management
- **React Native Reanimated v4** for animations
- **React Native SVG** for custom icons and progress ring
- **React Native Worklets** (required by Reanimated v4)
- **date-fns** for date handling
- **Firebase Cloud Messaging** for push notifications
- **Firestore** for device settings sync
- **Firebase Cloud Functions** for scheduled reminders

## Architecture (v2)

```
src/
├── app/                    # App entry, navigation, providers
│   ├── App.tsx             # Root component with providers
│   └── navigation/
│       ├── RootNavigator.tsx   # Bottom tab navigator
│       ├── HistoryStack.tsx    # History stack navigator
│       └── types.ts            # Navigation type definitions
├── screens/
│   ├── HomeScreen/         # Main water tracking screen
│   ├── HistoryScreen/      # Daily intake history grid
│   ├── SettingsScreen/     # Notifications & theme settings
│   └── DayDetailScreen/    # Individual day entry details
├── components/             # Shared components
│   ├── Button/             # Animated button + QuickAddButton
│   ├── Card/               # Card, SectionCard, ListItem
│   ├── Modal/              # Modal, ConfirmModal, InputModal
│   ├── ProgressRing/       # Custom animated progress ring
│   └── Typography/         # Text component with variants
├── theme/
│   ├── colors.ts           # Light/dark palettes
│   ├── spacing.ts          # Responsive scaling functions
│   ├── typography.ts       # Font sizes and styles
│   ├── shadows.ts          # Shadow presets
│   └── index.ts            # ThemeProvider & useTheme hook
├── store/
│   ├── index.ts            # Redux store configuration
│   └── slices/
│       ├── waterSlice.ts   # Water entries & daily goal
│       └── settingsSlice.ts # Theme mode & notification settings
├── services/
│   └── notifications/
│       └── useNotifications.ts  # FCM permissions & Firestore sync
├── utils/
│   └── date.ts             # Date formatting helpers
├── types/
│   └── index.ts            # Shared TypeScript types
└── assets/
    └── icons/
        └── WaterIcons.tsx  # SVG icons (glass, bottle, jug, tab icons)
```

## Key Patterns

### Theme System
- `useTheme()` hook for accessing current theme
- Supports light, dark, and system preference modes
- Theme stored in Redux (`settingsSlice.themeMode`) and persisted
- Colors defined in `src/theme/colors.ts`

### Animations
- All animations use `react-native-reanimated`
- Spring animations for bouncy button presses
- Progress ring with smooth fill animation
- Staggered list animations (FadeInUp with delay)

### State Management
- `waterSlice`: Water entries by date, daily goal, selectors for today's data
- `settingsSlice`: Theme mode, notification settings (enabled, interval)
- Data persisted via AsyncStorage with redux-persist

### Navigation
- Bottom tabs: History, Home (center), Settings
- History stack: HistoryScreen -> DayDetailScreen
- Custom tab bar icons from WaterIcons.tsx

## Commands

```bash
# Install dependencies
yarn install

# Install iOS pods
cd ios && pod install && cd ..

# Run iOS
yarn ios

# Run Android
yarn android

# Check TypeScript errors
npx tsc --noEmit

# Deploy Firebase Functions
cd functions && npm run deploy
```

## Firebase Functions

Located in `functions/src/index.ts`:
- Scheduled every 5 minutes (cost-optimized from 1 minute)
- Queries only enabled devices (`where("enabled", "==", true)`)
- Time-based notification messages (morning, afternoon, evening, general)
- Auto-cleanup of invalid FCM tokens on send failure

## Screens Overview

### HomeScreen (`src/screens/HomeScreen/index.tsx`)
- Animated greeting based on time of day ("Good morning!", etc.)
- Tappable progress ring to set daily goal (InputModal)
- Quick add buttons with icons:
  - 250ml: Glass icon
  - 500ml: Bottle icon
  - 750ml: Jug icon
- Custom amount button (opens InputModal)
- Today's activity list (last 5 entries)
- Undo button (removes last entry)

### HistoryScreen (`src/screens/HistoryScreen/index.tsx`)
- 2-column grid of day cards (FlatList)
- Color-coded by goal completion (green/blue/red)
- Staggered entrance animation
- Tap card -> DayDetailScreen

### SettingsScreen (`src/screens/SettingsScreen/index.tsx`)
- Notification toggle switch
- Interval picker (30min to 4hrs)
- Theme selector (System/Light/Dark)
- App version info

### DayDetailScreen (`src/screens/DayDetailScreen/index.tsx`)
- Header with date and totals
- List of all entries with times
- Delete button for each entry
- Back navigation

## Color Palette

### Light Mode
- Primary: `#6C5CE7` (vibrant purple)
- Secondary: `#00CEC9` (teal)
- Water: `#0984E3` (blue)
- Success: `#00B894` (mint green)
- Background: `#F8F9FA`

### Dark Mode
- Primary: `#A29BFE` (soft purple)
- Secondary: `#81ECEC` (light teal)
- Background: `#1A1A2E` (deep navy)
- Surface: `#16213E`

## Important Notes

1. **Entry Point:** `index.js` imports from `./src/app/App` (not root App.tsx)
2. **Old files deleted:** `App.tsx`, `src/screens/HomeScreen.tsx`, etc. are removed
3. **Reanimated v4 requires:** `react-native-worklets` package
4. **Pods must be installed** after adding new native dependencies
