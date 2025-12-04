import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function HistoryScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Haftalık İstatistik</Text>
      <Text>📅 Pazartesi: 1800 ml</Text>
      <Text>📅 Salı: 2000 ml</Text>
      <Text>📅 Çarşamba: 1500 ml</Text>
      <Text>📅 Perşembe: 2100 ml</Text>
      <Text>📅 Cuma: 1700 ml</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
});
