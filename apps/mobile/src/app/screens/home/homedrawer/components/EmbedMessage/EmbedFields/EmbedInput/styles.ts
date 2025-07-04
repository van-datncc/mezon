import { Attributes, size } from '@mezon/mobile-ui';
import { Platform, StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		TextInput: {
			borderWidth: 1,
			borderColor: colors.border,
			paddingHorizontal: size.s_12,
			paddingVertical: size.s_8,
			borderRadius: size.s_12,
			marginBottom: size.s_10,
			color: colors.textStrong,
			fontSize: size.medium,
			flexGrow: 1,
			backgroundColor: colors.secondary,
			minHeight: size.s_40,
			paddingTop: Platform.OS === 'ios' ? size.s_10 : size.s_8
		}
	});
