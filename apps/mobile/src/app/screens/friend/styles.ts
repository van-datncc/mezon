import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    friendContainer: {
        backgroundColor: Colors.secondary,
        flex: 1,
        paddingHorizontal: size.s_18,
        gap: size.s_14
    },
    searchFriend: {
		backgroundColor: Colors.primary,
		borderRadius: 40,
		alignItems: 'center',
		paddingHorizontal: size.s_12,
		flexDirection: 'row',
	},
	searchInput: {
		width: '93%',
		borderRadius: 20,
		color: Colors.white,
        paddingVertical: size.s_6
	},
    friendItem: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: size.s_8,
        backgroundColor: Colors.bgDarkCharcoal,
        paddingHorizontal: size.s_10,
        paddingVertical: size.s_8
    },
    friendAvatar: {
        width: size.s_40,
        height: size.s_40,
        borderRadius: 50
    },
    friendItemContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
    },
    online: {
        backgroundColor: Colors.green,
    },
    offline: {
        backgroundColor: Colors.bgGrayDark,
    },
    defaultText: {
        color: Colors.textGray
    },
    statusCircle: {
        position: 'absolute',
        width: 14,
        height: 14,
        borderRadius: 10,
        bottom: 0,
        right: -2,
        borderWidth: 2,
        borderColor: Colors.secondary,
    },
    friendAction: {
        flexDirection: 'row',
        gap: size.s_20,
        alignItems: 'center'
    },
    groupByAlphabetWrapper: {
        borderRadius: size.s_8,
    },
    findingFriendWrapper: {
        paddingTop: size.s_20,
    },
    groupFriendTitle: {
        color: Colors.textGray,
        paddingVertical: size.s_6
    },
    groupWrapper: {
        borderRadius: size.s_12,
        overflow: 'hidden',
    },
    friendText: {
        color: Colors.textGray,
        paddingVertical: size.s_18
    },
    requestFriendWrapper: {
        backgroundColor: Colors.bgDarkCharcoal,
        paddingHorizontal: size.s_10,
        paddingVertical: size.s_8,
        borderRadius: size.s_8,
        flexDirection: 'row',
        justifyContent: 'space-between',
        gap: 10,
        alignItems: 'center'
    },
    fill: {
        flex: 1
    },
    requestContentWrapper: {
        flexDirection: 'row',
        gap: size.s_4
    },
    line: {
        height: 2,
        width: '100%',
        backgroundColor: Colors.borderPrimary
    },
    approveIcon: {
        backgroundColor: Colors.green,
        width: size.s_28,
        height: size.s_28,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 50
    },
    textContent: {

    },
    whiteText: {
        color: Colors.white
    }
})
