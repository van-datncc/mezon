import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		channelItemTitle: {
			fontSize: size.s_15,
			fontWeight: '600',
			marginLeft: size.s_10,
			color: colors.channelNormal
		},
		channelItem: {
			paddingHorizontal: Metrics.size.m,
			flexDirection: 'row',
			alignItems: 'center',
			paddingVertical: size.s_8,
			borderRadius: 5,
			flex: 1
		}
	});
