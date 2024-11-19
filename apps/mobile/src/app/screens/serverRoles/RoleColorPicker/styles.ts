import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		checkedIcon: {
			color: colors.black
		},
		textBtn: {
			fontSize: size.label,
			fontWeight: '500',
			color: colors.white,
			textAlign: 'center'
		},
		title: {
			fontSize: size.h6,
			fontWeight: '600',
			color: colors.white,
			flex: 1,
			textAlign: 'center'
		},
		headerRightBtn: {
			backgroundColor: colors.charcoal,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			width: size.s_60
		},
		footerBtn: {
			backgroundColor: baseColor.blurple,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_6,
			borderRadius: size.s_20,
			width: size.s_80,
			alignItems: 'center',
			justifyContent: 'center'
		}
	});
