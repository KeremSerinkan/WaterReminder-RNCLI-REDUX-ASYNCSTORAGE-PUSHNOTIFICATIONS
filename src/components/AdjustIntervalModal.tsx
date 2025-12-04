import React, { useState, useEffect } from 'react';
import { Modal, View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { s } from 'react-native-size-matters';
import { fonts } from '../styles/fonts';
import { colors } from '../styles/colors';
import { notificationIntervals } from '../data/notificationIntervals';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (interval: number) => void;
  initialInterval: number;
}

export const AdjustIntervalModal: React.FC<Props> = ({ visible, onClose, onConfirm, initialInterval }) => {
  const [selectedInterval, setSelectedInterval] = useState(initialInterval);

  useEffect(() => {
    setSelectedInterval(initialInterval);
  }, [initialInterval]);

  const handleConfirm = () => {
    onConfirm(selectedInterval);
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Hatırlatma Aralığı</Text>

          {/* Picker */}
          {Platform.OS === 'ios' ? (
            <Picker
              selectedValue={selectedInterval}
              onValueChange={(value) => setSelectedInterval(value)}
              style={{ marginBottom: s(20) }}
            >
              {notificationIntervals.map((item) => (
                <Picker.Item key={item.value} label={item.label} value={item.value} />
              ))}
            </Picker>
          ) : (
            <View style={{ borderWidth: 1, borderColor: '#aaa', borderRadius: s(8), marginBottom: s(20) }}>
              <Picker
                selectedValue={selectedInterval}
                onValueChange={(value) => setSelectedInterval(value)}
              >
                {notificationIntervals.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
          )}

          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>İptal</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>Ayarla</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '80%', padding: s(20), backgroundColor: 'white', borderRadius: s(12) },
  modalTitle: { fontFamily: fonts.bold, fontSize: s(18), fontWeight: 'bold', marginBottom: s(10) },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelText: { fontFamily: fonts.medium, fontSize: s(16), color: 'red' },
  confirmText: { fontFamily: fonts.medium, fontSize: s(16), color: colors.waterColor },
});
