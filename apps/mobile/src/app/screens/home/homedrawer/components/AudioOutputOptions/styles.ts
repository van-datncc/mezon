import { Attributes, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) =>
	StyleSheet.create({
		optionContainer: {
			flex: 1,
			flexShrink: 1,
			flexGrow: 1,
			minWidth: size.s_150,
			backgroundColor: colors.primary
		},
		wrapperOption: {
			flexDirection: 'row',
			paddingHorizontal: size.s_10,
			paddingVertical: size.s_16,
			alignItems: 'center',
			gap: size.s_10,
			borderTopColor: '#3b3d44',
			borderTopWidth: 0.2
		},
		selectedOption: {
			backgroundColor: colors.secondaryLight
		},
		textOption: {
			color: colors.text,
			fontSize: size.s_13,
			fontWeight: '500',
			flex: 1
		},
		selectedText: {
			fontWeight: '600',
			color: colors.textStrong
		},
		content: {
			flexDirection: 'row',
			alignItems: 'center',
			flex: 1,
			gap: size.s_6,
			justifyContent: 'space-between'
		}
	});
