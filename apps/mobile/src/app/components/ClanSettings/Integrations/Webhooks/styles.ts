import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		description: {
			fontSize: size.s_12,
			color: colors.textDisabled,
			fontWeight: '400',
			marginBottom: size.s_10
		},
		textLink: {
			fontSize: size.s_12,
			color: colors.textLink,
			fontWeight: '400'
		},
		stickyNewButton: {
			position: 'absolute',
			bottom: 24,
			right: 24,
			zIndex: 100,
			backgroundColor: colors.bgViolet,
			borderRadius: size.s_10,
			paddingHorizontal: size.s_12,
			paddingVertical: size.s_12,
			shadowColor: colors.black,
			shadowOffset: { width: 0, height: 2 },
			shadowOpacity: 0.2,
			shadowRadius: 4,
			elevation: 5,
		},
		stickyNewButtonText: {
			color: colors.text,
			fontWeight: 'bold',
			fontSize: size.s_16,
			textAlign: 'center',
		},
	});
