import { appActions, DMCallActions, selectCurrentUserId, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { sleep } from '@mezon/utils';
import { useNavigation } from '@react-navigation/native';
import { safeJSONParse, WebrtcSignalingFwd, WebrtcSignalingType } from 'mezon-js';
import React, { memo, useCallback, useEffect, useRef } from 'react';
import { AppState, Platform, View } from 'react-native';
import { useSelector } from 'react-redux';
import { APP_SCREEN } from '../../navigation/ScreenTypes';
import NotificationPreferences from '../../utils/NotificationPreferences';
import CallingModal from '../CallingModal';

const CallingModalWrapper = () => {
	const userId = useSelector(selectCurrentUserId);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userId || ''));
	const dispatch = useAppDispatch();
	const navigation = useNavigation<any>();
	const appStateRef = useRef(AppState.currentState);

	const handleAppStateChangeListener = useCallback(
		(nextAppState: typeof AppState.currentState) => {
			if (appStateRef.current.match(/inactive|background/) && nextAppState === 'active') {
				const latestSignalingEntry = signalingData?.[signalingData?.length - 1];
				if (latestSignalingEntry?.signalingData?.data_type === WebrtcSignalingType.WEBRTC_SDP_OFFER) {
					getDataCall();
				}
			}

			appStateRef.current = nextAppState;
		},
		[signalingData]
	);

	useEffect(() => {
		const appStateSubscription = Platform.OS === 'android' ? AppState.addEventListener('change', handleAppStateChangeListener) : undefined;
		return () => {
			appStateSubscription && appStateSubscription.remove();
		};
	}, [handleAppStateChangeListener]);

	useEffect(() => {
		if (Platform.OS === 'android') {
			const latestSignalingEntry = signalingData?.[signalingData?.length - 1];
			if (latestSignalingEntry?.signalingData?.data_type === WebrtcSignalingType.WEBRTC_SDP_OFFER) {
				// RNNotificationCall.declineCall('6cb67209-4ef9-48c0-a8dc-2cec6cd6261d');
			} else {
				getDataCall();
			}
		}
	}, [signalingData]);

	const getDataCall = async () => {
		try {
			const notificationData = await NotificationPreferences.getValue('notificationDataCalling');
			if (!notificationData) return;

			const notificationDataParse = safeJSONParse(notificationData || '{}');
			const data = safeJSONParse(notificationDataParse?.offer || '{}');
			if (data?.offer !== 'CANCEL_CALL' && !!data?.offer) {
				dispatch(appActions.setLoadingMainMobile(true));
				const signalingData = {
					channel_id: data?.channelId,
					receiver_id: userId,
					json_data: data?.offer,
					data_type: WebrtcSignalingType.WEBRTC_SDP_OFFER,
					caller_id: data?.callerId
				};
				dispatch(
					DMCallActions.addOrUpdate({
						calleeId: userId,
						signalingData: signalingData as WebrtcSignalingFwd,
						id: data?.callerId,
						callerId: data?.callerId
					})
				);
				await sleep(2000);
				dispatch(appActions.setLoadingMainMobile(false));
				await NotificationPreferences.clearValue('notificationDataCalling');
				navigation.navigate(APP_SCREEN.MENU_CHANNEL.STACK, {
					screen: APP_SCREEN.MENU_CHANNEL.CALL_DIRECT,
					params: {
						receiverId: data?.callerId,
						receiverAvatar: data?.callerAvatar,
						directMessageId: data?.channelId,
						isAnswerCall: true
					}
				});
			} else if (notificationData) {
				await NotificationPreferences.clearValue('notificationDataCalling');
			} else {
				/* empty */
			}
		} catch (error) {
			console.error('Failed to retrieve data', error);
		}
	};

	if (!signalingData?.length) {
		return <View />;
	}

	return <CallingModal />;
};

export default memo(CallingModalWrapper, () => true);
