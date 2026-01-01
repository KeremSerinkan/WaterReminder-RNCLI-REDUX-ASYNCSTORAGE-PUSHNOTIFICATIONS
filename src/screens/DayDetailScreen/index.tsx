import React from 'react';
import { View, FlatList, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import Animated, { FadeInRight } from 'react-native-reanimated';

import { useTheme } from '../../theme';
import { useAppDispatch } from '../../store';
import { removeEntry } from '../../store/slices/waterSlice';

import { Typography } from '../../components/Typography';
import { Card } from '../../components/Card';
import { MiniProgress } from '../../components/ProgressRing';

import { formatDateFull, formatTime, getRelativeDateLabel } from '../../utils/date';
import { WaterEntry } from '../../types';
import { HistoryStackParamList } from '../../app/navigation/types';

type RouteProps = RouteProp<HistoryStackParamList, 'DayDetail'>;

const DayDetailScreen: React.FC = () => {
  const theme = useTheme();
  const navigation = useNavigation();
  const route = useRoute<RouteProps>();
  const dispatch = useAppDispatch();

  const { day } = route.params;

  const handleDeleteEntry = (entryIndex: number) => {
    dispatch(removeEntry({ date: day.date, entryIndex }));
    // If no entries left, go back
    if (day.entries.length <= 1) {
      navigation.goBack();
    }
  };

  const getProgressColor = (): string => {
    if (day.percentage >= 100) return theme.colors.success;
    if (day.percentage >= 70) return theme.colors.water;
    return theme.colors.danger;
  };

  const progressColor = getProgressColor();

  const renderEntry = ({ item, index }: { item: WaterEntry; index: number }) => {
    // Calculate index from original order (entries are stored oldest first)
    const originalIndex = day.entries.length - 1 - index;

    return (
      <Animated.View entering={FadeInRight.delay(index * 50).springify()}>
        <Card
          style={styles.entryCard}
          variant="default"
          padding="md"
        >
          <View style={styles.entryContent}>
            <View style={styles.entryInfo}>
              <Typography variant="h3" color={theme.colors.primary}>
                +{item.amount}ml
              </Typography>
              <Typography variant="bodyMedium" color={theme.colors.textSecondary}>
                {formatTime(item.time)}
              </Typography>
            </View>
            <Pressable
              onPress={() => handleDeleteEntry(originalIndex)}
              style={[
                styles.deleteButton,
                { backgroundColor: `${theme.colors.danger}15` },
              ]}
            >
              <Typography variant="labelSmall" color={theme.colors.danger}>
                Delete
              </Typography>
            </Pressable>
          </View>
        </Card>
      </Animated.View>
    );
  };

  // Reverse entries to show most recent first
  const reversedEntries = [...day.entries].reverse();

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.colors.background }]}
      edges={['top']}
    >
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={() => navigation.goBack()} style={styles.backButton}>
          <Typography variant="h2" color={theme.colors.primary}>
            ←
          </Typography>
        </Pressable>
        <View style={styles.headerContent}>
          <Typography variant="caption" color={theme.colors.textTertiary}>
            {getRelativeDateLabel(day.date)}
          </Typography>
          <Typography variant="h1" color={theme.colors.text}>
            {formatDateFull(day.date)}
          </Typography>
        </View>
      </View>

      {/* Summary Card */}
      <Card style={styles.summaryCard} variant="elevated" padding="lg">
        <View style={styles.summaryContent}>
          <View style={styles.summaryLeft}>
            <Typography variant="caption" color={theme.colors.textTertiary}>
              Total Intake
            </Typography>
            <Typography variant="numericLarge" color={progressColor}>
              {day.total}
            </Typography>
            <Typography variant="bodyMedium" color={theme.colors.textSecondary}>
              of {day.goal} ml goal
            </Typography>
          </View>
          <View style={styles.summaryRight}>
            <MiniProgress progress={day.percentage} size={80} />
            <View
              style={[
                styles.percentageBadge,
                { backgroundColor: `${progressColor}20` },
              ]}
            >
              <Typography variant="labelMedium" color={progressColor}>
                {Math.round(day.percentage)}%
              </Typography>
            </View>
          </View>
        </View>
      </Card>

      {/* Entries List */}
      <View style={styles.entriesSection}>
        <Typography
          variant="labelMedium"
          color={theme.colors.textSecondary}
          style={styles.sectionTitle}
        >
          {day.entries.length} {day.entries.length === 1 ? 'ENTRY' : 'ENTRIES'}
        </Typography>

        <FlatList
          data={reversedEntries}
          renderItem={renderEntry}
          keyExtractor={(item, index) => `${item.time}-${index}`}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 8,
    marginLeft: -8,
  },
  headerContent: {
    flex: 1,
  },
  summaryCard: {
    marginHorizontal: 20,
    marginBottom: 24,
  },
  summaryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  summaryLeft: {
    flex: 1,
  },
  summaryRight: {
    alignItems: 'center',
  },
  percentageBadge: {
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 12,
    marginTop: 8,
  },
  entriesSection: {
    flex: 1,
    paddingHorizontal: 20,
  },
  sectionTitle: {
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 100,
  },
  entryCard: {
    marginBottom: 0,
  },
  entryContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  entryInfo: {
    flex: 1,
  },
  deleteButton: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
  },
  separator: {
    height: 10,
  },
});

export default DayDetailScreen;
