import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { ReactNode } from 'react'
import { s, vs } from 'react-native-size-matters'
import Spacer from '../common/Spacer'
import { colors } from '../styles/colors'
import { fonts } from '../styles/fonts'

interface AddLiquidButtonProps {
  title: string;
  icon: ReactNode;
  spacerHeight: number;
  onPress: () => void;
  style?: object;
}

const AddLiquidButton = ({ title, icon, spacerHeight, onPress }: AddLiquidButtonProps) => {
  return (
    <TouchableOpacity onPress={onPress} style={styles.container}>
      {icon}
      <Spacer height={spacerHeight} />
      <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default AddLiquidButton

const styles = StyleSheet.create({
  container: {
    width: s(110),
    height: vs(120),
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: colors.buttonBG,
    borderRadius: s(16),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4.65,
    elevation: 7
  },
  text: {
    fontSize: s(18),
    fontFamily: fonts.bold,
    color: "#fff"
  }
})
