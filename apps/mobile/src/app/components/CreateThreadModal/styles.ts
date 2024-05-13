import { Colors, size } from '@mezon/mobile-ui';
import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
	createChannelContainer: {
    backgroundColor: Colors.secondary,
    height: '100%',
    width: '100%',
    position: 'relative'
  },
  createChannelContent: {
    position: 'absolute',
    top: '50%',
    left: 10,
    right: 10,
    flexDirection: 'column',
    alignItems: 'center',
  },
  textNoThread: {
    fontSize: size.h5,
    lineHeight: 1.25 * 20,
    fontWeight: '600',
    color: '#f2f3f5',
    marginBottom: 8
  },
  textNotify: {
    textAlign: 'center',
    color: Colors.textGray,
    fontSize: size.label,
    lineHeight: 1.25 * 16,
    fontWeight: '400',
    marginBottom: 8
  },
  button: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.bgButton,
    borderRadius: 50,
    paddingVertical: 2,
    paddingHorizontal: 16,
    width: 150,
    height: 50,
    marginTop: 20
  },
  buttonText: {
    color: 'white',
    fontSize: size.medium,
    fontWeight: '500',
    lineHeight: 16,
    textAlign: 'center',
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: Colors.tertiaryWeight,
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

