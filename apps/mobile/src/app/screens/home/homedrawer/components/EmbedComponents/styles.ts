import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		actionPanel: {
			flexDirection: 'row',
			gap: size.s_8,
			paddingVertical: size.s_8,
			alignItems: 'center'
		}
	});
