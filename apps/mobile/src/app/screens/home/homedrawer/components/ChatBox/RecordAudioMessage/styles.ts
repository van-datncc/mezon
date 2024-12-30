import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		boxIcon: {
			backgroundColor: colors.border,
			borderRadius: size.s_50,
			height: size.s_70,
			width: size.s_70,
			alignItems: 'center',
			justifyContent: 'center'
		},
		actionText: {
			fontSize: size.s_16,
			fontWeight: 'bold',
			color: colors.white,
			textAlign: 'center',
			marginVertical: size.s_10
		},
		title: {
			fontSize: size.s_16,
			color: colors.white,
			textAlign: 'center',
			marginVertical: size.s_20
		},
		containerAudioCustom: {
			width: '80%',
			padding: size.s_10
		},
		customLottie: {
			width: 140
		},
		soundLottie: {
			width: 120,
			height: 120
		},
		soundContainer: {
			position: 'relative',
			width: 120,
			height: 120
		},
		iconOverlay: {
			position: 'absolute',
			top: '50%',
			left: '50%',
			transform: [{ translateX: -12 }, { translateY: -12 }],
			zIndex: 999
		}
	});
