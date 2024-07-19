import { Attributes, Metrics, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const style = (colors: Attributes) => StyleSheet.create({
	pinMessageItemWrapper: {
		flexDirection: 'row',
		gap: size.s_10,
		marginVertical: Metrics.size.s,
		justifyContent: 'space-between',
		alignItems: "center",
		backgroundColor: colors.secondary,
		padding: Metrics.size.l,
		borderRadius: 10
	},
	pinMessageItemBox: {
		flex: 1
	},
	pinMessageItemName: {
		fontSize: size.label,
		color: colors.textStrong,
		fontWeight: '600'
	},
	pinMessageItemClose: {
		borderRadius: 50
	},
});
