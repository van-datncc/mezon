import messaging from '@react-native-firebase/messaging';
import { AppRegistry } from 'react-native';
import App from './src/app/navigation';
import CustomIncomingCall from './src/app/screens/customIncomingCall';
import { createLocalNotification, setupIncomingCall } from './src/app/utils/pushNotificationHelpers';

messaging().setBackgroundMessageHandler(async (remoteMessage) => {
	const title = remoteMessage?.notification?.title;
	if (title === 'Incoming call' || (title && (title.includes('started a video call') || title.includes('started a audio call')))) {
		await setupIncomingCall(remoteMessage?.notification?.body);
	} else {
		await createLocalNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
	}
});
AppRegistry.registerComponent('MyReactNativeApp', () => CustomIncomingCall);
AppRegistry.registerComponent('Mobile', () => HeadlessCheck);

function HeadlessCheck({ isHeadless }) {
	if (isHeadless) {
		return null;
	}

	return <App />;
}
