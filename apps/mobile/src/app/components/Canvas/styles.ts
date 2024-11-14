import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { Dimensions, Platform, StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		scrollView: {
			height: Metrics.screenHeight / (Platform.OS === 'ios' ? 1.4 : 1.3)
		},
		contentContainer: {
			paddingBottom: size.s_50
		},
		container: {
			width: Dimensions.get('screen').width,
			paddingHorizontal: size.s_12,
			paddingBottom: size.s_16
		}
	});
