import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		datepicker: { borderWidth: 1, borderColor: colors.border, borderRadius: size.s_12, paddingVertical: size.s_12 }
	});
