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
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import ReceiveSharingIntent from 'react-native-receive-sharing-intent';
import Toast from 'react-native-toast-message';
import { useDispatch, useSelector } from 'react-redux';
import LoadingModal from '../../components/LoadingModal/LoadingModal';
import { useCheckUpdatedVersion } from '../../hooks/useCheckUpdatedVersion';
import { Sharing } from '../../screens/settings/Sharing';
import {
	checkNotificationPermission,
	createLocalNotification,
	handleFCMToken,
	isShowNotification,
	navigateToNotification,
	setupNotificationListeners
} from '../../utils/pushNotificationHelpers';

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

	useEffect(() => {
		setupNotificationListeners(navigation);
	}, [navigation]);

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
		});
		messaging().setBackgroundMessageHandler(async (remoteMessage) => {
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
