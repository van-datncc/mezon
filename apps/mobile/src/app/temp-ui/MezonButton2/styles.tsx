import { Attributes, Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    container: {
        padding: Metrics.size.m,
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        borderRadius: 5,
        overflow: 'hidden',
        borderWidth: 1,
        backgroundColor: colors.primary,
        gap: 5,
        alignItems: "center",
        borderColor: colors.border
    },

    containerSuccess: {
        backgroundColor: Colors.green,
    },

    containerWarning: {
        backgroundColor: Colors.green,
    },

    containerDanger: {
        backgroundColor: Colors.green,
    },

    fluid: {
        flexBasis: 10,
        flexGrow: 1
    },

    border: {
        backgroundColor: "transparent",
    },

    title: {
        color: colors.textStrong,
        fontSize: Fonts.size.h8
    }
})