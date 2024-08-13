import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		clansBox: {
			marginTop: size.s_10,
		},
		serverItem: {
			marginBottom: size.s_10,
		},
		serverName: {
			flexDirection: 'row',
			gap: size.s_16,
			alignItems: 'center',
		},
		wrapperPlusClan: {
			height: verticalScale(50),
			width: verticalScale(50),
			borderRadius: verticalScale(50),
			overflow: 'hidden',
			alignItems: 'center',
			justifyContent: 'center',
			backgroundColor: colors.secondary,
		},
		createClan: {
			width: '100%',
			flexDirection: 'row',
			alignItems: 'center',
			borderRadius: 8,
			marginTop: size.s_10,
		},
		clanName: {
			color: colors.textStrong,
			fontSize: size.label,
			fontWeight: '400',
			maxWidth: 150,
		},

		activeClanItem: {
			backgroundColor: colors.secondaryLight,
		},
		activeClanName: {
			fontWeight: '700',
			color: colors.white,
		},
		mt10: {
			marginTop: size.s_10,
		},
	});
