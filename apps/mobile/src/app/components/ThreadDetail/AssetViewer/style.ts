import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        width: "100%",
        flexGrow: 1,
        flexBasis: 500,
        overflow: "hidden"
    },

    headerTab: {
        marginTop: 20,
        padding: 20,
        paddingVertical: 10,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        gap: 20
    },

    tabLabel: {
        color: Colors.white
    },

    a: {
        width: "100%",
        paddingHorizontal: 20,
        position: "relative",
    },
    b: {
        position: "absolute",
        backgroundColor: "purple",
        height: 3,
        top: 0,
        borderRadius: 50,
    }
})

export default styles;