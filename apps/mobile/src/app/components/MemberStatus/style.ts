import { Colors, size } from "@mezon/mobile-ui";
import { Dimensions, StyleSheet } from "react-native";

const style = StyleSheet.create({
    container: {
        backgroundColor: Colors.secondary,
        paddingHorizontal: size.s_18,
        width: Dimensions.get("screen").width,
        paddingBottom: size.s_60
    },

    text: {
        color: Colors.white
    },

    box: {
        backgroundColor: Colors.bgDarkCharcoal,
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
        backgroundColor: Colors.primary,
        borderRadius: 15,
        marginBottom: 10
    },

    iconWrapper: {
        padding: 10,
        backgroundColor: Colors.green,
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
		backgroundColor: Colors.bgDarkCharcoal,
		padding: size.s_10,
        borderRadius: size.s_12,
        marginBottom: size.s_10
	},
	actionTitle: {
		flex: 1,
		color: Colors.white,
	},
    newGroupContent: {
        color: Colors.textGray,
        fontSize: size.small
    },
    actionIconWrapper: {
		padding: size.s_8,
		borderRadius: 50,
        backgroundColor: Colors.bgViolet
	},
})

export default style;