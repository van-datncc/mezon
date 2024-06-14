import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5,
        borderRadius: 50,
        backgroundColor: Colors.gray72,
        paddingHorizontal: 7,
        paddingVertical: 3
    },

    containerSuccess: {
        backgroundColor: Colors.green,
    },

    containerDanger: {
        backgroundColor: Colors.textRed,
    },

    containerWarning: {
        backgroundColor: Colors.textViolet,
    },

    title: {
        color: Colors.white,
        fontSize: 9,
    }
})

export default styles;