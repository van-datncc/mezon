import { Attributes, baseColor, Fonts, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		title: {
			color: colors.textStrong,
			fontSize: Fonts.size.h6,
			textAlign: 'center'
		},

		subtitle: {
			color: colors.text,
			fontSize: Fonts.size.h8,
			textAlign: 'center'
		},

		bottomDescription: {
			color: colors.text,
			fontSize: Fonts.size.h8,
			marginVertical: Metrics.size.l
		},

		headerSection: {
			marginVertical: Metrics.size.xl
		},

		container: {
			paddingHorizontal: Metrics.size.xl,
			backgroundColor: colors.primary,
			flex: 1
		},

		input: {
			backgroundColor: colors.secondary
		},

		feedSection: {
			flexBasis: 10,
			flexGrow: 1
		},

		btnWrapper: {
			paddingVertical: Metrics.size.xl,
			backgroundColor: colors.primary
		},
		titleMezonBtn: { fontSize: Fonts.size.h7, color: baseColor.white, fontWeight: '600' },
		mezonBtn: { backgroundColor: baseColor.blurple },
		searchText: { paddingHorizontal: size.s_10 },
		fakeInput: {
			backgroundColor: colors.bgInputPrimary,
			borderRadius: size.s_10,
			alignItems: 'center',
			padding: size.s_12,
			flexDirection: 'row'
		},
		inputValue: {
			color: colors.text,
			paddingHorizontal: size.s_10
		},
		items: {
			flexDirection: 'row',
			paddingHorizontal: size.s_8,
			paddingVertical: size.s_12,
			marginBottom: size.s_10,
			borderRadius: size.s_12,
			borderWidth: 1,
			borderColor: colors.border,
			alignItems: 'center',
			backgroundColor: colors.secondary
		}
	});
