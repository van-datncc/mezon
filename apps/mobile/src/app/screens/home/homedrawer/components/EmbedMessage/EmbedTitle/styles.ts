import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1
		},
		title: {
			color: colors.white,
			fontSize: size.s_14,
			fontWeight: 'bold'
		},
		urlTitle: {
			color: colors.textLink,
			fontSize: size.s_14,
			fontWeight: 'bold',
			textDecorationLine: 'underline'
		}
	});
