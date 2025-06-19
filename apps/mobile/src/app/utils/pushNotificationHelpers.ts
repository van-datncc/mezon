import {
	ActionEmitEvent,
	getUpdateOrAddClanChannelCache,
	load,
	save,
	STORAGE_CLAN_ID,
	STORAGE_DATA_CLAN_CHANNEL_CACHE,
	STORAGE_IS_DISABLE_LOAD_BACKGROUND,
	STORAGE_MY_USER_ID
} from '@mezon/mobile-components';
import { appActions, channelsActions, clansActions, directActions, getStoreAsync, topicsActions, usersClanActions } from '@mezon/store-mobile';
import notifee, { EventType } from '@notifee/react-native';
import {
	AndroidBadgeIconType,
	AndroidCategory,
	AndroidImportance,
	AndroidVisibility,
	NotificationAndroid
} from '@notifee/react-native/src/types/NotificationAndroid';
import { NotificationIOS } from '@notifee/react-native/src/types/NotificationIOS';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
import { safeJSONParse } from 'mezon-js';
import { Alert, DeviceEventEmitter, Linking, NativeModules, PermissionsAndroid, Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import { PERMISSIONS, requestMultiple, RESULTS } from 'react-native-permissions';
import { APP_SCREEN } from '../navigation/ScreenTypes';
import { clanAndChannelIdLinkRegex, clanDirectMessageLinkRegex } from './helpers';

// Type definitions and validation helpers
interface VoIPManagerType {
	registerForVoIPPushes(): Promise<string>;
	getVoIPToken(): Promise<string>;
	reportIncomingCall(callId: string, callerName: string, callerNumber: string, hasVideo: boolean): Promise<string>;
	endCall(callId: string): Promise<string>;
}

const isNotificationAlreadyDisplayed = async (data: Record<string, any>): Promise<boolean> => {
	try {
		const displayedNotifications = await notifee.getDisplayedNotifications();
		if (displayedNotifications?.length === 0) {
			return false;
		}
		const isAlreadyDisplayed = displayedNotifications.some((notification) => {
			return JSON.stringify(notification.notification?.data?.message) == JSON.stringify(data?.message);
		});
		return isAlreadyDisplayed;
	} catch (error) {
		console.error('Error checking displayed notifications:', error);
		return false;
	}
};

// Safe validation helpers
const isValidString = (value: unknown): value is string => {
	return typeof value === 'string' && value.trim().length > 0;
};

const isValidObject = (value: unknown): value is Record<string, unknown> => {
	return value !== null && typeof value === 'object';
};

const validateNotificationData = (data: Record<string, unknown> | undefined): data is Record<string, string | object> => {
	return isValidObject(data) && Object.keys(data).length > 0;
};

const safeGetChannelFromData = (data: Record<string, unknown>): string | null => {
	const channel = data?.channel;
	return isValidString(channel) ? channel : null;
};

export const checkNotificationPermission = async () => {
	try {
		if (Platform.OS === 'ios') await notifee.requestPermission();

		if (Platform.OS === 'android' && Platform.Version >= 33) {
			await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS);
		} else {
			const authorizationStatus = await messaging().hasPermission();

			if (authorizationStatus === messaging.AuthorizationStatus.NOT_DETERMINED) {
				await requestNotificationPermission();
			}
		}
	} catch (error) {
		console.error('Error checking notification permission:', error);
	}
};

const requestNotificationPermission = async () => {
	try {
		await messaging().requestPermission({
			alert: true,
			sound: true,
			badge: true
		});
	} catch (error) {
		Alert.alert('Notification Permission', 'Notification permission denied.', [
			{
				text: 'Cancel',
				style: 'cancel'
			},
			{
				text: 'OK',
				onPress: () => {
					openAppSettings();
				}
			}
		]);
	}
};

const openAppSettings = () => {
	try {
		if (Platform.OS === 'ios') {
			Linking.openURL('app-settings:');
		} else {
			Linking.openSettings();
		}
	} catch (error) {
		console.error('Error opening app settings:', error);
	}
};

const getConfigDisplayNotificationAndroid = async (data: Record<string, string | object>): Promise<NotificationAndroid> => {
	const defaultConfig: NotificationAndroid = {
		visibility: AndroidVisibility.PUBLIC,
		channelId: 'default',
		smallIcon: 'ic_notification',
		color: '#000000',
		sound: 'default',
		largeIcon: isValidString(data?.image) ? (data.image as string) : undefined,
		smallIconLevel: 10,
		importance: AndroidImportance.HIGH,
		showTimestamp: true,
		badgeIconType: AndroidBadgeIconType.LARGE,
		pressAction: {
			id: 'default',
			launchActivity: 'com.mezon.mobile.MainActivity'
		}
	};

	const channel = safeGetChannelFromData(data);
	if (!channel) {
		return defaultConfig;
	}

	try {
		const channelGroup = await getOrCreateChannelGroup(channel);
		const channelId = await createNotificationChannel(channel, channelGroup?.groupId);

		return {
			...defaultConfig,
			channelId,
			tag: channelId,
			sortKey: channelId,
			category: AndroidCategory.MESSAGE,
			groupId: channelGroup?.groupId,
			groupSummary: channelGroup?.isGroupSummary
		};
	} catch (error) {
		console.error('Error configuring Android notification:', error);
		return defaultConfig;
	}
};

const getOrCreateChannelGroup = async (channelId: string): Promise<{ groupId: string; isGroupSummary: boolean } | null> => {
	try {
		if (!isValidString(channelId)) return null;

		let groupId = '';
		const group = await notifee.getChannelGroup(channelId);
		const notifications = await notifee.getDisplayedNotifications();
		const existInNotification = notifications?.some?.((item) => item?.notification?.android?.groupId === channelId);

		if (group?.id) {
			groupId = group.id;
		} else {
			groupId = await notifee.createChannelGroup({
				id: channelId,
				name: channelId
			});
		}

		return {
			groupId,
			isGroupSummary: group === null || !existInNotification
		};
	} catch (error) {
		console.error('Error creating channel group:', error);
		return null;
	}
};

const createNotificationChannel = async (channelId: string, groupId: string): Promise<string> => {
	try {
		if (!isValidString(channelId) || !isValidString(groupId)) {
			throw new Error('Invalid channel or group ID');
		}

		return await notifee.createChannel({
			id: channelId,
			name: channelId,
			groupId,
			importance: AndroidImportance.HIGH,
			sound: 'default',
			visibility: AndroidVisibility.PUBLIC
		});
	} catch (error) {
		console.error('Error creating notification channel:', error);
		return 'default';
	}
};

const getConfigDisplayNotificationIOS = async (data: Record<string, string | object>): Promise<NotificationIOS> => {
	const defaultConfig: NotificationIOS = {
		critical: true,
		criticalVolume: 1.0,
		sound: 'default',
		foregroundPresentationOptions: {
			badge: true,
			banner: true,
			list: true,
			sound: true
		}
	};

	const channel = safeGetChannelFromData(data);
	return {
		...defaultConfig,
		threadId: channel || undefined
	};
};

export const createLocalNotification = async (title: string, body: string, data: Record<string, string | object>) => {
	try {
		// Input validation
		if (!isValidString(title) || !isValidString(body)) {
			console.error('Invalid notification title or body');
			return;
		}

		if (!validateNotificationData(data)) {
			console.error('Invalid notification data');
			return;
		}

		const myUserId = load(STORAGE_MY_USER_ID);
		const excludedMessages = ['video call', 'audio call', 'Untitled message'];

		// Skip if it's a call message or from the current user
		if (excludedMessages.some((text) => body.includes(text)) || myUserId === data?.sender) {
			return;
		}

		const configDisplayNotificationAndroid: NotificationAndroid =
			Platform.OS === 'android' ? await getConfigDisplayNotificationAndroid(data) : {};
		const configDisplayNotificationIOS: NotificationIOS = Platform.OS === 'ios' ? await getConfigDisplayNotificationIOS(data) : {};

		const notificationId = `${data?.sender || 'unknown'}_${data?.link || 'nolink'}_${Date.now()}`;
		const isAlreadyDisplayed = await isNotificationAlreadyDisplayed(data);
		if (isAlreadyDisplayed) {
			return;
		}
		await notifee.displayNotification({
			id: notificationId,
			title: title.trim(),
			body: body.trim(),
			subtitle: isValidString(data?.subtitle) ? (data.subtitle as string) : '',
			data: data,
			android: configDisplayNotificationAndroid,
			ios: configDisplayNotificationIOS
		});
	} catch (err) {
		console.error('Error creating local notification:', err);
	}
};

export const handleFCMToken = async (): Promise<string | undefined> => {
	try {
		const authStatus = await messaging().requestPermission({
			alert: true,
			sound: true,
			badge: true
		});

		const enabled = authStatus === messaging.AuthorizationStatus.AUTHORIZED || authStatus === messaging.AuthorizationStatus.PROVISIONAL;

		if (enabled) {
			const fcmtoken = await messaging().getToken();
			if (isValidString(fcmtoken)) {
				return fcmtoken;
			}
		}
	} catch (error) {
		console.error('Error handling FCM token:', error);
	}
	return undefined;
};

export const isShowNotification = (
	currentChannelId: string | undefined,
	currentDmId: string | undefined,
	remoteMessage: FirebaseMessagingTypes.RemoteMessage
): boolean => {
	try {
		if (!validateNotificationData(remoteMessage?.data)) {
			return false;
		}

		const link = remoteMessage.data?.link;
		if (!isValidString(link)) {
			return false;
		}

		const directMessageMatch = link.match(clanDirectMessageLinkRegex);
		const channelMessageMatch = link.match(clanAndChannelIdLinkRegex);

		const directMessageId = directMessageMatch?.[1] || '';
		const channelMessageId = channelMessageMatch?.[2] || '';

		const areOnChannel = currentChannelId === channelMessageId;
		const areOnDirectMessage = currentDmId === directMessageId;

		if (areOnChannel && currentDmId) {
			return true;
		}

		if ((channelMessageId && areOnChannel) || (directMessageId && areOnDirectMessage)) {
			return false;
		}

		return true;
	} catch (error) {
		console.error('Error checking notification visibility:', error);
		return false;
	}
};

export const navigateToNotification = async (store: any, notification: any, navigation: any, isTabletLandscape = false, time?: number) => {
	const link = notification?.data?.link;
	const topicId = notification?.data?.topic;
	if (link) {
		const linkMatch = link.match(clanAndChannelIdLinkRegex);

		// IF is notification to channel
		if (linkMatch) {
			const clanId = linkMatch?.[1];
			const channelId = linkMatch?.[2];
			if (navigation) {
				navigation.navigate(APP_SCREEN.HOME_DEFAULT as never);
			}
			store.dispatch(directActions.setDmGroupCurrentId(''));
			if (clanId && channelId) {
				const joinAndChangeClan = async (store: any, clanId: string) => {
					await Promise.allSettled([
						store.dispatch(clansActions.joinClan({ clanId: clanId })),
						store.dispatch(clansActions.changeCurrentClan({ clanId: clanId, noCache: true })),
					]);
				};

				await joinAndChangeClan(store, clanId);
				if (channelId) {
					store.dispatch(channelsActions.setCurrentChannelId({ clanId, channelId }));
					store.dispatch(
						channelsActions.joinChannel({
							clanId: clanId ?? '',
							channelId: channelId,
							noFetchMembers: false,
							isClearMessage: true,
							noCache: true
						})
					);
				}
				const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
				save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
				save(STORAGE_CLAN_ID, clanId);
			}
			store.dispatch(appActions.setLoadingMainMobile(false));
			if (topicId && topicId !== '0' && !!topicId) {
				await handleOpenTopicDiscustion(store, topicId, channelId, navigation);
			}
			setTimeout(() => {
				store.dispatch(appActions.setIsFromFCMMobile(false));
				save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
			}, 4000);
		} else {
			const linkDirectMessageMatch = link.match(clanDirectMessageLinkRegex);

			// IS message DM
			if (linkDirectMessageMatch) {
				const messageId = linkDirectMessageMatch[1];
				if (navigation) {
					await store.dispatch(directActions.setDmGroupCurrentId(messageId));
					if (isTabletLandscape) {
						navigation.navigate(APP_SCREEN.MESSAGES.HOME);
					} else {
						navigation.navigate(APP_SCREEN.MESSAGES.MESSAGE_DETAIL, { directMessageId: messageId });
					}
				}
				store.dispatch(appActions.setLoadingMainMobile(false));
				setTimeout(() => {
					store.dispatch(appActions.setIsFromFCMMobile(false));
					save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
				}, 4000);
			} else {
				store.dispatch(appActions.setLoadingMainMobile(false));
				setTimeout(() => {
					store.dispatch(appActions.setIsFromFCMMobile(false));
					save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
				}, 4000);
			}
		}
	} else {
		store.dispatch(appActions.setLoadingMainMobile(false));
		setTimeout(() => {
			store.dispatch(appActions.setIsFromFCMMobile(false));
			save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, false);
		}, 4000);
	}
};

const handleOpenTopicDiscustion = async (store: any, topicId: string, channelId: string, navigation: any) => {
	const promises = [];
	promises.push(store.dispatch(topicsActions.setCurrentTopicInitMessage(null)));
	promises.push(store.dispatch(topicsActions.setCurrentTopicId(topicId || '')));
	promises.push(store.dispatch(topicsActions.setIsShowCreateTopic(true)));

	await Promise.all(promises);

	if (navigation) {
		navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
			screen: APP_SCREEN.MESSAGES.TOPIC_DISCUSSION
		});
	}
};

const processNotification = async ({ notification, navigation, time = 0, isTabletLandscape = false }) => {
	const store = await getStoreAsync();
	save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, true);
	store.dispatch(appActions.setLoadingMainMobile(true));
	store.dispatch(appActions.setIsFromFCMMobile(true));
	if (time) {
		setTimeout(() => {
			navigateToNotification(store, notification, navigation, isTabletLandscape, time);
		}, time);
	} else {
		navigateToNotification(store, notification, navigation, isTabletLandscape);
	}
};

export const setupNotificationListeners = async (navigation, isTabletLandscape = false) => {
	messaging()
		.getInitialNotification()
		.then(async (remoteMessage) => {
			notifee
				.getInitialNotification()
				.then(async (resp) => {
					if (resp) {
						const store = await getStoreAsync();
						save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, true);
						store.dispatch(appActions.setIsFromFCMMobile(true));
						if (resp) {
							processNotification({
								notification: { ...resp?.notification, data: resp?.notification?.data },
								navigation,
								time: 1,
								isTabletLandscape
							});
						}
					}
				})
				.catch((err) => {
					console.error('*** err getInitialNotification', err);
				});
			if (remoteMessage) {
				const store = await getStoreAsync();
				save(STORAGE_IS_DISABLE_LOAD_BACKGROUND, true);
				store.dispatch(appActions.setIsFromFCMMobile(true));
				if (remoteMessage?.notification?.title) {
					processNotification({
						notification: { ...remoteMessage?.notification, data: remoteMessage?.data },
						navigation,
						time: 1,
						isTabletLandscape
					});
				}
			}
		});

	messaging().onNotificationOpenedApp(async (remoteMessage) => {
		processNotification({
			notification: { ...remoteMessage?.notification, data: remoteMessage?.data },
			navigation,
			time: 0,
			isTabletLandscape
		});
	});

	notifee.onBackgroundEvent(async ({ type, detail }) => {
		// const { notification, pressAction, input } = detail;
		if (type === EventType.PRESS && detail) {
			processNotification({
				notification: detail.notification,
				navigation,
				time: 1,
				isTabletLandscape
			});
		}
	});

	return notifee.onForegroundEvent(({ type, detail }) => {
		switch (type) {
			case EventType.DISMISSED:
				break;
			case EventType.PRESS:
				processNotification({
					notification: detail.notification,
					navigation,
					time: 1,
					isTabletLandscape
				});
				break;
		}
	});
};

export const setupCallKeep = async () => {
	const granted = await requestMultiple([PERMISSIONS.ANDROID.READ_PHONE_NUMBERS]);
	if (granted[PERMISSIONS.ANDROID.READ_PHONE_NUMBERS] !== RESULTS.GRANTED && Platform.OS === 'android') return false;
	try {
		const options = {
			ios: {
				appName: 'Mezon',
				supportsVideo: false,
				maximumCallGroups: '1',
				maximumCallsPerCallGroup: '1',
				includesCallsInRecents: false,
				ringtoneSound: 'ringing'
			},
			android: {
				alertTitle: 'Permissions required',
				alertDescription: 'Mezon needs to access your phone accounts to receive calls from mezon',
				cancelButton: 'Cancel',
				okButton: 'ok',
				selfManaged: true,
				additionalPermissions: [PERMISSIONS.ANDROID.WRITE_CALL_LOG],
				foregroundService: {
					channelId: 'com.mezon.mobile',
					channelName: 'Incoming Call',
					notificationTitle: 'Incoming Call',
					notificationIcon: 'ic_notification'
				}
			}
		};
		await RNCallKeep.setup(options);
		return true;
	} catch (error) {
		console.error('initializeCallKeep error:', (error as Error)?.message);
	}
};

export const getVoIPToken = async () => {
	try {
		const VoIPManager = NativeModules?.VoIPManager as VoIPManagerType;
		await VoIPManager.registerForVoIPPushes();
		return await VoIPManager.getVoIPToken();
	} catch (e) {
		return '';
	}
};

const listRNCallKeep = async (bodyData: any) => {
	try {
		RNCallKeep.addEventListener('answerCall', ({ callUUID }) => {
			for (let i = 0; i < 10; i++) {
				RNCallKeep.backToForeground();
			}
			setTimeout(() => {
				RNCallKeep.endCall(callUUID);
				DeviceEventEmitter.emit(ActionEmitEvent.GO_TO_CALL_SCREEN, { payload: bodyData });
			}, 2000);
		});
		RNCallKeep.addEventListener('endCall', ({ callUUID }) => {
			RNCallKeep.endCall(callUUID);
		});
	} catch (error) {
		/* empty */
	}
};
export const setupIncomingCall = async (body: string) => {
	try {
		const bodyData = safeJSONParse(body || '{}');
		if (bodyData?.offer === 'CANCEL_CALL') {
			const callID = '0731961b-415b-44f3-a960-dd94ef3372fc';
			RNCallKeep.endCall(callID);
			return;
		}
		// if (Platform.OS === 'ios') {
		// 	const options = {
		// 		playSound: true,
		// 		vibration: true,
		// 		sound: 'ringing',
		// 		vibrationPattern: [0, 500, 1000],
		// 		timeout: 30000
		// 	};
		// 	const callID = '6cb67209-4ef9-48c0-a8dc-2cec6cd6261d';
		// 	RNCallKeep.displayIncomingCall(callID, callID, `${bodyData?.callerName} is calling you`, 'number', true, options);
		// 	await listRNCallKeep(bodyData);
		// }
	} catch (error) {
		console.error('log  => setupIncomingCall', error);
		/* empty */
	}
};
