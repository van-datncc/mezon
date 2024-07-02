import { Attributes, Colors, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const style = ({ primary, textStrong, }: Attributes) => StyleSheet.create({
    backgroundStyle: {
        backgroundColor: primary
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
        color: textStrong,
        fontWeight: "bold",
        flexGrow: 1,
        flexBasis: 10
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
        paddingLeft: 10
    },
    handleIndicator: {
        backgroundColor: textStrong
    }
});