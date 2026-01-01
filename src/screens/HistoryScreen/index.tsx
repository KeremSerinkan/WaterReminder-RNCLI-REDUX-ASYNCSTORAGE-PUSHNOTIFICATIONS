import React, { useMemo } from 'react';
import { View, FlatList, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import Animated, { FadeInUp } from 'react-native-reanimated';

import { useTheme } from '../../theme';
import { useAppSelector } from '../../store';
import { selectHistory, selectDailyGoal } from '../../store/slices/waterSlice';

import { Typography, Heading1 } from '../../components/Typography';
import { Card } from '../../components/Card';
import { MiniProgress } from '../../components/ProgressRing';

import { formatDateShort, getRelativeDateLabel } from '../../utils/date';
import { DayData, DayHistory } from '../../types';
import { HistoryStackParamList } from '../../app/navigation/types';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_GAP = 12;
const CARD_WIDTH = (SCREEN_WIDTH - 40 - CARD_GAP) / 2;

type NavigationProp = NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>;

const HistoryScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation<NavigationProp>();

  const history = useAppSelector(selectHistory);
  const dailyGoal = useAppSelector(selectDailyGoal);

  // Transform history to DayData and sort by date (most recent first)
  const historyData = useMemo((): DayData[] => {
    return [...history]
      .map((day: DayHistory) => {
        const total = day.entries.reduce((sum, entry) => sum + entry.amount, 0);
        return {
          date: day.date,
          total,
          goal: dailyGoal,
          percentage: (total / dailyGoal) * 100,
          entries: day.entries,
        };
      })
      .sort((a, b) => b.date.localeCompare(a.date));
  }, [history, dailyGoal]);

  const handleDayPress = (day: DayData) => {
    navigation.navigate('DayDetail', { day });
  };

  const getProgressColor = (percentage: number): string => {
    if (percentage >= 100) return theme.colors.success;
    if (percentage >= 70) return theme.colors.water;
    return theme.colors.danger;
  };

  const renderDayCard = ({ item, index }: { item: DayData; index: number }) => {
    const progressColor = getProgressColor(item.percentage);

    return (
      <Animated.View
        entering={FadeInUp.delay(index * 50).springify()}
        style={styles.cardWrapper}
      >
        <Card
          onPress={() => handleDayPress(item)}
          variant="elevated"
          style={[
            styles.dayCard,
            { borderLeftColor: progressColor, borderLeftWidth: 4 },
          ]}
        >
          <View style={styles.cardHeader}>
            <View>
              <Typography variant="labelSmall" color={theme.colors.textTertiary}>
                {getRelativeDateLabel(item.date)}
              </Typography>
              <Typography variant="h3" color={theme.colors.text}>
                {formatDateShort(item.date)}
              </Typography>
            </View>
            <MiniProgress progress={item.percentage} size={44} />
          </View>

          <View style={styles.cardStats}>
            <View>
              <Typography variant="numericSmall" color={progressColor}>
                {item.total}
              </Typography>
              <Typography variant="caption" color={theme.colors.textTertiary}>
                / {item.goal} ml
              </Typography>
            </View>
            <View
              style={[
                styles.percentageBadge,
                { backgroundColor: `${progressColor}20` },
              ]}
            >
              <Typography variant="labelSmall" color={progressColor}>
                {Math.round(item.percentage)}%
              </Typography>
            </View>
          </View>
        </Card>
      </Animated.View>
    );
  };

  const renderEmptyState = () => (
    <View style={styles.emptyState}>
      <Typography variant="displaySmall" color={theme.colors.textTertiary}>
        💧
      </Typography>
      <Typography
        variant="h2"
        color={theme.colors.textSecondary}
        style={styles.emptyTitle}
      >
        No History Yet
      </Typography>
      <Typography
        variant="bodyMedium"
        color={theme.colors.textTertiary}
        align="center"
      >
        Start tracking your water intake{'\n'}and your history will appear here
      </Typography>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      <View style={styles.header}>
        <Typography variant="displaySmall" color={theme.colors.text}>
          History
        </Typography>
        <Typography variant="bodyMedium" color={theme.colors.textSecondary}>
          {historyData.length} {historyData.length === 1 ? 'day' : 'days'} tracked
        </Typography>
      </View>

      <FlatList
        data={historyData}
        renderItem={renderDayCard}
        keyExtractor={(item) => item.date}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderEmptyState}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  row: {
    justifyContent: 'space-between',
    marginBottom: CARD_GAP,
  },
  cardWrapper: {
    width: CARD_WIDTH,
  },
  dayCard: {
    padding: 14,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  percentageBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    marginTop: 16,
    marginBottom: 8,
  },
});

export default HistoryScreen;
