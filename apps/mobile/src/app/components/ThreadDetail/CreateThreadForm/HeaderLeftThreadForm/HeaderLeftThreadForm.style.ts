import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		headerLeft: {
			flexDirection: 'row',
			alignItems: 'center',
			height: size.s_50
		},
		btnBack: {
			paddingLeft: size.s_16,
			paddingRight: size.s_14,
			height: '100%',
			justifyContent: 'center'
		}
	});
