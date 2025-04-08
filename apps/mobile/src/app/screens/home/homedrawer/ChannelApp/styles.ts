import { Attributes, size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

const height = Dimensions.get('window').height;
export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			height: height * 0.85,
			backgroundColor: colors.primary
		},
		containerWebview: {
			width: '100%',
			height: '100%'
		},
		topBar: {
			paddingHorizontal: size.s_10,
			paddingTop: size.s_2,
			paddingBottom: size.s_10,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			position: 'absolute',
			top: -1,
			left: 0,
			zIndex: 1000,
			backgroundColor: colors.primary,
			width: '100%'
		},
		row: {
			flexDirection: 'row',
			gap: size.s_10
		},
		backButton: {
			height: size.s_40,
			width: size.s_40,
			borderRadius: size.s_20,
			backgroundColor: colors.bgInputPrimary,
			justifyContent: 'center',
			alignItems: 'center'
		},
		title: {
			fontSize: size.s_20,
			fontWeight: '500',
			color: colors.textStrong
		},
		textLoading: {
			marginTop: size.s_6,
			fontSize: size.s_14,
			color: colors.text
		}
	});
