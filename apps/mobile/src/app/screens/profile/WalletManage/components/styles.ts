import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		main: {
			flex: 1,
			width: '100%',
			height: '100%',
			alignItems: 'center',
			justifyContent: 'center'
		},
		container: {
			backgroundColor: colors.secondary,
			padding: Metrics.size.xl,
			margin: Metrics.size.l,
			borderRadius: 10,
			overflow: 'hidden',
			width: '90%',
			marginHorizontal: 0,
			zIndex: 100
		},
		backdrop: {
			position: 'absolute',
			top: 0,
			left: 0,
			width: '100%',
			height: '100%',
			backgroundColor: 'rgba(0,0,0,0.5)'
		},
		noButton: {
			paddingVertical: size.s_10,
			borderRadius: 50,
			backgroundColor: colors.bgInputPrimary
		},
		yesButton: {
			paddingVertical: size.s_10,
			borderRadius: size.s_8,
			backgroundColor: colors.bgViolet,
			flexDirection: 'row',
			justifyContent: 'center',
			alignItems: 'center',
			gap: size.s_6
		},
		buttonText: {
			color: 'white',
			fontWeight: 'bold',
			fontSize: size.s_14,
			textAlign: 'center'
		},
		buttonsWrapper: {
			maxHeight: 90,
			gap: size.s_10,
			marginTop: size.s_20
		},
		headerTitle: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_10,
			marginBottom: size.s_30
		},
		title: {
			fontSize: size.h4,
			fontWeight: 'bold',
			color: colors.white
		},
		description: {
			fontSize: size.h7,
			color: colors.textDisabled,
			textAlign: 'center'
		},
		subTitle: {
			fontSize: size.h7,
			marginBottom: size.s_10,
			color: colors.white
		},
		textBox: {
			borderWidth: 1,
			borderColor: colors.textDisabled,
			borderRadius: size.s_8,
			marginBottom: size.s_20,
			padding: size.s_4
		},
		input: {
			letterSpacing: size.s_10,
			textAlign: 'center',
			fontWeight: 'bold',
			fontSize: size.h5,
			paddingVertical: size.s_10,
			color: colors.text
		}
	});
