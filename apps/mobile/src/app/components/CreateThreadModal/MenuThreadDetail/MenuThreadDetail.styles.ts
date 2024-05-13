import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  bottomSheetContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  bottomSheetContent:
    { flexDirection: 'row', alignItems: 'center', height: 60 }
  ,
  optionText: {
     color: Colors.white, fontFamily: 'bold', marginLeft: 10, fontSize: size.label
  },
  settingOptions:{
    flexDirection: 'column',
    alignItems: 'center'
  },
  settingOptionsIcon: {
    backgroundColor: Colors.tertiaryWeight,
    padding: 8,
    borderRadius: 50
  },
  channelLabel: { color: Colors.white, fontFamily: 'bold', marginLeft: 10, fontSize: size.label },
  iconContainer: {flexDirection: 'row', alignItems: 'center', gap: 20}
});
