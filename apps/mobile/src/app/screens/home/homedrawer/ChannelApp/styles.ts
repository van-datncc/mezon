import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flex: 1,
			backgroundColor: colors.primary
		},
		topBar: {
			padding: size.s_10,
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center'
		},
		row: {
			flexDirection: 'row',
			gap: size.s_10
		},
		backButton: {
			height: size.s_40,
			width: size.s_40,
			borderRadius: size.s_20,
			backgroundColor: colors.bgInputPrimary,
			justifyContent: 'center',
			alignItems: 'center'
		},
		title: {
			fontSize: size.s_20,
			fontWeight: '500',
			color: colors.textStrong
		}
	});
