import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_10,
			paddingBottom: size.s_10
		},
		text: {
			color: colors.text,
			marginTop: size.s_10
		},
		textInvite: {
			color: colors.text
		},
		box: {
			backgroundColor: colors.primary,
			marginTop: size.s_10,
			borderRadius: 15,
			width: '100%',
			minHeight: size.s_80
		},
		inviteBtn: {
			display: 'flex',
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			padding: size.s_10,
			backgroundColor: colors.primary,
			borderRadius: 15,
			marginBottom: size.s_10
		},

		iconWrapper: {
			padding: size.s_10,
			backgroundColor: baseColor.blurple,
			borderRadius: 50
		},

		iconNameWrapper: {
			display: 'flex',
			justifyContent: 'center',
			alignItems: 'center',
			flexDirection: 'row',
			gap: size.s_10
		},
		actionItem: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_12,
			backgroundColor: colors.secondary,
			padding: size.s_10,
			borderRadius: 12,
			marginBottom: size.s_10
		},
		actionTitle: {
			flex: 1,
			color: colors.text
		},
		newGroupContent: {
			color: colors.textDisabled,
			fontSize: size.small
		},
		actionIconWrapper: {
			padding: size.s_8,
			borderRadius: 50,
			backgroundColor: baseColor.blurple
		}
	});

export default style;
