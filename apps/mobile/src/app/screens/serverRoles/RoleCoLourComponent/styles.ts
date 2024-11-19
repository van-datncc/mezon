import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		roleButton: {
			backgroundColor: colors.secondary,
			padding: size.s_10,
			marginVertical: size.s_10,
			borderRadius: size.s_8,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		textBtn: {
			fontSize: size.label,
			fontWeight: '500',
			color: colors.white,
			textAlign: 'center'
		},
		colorText: {
			fontSize: size.label,
			color: colors.textDisabled
		},
		checkedIcon: {
			color: colors.black
		}
	});
