import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    logoContainer: {
        position: "relative"
    },

    logoWrapper: {
        width: 60,
        height: 60,
        borderRadius: 20,
        overflow: "hidden",
        backgroundColor: Colors.green,
    },

    logoSection: {
        paddingVertical: 40,
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
    },

    btnWrapper: {
        position: "absolute",
        top: -7,
        right: -7,
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-end",
        alignItems: "center",
        padding: 7,
        borderRadius: 50,
        backgroundColor: Colors.white
    },

    clanName: {
        color: Colors.white,
        fontSize: 14,
        marginTop: 10
    }
})

export default styles;