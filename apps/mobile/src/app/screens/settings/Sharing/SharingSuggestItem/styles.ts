import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	itemSuggestion: {
		paddingVertical: size.s_10,
		flexDirection: 'row',
		gap: size.s_18,
		alignItems: 'center'
	},
	titleSuggestion: {
		fontSize: size.label,
		color: Colors.tertiary
	}
});
