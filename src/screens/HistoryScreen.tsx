import React, { useMemo } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../styles/colors';
import { s, vs } from 'react-native-size-matters';
import { useSelector } from 'react-redux';
import { RootState } from '../data/redux/store';
import { fonts } from '../styles/fonts';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { HistoryStackParamList } from './HistoryStackNavigator';

const { width } = Dimensions.get('window');
const numColumns = 2;
const cardSize = (width - s(60)) / numColumns;

interface DayData {
  date: string;
  displayDate: string;
  total: number;
}

const getCardColor = (total: number, goal: number) => {
  const progress = Math.min((total / goal) * 100, 100);
  if (progress <= 70) return "#FF4C4C";
  if (progress < 100) return colors.waterColor;
  return "#4CAF50";
};

export default function HistoryScreen() {
  const navigation = useNavigation<NativeStackNavigationProp<HistoryStackParamList, 'HistoryMain'>>();
  const dailyGoal = useSelector((state: RootState) => state.water.dailyGoal);
  const history = useSelector((state: RootState) => state.water.history);

  // history'den DayData array'i oluştur, undefined entries güvenli
  const historyData: DayData[] = useMemo(() => {
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD

    // mevcut history map
    let data = history
      .map((d, index) => ({
        date: d.date,
        displayDate: new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
        total: d.entries?.reduce((a, b) => a + (b.amount || 0), 0) || 0,
      }))
      .sort((a, b) => (a.date < b.date ? 1 : -1)); // en güncel gün başta

    // eğer bugünün tarihi yoksa ekle
    if (!data.find(d => d.date.startsWith(today))) {
      data.unshift({
        date: today,
        displayDate: new Date(today).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' }),
        total: 0,
      });
    }

    return data;
  }, [history]);

  // FlatList keyExtractor


  const renderItem = ({ item }: { item: DayData }) => {
    const bgColor = getCardColor(item.total, dailyGoal);
    return (
      <TouchableOpacity
        style={[styles.card, { backgroundColor: bgColor }]}
        onPress={() => navigation.navigate('DayDetail', { day: item })}
      >
        <Text style={styles.dateText}>{item.displayDate}</Text>
        <Text style={styles.totalText}>{item.total} ml</Text>
        <Text style={styles.goalText}>/ {dailyGoal} ml</Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['left', 'right']}>
      <FlatList
        data={historyData}
        renderItem={renderItem}
        keyExtractor={(item, index) => `${item.date}_${index}`}
        numColumns={numColumns}
        contentContainerStyle={{ paddingHorizontal: s(20), paddingTop: vs(50), paddingBottom: vs(10) }}
        columnWrapperStyle={{ justifyContent: 'space-between', marginBottom: vs(15) }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: colors.appBG },
  card: {
    width: cardSize,
    height: cardSize,
    borderRadius: s(12),
    justifyContent: 'center',
    alignItems: 'center',
    padding: s(10),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  dateText: { fontFamily: fonts.bold, fontSize: s(16), marginBottom: vs(5), color: '#fff' },
  totalText: { fontFamily: fonts.bold, fontSize: s(18), color: '#fff' },
  goalText: { fontFamily: fonts.regular, fontSize: s(14), color: '#fff', marginTop: vs(3) },
});
