import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	threadItemWrapper: {
		flexDirection: 'row',
		backgroundColor: Colors.bgDarkCharcoal,
		alignItems: 'center',
		padding: size.s_10,
		justifyContent: 'space-between',
		borderTopColor: Colors.textGray,
		borderTopWidth: 0.2,
	},
	threadName: { fontSize: size.label, color: Colors.white, fontWeight: '500' },
	threadContent: { flexDirection: 'row', alignItems: 'center' },
	textThreadCreateBy: { fontSize: size.medium, color: Colors.textGray, fontWeight: '500' },
	bullet: { marginHorizontal: 5, fontSize: size.s_18, color: Colors.textGray, marginLeft: size.s_10 },
	createTime: { fontSize: size.medium, color: Colors.textGray, fontWeight: '500' },
	messageContent: { marginLeft: size.s_6, fontSize: size.medium, color: Colors.textGray, fontWeight: '500', maxWidth: 170 },
});
