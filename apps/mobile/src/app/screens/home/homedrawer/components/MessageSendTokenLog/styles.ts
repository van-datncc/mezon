import { Attributes, baseColor, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			width: size.s_100 * 2.5,
			borderRadius: size.s_12,
			overflow: 'hidden',
			marginTop: size.s_4,
			paddingHorizontal: size.s_20,
			paddingVertical: size.s_16,
			backgroundColor: colors.secondaryLight
		},
		info: {
			flexDirection: 'row',
			justifyContent: 'center',
			marginBottom: size.s_4
		},
		title: {
			color: colors.text,
			fontSize: size.medium,
			fontWeight: 'bold'
		},
		lightTitle: {
			color: colors.text,
			fontSize: size.small
		},
		seperatedItem: {
			height: 1,
			backgroundColor: colors.borderDim
		},
		transaction: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		buttonTitle: {
			marginTop: size.s_4,
			color: baseColor.blurple,
			fontSize: size.s_16,
			fontWeight: 'bold'
		}
	});
