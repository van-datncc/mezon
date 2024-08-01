import { Attributes, Colors, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		mainList: {
			height: '100%',
			width: '82%',
			borderTopLeftRadius: 20,
			overflow: 'hidden',
			backgroundColor: colors.secondary,
		},
		channelListSearch: {
			width: '100%',
			paddingHorizontal: 8,
			marginBottom: size.s_16,
			flexDirection: 'row',
			justifyContent: 'space-between',
			gap: size.s_8,
		},
		channelListSearchWrapperInput: {
			backgroundColor: Colors.tertiaryWeight,
			flex: 1,
			borderRadius: size.s_16,
			alignItems: 'center',
			paddingHorizontal: size.s_6,
			gap: 10,
			flexDirection: 'row',
			justifyContent: 'space-between',
		},
		channelListSearchInput: {
			height: size.s_34,
			padding: 0,
			flex: 1,
		},
		inviteIconWrapper: {
			alignItems: 'center',
			justifyContent: 'center',
			borderRadius: 50,
			backgroundColor: colors.primary,
			width: 40,
			height: 40,
		},
		searchBox: {
			backgroundColor: colors.primary,
			borderRadius: size.s_50,
			paddingHorizontal: Metrics.size.l,
			display: 'flex',
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'center',
			gap: Metrics.size.m,
			flexBasis: size.s_50,
			flexGrow: 1,
		},
		placeholderSearchBox: {
			color: colors.text,
			fontWeight: '600',
			fontSize: size.s_16,
		},
	});
