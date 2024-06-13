import { Colors } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    avatarWrapper: {
        width: 60,
        height: 60,
        backgroundColor: Colors.azureBlue,
        borderRadius: 10,
        overflow: "hidden"
    },

    serverName: {
        color: Colors.white,
        fontSize: 14,
        fontWeight: "700"
    },

    header: {
        gap: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start",
        marginBottom: 30
    },

    container: {
        padding: 20,
        paddingTop: 0,
    }
})

export default styles;