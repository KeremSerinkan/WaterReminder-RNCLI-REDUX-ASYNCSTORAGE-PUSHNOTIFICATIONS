import { Animated, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { FC, useEffect, useRef, useState } from 'react'
import { AnimatedCircularProgress } from 'react-native-circular-progress'
import { colors } from '../styles/colors'
import { s, vs } from 'react-native-size-matters';


interface ProgressProps {
  progress: number,
  dailyGoal: number,
  water: number,
  undoFlash?: number | null,
}



const ProgressCircle: FC<ProgressProps> = ({ progress, dailyGoal, water, undoFlash}) => {
  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    if (undoFlash !== null) {
      opacity.setValue(1);
      translateY.setValue(20);

      Animated.parallel([
        Animated.timing(opacity, { toValue: 0, duration: 900, useNativeDriver: true }),
        Animated.timing(translateY, { toValue: -20, duration: 900, useNativeDriver: true })
      ]).start();
    }
  }, [undoFlash]);

  const getColor = () => {
    if (progress <= 20) return "#FF4C4C";
    if (progress <= 50) return "#FFD93D";
    if (progress <= 99) return colors.waterColor;
    return "#4CAF50";
  };

  return (
    <View>
      <AnimatedCircularProgress
        size={s(180)}
        width={s(12)}
        fill={progress}
        tintColor={getColor()}
        backgroundColor={colors.waterBG}
        rotation={0}
        lineCap="round"
      >
        {() => (
          <View style={styles.innerCircle}>
            
            <Text style={styles.amount}>{water} ml</Text>
            <Text style={styles.goal}>/{dailyGoal} ml</Text>

            {undoFlash !== null && (
              <Animated.Text
                style={{
                  position: 'absolute',
                  top: vs(20),
                  fontSize: s(20),
                  color: 'red',
                  opacity: opacity,
                  transform: [{ translateY }]
                }}
              >
                -{undoFlash} ml
              </Animated.Text>
            )}

          </View>
        )}
      </AnimatedCircularProgress>
    </View>
  );
};


export default ProgressCircle

const styles = StyleSheet.create({

  innerCircle: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  amount: {
    fontSize: s(24),
    fontWeight: 'bold',
    color: '#00BFFF'
  },
  goal: {
    fontSize: s(16),
    color: 'gray'
  }
})