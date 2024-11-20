import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			height: '100%',
			flexDirection: 'row',
			flexWrap: 'wrap',
			width: Metrics.screenWidth,
			justifyContent: 'center',
			alignItems: 'center',
			gap: size.s_4
		},
		normal: {
			width: size.s_100,
			height: size.s_100,
			borderRadius: size.s_8
		}
	});
