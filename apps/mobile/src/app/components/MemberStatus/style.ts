import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        // backgroundColor: Colors.secondary,
        padding: 20,
        width: "100%",
    },

    text: {
        color: Colors.white
    },

    box: {
        backgroundColor: Colors.primary,
        marginTop: 10,
        borderRadius: 15,
        width: "100%"
    }
})

export default style;