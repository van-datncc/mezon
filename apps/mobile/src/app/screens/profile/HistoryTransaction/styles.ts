import { Attributes, size } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

const screenWidth = Dimensions.get('window').width;

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.secondary
		},
		title: {
			color: colors.textStrong,
			margin: size.s_2
		},
		code: {
			color: colors.textDisabled,
			fontSize: size.small,
			margin: size.s_2,
			fontWeight: '300'
		},
		userItem: {
			justifyContent: 'space-between',
			flexDirection: 'row',
			gap: size.s_8,
			alignItems: 'center',
			padding: size.s_10,
			marginVertical: size.s_2
		},
		userName: {
			color: colors.text,
			paddingHorizontal: size.s_10
		},
		cursor: {
			flexDirection: 'row',
			gap: size.s_10,
			height: size.s_60,
			justifyContent: 'space-between',
			margin: size.s_10
		},
		cursorItem: {
			height: size.s_50,
			width: (screenWidth - size.s_100) / 2,
			flex: 1,
			backgroundColor: colors.borderDim,
			justifyContent: 'center',
			alignItems: 'center',
			borderRadius: size.s_8
		},
		page: {
			justifyContent: 'center',
			alignItems: 'center',
			height: size.s_60,
			width: size.s_60,
			borderRadius: size.s_4,
			backgroundColor: colors.borderDim
		}
	});
