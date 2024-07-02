import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	wrapper: { borderColor: Colors.textGray, marginTop: size.s_10 },
	option: { flexDirection: 'row', paddingHorizontal: size.s_6, paddingVertical: size.s_14, gap: size.s_20 },
});
