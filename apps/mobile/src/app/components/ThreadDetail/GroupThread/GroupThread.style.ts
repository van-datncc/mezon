import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	groupThread: {
		borderRadius: 8,
		overflow: 'hidden',
	},
	title: {
		color: Colors.textGray,
		fontWeight: '600',
		fontSize: size.label,
		marginBottom: size.s_10,
	},
});
