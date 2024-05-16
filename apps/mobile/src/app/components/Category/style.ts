import { Colors, Fonts } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.primary,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "column",
        gap: 10
    },
    label: {
        color: Colors.white,
        textTransform: "uppercase",
        paddingHorizontal: 20
    },
    labelNormal: {
        color: Colors.white,
    },
    labelIconWrapper: {
        display: "flex",
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    description: {
        marginTop: 10,
        paddingHorizontal: 20,
        color: Colors.gray48,
        fontSize: Fonts.size.small
    },
    input: {
        backgroundColor: Colors.secondary,
        marginVertical: 10,
        color: Colors.white,
        paddingHorizontal: 20
    },
    checkboxWrapper: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: Colors.secondary,
    }
})

export default styles;