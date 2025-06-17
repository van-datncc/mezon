import {Attributes, Fonts, size} from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			backgroundColor: colors.secondary,
			marginHorizontal: size.s_20,
			borderRadius: size.s_10,
			marginTop: size.s_20,
			padding: size.s_20
		},

		name: {
			color: colors.textStrong,
			fontWeight: '700',
			fontSize: Fonts.size.h5
		},

		username: {
			color: colors.text,
			fontSize: Fonts.size.small
		},

		nameWrapper: {
			marginBottom: size.s_20
		}
	});
