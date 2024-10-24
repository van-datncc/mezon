import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		dmMessageContainer: {
			flex: 1,
			flexDirection: 'row'
		},
		message: {
			fontSize: size.small,
			color: colors.text
		},
		emoji: {
			height: size.s_14,
			width: size.s_14
		}
	});
