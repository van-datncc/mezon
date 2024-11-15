import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		userName: {
			fontSize: size.s_14,
			color: colors.text
		},
		textTime: {
			fontSize: size.s_12,
			color: colors.textDisabled,
			marginTop: size.s_8
		},
		actionText: {
			fontSize: size.s_14,
			fontWeight: '600',
			color: colors.white
		}
	});
