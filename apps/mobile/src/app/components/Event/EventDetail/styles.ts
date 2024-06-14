import { Colors, Fonts, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        paddingHorizontal: Metrics.size.xl,
        marginHorizontal: Metrics.size.xl,
        paddingVertical: Metrics.size.xl,
        borderWidth: 1,
        borderColor: Colors.gray48,
        borderRadius: 15,
        backgroundColor: Colors.secondary,
        // gap: Metrics.size.xs
        gap: 10,
    },

    title: {
        color: Colors.white,
        // fontSize: 14,
        fontSize: Fonts.size.h6,
        fontWeight: "bold"
    },

    description: {
        // fontSize: Fonts.size.h8,
        fontSize: 11,
        color: Colors.gray48
    },

    mainSection: {
        gap: 5
    },

    inline: {
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 5
    },

    smallText: {
        color: Colors.white,
        fontSize: 11
        // fontSize: Fonts.size.h7,
    },
})

export default styles;