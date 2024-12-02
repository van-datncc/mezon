import { useAuth } from '@mezon/core';
import { getAppInfo } from '@mezon/mobile-components';
import {
	appActions,
	fcmActions,
	getStoreAsync,
	selectCurrentChannel,
	selectCurrentClan,
	selectDmGroupCurrentId,
	selectLoadingMainMobile
} from '@mezon/store-mobile';
import messaging from '@react-native-firebase/messaging';
import { useNavigation } from '@react-navigation/native';
import { Snowflake } from '@theinternetfolks/snowflake';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { NativeModules, Platform } from 'react-native';
import RNNotificationCall from 'react-native-full-screen-notification-incoming-call';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import Sound from 'react-native-sound';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import useIncomingCall from '../../hooks/useIncomingCall';
import { Sharing } from '../../screens/settings/Sharing';
import {
	checkNotificationPermission,
	createLocalNotification,
	handleFCMToken,
	isShowNotification,
	navigateToNotification,
	setupNotificationListeners
} from '../../utils/pushNotificationHelpers';
const { WakeLockModule } = NativeModules;

export const AuthenticationLoader = () => {
	const navigation = useNavigation<any>();
	const { userProfile } = useAuth();
	const currentClan = useSelector(selectCurrentClan);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const isLoadingMain = useSelector(selectLoadingMainMobile);
	const dispatch = useDispatch();
	const [fileShared, setFileShared] = useState<any>();
	const currentDmGroupIdRef = useRef(currentDmGroupId);
	const currentChannelRef = useRef(currentClan);
	useCheckUpdatedVersion();
	const IncomingCall = useIncomingCall();

	const loadFRMConfig = useCallback(async () => {
		try {
			const [fcmtoken, appInfo] = await Promise.all([handleFCMToken(), getAppInfo()]);
			if (fcmtoken) {
				const { app_platform: platform } = appInfo;
				// eslint-disable-next-line @typescript-eslint/ban-ts-comment
				// @ts-expect-error
				dispatch(fcmActions.registFcmDeviceToken({ tokenId: fcmtoken, deviceId: userProfile?.user?.username, platform }));
			}
		} catch (error) {
			console.error('Error loading FCM config:', error);
		}
	}, [dispatch, userProfile?.user?.username]);

	useEffect(() => {
		if (userProfile?.user?.username) loadFRMConfig();
	}, [loadFRMConfig, userProfile?.user?.username]);

	const incomingCallAnswer = () => {
		// Navigate to your call screen or main app
	};

	const showIncomingCallUi = () => {
		if (Platform.OS === 'android') {
			// TODO: map content call from FCM
			RNNotificationCall.displayNotification(Snowflake.generate(), null, 30000, {
				channelId: 'com.mezon.mezon',
				channelName: 'Incoming call',
				notificationIcon: 'ic_notification', // mipmap
				notificationTitle: 'Nguyen Tran',
				notificationBody: 'Incoming video call',
				answerText: 'Answer',
				declineText: 'Decline',
				notificationColor: 'colorAccent',
				isVideo: false,
				notificationSound: 'ringing.mp3'
			});
		}
	};

	useEffect(() => {
		IncomingCall.configure(incomingCallAnswer, () => {}, showIncomingCallUi);
		setupNotificationListeners(navigation);
	}, [navigation]);

	useEffect(() => {
		RNNotificationCall.addEventListener('answer', (data) => {
			RNNotificationCall.backToApp();
			incomingCallAnswer();
		});
	}, []);

	useEffect(() => {
		currentDmGroupIdRef.current = currentDmGroupId;
	}, [currentDmGroupId]);

	useEffect(() => {
		currentChannelRef.current = currentChannel;
	}, [currentChannel]);

	useEffect(() => {
		checkNotificationPermission();

		const unsubscribe = messaging().onMessage((remoteMessage) => {
			if (isShowNotification(currentChannelRef.current?.id, currentDmGroupIdRef.current, remoteMessage)) {
				Toast.show({
					type: 'notification',
					topOffset: Platform.OS === 'ios' ? undefined : 10,
					props: remoteMessage.notification,
					swipeable: true,
					visibilityTime: 5000,
					onPress: async () => {
						Toast.hide();
						const store = await getStoreAsync();
						store.dispatch(appActions.setLoadingMainMobile(true));
						store.dispatch(appActions.setIsFromFCMMobile(true));
						requestAnimationFrame(async () => {
							await navigateToNotification(store, remoteMessage, navigation);
						});
					}
				});
			}
			//Payload from FCM need messageType and sound
			if (remoteMessage.notification.body === 'Buzz!!') {
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
			}
		});
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
			// TODO: handle data from FCM
			IncomingCall.displayIncomingCall('Nguyen Tran');
			if (Platform.OS === 'android') {
				WakeLockModule.releaseWakeLock();
				WakeLockModule.acquireWakeLock();
				showIncomingCallUi();
			}
			await createLocalNotification(remoteMessage.notification?.title, remoteMessage.notification?.body, remoteMessage.data);
		});

		// To get All Received Urls
		loadFileSharing();

		// To clear Intents
		return () => {
			unsubscribe();
		};
	}, []);

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

	const onCloseFileShare = () => {
		setFileShared(undefined);
		navigation.goBack();
	};

	return (
		<>
			<LoadingModal isVisible={isLoadingMain} />
			{!!fileShared && !isLoadingMain && <Sharing data={fileShared} onClose={onCloseFileShare} />}
		</>
	);
};
