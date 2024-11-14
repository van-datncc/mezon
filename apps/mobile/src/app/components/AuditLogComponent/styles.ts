import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		headerRightText: {
			fontWeight: '500',
			fontSize: size.label,
			color: colors.bgViolet
		},
		headerRightBtn: {
			marginRight: size.s_10,
			padding: size.s_10
		},
		headerLeftBtn: {
			marginLeft: size.s_10,
			padding: size.s_10
		},
		filterBtn: {
			flexDirection: 'row',
			paddingVertical: size.s_10,
			paddingHorizontal: size.s_10,
			alignItems: 'center',
			justifyContent: 'space-between'
		},
		filterText: {
			fontWeight: '500',
			fontSize: size.s_18,
			color: colors.white
		},
		textFilterBtn: {
			fontWeight: '400',
			fontSize: size.s_14,
			color: colors.text
		}
	});
