import { IS_TABLET } from '@mezon/mobile-components';
import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTabletLandscape?: boolean) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.primary,
			justifyContent: 'center',
			width: isTabletLandscape ? '50%' : IS_TABLET ? '80%' : '100%',
			height: isTabletLandscape ? '90%' : IS_TABLET ? '70%' : '100%',
			borderRadius: IS_TABLET ? size.s_20 : 0,
			paddingHorizontal: IS_TABLET ? size.s_10 : 0
		},
		gradient: {
			width: '100%',
			height: '100%',
			justifyContent: 'center',
			alignItems: 'center'
		},
		headerContainer: {
			alignItems: 'center',
			paddingVertical: Metrics.size.m,
			paddingHorizontal: Metrics.size.xl
		},
		headerTitle: {
			fontSize: isTabletLandscape ? size.s_40 : size.s_34,
			textAlign: 'center',
			fontWeight: 'bold',
			color: colors.textStrong
		},
		headerContent: {
			fontSize: size.s_16,
			lineHeight: size.s_20,
			textAlign: 'center',
			color: colors.text
		},

		signupContainer: {
			marginHorizontal: Metrics.size.xl,
			justifyContent: 'center',
			paddingVertical: Metrics.size.xl,
			flexDirection: 'row',
			alignItems: 'center'
		}
	});
