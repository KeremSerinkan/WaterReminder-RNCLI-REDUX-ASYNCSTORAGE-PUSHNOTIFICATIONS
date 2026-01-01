import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';

import { useTheme } from '../../theme';
import { useAppSelector, useAppDispatch } from '../../store';
import {
  addWater,
  removeLastEntry,
  setDailyGoal,
  selectDailyGoal,
  selectTodayTotal,
  selectTodayProgress,
  selectTodayHistory,
  selectLastEntry,
} from '../../store/slices/waterSlice';

import { Typography, Heading1 } from '../../components/Typography';
import { ProgressRing } from '../../components/ProgressRing';
import { QuickAddButton, CustomAddButton, UndoButton } from '../../components/Button/QuickAddButton';
import { InputModal } from '../../components/Modal';
import { Card } from '../../components/Card';

import { getGreeting, formatTime, formatDateFull, getTodayKey } from '../../utils/date';
import { QUICK_ADD_PRESETS, WaterEntry } from '../../types';

const HomeScreen: React.FC = () => {
  const theme = useTheme();
  const dispatch = useAppDispatch();

  // Redux state
  const dailyGoal = useAppSelector(selectDailyGoal);
  const todayTotal = useAppSelector(selectTodayTotal);
  const progress = useAppSelector(selectTodayProgress);
  const todayHistory = useAppSelector(selectTodayHistory);
  const lastEntry = useAppSelector(selectLastEntry);

  // Local state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [showCustomModal, setShowCustomModal] = useState(false);
  const [undoFeedback, setUndoFeedback] = useState<number | null>(null);

  // Get today's entries (last 5)
  const recentEntries = useMemo(() => {
    if (!todayHistory) return [];
    return [...todayHistory.entries].reverse().slice(0, 5);
  }, [todayHistory]);

  // Handlers
  const handleAddWater = (amount: number) => {
    dispatch(addWater(amount));
  };

  const handleUndo = () => {
    if (lastEntry) {
      setUndoFeedback(lastEntry.amount);
      dispatch(removeLastEntry());
      // Clear feedback after animation
      setTimeout(() => setUndoFeedback(null), 1500);
    }
  };

  const handleSetGoal = (value: string) => {
    const goal = parseInt(value, 10);
    if (!isNaN(goal) && goal >= 500 && goal <= 10000) {
      dispatch(setDailyGoal(goal));
    }
  };

  const handleCustomAdd = (value: string) => {
    const amount = parseInt(value, 10);
    if (!isNaN(amount) && amount > 0 && amount <= 5000) {
      dispatch(addWater(amount));
    }
  };

  const renderEntry = ({ item, index }: { item: WaterEntry; index: number }) => (
    <Animated.View
      entering={FadeIn.delay(index * 50)}
      style={[
        styles.entryItem,
        { backgroundColor: theme.colors.backgroundSecondary },
      ]}
    >
      <Typography variant="labelMedium" color={theme.colors.textSecondary}>
        {formatTime(item.time)}
      </Typography>
      <Typography variant="labelLarge" color={theme.colors.primary}>
        +{item.amount}ml
      </Typography>
    </Animated.View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Typography variant="displaySmall" color={theme.colors.primary}>
            {getGreeting()}
          </Typography>
          <Typography variant="bodyMedium" color={theme.colors.textSecondary}>
            {formatDateFull(getTodayKey())}
          </Typography>
        </View>

        {/* Progress Ring */}
        <View style={styles.progressContainer}>
          <ProgressRing
            progress={progress}
            current={todayTotal}
            goal={dailyGoal}
            size={theme.layout.progressRingSize}
            onPress={() => setShowGoalModal(true)}
            showUndoFeedback={undoFeedback}
          />
          <Typography
            variant="caption"
            color={theme.colors.textTertiary}
            style={styles.tapHint}
          >
            Tap to adjust goal
          </Typography>
        </View>

        {/* Quick Add Buttons */}
        <View style={styles.quickAddContainer}>
          <Typography
            variant="labelMedium"
            color={theme.colors.textSecondary}
            style={styles.sectionLabel}
          >
            Quick Add
          </Typography>
          <View style={styles.quickAddButtons}>
            {QUICK_ADD_PRESETS.map((preset) => (
              <QuickAddButton
                key={preset.amount}
                amount={preset.amount}
                icon={preset.icon}
                onPress={() => handleAddWater(preset.amount)}
              />
            ))}
          </View>
          <CustomAddButton onPress={() => setShowCustomModal(true)} />
        </View>

        {/* Today's Entries */}
        {recentEntries.length > 0 && (
          <Card style={styles.entriesCard} padding="md">
            <Typography
              variant="labelMedium"
              color={theme.colors.textSecondary}
              style={styles.entriesTitle}
            >
              Today's Activity
            </Typography>
            <FlatList
              data={recentEntries}
              renderItem={renderEntry}
              keyExtractor={(item, index) => `${item.time}-${index}`}
              scrollEnabled={false}
              ItemSeparatorComponent={() => <View style={styles.entrySeparator} />}
            />
          </Card>
        )}

        {/* Undo Button */}
        <View style={styles.undoContainer}>
          <UndoButton
            onPress={handleUndo}
            disabled={!lastEntry}
          />
        </View>
      </ScrollView>

      {/* Goal Modal */}
      <InputModal
        visible={showGoalModal}
        onClose={() => setShowGoalModal(false)}
        onSubmit={handleSetGoal}
        title="Set Daily Goal"
        placeholder="Enter goal in ml (500-10000)"
        keyboardType="numeric"
        submitText="Save"
        initialValue={dailyGoal.toString()}
      />

      {/* Custom Amount Modal */}
      <InputModal
        visible={showCustomModal}
        onClose={() => setShowCustomModal(false)}
        onSubmit={handleCustomAdd}
        title="Add Custom Amount"
        placeholder="Enter amount in ml"
        keyboardType="numeric"
        submitText="Add"
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  header: {
    marginTop: 20,
    marginBottom: 32,
  },
  progressContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  tapHint: {
    marginTop: 12,
  },
  quickAddContainer: {
    marginBottom: 32,
  },
  sectionLabel: {
    marginBottom: 16,
  },
  quickAddButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  entriesCard: {
    marginBottom: 24,
  },
  entriesTitle: {
    marginBottom: 12,
  },
  entryItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  entrySeparator: {
    height: 8,
  },
  undoContainer: {
    alignItems: 'center',
  },
});

export default HomeScreen;
