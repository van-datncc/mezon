import { registerGlobals } from '@livekit/react-native';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import { enableScreens } from 'react-native-screens';
import App from './app/navigation';
import CustomIncomingCall from './app/screens/customIncomingCall';
import { createLocalNotification, setupIncomingCall } from './app/utils/pushNotificationHelpers';

const isValidString = (value: unknown): value is string => {
	return typeof value === 'string' && value.trim().length > 0;
};

notifee.onBackgroundEvent(async () => { });

registerGlobals();
enableScreens(true);

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	try {
		const offer = remoteMessage?.data?.offer;

		// Safe handling of offer data
		if (offer && isValidString(offer)) {
			await setupIncomingCall(offer);
			return;
		}

		// Safe handling of notification data
		if (!remoteMessage?.notification && remoteMessage?.data) {
			const { title, body } = remoteMessage.data;

			if (isValidString(title) && isValidString(body)) {
				await createLocalNotification(title, body, remoteMessage.data);
			}
		}
	} catch (error) {
		console.error('Error handling background message:', error);
	}
});

AppRegistry.registerComponent('ComingCallApp', () => CustomIncomingCall);
AppRegistry.registerComponent('Mobile', () => App);
