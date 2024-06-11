import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    info: {
        flexDirection: "row",
        alignItems: "center",
        gap: 15,
        justifyContent: "flex-start"
    },

    inlineInfo: {
        flexDirection: "row",
        alignItems: "center",
        gap: 5,
    },

    inlineText: {
        fontSize: 10,
        color: Colors.white
    },
})

export default styles;