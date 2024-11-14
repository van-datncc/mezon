import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		userName: {
			fontSize: size.s_16,
			fontWeight: '500',
			color: colors.white
		},
		textTime: {
			fontSize: size.s_14,
			fontWeight: '400',
			color: colors.text
		},
		actionText: {
			fontSize: size.s_14,
			fontWeight: '400',
			color: colors.text
		}
	});
