import { Colors, size } from "@mezon/mobile-ui";
import { StyleSheet } from "react-native";

export const styles = StyleSheet.create({
    inviteToChannelWrapper: {
		alignItems: 'center',
		justifyContent: 'center',
		borderRadius: 50,
		backgroundColor: Colors.tertiaryWeight,
		width: 30,
		height: 30,
	},
	radioContainer: {
		flexDirection: 'row',
		justifyContent: 'center',
		alignItems: 'center'
	},
	radioItem: {
		width: 100,
		borderRadius: 3,
		paddingVertical: 5,
		marginRight: 10,
	},
	radioItemDeActive: {
		backgroundColor: '#1c2023'
	},
	radioItemActive: {
		backgroundColor: '#5a62f4'
	},
	inviteHeader: {
		backgroundColor: '#1c2023',
		padding: 19,
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8
	},
	inviteHeaderText: {
		color: '#FFFFFF',
		fontWeight: 'bold',
		fontSize: 15,
	},
	inviteIconWrapper: {
		justifyContent: 'center',
		alignItems: 'center'
	},
	shareToInviteIcon: {
		borderRadius: 50,
		padding: 10,
		backgroundColor: '#3e4247',
		color: '#FFFFFF',
	},
	inviteIconText: {
		color: '#7c7f87',
	},
	searchFriendToInviteWrapper: {
		backgroundColor: '#1c2023',
		borderRadius: 8,
		alignItems: 'center',
		paddingHorizontal: size.s_6,
		flexDirection: 'row',
	},
	searchFriendToInviteInput: {
		width: '93%',
		borderRadius: 8,
		color: Colors.white
	},
	editInviteLinkWrapper: {
		paddingTop: 17,
		flexDirection: 'row',
	},
	inviteWrapper: {
		flex: 1,
		backgroundColor: '#31343d',
		width: '100%',
		borderTopRightRadius: 8,
		borderTopLeftRadius: 8
	},
	iconAreaWrapper: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		padding: 19,
		borderBottomColor: '#363940',
		borderBottomWidth: 3
	},
	searchInviteFriendWrapper: {
		padding: 19
	},
	defaultText: {
		color: Colors.white
	},
	linkText: {
		color: '#2b6478'
	},
    channelInviteTitle: {
		fontSize: size.s_14,
		fontWeight: '600',
		color: Colors.tertiary,
	},
    channelInviteItem: {
		width: '100%',
		flexDirection: 'row',
		alignItems: 'center',
		paddingVertical: 19,
		borderRadius: 5,
	},
    inviteChannelListWrapper: {
        marginVertical: 15,
        paddingVertical: 20,
        borderBottomWidth: 2,
        borderTopWidth: 2,
        borderColor: '#363940',
        paddingHorizontal: 10
    },
    inviteChannelListTitle: {
        color: '#888c94',
        fontSize: 16,
        fontWeight: '500'
    },
    advancedSettingWrapper: {
        paddingLeft: 10,
        gap: 10
    },
    advancedSettingTitle: {
        color: '#888c94',
        fontSize: 16,
        fontWeight: '500'
    },
    advancedSettingSubTitle: {
        color: '#676b73',
        fontSize: 16,
        fontWeight: '500'
    },
    temporaryMemberWrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        paddingTop: 20
    }
});