import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			overflow: 'hidden',
			backgroundColor: colors.charcoal,
			alignSelf: 'center',
			borderRadius: size.s_10,
			padding: size.s_16,
			maxHeight: '40%',
			width: '90%',
			display: 'flex',
			flexDirection: 'column',
			justifyContent: 'space-between',
			gap: size.s_10
		},
		noButton: {
			paddingVertical: size.s_10,
			borderRadius: 50,
			backgroundColor: colors.bgInputPrimary
		},
		yesButton: {
			paddingVertical: size.s_10,
			borderRadius: 50,
			backgroundColor: colors.bgViolet
		},
		buttonText: {
			color: colors.white,
			textAlign: 'center'
		},
		buttonsWrapper: {
			maxHeight: 90,
			gap: size.s_10
		},
		title: {
			fontSize: size.h6,
			color: colors.white,
			paddingBottom: size.s_10
		},
		descriptionText: {
			color: colors.tertiary
		},
		textBox: {
			borderWidth: 1,
			borderColor: colors.text,
			borderRadius: size.s_8,
			marginBottom: size.s_20,
			padding: size.s_4
		},
		input: {
			color: colors.text
		}
	});
