import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			height: size.s_60,
			marginHorizontal: size.s_10,
			marginVertical: size.s_10,
			borderRadius: size.s_4,
			backgroundColor: colors.primary,
			padding: size.s_6,
			justifyContent: 'center'
		},
		title: {
			color: colors.white,
			marginHorizontal: size.s_10,
			width: '90%'
		}
	});
