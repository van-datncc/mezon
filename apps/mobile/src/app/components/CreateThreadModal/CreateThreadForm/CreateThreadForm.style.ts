import {StyleSheet} from 'react-native';
export const styles = StyleSheet.create({
	createChannelContainer: {
    backgroundColor: '#2b2d31',
    height: '100%',
    width: '100%',
    position: 'relative'
  },
  createChannelContent: {
    position: 'absolute',
    top: '35%',
    width: '100%',
    paddingHorizontal: 10
  },
  createChannelIcon: {
    height: 60,
    width: 60,
    backgroundColor: '#313338',
    borderRadius: 50,
    marginBottom: 10
  },
  threadName: {
    fontSize: 16,
    lineHeight: 1.25 * 16,
    fontWeight: '600',
    color: '#f1f2f4',
    marginBottom: 5
  },
  threadPolicy: {
    backgroundColor: '#383a40',
    marginTop: 15,
    borderRadius: 8,
    flexDirection: 'row',
    padding: 10,
    gap: 20
  },
  threadPolicyTitle: {
    fontSize: 16,
    lineHeight: 1.25 * 16,
    fontWeight: '600',
    color: '#f1f2f4'
  },
  threadPolicyContent: {
    fontSize: 16,
    lineHeight: 1.25 * 16,
    fontWeight: '400',
    color: '#dedce1'
  },
  inputThreadName: {
    borderRadius: 6,
    backgroundColor: '#1e1f22',
    borderColor: '#43464b',
    borderWidth: 1,
    fontSize: 16,
    fontWeight: '500',
    color: 'white'
  },
  threadPolicyInfo: {
    flex: 1,
  },
  iconContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    backgroundColor: '#313338',
    marginBottom: 16,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
});

