import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		totalTime: {
			color: colors.text,
			fontSize: size.s_12
		},
		currentTime: {
			color: colors.text,
			fontSize: size.s_14,
			fontWeight: 'bold'
		},
		soundLottie: { width: size.s_100, height: size.s_4 },
		container: { width: '60%', backgroundColor: baseColor.bgDeepLavender, padding: size.s_6, borderRadius: size.s_30, marginVertical: size.s_2 }
	});
