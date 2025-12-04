// screens/SettingsScreen.tsx
import React, { useEffect } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import { RootState } from '../data/redux/store';
import { setEnabled, setIntervalMinutes } from '../data/redux/slices/notificationSlice';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notification);

  
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Hatırlatma Ayarları</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Bildirim Aç/Kapa</Text>
        <Switch
          value={notification.enabled}
          onValueChange={(v) => {
            dispatch(setEnabled(v));
          }}
        />

      </View>

      {notification.enabled && (
        <View style={styles.pickerContainer}>
          <Text style={styles.label}>Hatırlatma Aralığı</Text>
          <Picker
            selectedValue={notification.intervalMinutes}
            onValueChange={(v) => dispatch(setIntervalMinutes(v))}
          >
            <Picker.Item label="1 dakika" value={1} />
            <Picker.Item label="30 dakika" value={30} />
            <Picker.Item label="1 saat" value={60} />
            <Picker.Item label="2 saat" value={120} />
          </Picker>
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 20 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  label: { fontSize: 18 },
  pickerContainer: { marginTop: 20 },
});
