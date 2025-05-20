import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		itemDetail: {
			gap: size.s_10
		},
		name: {
			color: colors.white,
			fontWeight: 'bold',
			fontSize: size.medium
		},
		value: {
			color: colors.text,
			fontSize: size.s_13,
			marginTop: size.s_6,
			width: '80%'
		},
		option: {
			marginTop: size.s_10,
			justifyContent: 'space-between',
			flexDirection: 'row',
			alignItems: 'center'
		}
	});
