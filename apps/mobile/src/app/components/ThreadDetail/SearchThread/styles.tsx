import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const style = (colors: Attributes) =>
	StyleSheet.create({
		searchBar: {
			borderRadius: size.s_8,
			paddingHorizontal: size.s_12,
			backgroundColor: colors.secondary,
			color: colors.tertiary,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			gap: size.s_4
		},
		searchInput: {
			color: colors.text,
			fontSize: size.small,
			flex: 1
		}
	});
