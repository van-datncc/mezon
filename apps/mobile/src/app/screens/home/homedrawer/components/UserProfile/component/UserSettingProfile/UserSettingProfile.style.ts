import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
	wrapper: { borderColor: Colors.borderGrayishBrown, marginTop: size.s_10, borderWidth: 0.8, borderRadius: size.s_10 , padding: size.s_10},
	option: { flexDirection: 'row', paddingHorizontal: size.s_6, paddingVertical: size.s_14, gap: size.s_20 },
  textOption: {
    color: Colors.white,
    fontSize: size.label,
    fontWeight: '700',
  }
});
