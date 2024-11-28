import { Snowflake } from '@theinternetfolks/snowflake';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Platform } from 'react-native';
import RNCallKeep from 'react-native-callkeep';
import VoipPushNotification from 'react-native-voip-push-notification';

const useIncomingCall = () => {
	const [currentCallId, setCurrentCallId] = useState<string | null>(null);
	const [APN, setAPN] = useState(null);
	const APNRef = useRef();
	APNRef.current = APN;

	useEffect(() => {
		VoipPushNotification.addEventListener('register', (token) => {
			setAPN(token);
		});

		VoipPushNotification.addEventListener('notification', (notification: { type: string; uuid: string }) => {
			const type = notification?.type;
			if (type === 'CALL_INITIATED') {
				alert('CALL_INITIATED');
			} else if (type === 'DISCONNECT') {
				alert('DISCONNECT');
			}
			VoipPushNotification.onVoipNotificationCompleted(notification?.uuid);
		});

		VoipPushNotification.addEventListener('didLoadWithEvents', (events) => {
			const { type = '' } = events.length > 1 && (events[1].data as { type: string });
			if (type === 'CALL_INITIATED') {
				alert('CALL_INITIATED didLoadWithEvents');
			}
		});

		return () => {
			VoipPushNotification.removeEventListener('didLoadWithEvents');
			VoipPushNotification.removeEventListener('register');
			VoipPushNotification.removeEventListener('notification');
		};
	}, []);

	const configure = useCallback((incomingcallAnswer: () => void, endIncomingCall: () => void, showIncomingCallUi: () => void) => {
		try {
			setupCallKeep();
			if (Platform.OS === 'android') {
				RNCallKeep.setAvailable(true);
				RNCallKeep.addEventListener('createIncomingConnectionFailed', onFailCallAction);
				RNCallKeep.addEventListener('showIncomingCallUi', showIncomingCallUi);
				RNCallKeep.backToForeground();
			}
			RNCallKeep.addEventListener('answerCall', incomingcallAnswer);
			RNCallKeep.addEventListener('endCall', endIncomingCall);
		} catch (error) {
			console.error('initializeCallKeep error:', (error as Error)?.message);
		}
	}, []);

	const onFailCallAction = () => {
		RNCallKeep.endAllCalls();
	};

	const setupCallKeep = useCallback(() => {
		try {
			RNCallKeep.setup({
				ios: {
					appName: 'Mezon',
					supportsVideo: false,
					maximumCallGroups: '1',
					maximumCallsPerCallGroup: '1'
				},
				android: {
					alertTitle: 'Permissions required',
					alertDescription: 'Mezon needs to access your phone accounts to receive calls from mezon',
					cancelButton: 'Cancel',
					okButton: 'ok',
					selfManaged: true,
					additionalPermissions: [],
					foregroundService: {
						channelId: 'com.mezon.mobile',
						channelName: 'Incoming Call',
						notificationTitle: 'Incoming Call',
						notificationIcon: 'ic_notification'
					}
				}
			});
		} catch (error) {
			console.error('initializeCallKeep error:', (error as Error)?.message);
		}
	}, []);

	const startCall = useCallback(({ handle, localizedCallerName }: { handle: string; localizedCallerName: string }) => {
		RNCallKeep.startCall(getCurrentCallId(), handle, localizedCallerName);
	}, []);

	const reportEndCallWithUUID = useCallback((callUUID: string, reason: number) => {
		RNCallKeep.reportEndCallWithUUID(callUUID, reason);
	}, []);

	const endIncomingcallAnswer = useCallback(() => {
		if (currentCallId) {
			RNCallKeep.endCall(currentCallId);
			setCurrentCallId(null);
			removeEvents();
		}
	}, [currentCallId]);

	const removeEvents = useCallback(() => {
		RNCallKeep.removeEventListener('answerCall');
		RNCallKeep.removeEventListener('endCall');
	}, []);

	const displayIncomingCall = useCallback((callerName: string) => {
		if (Platform.OS === 'android') {
			RNCallKeep.setAvailable(false);
		}
		RNCallKeep.displayIncomingCall(getCurrentCallId(), callerName, callerName, 'number', true, null);
	}, []);

	const backToForeground = useCallback(() => {
		RNCallKeep.backToForeground();
	}, []);

	const getCurrentCallId = useCallback(() => {
		const callId = currentCallId || (Snowflake.generate() as string);
		if (!currentCallId) {
			setCurrentCallId(callId);
		}
		return callId;
	}, [currentCallId]);

	const endAllCall = useCallback(() => {
		RNCallKeep.endAllCalls();
		setCurrentCallId(null);
		removeEvents();
	}, []);

	return {
		configure,
		startCall,
		reportEndCallWithUUID,
		endIncomingcallAnswer,
		displayIncomingCall,
		backToForeground,
		getCurrentCallId,
		endAllCall,
		currentCallId
	};
};

export default useIncomingCall;
