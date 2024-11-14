import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		searchMessage: {
			backgroundColor: colors.tertiary,
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			paddingHorizontal: size.s_10,
			borderRadius: size.s_6
		},
		searchInput: {
			padding: 5,
			color: colors.textDisabled,
			flex: 1
		}
	});
