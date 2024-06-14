import { Colors, Fonts } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        gap: 5
    },

    inline: {
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
        gap: 5
    },

    tinyText: {
        color: Colors.white,
        fontSize: Fonts.size.tiny,
    },

    smallText: {
        color: Colors.white,
        fontSize: 11,
        // fontSize: Fonts.size.h7,
    },
});

export default styles;