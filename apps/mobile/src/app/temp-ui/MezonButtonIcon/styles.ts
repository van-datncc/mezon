import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    iconWrapper: {
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        padding: 10,
        backgroundColor: Colors.gray48,
        borderWidth: 2,
        borderColor: Colors.borderDim,
        borderRadius: 999
    },

    container: {
        gap: 10,
        alignItems: 'center',
    },

    title: {
        color: Colors.white,
        fontSize: 9,
    }
})

export default styles;