import { Colors } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';

export const styles = StyleSheet.create({

  bottomSheetContainer: {
    display: 'flex',
    alignItems: 'center',
  },
  optionText: {
     color: '#FFFFFF', fontFamily: 'bold', marginLeft: 10, fontSize: 16
  },
  settingOptions:{
    flexDirection: 'column',
    alignItems: 'center'
  },
  settingOptionsIcon: {
    backgroundColor: Colors.secondary,
    padding: 8,
    borderRadius: 50
  },
});
