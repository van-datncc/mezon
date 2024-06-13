import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	emptyPinMessageBox: { marginTop: size.s_50, flexDirection: 'column', gap: size.s_10, marginVertical: size.s_10, alignItems: 'center' },
	emptyPinMessageTitle: {
		maxWidth: 300,
		fontSize: size.label,
		color: Colors.textGray,
		fontWeight: '500',
		textAlign: 'center',
		marginTop: size.s_30,
	},
	emptyPinMessageHeaderText: { fontSize: size.label, color: Colors.caribbeanGreen, fontWeight: '500', textAlign: 'center' },
	emptyPinMessageDescription: { maxWidth: 400, fontSize: size.label, color: Colors.textGray, fontWeight: '500', textAlign: 'center' },
});
