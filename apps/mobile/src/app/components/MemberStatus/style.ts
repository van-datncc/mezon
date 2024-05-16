import { Colors } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        padding: 20,
        width: Dimensions.get("screen").width,
    },

    text: {
        color: Colors.white
    },

    box: {
        backgroundColor: Colors.primary,
        marginTop: 10,
        borderRadius: 15,
        width: "100%"
    },
    inviteBtn: {
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        padding: 10,
        backgroundColor: Colors.primary,
        borderRadius: 15,
        marginBottom: 10
    },

    iconWrapper: {
        padding: 10,
        backgroundColor: Colors.green,
        borderRadius: 50
    },
    iconNameWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    }
})

export default style;