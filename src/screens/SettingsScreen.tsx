import React, { useState } from 'react';
import { View, Text, Switch, StyleSheet, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../data/redux/store';
import { setEnabled, setIntervalMinutes } from '../data/redux/slices/notificationSlice';
import { colors } from '../styles/colors';
import { AdjustIntervalModal } from '../components/AdjustIntervalModal';
import { s } from 'react-native-size-matters';

export default function SettingsScreen() {
  const dispatch = useDispatch();
  const notification = useSelector((state: RootState) => state.notification);

  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Notifications</Text>
        <Switch
          value={notification.enabled}
          onValueChange={(v) => { dispatch(setEnabled(v)); }}
        />
      </View>

      {notification.enabled && (
        <View style={styles.row}>
          <Text style={styles.label}>Reminder Interval</Text>
          <TouchableOpacity onPress={() => setModalVisible(true)}>
            <Text style={styles.intervalText}>{notification.intervalMinutes} minutes</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* Modal */}
      <AdjustIntervalModal
        visible={modalVisible}
        initialInterval={notification.intervalMinutes}
        onConfirm={(interval) => dispatch(setIntervalMinutes(interval))}
        onClose={() => setModalVisible(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: s(18), backgroundColor: colors.appBG },
  title: { fontSize: s(26), fontWeight: 'bold', marginBottom: s(20) },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: s(18) },
  label: { fontSize: s(18) },
  intervalText: { fontSize: s(16), color: colors.waterColor },
});
