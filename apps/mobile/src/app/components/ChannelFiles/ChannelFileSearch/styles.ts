import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes, isTablet?: boolean) =>
	StyleSheet.create({
		searchFiles: {
			backgroundColor: isTablet ? colors.secondary : colors.primary,
			borderRadius: 40,
			alignItems: 'center',
			paddingHorizontal: size.s_12,
			flexDirection: 'row',
			justifyContent: 'space-between',
			marginHorizontal: size.s_12,
			marginBottom: size.s_8
		},

		searchInput: {
			borderRadius: 20,
			height: isTablet ? size.s_34 : size.s_50,
			color: colors.textStrong,
			paddingVertical: size.s_6,
			paddingHorizontal: size.s_12,
			fontSize: size.medium,
			flex: 1
		},

		defaultText: {
			color: colors.text,
			fontSize: size.medium
		}
	});
