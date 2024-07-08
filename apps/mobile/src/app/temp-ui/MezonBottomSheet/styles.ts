import { Attributes, Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { title } from "process";
import { StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    backgroundStyle: {
        backgroundColor: colors.primary
    },

    header: {
        display: "flex",
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between"
    },

    section: {
        flex: 1
    },

    sectionTitle: {
        textAlign: "center",
        color: colors.textStrong,
        fontWeight: "bold",
        flexGrow: 1,
        flexBasis: 10
    },

    titleSM: {

    },

    titleMD: {
        fontSize: Fonts.size.h6
    },

    titleLg: {

    },
    sectionRight: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingRight: Metrics.size.m
    },

    sectionLeft: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        paddingLeft: Metrics.size.m
    },
    handleIndicator: {
        backgroundColor: colors.textStrong
    }
});