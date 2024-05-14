import { Colors, Fonts } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

const style = StyleSheet.create({
    avatar: {
        height: 35,
        width: 35,
        overflow: "hidden",
        borderRadius: 9999,
    },

    avatarContainer: {
        position: "relative",
        width: 35,
        height: 35,
        borderRadius: 9999
    },

    statusWrapper: {
        backgroundColor: Colors.secondary,
        padding: 3,
        position: "absolute",
        bottom: -4,
        right: -4,
        borderRadius: 9999,
    },

    nameContainer: {
        paddingVertical: 20,
        flexGrow: 1,
        borderBottomColor: Colors.borderDim,
    },

    container: {
        display: "flex",
        flexDirection: "row",
        alignItems: "center",
        gap: 20,
        paddingLeft: 20,
        width: "100%"
    },

    textName: {
        color: "green",
        fontSize: Fonts.size.small,
        fontWeight: "700"
    }
})

export default style;