import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		totalTime: {
			color: colors.text,
			fontSize: size.s_12
		},
		currentTime: {
			color: colors.text,
			fontSize: size.s_12,
			marginLeft: size.s_40
		},
		soundLottie: { width: size.s_60 * 2, height: size.s_4, flex: 1 }
	});
