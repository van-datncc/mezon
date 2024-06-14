import { Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Metrics.size.xl,
        paddingVertical: Metrics.size.xl,
        borderWidth: 1,
        borderColor: Colors.gray48,
        borderRadius: 15,
        backgroundColor: Colors.secondary,
        // gap: Metrics.size.xs
        gap: 3
    },
    description: {
        // fontSize: Fonts.size.h8,
        fontSize: 11,
        color: Colors.gray48
    },
    title: {
        // fontSize: Fonts.size.h7,
        fontSize: 14,
        color: Colors.white
    },
    infoSection: {
        flexDirection: "row",
        justifyContent: "space-between",
        marginBottom: 10
    },

    inline: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5
    },

    tinyText: {
        color: Colors.white,
        fontSize: Fonts.size.tiny,
    },

    smallText: {
        color: Colors.white,
        fontSize: 11
        // fontSize: Fonts.size.h7,
    },

    avatar: {
        width: 20,
        height: 20,
        borderRadius: 10,
        overflow: "hidden"
    },

    infoRight: {
        gap: Metrics.size.l
    },

    mainSec: {
        gap: 5,
        marginBottom: 10
    }
})

export default styles;