import { Attributes, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    container: {
        padding: Metrics.size.xl,
        gap: Metrics.size.xl
    },
    emptyView: {
        padding: Metrics.size.xl,
        gap: Metrics.size.xxl,
        alignItems: "center"
    },
    emptyText: {
        color: colors.text,
        textAlign: "center",
        fontSize: Fonts.size.h7,
        fontWeight: "bold"
    },
    emptyTextDescription: {
        color: colors.textDisabled,
        textAlign: "center",
        fontSize: Fonts.size.h8,
        marginTop: Metrics.size.m
    },
    iconWrapper: {
        padding: Metrics.size.l,
        borderRadius: 28,
        backgroundColor: colors.tertiary,
    }
})