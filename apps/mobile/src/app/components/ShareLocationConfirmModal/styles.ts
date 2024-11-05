import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		modalContainer: {
			backgroundColor: colors.secondaryLight,
			padding: size.s_10,
			borderRadius: size.s_16
		},
		headerText: {
			color: colors.white,
			fontSize: size.label,
			fontWeight: '500'
		},
		modalHeader: {
			paddingTop: size.s_4
		},
		modalContent: {
			flexDirection: 'row',
			paddingVertical: size.s_20,
			alignItems: 'center',
			gap: size.s_10
		},
		circleIcon: {
			backgroundColor: colors.midnightBlue,
			borderRadius: size.s_20,
			width: size.s_40,
			height: size.s_40,
			alignItems: 'center',
			justifyContent: 'center'
		},
		textContent: {
			color: colors.text,
			fontSize: size.s_14,
			fontWeight: '400'
		},
		modalFooter: {
			flexDirection: 'row',
			alignItems: 'center'
		},
		button: {
			padding: size.s_10,
			borderWidth: size.s_2,
			borderColor: colors.borderDim,
			width: '50%'
		},
		textButton: {
			color: colors.textLink,
			fontSize: size.label,
			fontWeight: '400',
			textAlign: 'center'
		}
	});
