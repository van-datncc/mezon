import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		normalText: { width: '100%', marginBottom: size.s_10, height: size.s_24, borderRadius: size.s_8 },
		smallText: { width: '50%', marginBottom: size.s_10, height: size.s_16, borderRadius: size.s_8 },
		avatar: { width: size.s_40, height: size.s_40, borderRadius: 50 },
		messageItem: {
			flexDirection: 'row',
			gap: size.s_8,
			marginTop: size.s_10,
			marginHorizontal: size.s_10,
			paddingHorizontal: size.s_8,
			paddingVertical: size.s_6,
			borderRadius: size.s_10
		}
	});
