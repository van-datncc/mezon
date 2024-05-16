import { Colors, size } from '@mezon/mobile-ui';
import { StyleSheet } from 'react-native';
export const styles = StyleSheet.create({
  notifyContainer: {
    paddingHorizontal: 20
  },
  notifyHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10
  },
  notifyContent: {
    flex: 1,
  },
  notifyHeaderTitle: {
    color: Colors.titleSteelGray,
    fontSize: size.label,
    fontWeight: '400',
    marginBottom: 5
  },
  notifyDuration: {
    color: Colors.titleSteelGray,
  },
  boxImage: {
    width: 60,
    height: 60,
    borderRadius: 50,
    marginBottom: 10
  },
  image: {
    width: '90%',
    height: '90%',
    borderRadius: 50
  },
  boxImageChar: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.bgDarkCharcoal,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10
  },
  contentMessage: {
    marginBottom: 10,
    borderLeftColor: Colors.borderNeutralDisable,
    borderLeftWidth: 2,
    paddingLeft: 8
  }
})
