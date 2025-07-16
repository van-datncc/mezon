import { size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = () =>
	StyleSheet.create({
		containerPinMessage: {
			paddingHorizontal: size.s_12
		},
		container: {
			paddingHorizontal: size.s_10,
			flex: 1
		},
		listContent: {
			paddingBottom: size.s_6
		}
	});