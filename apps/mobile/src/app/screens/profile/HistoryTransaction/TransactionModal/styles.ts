import { Attributes, Fonts, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTabletLandscape: boolean) =>
	StyleSheet.create({
		main: {
			flex: 1,
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center'
		},
		container: {
			backgroundColor: colors.primary,
			borderRadius: 10,
			overflow: 'hidden',
			width: '90%',
			marginHorizontal: isTabletLandscape ? '30%' : 0,
			zIndex: 100
		},

		title: {
			color: colors.textStrong,
			fontSize: Fonts.size.h7,
			fontWeight: '500',
			textAlign: 'left'
		},

		description: {
			color: colors.text,
			fontSize: Fonts.size.h7,
			marginVertical: size.s_6,
			textAlign: 'right'
		},

		header: {
			paddingBottom: Metrics.size.m,
			borderBottomColor: colors.border,
			borderBottomWidth: 1,
			marginBottom: Metrics.size.xl
		},

		row: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: 10,
			marginBottom: size.s_10
		},

		copyButton: {
			width: '15%',
			height: size.s_50,
			backgroundColor: colors.bgViolet,
			borderRadius: size.s_6,
			padding: size.s_10,
			justifyContent: 'center',
			alignItems: 'center'
		},

		backdrop: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.5)'
		},
		noteField: {
			backgroundColor: colors.secondary,
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_4,
			marginTop: size.s_12,
			borderRadius: size.s_4
		},
		note: {
			color: colors.text,
			fontSize: Fonts.size.h7,
			marginVertical: size.s_6
		},
		wrapper: {
			padding: Metrics.size.xl,
			margin: Metrics.size.l
		},
		overlay: {
			position: 'absolute',
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center',
			alignSelf: 'center',
			backgroundColor: 'rgba(0, 0, 0, 0.5)',
			zIndex: 1000
		}
	});
