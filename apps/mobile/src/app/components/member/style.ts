import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.primary,
        height: "100%",
        padding: 20
    },

    text: {
        color: Colors.white
    },

    box: {
        backgroundColor: Colors.secondary,
        marginTop: 10,
        borderRadius: 15,
        paddingVertical: 10
    }
})

export default style;