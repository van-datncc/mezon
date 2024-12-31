import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		currentTime: {
			color: colors.text,
			fontSize: size.s_14,
			fontWeight: 'bold'
		},
		soundLottie: { width: 150, height: size.s_4 },
		container: {
			width: '80%',
			backgroundColor: baseColor.bgDeepLavender,
			padding: size.s_18,
			borderRadius: size.s_40,
			marginVertical: size.s_2,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: size.s_20
		}
	});
