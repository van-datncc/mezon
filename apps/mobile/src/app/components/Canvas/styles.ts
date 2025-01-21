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
		},
		horizontalScrollView: {
			maxWidth: size.s_100 * 1.9,
			height: size.s_60,
			alignSelf: 'center',
			marginBottom: size.s_10
		},
		pageItem: {
			width: size.s_30,
			height: size.s_30,
			borderRadius: size.s_15,
			marginHorizontal: size.s_4,
			marginVertical: size.s_10,
			backgroundColor: colors.primary,
			justifyContent: 'center',
			alignItems: 'center'
		},
		pageNumber: {
			color: colors.textStrong,
			fontSize: size.medium
		},
		selected: {
			borderWidth: size.s_2,
			borderColor: colors.white
		}
	});
