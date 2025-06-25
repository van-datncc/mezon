import { Attributes, baseColor, Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		container: {
			flexDirection: 'row',
			justifyContent: 'space-between',
			alignItems: 'center',
			backgroundColor: colors.primary,
			paddingBottom: size.s_2,
			marginBottom: size.s_10,
			borderBottomColor: colors.border,
			borderBottomWidth: 1,
			paddingHorizontal: size.s_16
		},
		flexRow: {
			flexDirection: 'row',
			alignItems: 'center',
			gap: size.s_14
		},

		text: {
			color: colors.textStrong
		},

		close: {
			height: '100%',
			padding: size.s_10,
			justifyContent: 'center',
			alignItems: 'center'
		},
		rightItem: {
			backgroundColor: baseColor.flamingo,
			paddingHorizontal: size.s_15,
			justifyContent: 'center',
			alignItems: 'center',
			paddingVertical: size.s_15
		},
		deleteButton: {
			justifyContent: 'center',
			alignItems: 'center'
		},
		deleteText: {
			color: Colors.white,
			fontWeight: 'bold',
			fontSize: size.s_14
		},
		wrapperForSale: {
			position: 'absolute',
			alignItems: 'center',
			justifyContent: 'center',
			left: size.s_4,
			bottom: 0,
			transform: 'rotate(320deg)',
			width: size.s_24,
			borderWidth: 1,
			borderColor: 'yellow',
			borderRadius: size.s_20,
			height: size.s_24,
			zIndex: 1,
			backgroundColor: colors.primary
		}
	});
