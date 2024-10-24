import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		categoryItemTitle: {
			textTransform: 'uppercase',
			fontSize: size.s_13,
			fontWeight: 'bold',
			color: colors.text
		},
		categoryItem: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
			paddingVertical: size.s_10
		}
	});
