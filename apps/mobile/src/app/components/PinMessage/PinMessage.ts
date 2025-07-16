import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		containerPinMessage: {
			paddingHorizontal: size.s_12
		},
		loading: {
			alignItems: 'center',
			marginTop: size.s_20
		}
	});
