import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		dmMessageContainer: {
			flex: 1,
			height: size.s_17,
			flexDirection: 'row'
		},
		message: {
			fontSize: size.small
		},
		emoji: {
			height: size.s_17,
			width: size.s_17
		}
	});
