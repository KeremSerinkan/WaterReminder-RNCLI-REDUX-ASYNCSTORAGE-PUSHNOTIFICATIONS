# Water Reminder App

React Native CLI app for tracking daily water intake with push notification reminders.

## Tech Stack

- **React Native CLI** (not Expo)
- **TypeScript** for type safety
- **Redux Toolkit** + Redux Persist + AsyncStorage for state management
- **React Native Reanimated** for animations
- **React Native SVG** for custom icons and progress ring
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
        └── WaterIcons.tsx  # SVG icons (glass, bottle, jug, etc.)
```

## Key Patterns

### Theme System
- `useTheme()` hook for accessing current theme
- Supports light, dark, and system preference modes
- Theme stored in Redux and persisted

### Animations
- All animations use `react-native-reanimated`
- Spring animations for bouncy button presses
- Progress ring with smooth fill animation
- Staggered list animations

### State Management
- `waterSlice`: Water entries by date, daily goal
- `settingsSlice`: Theme mode, notification settings
- Data persisted via AsyncStorage

### Navigation
- Bottom tabs: Home, History, Settings
- History stack: HistoryScreen -> DayDetailScreen

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

# Deploy Firebase Functions
cd functions && npm run deploy
```

## Firebase Functions

Located in `functions/src/index.ts`:
- Scheduled every 5 minutes (cost-optimized)
- Queries only enabled devices
- Time-based notification messages (morning, afternoon, evening)
- Auto-cleanup of invalid FCM tokens

## Screens Overview

### HomeScreen
- Animated greeting based on time of day
- Tappable progress ring to set daily goal
- Quick add buttons with icons (250ml glass, 500ml bottle, 750ml jug)
- Custom amount modal
- Today's entries list with undo functionality

### HistoryScreen
- 2-column grid of day cards
- Color-coded by goal completion
- Tap to view day details

### SettingsScreen
- Notification toggle & interval picker
- Theme selector (System/Light/Dark)
- App version info

### DayDetailScreen
- Header with date and totals
- List of all entries with times
- Swipe to delete entries

## Rebuild Status

The v2 rebuild is complete with all major features implemented:
- Theme system with dark mode
- Custom animated components (ProgressRing, QuickAddButton)
- All 4 screens rebuilt with playful UI
- Firebase Functions optimized for cost reduction
- Type-safe codebase with proper navigation typing

Remaining items:
- Run ESLint and fix any issues
- Test on physical devices
