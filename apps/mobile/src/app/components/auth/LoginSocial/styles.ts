import { IS_TABLET } from '@mezon/mobile-components';
import { Attributes, Metrics, brandColors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		googleButton: {
			backgroundColor: 'white',
			paddingVertical: Metrics.size.l,
			marginHorizontal: Metrics.size.xl,
			borderRadius: size.s_4,
			justifyContent: 'center',
			alignItems: 'center'
		},
		// Will fix later
		appleButton: {
			backgroundColor: 'black',
			paddingVertical: size.s_15,
			marginHorizontal: size.s_20,
			borderRadius: size.s_4,
			justifyContent: 'center',
			alignItems: 'center'
		},

		socialButtonsContainer: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			width: '100%',
			gap: Metrics.size.m
		},
		socialSigninButtonText: {
			color: brandColors.google,
			fontSize: size.s_16,
			lineHeight: IS_TABLET ? size.s_22 : size.s_18
		}
	});
