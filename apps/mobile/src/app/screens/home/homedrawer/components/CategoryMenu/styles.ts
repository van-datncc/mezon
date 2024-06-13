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
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10
    },

    header: {
        gap: 15,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "flex-start"
    },

    container: {
        padding: 20,
        paddingTop: 0,
        gap: 20
    }
})

export default styles;