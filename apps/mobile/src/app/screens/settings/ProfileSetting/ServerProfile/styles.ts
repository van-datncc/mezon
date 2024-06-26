import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    bottomSheetContainer: {

    },
    clanItem: {
        
    },
    selectClanWrapper: {

    },
	actionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: size.s_12,
		backgroundColor: Colors.bgDarkSlate,
		padding: size.s_10,
	},
    clanAvatarWrapper: {
		borderRadius: size.s_10,
        overflow: 'hidden',
        backgroundColor: Colors.primary
	},
    avatar: {
        height: size.s_30,
        width: size.s_30,
        alignItems: 'center',
        justifyContent: 'center'
    },
    textAvatar: {
        color: Colors.white
    },
    clanName: {
        color: Colors.white,
        fontSize: size.label
    },
    btnIcon: {
        padding: size.s_8,
        borderRadius: size.s_10,
        backgroundColor: Colors.bgViolet
    },
    btnGroup: {
        flexDirection: "row",
        justifyContent: "flex-end",
        paddingHorizontal: size.s_10,
        marginTop: -20
    },
    clanProfileDetail: {
        backgroundColor: Colors.primary,
        marginHorizontal: 20,
        borderRadius: 10,
        marginTop: 20,
        padding: 20
    },
    displayNameText: {
        color: Colors.white,
        fontWeight: "700",
        fontSize: size.h5,
    },
    userNameText: {
        color: Colors.white,
        fontSize: size.small,
    },
    nameWrapper: {
        marginBottom: 20
    }
})