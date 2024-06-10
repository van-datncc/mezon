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

    container: {
        padding: 20,
        paddingTop: 0
    },

    serverName: {
        color: Colors.white,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10
    },

    header: {
        gap: 15
    },

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

    actionWrapper: {
        flexDirection: "row",
        gap: 10,
        padding:10,
        justifyContent: "space-between",
        minWidth: "100%",
    }
})

export default styles;