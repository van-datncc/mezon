import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		input: { height: size.s_40, width: '100%', borderRadius: size.s_8, marginTop: size.s_20 },
		bigText: { marginBottom: size.s_10, height: size.s_30, width: '30%', borderRadius: size.s_8, marginTop: size.s_20 },
		normalText: { marginTop: size.s_6, width: '50%', marginBottom: size.s_10, height: size.s_24, borderRadius: size.s_8 },
		smallText: { width: '30%', marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		mediumText: { width: '50%', marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		dropdown: { width: size.s_40, height: size.s_40, borderRadius: size.s_4 }
	});
