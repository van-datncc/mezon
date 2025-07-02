import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	headerModal: { backgroundColor: Colors.transparent, paddingHorizontal: 0 },
	titleHeader: {
		width: '76%',
		textAlign: 'center'
	},
	option: {
		backgroundColor: Colors.secondary
	},
	durationText: {
		fontSize: size.label,
		color: Colors.textGray,
		fontWeight: '600',
		marginBottom: size.s_10,
		marginTop: size.s_30
	},
	titleModal: {
		flex: 1,
		textAlign: 'center',
		position: 'absolute',
		alignSelf: 'center',
		left: 0,
		right: 0,
		zIndex: -1
	}
});
