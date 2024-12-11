import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			paddingRight: size.s_10,
			marginVertical: size.s_8,
			borderRadius: size.s_8,
			backgroundColor: colors.primary,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_16,
			gap: size.s_8,
			flexDirection: 'row',
			alignItems: 'center'
		},
		fileName: {
			color: colors.textStrong
		},
		footer: {
			flexDirection: 'row',
			gap: size.s_10
		},
		footerTitle: {
			color: colors.text,
			fontSize: size.small
		}
	});
