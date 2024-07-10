import { Attributes, Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    title: {
        color: colors.textStrong,
        fontSize: Fonts.size.h5,
        fontWeight: "bold"
    },

    subtitle: {
        color: colors.text,
        fontSize: Fonts.size.h8,
    },

    bottomDescription: {
        color: colors.text,
        fontSize: Fonts.size.h8,
        marginVertical: Metrics.size.l
    },

    headerSection: {
        marginVertical: Metrics.size.xxxl
    },

    container: {
        padding: Metrics.size.xl
    },

    feedSection: {
        marginBottom: Metrics.size.xl
    },

    inlineSec: {
        flexDirection: "row",
        gap: Metrics.size.xl
    },

    section: {
        gap: Metrics.size.m
    }
})