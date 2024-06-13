import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	pinMessageItemWrapper: { flexDirection: 'row', gap: size.s_10, marginVertical: size.s_10, justifyContent: 'space-between' },
	pinMessageItemBox: { flex: 1 },
	pinMessageItemName: { fontSize: size.label, color: Colors.white, fontWeight: '600' },
	pinMessageItemClose: { backgroundColor: Colors.bgCharcoal, padding: size.s_4, borderRadius: 50 },
});
