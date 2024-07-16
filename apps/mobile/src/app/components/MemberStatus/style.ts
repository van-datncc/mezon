import { Attributes, baseColor, size } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

export const style = (colors: Attributes) => StyleSheet.create({
    container: {
        backgroundColor: colors.primary,
        padding: 20,
        width: Dimensions.get("screen").width,
    },

    text: {
        color: colors.text
    },

    box: {
        backgroundColor: colors.secondary,
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
        backgroundColor: colors.secondary,
        borderRadius: 15,
        marginBottom: 10
    },

    iconWrapper: {
        padding: 10,
        backgroundColor: baseColor.blurple,
        borderRadius: 50
    },

    iconNameWrapper: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "row",
        gap: 10
    },
    actionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: size.s_12,
        backgroundColor: colors.secondary,
        padding: size.s_10,
        borderRadius: size.s_12,
        marginBottom: size.s_10
    },
    actionTitle: {
        flex: 1,
        color: colors.text,
    },
    newGroupContent: {
        color: colors.textDisabled,
        fontSize: size.small
    },
    actionIconWrapper: {
        padding: size.s_8,
        borderRadius: 50,
        backgroundColor: baseColor.blurple
    },
})

export default style;