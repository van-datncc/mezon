import { Attributes, size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

const height = Dimensions.get('window').height;
export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			height: '100%',
			width: '100%',
			backgroundColor: colors.primary,
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 100000000
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
			top: 0,
			left: 0,
			zIndex: 1000,
			width: '100%',
			backgroundColor: 'red'
		},
		row: {
			flexDirection: 'row',
			gap: size.s_10
		},
		backButton: {
			height: size.s_30,
			width: size.s_30,
			borderRadius: size.s_30,
			backgroundColor: colors.bgInputPrimary,
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			top: size.s_6,
			left: size.s_10,
			zIndex: 1000
		},
		reloadButton: {
			height: size.s_30,
			width: size.s_30,
			borderRadius: size.s_30,
			backgroundColor: colors.bgInputPrimary,
			justifyContent: 'center',
			alignItems: 'center',
			position: 'absolute',
			top: size.s_6,
			right: size.s_10,
			zIndex: 1000
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
