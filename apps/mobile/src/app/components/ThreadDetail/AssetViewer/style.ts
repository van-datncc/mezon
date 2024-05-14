import { Colors } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexGrow: 1,
        flexBasis: 500,
        overflow: "hidden"
    },

    headerTab: {
        padding: 20,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20
    },

    tabLabel: {
        color: Colors.white
    }
})

export default styles;