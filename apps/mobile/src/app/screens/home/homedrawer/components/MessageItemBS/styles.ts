import { Attributes, Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) => StyleSheet.create({
	bottomSheetWrapper: {
		flex: 1,
		width: '100%',
		height: '100%',
		overflow: 'hidden',
		paddingBottom: size.s_10,
	},
	messageActionsWrapper: {
		paddingTop: size.s_20,
		gap: size.s_10,
	},
	reactWrapper: {
		flexDirection: 'row',
		gap: 20,
		justifyContent: 'space-between',
		padding: size.s_12,
		alignItems: 'center',
	},
	messageActionGroup: {
		backgroundColor: colors.secondary,
		marginHorizontal: size.s_10,
		borderRadius: size.s_10,
		overflow: 'hidden',
		gap: 1
	},
	actionItem: {
		flexDirection: 'row',
		alignItems: 'center',
		gap: 20,
		paddingHorizontal: size.s_16,
		paddingVertical: size.s_12,
		backgroundColor: colors.secondary,
	},
	icon: {
		width: size.s_20,
		height: size.s_20,
	},
	warningIcon: {
		padding: size.s_6,
		backgroundColor: colors.tertiary,
		borderRadius: 50,

	},
	favouriteIconItem: {
		backgroundColor: colors.secondary,
		padding: size.s_10,
		borderRadius: 50
	},
	reactIcon: {
		fontSize: size.h4,
		color: Colors.white,
	},
	actionText: {
		color: colors.text,
	},
	warningActionText: {
		color: Colors.textRed,
	},
	actionIcon: {
		color: Colors.white,
	},
	bottomSheetBar: {
		width: size.s_30,
		height: size.s_4,
		borderRadius: 20,
		backgroundColor: colors.textStrong,
	},
	bottomSheetBarWrapper: {
		height: 20,
		width: '100%',
		alignItems: 'center',
		justifyContent: 'center',
		backgroundColor: 'transparent',
		position: 'absolute'
	},
	bottomSheet: {
		borderTopLeftRadius: size.s_14,
		borderTopRightRadius: size.s_14,
		overflow: 'hidden'
	}
});
