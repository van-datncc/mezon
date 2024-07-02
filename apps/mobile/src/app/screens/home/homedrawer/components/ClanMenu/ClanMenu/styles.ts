import { Attributes, Colors, Fonts, Metrics, baseColor } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ textStrong, }: Attributes) => StyleSheet.create({
    avatarWrapper: {
        width: 60,
        height: 60,
        backgroundColor: baseColor.blurple,
        borderRadius: 10,
        overflow: "hidden"
    },

    container: {
        padding: 20,
        paddingTop: 0
    },

    serverName: {
        color: textStrong,
        fontSize: Fonts.size.h6,
        fontWeight: "700",
        marginBottom: Metrics.size.m
    },

    header: {
        gap: 15
    },

    actionWrapper: {
        flexDirection: "row",
        gap: 10,
        padding: 10,
        justifyContent: "space-between",
        minWidth: "100%",
    }
})