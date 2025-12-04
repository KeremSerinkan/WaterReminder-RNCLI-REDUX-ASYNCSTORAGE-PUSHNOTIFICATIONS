import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { colors } from '../styles/colors';
import { s, vs } from 'react-native-size-matters';
import { fonts } from '../styles/fonts';

interface Props {
  visible: boolean;
  onClose: () => void;
  onConfirm: (goal: number) => void;
  initialGoal: number;
}

export const AdjustDailyAmount: React.FC<Props> = ({ visible, onClose, onConfirm, initialGoal }) => {
  const [goalInput, setGoalInput] = useState(initialGoal.toString());

  const handleConfirm = () => {
    const newGoal = parseInt(goalInput, 10);
    if (!isNaN(newGoal) && newGoal > 0) {
      onConfirm(newGoal);
    }
    onClose();
  };

  return (
    <Modal transparent visible={visible} animationType="fade">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Set Daily Goal (ml)</Text>
          <TextInput
            value={goalInput}
            onChangeText={setGoalInput}
            keyboardType="numeric"
            style={styles.input}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity onPress={onClose}>
              <Text style={styles.cancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleConfirm}>
              <Text style={styles.confirmText}>Set</Text>
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
  modalTitle: {fontFamily: fonts.bold, fontSize: s(18), fontWeight: 'bold', marginBottom: s(10) },
  input: {fontFamily: fonts.medium, borderWidth: 1, borderColor: '#aaa', borderRadius: s(8), padding: s(10), marginBottom: s(20) },
  modalButtons: { flexDirection: 'row', justifyContent: 'space-between' },
  cancelText: { fontFamily: fonts.medium, fontSize: s(16), color: 'red' },
  confirmText: { fontFamily: fonts.medium, fontSize: s(16), color: 'blue' }
});
