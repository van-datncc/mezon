import { channelsActions, messagesActions } from '@mezon/store';
import { getStoreAsync } from '@mezon/store-mobile';
import notifee, { AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import { clanAndChannelIdLinkRegex } from './helpers';
const IS_ANDROID = Platform.OS === 'android';

export const createLocalNotification = async (title: string, body: string, data: { [key: string]: string | object }) => {
	try {
		const channelId = await notifee.createChannel({
			id: 'default',
			name: 'mezon',
		});
		await notifee.displayNotification({
			title: title || '',
			body: body,
			data: data,
			android: {
				channelId,
				smallIcon: 'ic_notification',
				color: '#000000',
				pressAction: {
					id: 'default',
				},
			},
			ios: {
				critical: true,
				criticalVolume: 0.5,
				foregroundPresentationOptions: {
					badge: true,
					banner: true,
					list: true,
					sound: true,
				},
			},
		});
	} catch (err) {
		console.log('Tom log  => err', err);
	}
};

export const handleFCMToken = async () => {
	const authStatus = await messaging().requestPermission();

	const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || messaging.AuthorizationStatus.PROVISIONAL;

	if (enabled) {
		const fcmtoken = await messaging().getToken();
		if (fcmtoken) {
			try {
				return fcmtoken;
			} catch (error) {
				console.log('Error setting fcmtoken to user');
			}
		}
	}
};

const navigateToNotification = async (notification: any) => {
	const link = notification?.data?.link;
	if (link) {
		const linkMatch = link.match(clanAndChannelIdLinkRegex);
		const store = await getStoreAsync();

		const clanId = linkMatch[1];
		const channelId = linkMatch[2];
		store.dispatch(messagesActions.jumpToMessage({ messageId: '', channelId: channelId }));
		store.dispatch(channelsActions.joinChannel({ clanId: clanId ?? '', channelId: channelId, noFetchMembers: false }));
		// TODO: handle navigation
		// handleRemoteNotificationNavigation(notification.data.action, notification);
	}
};

const processNotification = ({ notification, navigation, time = 0 }) => {
	if (time) {
		setTimeout(() => {
			navigateToNotification(notification);
		}, time);
	} else {
		navigateToNotification(notification);
	}
};

export const setupNotificationListeners = async (navigation, dispatch) => {
	await notifee.createChannel({
		id: 'default',
		name: 'mezon',
		importance: AndroidImportance.HIGH,
	});

	if (IS_ANDROID) {
		messaging()
			.getInitialNotification()
			.then(async (remoteMessage) => {
				console.log('Notification caused app to open from quit state:');

				if (remoteMessage?.notification?.title) {
					processNotification({
						notification: { ...remoteMessage?.notification, data: remoteMessage?.data },
						navigation,
						time: 2500,
					});
				}
			});
	}

	messaging().onNotificationOpenedApp((remoteMessage) => {
		console.log('Notification caused app to open from background state:');

		processNotification({
			notification: { ...remoteMessage?.notification, data: remoteMessage?.data },
			navigation,
			time: 2500,
		});
	});

	return notifee.onForegroundEvent(({ type, detail }) => {
		switch (type) {
			case EventType.DISMISSED:
				console.log('User dismissed notification', detail.notification);

				break;
			case EventType.PRESS:
				processNotification({
					notification: detail.notification,
					navigation,
				});
				console.log('User pressed notification', detail.notification);

				break;
		}
	});
};
