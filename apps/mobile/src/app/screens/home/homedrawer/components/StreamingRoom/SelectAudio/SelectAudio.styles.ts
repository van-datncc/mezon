import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		title: {
			color: colors.white,
			fontSize: size.s_18,
			fontWeight: '600',
			textAlign: 'center'
		}
	});
