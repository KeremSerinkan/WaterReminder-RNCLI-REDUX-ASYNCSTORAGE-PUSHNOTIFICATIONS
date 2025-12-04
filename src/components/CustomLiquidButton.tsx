import { useState } from "react";
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet } from "react-native";
import { s, vs } from "react-native-size-matters";
import { colors } from "../styles/colors";
import { fonts } from "../styles/fonts";

interface CustomLiquidButtonProps {
  onAdd: (amount: number) => void;
}

export const CustomLiquidButton = ({ onAdd } : CustomLiquidButtonProps) => {
    const [visible, setVisible] = useState(false);
    const [amount, setAmount] = useState("");

    const handleConfirm = () => {
        const ml = parseInt(amount, 10);
        if (!isNaN(ml) && ml > 0) {
            onAdd(ml);
        }
        setVisible(false);
        setAmount("");
    };

    return (
        <>
            <TouchableOpacity
                onPress={() => setVisible(true)}
                style={styles.customButton}>
                <Text style={styles.text}>Custom{"\n"}Add</Text>
            </TouchableOpacity>

            <Modal transparent={true} visible={visible} animationType="fade">
                <View style={styles.modalOverlay}>

                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Enter Amount (ml)</Text>

                        <TextInput
                            value={amount}
                            onChangeText={setAmount}
                            keyboardType="numeric"
                            placeholder="Example: 300"
                            style={styles.input}
                        />

                        <View style={styles.modalButtons}>
                            <TouchableOpacity onPress={() => setVisible(false)}>
                                <Text style={styles.cancelText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity onPress={handleConfirm}>
                                <Text style={styles.confirmText}>Add</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                </View>
            </Modal>
        </>
    );
};

const styles = StyleSheet.create({
    customButton: {
        width: s(110),
        height: vs(120),
        justifyContent: "center",
        alignItems: "center",
        padding: 15,
        backgroundColor: colors.buttonBG,
        borderRadius: 12,
    },

    text: {
        fontSize: s(18),
        color: colors.waterColor,
        fontFamily: fonts.bold,
        textAlign: "center"
    },

    modalOverlay: {
        flex: 1,
        backgroundColor: "rgba(0,0,0,0.5)",
        justifyContent: "center",
        alignItems: "center"
    },

    modalContent: {
        width: "80%",
        padding: 20,
        backgroundColor: "white",
        borderRadius: 12
    },

    modalTitle: {
        fontSize: 18,
        fontFamily: fonts.bold,
        marginBottom: 10
    },

    input: {
        fontFamily: fonts.medium,
        borderWidth: 1,
        borderColor: "#aaa",
        borderRadius: 8,
        padding: 10,
        marginBottom: 20
    },

    modalButtons: {
        flexDirection: "row",
        justifyContent: "space-between"
    },

    cancelText: {
        fontFamily: fonts.medium,
        fontSize: 16,
        color: "red"
    },

    confirmText: {
        fontFamily: fonts.medium,
        fontSize: 16,
        color: "blue"
    }
});

