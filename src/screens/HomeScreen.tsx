import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';


import { SafeAreaView } from 'react-native-safe-area-context';
import { s, vs } from 'react-native-size-matters';
import { colors } from '../styles/colors';

import ProgressCircle from '../components/ProgressCircle';
import AddLiquidButton from '../components/AddLiquidButton';
import { CustomLiquidButton } from '../components/CustomLiquidButton';
import { AdjustDailyAmount } from '../components/AdjustDailyAmount';

import { WaterBottleIcon } from '../assets/icons/waterBottle';
import { WaterGlassIcon } from '../assets/icons/waterGlass';
import { UndoIcon } from '../assets/icons/undo';
import Spacer from '../common/Spacer';
import { RootState } from '../data/redux/store';
import { addWater, setDailyGoal, undo } from '../data/redux/slices/waterSlice';
import { fonts } from '../styles/fonts';

export default function HomeScreen() {
  const dispatch = useDispatch();


  const dailyGoal = useSelector((state: RootState) => state.water.dailyGoal);
  const history = useSelector((state: RootState) => state.water.history);
  const todayKey = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  const todayHistory = history.find((d) => d.date === todayKey);
  const water = todayHistory?.entries.reduce((sum, e) => sum + e.amount, 0) || 0;
  const [goalModalVisible, setGoalModalVisible] = useState(false);

  const [undoFlash, setUndoFlash] = useState<number | null>(null);
  const [addFlash, setAddFlash] = useState<number | null>(null);

  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric'
  });

  const progress = (water / dailyGoal) * 100;



  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.title}>{formattedDate}</Text>

      <Spacer height={vs(20)} />

      <TouchableOpacity onPress={() => setGoalModalVisible(true)}>
        <ProgressCircle progress={progress} dailyGoal={dailyGoal} water={water} undoFlash={undoFlash} />
      </TouchableOpacity>

      <AdjustDailyAmount
        visible={goalModalVisible}
        onClose={() => setGoalModalVisible(false)}
        initialGoal={dailyGoal}
        onConfirm={(goal) => dispatch(setDailyGoal(goal))}
      />

      <Spacer height={vs(30)} />

      <View style={styles.buttonsRow}>
        <AddLiquidButton
          title={"+500 ml"}
          icon={<WaterBottleIcon width={s(60)} height={vs(60)} />}
          spacerHeight={vs(12)}
          onPress={() => dispatch(addWater(500))}
        />
        <AddLiquidButton
          title={"+200 ml"}
          icon={<WaterGlassIcon width={s(60)} height={vs(60)} />}
          spacerHeight={vs(12)}
          onPress={() => dispatch(addWater(200))}
        />
      </View>

      <View style={styles.buttonsRow}>
        <CustomLiquidButton onAdd={(amount) => dispatch(addWater(amount))} />
        <AddLiquidButton
          title="Undo"
          icon={<UndoIcon width={s(35)} height={s(35)} />}
          spacerHeight={vs(10)}
          onPress={() => {
            // Bugünün tarihini al
            const todayKey = new Date().toISOString().split('T')[0];
            const today = history.find((d) => d.date === todayKey);

            if (today && today.entries.length > 0) {
              const lastEntry = today.entries[today.entries.length - 1]; // son içilen miktar
              setUndoFlash(lastEntry.amount); // sadece amount'u flash olarak ver
              setTimeout(() => setUndoFlash(null), 1000);
            }

            dispatch(undo());
          }}

          style={{ backgroundColor: colors.undoColor }}
        />
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.appBG,
    paddingTop: vs(20)
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: s(28),
    color: "#0077B6"
  },
  buttonsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(20),
    marginVertical: vs(15)
  }
});

