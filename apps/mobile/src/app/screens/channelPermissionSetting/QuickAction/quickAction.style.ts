import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		addButton: {
			position: 'absolute',
			right: size.s_20,
			bottom: size.s_30,
			padding: size.s_12,
			justifyContent: 'center',
			alignItems: 'center',
		},
		item: {
			flexDirection: 'row',
			alignItems: 'center',
			justifyContent: 'space-between',
			backgroundColor: colors.primary,
			borderRadius: size.s_10,
			padding: size.s_14,
			marginBottom: size.s_10,
			gap: size.s_12,
			borderColor: colors.border,
			borderWidth: 1
		},
		keyContainer: {
			borderWidth: 1,
			borderColor: colors.darkJade,
			alignSelf: 'flex-start',
			paddingHorizontal: size.s_8,
			borderRadius: size.s_6,
			backgroundColor: colors.darkJade
		},
		keyText: {
			color: colors.textStrong,
			fontSize: size.s_14
		},
		valueText: {
			color: colors.textStrong,
			fontSize: size.s_16,
			marginTop: size.s_6
		},
		edit: {
			marginHorizontal: size.s_10
		},
		delete: {
			marginLeft: size.s_10
		},
		modalContainer: {
			position: 'absolute',
			top: 0,
			left: 0,
			right: 0,
			bottom: 0,
			backgroundColor: 'rgba(0,0,0,0.4)',
			justifyContent: 'center',
			alignItems: 'center',
		},
		modalBox: {
			backgroundColor: colors.secondary,
			padding: size.s_20,
			borderRadius: size.s_10,
			width: '90%'
		},
		input: {
			borderWidth: 1,
			borderColor: colors.border,
			backgroundColor: colors.bgInputPrimary,
			borderRadius: size.s_6,
			padding: size.s_10,
			color: colors.text,
			marginBottom: size.s_12
		}
	});
