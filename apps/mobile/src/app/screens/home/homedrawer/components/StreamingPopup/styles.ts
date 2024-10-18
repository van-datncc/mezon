import { Attributes } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			alignItems: 'center',
			justifyContent: 'center'
		},
		titleText: {
			fontSize: 14,
			lineHeight: 24,
			fontWeight: 'bold'
		},
		box: {
			height: 150,
			width: 150,
			borderRadius: 5,
			zIndex: 999
		},
		animatedView: {
			zIndex: 999999,
			position: 'absolute'
		}
	});
