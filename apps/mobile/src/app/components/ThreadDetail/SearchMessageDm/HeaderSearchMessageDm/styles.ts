import { Attributes, size, verticalScale } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		searchBox: {
			flexDirection: 'row',
			alignItems: 'center',
			backgroundColor: colors.bgInputPrimary,
			borderRadius: verticalScale(50),
			flex: 1,
			height: size.s_40,
			paddingHorizontal: size.s_10,
			justifyContent: 'space-between'
		},
		input: {
			color: colors.text,
			flex: 1
		}
	});
