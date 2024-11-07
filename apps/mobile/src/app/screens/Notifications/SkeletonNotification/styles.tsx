import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		bigText: { marginBottom: size.s_10, height: size.s_30, width: '100%', borderRadius: size.s_8 },
		normalText: { marginTop: size.s_6, width: '100%', marginBottom: size.s_10, height: size.s_24, borderRadius: size.s_8 },
		smallText: { marginLeft: size.s_20, width: '50%', marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		mediumText: { marginLeft: size.s_20, width: '80%', marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		avatar: { width: size.s_40, height: size.s_40, borderRadius: 50 }
	});
