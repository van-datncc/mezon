import { Attributes, Fonts, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			flexWrap: 'wrap',
			paddingTop: size.s_6
		},
		channelTitle: {
			fontSize: Fonts.size.h7,
			color: colors.textStrong,
			fontWeight: 'bold'
		},
		description: {
			fontSize: Fonts.size.h7,
			color: colors.textStrong
		}
	});
