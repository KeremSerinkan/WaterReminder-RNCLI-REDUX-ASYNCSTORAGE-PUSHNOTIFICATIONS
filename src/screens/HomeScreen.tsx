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

  const water = useSelector((state: RootState) => state.water.water);
  const dailyGoal = useSelector((state: RootState) => state.water.dailyGoal);
  const history = useSelector((state: RootState) => state.water.history);

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

      <View style={styles.buttons}>
        <AddLiquidButton
          title={"+500 ml"}
          icon={<WaterBottleIcon width={s(45)} height={vs(45)} />}
          spacerHeight={vs(15)}
          onPress={() => dispatch(addWater(500))}
        />

        <AddLiquidButton
          title={"+200 ml"}
          icon={<WaterGlassIcon width={s(50)} height={vs(50)} />}
          spacerHeight={vs(9)}
          onPress={() => dispatch(addWater(200))}
        />
      </View>

      <Spacer height={vs(20)} />

      <View style={styles.buttons}>
        <CustomLiquidButton onAdd={(amount) => dispatch(addWater(amount))} />

        <AddLiquidButton
          title={"Undo"}
          icon={<UndoIcon width={s(35)} height={s(35)} />}
          spacerHeight={vs(8)}
          onPress={() => {
            if (history.length > 0) {
              const lastAmount = history[history.length - 1];
              setUndoFlash(lastAmount);
              setTimeout(() => setUndoFlash(null), 1000); 
            }
            dispatch(undo());
          }}
        />
      </View>

    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.appBG
  },
  title: {
    fontFamily: fonts.bold,
    fontSize: 28
  },
  buttons: {
    flexDirection: 'row',
    gap: s(30)
  },
});
