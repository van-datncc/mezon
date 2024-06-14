import { Colors, Metrics } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    inline: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignContent: "center",
        gap: Metrics.size.s
    },

    smallText: {
        color: Colors.white,
        fontSize: 11
        // fontSize: Fonts.size.h7,
    }
})

export default styles;