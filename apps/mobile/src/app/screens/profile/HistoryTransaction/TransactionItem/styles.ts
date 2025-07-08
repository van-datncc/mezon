import { Attributes, Fonts, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			borderRadius: size.s_12,
			overflow: 'hidden',
			backgroundColor: colors.secondaryLight,
			marginVertical: size.s_4
		},
		userItem: {
			flexDirection: 'row',
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_6,
			borderRadius: size.s_12,
			gap: size.s_8,
			alignItems: 'center',
			backgroundColor: colors.secondary
		},
		title: {
			color: colors.textStrong,
			fontSize: Fonts.size.h7,
			fontWeight: '500',
			textAlign: 'left'
		},
		userRowItem: {
			flexDirection: 'row',
			alignItems: 'flex-start',
			gap: size.s_10
		},
		userRowHeader: {
			gap: size.s_10
		},
		code: {
			color: colors.textDisabled,
			fontSize: Fonts.size.small,
			fontWeight: '400'
		},
		description: {
			color: colors.text,
			fontSize: Fonts.size.h7,
			marginVertical: size.s_6,
			textAlign: 'left'
		},
		row: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: 10,
			marginBottom: size.s_10,
			width: '50%'
		},
		field: {
			alignItems: 'flex-start'
		},
		expandIcon: {
			alignItems: 'center',
			justifyContent: 'center',
			height: size.s_30,
			width: size.s_30,
			borderRadius: size.s_15
		},
		loading: {
			height: size.s_80,
			justifyContent: 'center',
			alignItems: 'center',
			padding: size.s_20
		},
		detail: {
			backgroundColor: colors.secondaryLight,
			padding: size.s_10,
			flexDirection: 'row',
			flexWrap: 'wrap'
		}
	});
