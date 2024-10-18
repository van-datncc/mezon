import { Attributes } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';
const { width, height } = Dimensions.get('window');

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {},
		video: {
			width: '100%',
			height: '100%'
		},
		fullScreenVideo: {
			width: '100%',
			height: '100%'
		},
		fullScreenButton: {
			position: 'absolute',
			top: 10,
			right: 10,
			padding: 10,
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			borderRadius: 50
		}
	});
