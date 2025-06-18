import { ChatContext, useAuth } from '@mezon/core';
import {
	ActionEmitEvent,
	STORAGE_CHANNEL_CURRENT_CACHE,
	STORAGE_DATA_CLAN_CHANNEL_CACHE,
	STORAGE_KEY_TEMPORARY_ATTACHMENT,
	STORAGE_KEY_TEMPORARY_INPUT_MESSAGES,
	STORAGE_MY_USER_ID,
	load,
	remove
} from '@mezon/mobile-components';
import {
	DMCallActions,
	appActions,
	authActions,
	channelsActions,
	clansActions,
	directActions,
	getStoreAsync,
	messagesActions,
	selectCurrentChannel,
	selectCurrentClan,
	selectDmGroupCurrentId,
	selectLoadingMainMobile
} from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { ChannelMessage, WebrtcSignalingFwd, WebrtcSignalingType, safeJSONParse } from 'mezon-js';
import moment from 'moment/moment';
import React, { useCallback, useContext, useEffect, useRef, useState } from 'react';
import { DeviceEventEmitter, Linking, Platform, StatusBar } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import MezonConfirm from '../../componentUI/MezonConfirm';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import { Sharing } from '../../screens/settings/Sharing';
import NotificationPreferences from '../../utils/NotificationPreferences';
import { clanAndChannelIdLinkRegex, clanDirectMessageLinkRegex } from '../../utils/helpers';
import { checkNotificationPermission, isShowNotification, navigateToNotification } from '../../utils/pushNotificationHelpers';
import { APP_SCREEN } from '../ScreenTypes';

export const AuthenticationLoader = () => {
	const navigation = useNavigation<any>();
	const { userProfile } = useAuth();
	const currentClan = useSelector(selectCurrentClan);
	const mezon = useMezon();
	const currentChannel = useSelector(selectCurrentChannel);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const isLoadingMain = useSelector(selectLoadingMainMobile);
	const dispatch = useDispatch();
	const [fileShared, setFileShared] = useState<any>();
	const currentDmGroupIdRef = useRef(currentDmGroupId);
	const currentChannelRef = useRef(currentClan);
	useCheckUpdatedVersion();
	const { onchannelmessage } = useContext(ChatContext);

	useEffect(() => {
		const getUrl = async () => {
			try {
				const url = await Linking.getInitialURL();
				if (url) {
					await onNavigationDeeplink(url);
				}
			} catch (error) {
				console.error('Error getting initial URL:', error);
			}
		};
		getUrl();
	}, []);

	useEffect(() => {
		const eventDeeplink = DeviceEventEmitter.addListener(ActionEmitEvent.ON_NAVIGATION_DEEPLINK, (path) => onNavigationDeeplink(path));
		initLoader();
		onNotificationOpenedApp();

		return () => {
			eventDeeplink.remove();
		};
	}, []);

	const deleteAllChannelGroupsNotifee = async () => {
		try {
			const channelGroups = await notifee.getChannelGroups(); // Fetch all channel groups
			for (const group of channelGroups) {
				await notifee.deleteChannelGroup(group.id); // Delete each channel group by its ID
			}
		} catch (error) {
			console.error('Error deleting channel groups:', error);
		}
	};

	const initLoader = async () => {
		try {
			await notifee.cancelAllNotifications();
			if (Platform.OS === 'android') {
				await deleteAllChannelGroupsNotifee();
			}
			await remove(STORAGE_CHANNEL_CURRENT_CACHE);
			await remove(STORAGE_KEY_TEMPORARY_ATTACHMENT);
		} catch (error) {
			console.error('Error in tasks:', error);
		}
	};

	const extractChannelParams = (url: string) => {
		const regex = /channel-app\/(\d+)\/(\d+)(?:\?[^#]*)?/;
		const baseMatch = url.match(regex);
		if (!baseMatch) return null;

		const [, id1, id2] = baseMatch;

		const codeMatch = url.match(/[?&]code=([^&]+)/);
		const subpathMatch = url.match(/[?&]subpath=([^&]+)/);

		return {
			channelId: id1,
			clanId: id2,
			code: codeMatch ? codeMatch[1] : null,
			subpath: subpathMatch ? subpathMatch[1] : null
		};
	};

	const onNavigationDeeplink = async (path: string) => {
		if (path?.includes?.('channel-app/')) {
			const parts = extractChannelParams(path);
			if (parts) {
				const channelId = parts.channelId;
				const clanId = parts.clanId;
				const code = parts.code;
				const subpath = parts.subpath;
				if (clanId && channelId) {
					navigation.navigate(APP_SCREEN.CHANNEL_APP, {
						channelId: channelId,
						clanId: clanId,
						code: code,
						subpath: subpath
					});
				}
			}
		}
	};

	const onNotificationOpenedApp = async () => {
		if (Platform.OS === 'android') {
			try {
				const notificationDataPushed = await NotificationPreferences.getValue('notificationDataPushed');
				const notificationDataPushedParse = safeJSONParse(notificationDataPushed || '[]');
				if (notificationDataPushedParse.length > 0) {
					for (const data of notificationDataPushedParse) {
						const extraMessage = data?.message;
						if (extraMessage) {
							const message = safeJSONParse(extraMessage);
							if (message && typeof message === 'object' && message?.channel_id) {
								const createTimeSeconds = message?.create_time_seconds;
								const updateTimeSeconds = message?.update_time_seconds;

								const createTime = createTimeSeconds
									? moment.unix(createTimeSeconds).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
									: new Date().toISOString();
								const updateTime = updateTimeSeconds
									? moment.unix(updateTimeSeconds).utc().format('YYYY-MM-DDTHH:mm:ss.SSS[Z]')
									: new Date().toISOString();

								let codeValue = 0;
								if (message?.code) {
									if (typeof message.code === 'number') {
										codeValue = message.code;
									} else if (typeof message.code === 'object' && message.code?.value !== undefined) {
										codeValue = message.code.value;
									}
								}

								const messageId = message?.message_id || message?.id;
								if (!messageId) {
									console.warn('onNotificationOpenedApp: Message missing id');
									continue;
								}

								const messageData = {
									...message,
									code: codeValue,
									id: messageId,
									content: safeJSONParse(message?.content || '{}'),
									attachments: safeJSONParse(message?.attachments || '[]'),
									mentions: safeJSONParse(message?.mentions || '[]'),
									references: safeJSONParse(message?.references || '[]'),
									reactions: safeJSONParse(message?.reactions || '[]'),
									create_time: createTime,
									update_time: updateTime
								};
								onchannelmessage(messageData as ChannelMessage);
							} else {
								console.warn('onNotificationOpenedApp: Invalid message structure or missing channel_id');
							}
						}
					}
				}
				await NotificationPreferences.clearValue('notificationDataPushed');
			} catch (error) {
				console.error('Error processing notifications:', error);
			}
		}
	};

	useEffect(() => {
		currentDmGroupIdRef.current = currentDmGroupId;
	}, [currentDmGroupId]);

	useEffect(() => {
		currentChannelRef.current = currentChannel;
	}, [currentChannel]);

	useEffect(() => {
		let timer;
		const callListener = DeviceEventEmitter.addListener(ActionEmitEvent.GO_TO_CALL_SCREEN, async ({ payload, isDecline = false }) => {
			if (isDecline) {
				const myUserId = load(STORAGE_MY_USER_ID);
				await mezon.socketRef.current?.forwardWebrtcSignaling(
					payload?.callerId,
					WebrtcSignalingType.WEBRTC_SDP_QUIT,
					'{}',
					payload?.channelId,
					myUserId
				);
				return;
			}
			dispatch(appActions.setLoadingMainMobile(true));
			dispatch(DMCallActions.setIsInCall(true));
			const signalingData = {
				channel_id: payload?.channelId,
				json_data: payload?.offer,
				data_type: WebrtcSignalingType.WEBRTC_SDP_OFFER,
				caller_id: payload?.callerId
			};
			dispatch(
				DMCallActions.addOrUpdate({
					calleeId: userProfile?.user?.id,
					signalingData: signalingData as WebrtcSignalingFwd,
					id: payload?.callerId,
					callerId: payload?.callerId
				})
			);
			timer = setTimeout(() => {
				dispatch(appActions.setLoadingMainMobile(false));
				navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
					screen: APP_SCREEN.MENU_CHANNEL.CALL_DIRECT,
					params: {
						receiverId: payload?.callerId,
						receiverAvatar: payload?.callerAvatar,
						directMessageId: payload?.channelId,
						isAnswerCall: true
					}
				});
			}, 1000);
		});

		return () => {
			timer && clearTimeout(timer);
			callListener.remove();
		};
	}, [dispatch, navigation, userProfile?.user?.id]);

	useEffect(() => {
		const listener = DeviceEventEmitter.addListener(ActionEmitEvent.ON_SHOW_POPUP_SESSION_EXPIRED, () => {
			const data = {
				children: (
					<MezonConfirm
						onConfirm={logout}
						title={'Session Expired or Network Error'}
						confirmText={'Login Again'}
						content={'Your session has expired. Please log in again to continue.'}
					/>
				)
			};
			DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: false, data });
		});

		return () => {
			listener.remove();
		};
	}, [dispatch, navigation, userProfile?.user?.id]);

	useEffect(() => {
		checkPermission();

		const unsubscribe = messaging().onMessage((remoteMessage) => {
			if (isShowNotification(currentChannelRef.current?.id, currentDmGroupIdRef.current, remoteMessage)) {
				// Case: FCM start call
				const title = remoteMessage?.notification?.title || remoteMessage?.data?.title;
				const body = remoteMessage?.notification?.body || remoteMessage?.data?.body;
				if (
					title === 'Incoming call' ||
					(body && ['video call', 'audio call', 'Untitled message'].some((text) => body?.includes?.(text))) ||
					!body ||
					!title ||
					body?.includes?.('"Untitled message"')
				) {
					return;
				}
				Toast.show({
					type: 'notification',
					topOffset: Platform.OS === 'ios' ? undefined : StatusBar.currentHeight + 10,
					props: {
						title,
						body
					},
					swipeable: true,
					visibilityTime: 5000,
					onPress: async () => {
						Toast.hide();
						const store = await getStoreAsync();
						store.dispatch(directActions.setDmGroupCurrentId(''));
						store.dispatch(appActions.setLoadingMainMobile(true));
						store.dispatch(appActions.setIsFromFCMMobile(true));
						DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_BOTTOM_SHEET, { isDismiss: true });
						DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
						requestAnimationFrame(async () => {
							await navigateToNotification(store, remoteMessage, navigation);
						});
					}
				});
			}
			//Payload from FCM need messageType and sound
			if (remoteMessage?.notification?.body === 'Buzz!!') {
				playBuzzSound();
				handleBuzz(remoteMessage);
			}
		});
		// To get All Received Urls
		loadFileSharing();

		// To clear Intents
		return () => {
			unsubscribe();
		};
	}, []);

	const checkPermission = async () => {
		await checkNotificationPermission();
	};

	const playBuzzSound = () => {
		Sound.setCategory('Playback');
		const sound = new Sound('buzz.mp3', Sound.MAIN_BUNDLE, (error) => {
			if (error) {
				console.error('failed to load the sound', error);
				return;
			}
			sound.play((success) => {
				if (!success) {
					console.error('Sound playback failed');
				}
			});
		});
	};

	const handleBuzz = (notification) => {
		const link = notification?.data?.link;
		if (!link) return;
		const linkMatch = link.match(clanAndChannelIdLinkRegex);
		const timestamp = Math.round(Date.now() / 1000);
		if (linkMatch) {
			const channelId = linkMatch?.[2];
			dispatch(
				channelsActions.setBuzzState({
					clanId: channelId as string,
					channelId,
					buzzState: null
				})
			);
		} else {
			const linkDirectMessageMatch = link.match(clanDirectMessageLinkRegex);
			const channelId = linkDirectMessageMatch[1];
			dispatch(directActions.setBuzzStateDirect({ channelId: channelId, buzzState: { isReset: true, senderId: '', timestamp } }));
		}
	};

	const loadFileSharing = () => {
		try {
			ReceiveSharingIntent.getReceivedFiles(
				(files: any) => {
					setFileShared(files);
				},
				(error: any) => {
					/* empty */
				},
				'mezon.mobile.sharing'
			);
		} catch (error) {
			/* empty */
		}
	};

	const onCloseFileShare = useCallback(() => {
		setFileShared(undefined);
		navigation.goBack();
	}, []);

	const logout = useCallback(async () => {
		const store = await getStoreAsync();
		store.dispatch(channelsActions.removeAll());
		store.dispatch(messagesActions.removeAll());
		store.dispatch(clansActions.setCurrentClanId(''));
		store.dispatch(clansActions.removeAll());
		store.dispatch(clansActions.refreshStatus());

		await remove(STORAGE_DATA_CLAN_CHANNEL_CACHE);
		await remove(STORAGE_CHANNEL_CURRENT_CACHE);
		await remove(STORAGE_KEY_TEMPORARY_INPUT_MESSAGES);
		await remove(STORAGE_KEY_TEMPORARY_ATTACHMENT);
		store.dispatch(authActions.logOut({ device_id: userProfile?.user?.username, platform: Platform.OS }));
		DeviceEventEmitter.emit(ActionEmitEvent.ON_TRIGGER_MODAL, { isDismiss: true });
	}, []);

	return (
		<>
			<LoadingModal isVisible={isLoadingMain} />
			{!!fileShared && !isLoadingMain && <Sharing data={fileShared} onClose={onCloseFileShare} />}
		</>
	);
};
