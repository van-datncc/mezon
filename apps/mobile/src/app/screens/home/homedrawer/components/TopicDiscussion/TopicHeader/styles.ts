import { Attributes, Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		dateText: {
			fontSize: size.small,
			color: Colors.gray72
		},
		name: {
			fontSize: size.medium,
			marginRight: size.s_10,
			fontWeight: '700'
		},
		title: {
			fontSize: size.label,
			color: colors.text,
			marginRight: size.s_10,
			fontWeight: '700'
		},
		backButton: {
			width: size.s_50,
			paddingVertical: size.s_4
		}
	});
