import {Attributes, size} from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
import {transparent} from "tailwindcss/colors";

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.secondary,
			flex: 1
		},
		main: {
			flex: 1,
			marginTop: size.s_10,
			marginBottom: size.s_50,
		},
		menuHeader: {
			width: '100%',
			backgroundColor: transparent,
			padding: 10,
			borderRadius: 10,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		buttonCircle: {
			backgroundColor: colors.border,
			padding: size.s_8,
			borderRadius: size.s_22
		},
		menuFooter: {
			position: 'absolute',
			bottom: size.s_30,
			width: '100%',
			padding: size.s_20,
			gap: size.s_10,
			alignItems: 'center',
			justifyContent: 'center'
		},
		menuIcon: {
			justifyContent: 'center',
			alignItems: 'center',
			position: 'relative',
			width: size.s_50,
			height: size.s_50,
			backgroundColor: colors.badgeHighlight,
			borderRadius: size.s_30
		},
	});
