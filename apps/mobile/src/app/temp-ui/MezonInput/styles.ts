import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        marginBottom: 10
    },
    inputBox: {
        borderColor: Colors.gray48,
        borderWidth: 1,
        borderRadius: 10,
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingHorizontal: 15
    },

    label: {
        color: Colors.gray48,
        fontSize: 14,
        fontWeight: 'bold',
        marginBottom: 5
    },

    input: {
        color: Colors.white,
    },

    clearBtn: {
        padding: 3,
        borderRadius: 10,
        backgroundColor: Colors.white
    }
})

export default styles;