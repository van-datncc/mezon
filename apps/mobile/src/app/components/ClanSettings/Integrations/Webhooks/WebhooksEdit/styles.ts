import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		image: { width: size.s_60, height: size.s_60, borderRadius: size.s_30 },
		textRecommend: {
			fontSize: size.s_14,
			color: colors.textDisabled,
			fontWeight: '500',
			marginTop: size.s_20
		},
		label: {
			fontSize: size.s_14,
			color: colors.text,
			fontWeight: '500',
			marginBottom: size.s_10
		},
		btnLink: {
			backgroundColor: colors.secondary,
			padding: size.s_10,
			borderRadius: size.s_10,
			flexDirection: 'row',
			alignItems: 'center'
		},
		textBtnLink: {
			fontSize: size.s_14,
			color: colors.text,
			fontWeight: '500',
			flexBasis: '85%',
			textAlign: 'left',
			height: size.s_100
		},
		btnResetToken: {
			backgroundColor: baseColor.bgSuccess,
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_10,
			borderRadius: size.s_14,
			marginTop: size.s_20
		},
		btnDelete: {
			backgroundColor: baseColor.bgDanger,
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_10,
			borderRadius: size.s_14,
			marginTop: size.s_20
		},
		textBtnDelete: {
			fontSize: size.s_14,
			color: colors.white,
			fontWeight: '500',
			textAlign: 'center'
		},
		textLink: {
			fontSize: size.s_14,
			color: colors.textLink,
			fontWeight: '400',
			paddingHorizontal: size.s_10
		},
		headerBs: {
			fontSize: size.s_16,
			color: colors.white,
			fontWeight: '600',
			textAlign: 'center'
		},
		uploadIcon: { position: 'absolute', right: 0, top: -2 },
		upload: {
			position: 'relative'
		},
		textHeader: {
			fontSize: size.s_16,
			color: baseColor.blurple,
			fontWeight: '500'
		}
	});
