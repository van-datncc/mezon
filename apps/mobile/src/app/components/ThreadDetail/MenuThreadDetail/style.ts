import { Colors, Fonts } from '@mezon/mobile-ui';
import { Dimensions, StyleSheet } from 'react-native';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column"
  },

  channelLabelWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 60
  },

  channelLabel: {
    color: Colors.white,
    fontWeight: "700",
    marginLeft: 10,
    fontSize: Fonts.size.h5
  },
});
