import { registerGlobals } from '@livekit/react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry, NativeModules } from 'react-native';
import { enableFreeze, enableScreens } from 'react-native-screens';
import App from './app/navigation';
import CustomIncomingCall from './app/screens/customIncomingCall';
import { setupIncomingCall } from './app/utils/pushNotificationHelpers';
notifee.onBackgroundEvent(async () => {});
if (__DEV__) {
	require('../reactotronConfig');
}
const checkAndReloadIfJSIUnavailable = () => {
	try {
		// Check for JSI availability
		if (global?.__turboModuleProxy == null || !global?.nativeCallSyncHook || !global?.__turboModuleProxy) {
			console.warn('JSI not available - attempting to reload');
			const DevSettings = NativeModules?.DevSettings;
			if (DevSettings?.reload) {
				DevSettings.reload();
			} else {
				NativeModules?.DevMenu?.reload?.();
			}
		}
	} catch (error) {
		console.error('JSI check failed:', error);
	}
};

checkAndReloadIfJSIUnavailable();

registerGlobals();
enableScreens(true);
enableFreeze(true);
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	const offer = remoteMessage?.data?.offer;
	if (offer) {
		await setupIncomingCall(offer as string);
	} else {
		// await createLocalNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
	}
});
AppRegistry.registerComponent('ComingCallApp', () => CustomIncomingCall);
AppRegistry.registerComponent('Mobile', () => App);
