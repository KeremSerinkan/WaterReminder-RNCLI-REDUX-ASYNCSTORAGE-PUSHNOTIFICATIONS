import React, { useMemo } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { s, vs } from 'react-native-size-matters';
import { fonts } from '../styles/fonts';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { HistoryStackParamList } from './HistoryStackNavigator';
import { useSelector } from 'react-redux';
import { RootState } from '../data/redux/store';

interface DayData {
  date: string;
  entries: { amount: number; time: string }[];
}

type RouteParams = {
  DayDetail: { day: DayData };
};

export default function DayDetailScreen() {
  const route = useRoute<RouteProp<RouteParams, 'DayDetail'>>();
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList, 'DayDetail'>>();
  const { day } = route.params;

  const dailyGoal = useSelector((state: RootState) => state.water.dailyGoal);
  const history = useSelector((state: RootState) => state.water.history);

  // Gün verisini güvenli şekilde çek
  const dayHistory = history.find((d) => d.date === day.date) || { entries: [] };

  const entriesWithTime = useMemo(() => {
    return dayHistory.entries.map((entry) => {
      // eğer time yoksa current time ekle
      const time = entry.time || new Date().toISOString();
      return { amount: entry.amount, time };
    });
  }, [dayHistory]);

  const total = useMemo(() => {
    return entriesWithTime.reduce((a, b) => a + (b.amount || 0), 0);
  }, [entriesWithTime]);

  const formattedDate = useMemo(() => {
    const d = new Date(day.date);
    return d.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
  }, [day.date]);

  return (
    <SafeAreaView style={styles.container} edges={['left','right']}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{formattedDate}</Text>
      <Text style={styles.totalText}>{total} ml</Text>
      <Text style={styles.goalText}>/ {dailyGoal} ml</Text>

      <FlatList
        data={entriesWithTime}
        keyExtractor={(_, index) => index.toString()}
        contentContainerStyle={{ padding: s(20) }}
        renderItem={({ item }) => (
          <View style={styles.entryCard}>
            <Text style={styles.entryTime}>{item.time.split('T')[1]?.slice(0,5) || '00:00'}</Text>
            <Text style={styles.entryAmount}>{item.amount} ml</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBG },
  backButton: { marginTop: vs(50), marginLeft: s(15) },
  backText: { fontFamily: fonts.bold, fontSize: s(16), color: colors.buttonBG },
  title: { fontFamily: fonts.bold, fontSize: s(22), marginTop: vs(10), textAlign: 'center', color: colors.waterColor },
  totalText: { fontFamily: fonts.bold, fontSize: s(18), textAlign: 'center', marginVertical: vs(5), color: colors.buttonBG },
  goalText: { fontFamily: fonts.regular, fontSize: s(14), textAlign: 'center', marginBottom: vs(10), color: colors.buttonBG },
  entryCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: s(15),
    backgroundColor: colors.waterBG,
    borderRadius: s(12),
    marginBottom: vs(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  entryTime: { fontFamily: fonts.bold, fontSize: s(16), color: colors.buttonBG },
  entryAmount: { fontFamily: fonts.bold, fontSize: s(16), color: colors.waterColor },
});
