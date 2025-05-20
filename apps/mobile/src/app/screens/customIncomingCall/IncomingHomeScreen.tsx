import { size, useTheme } from '@mezon/mobile-ui';
import { appActions, DMCallActions, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import LottieView from 'lottie-react-native';
import { safeJSONParse, WebrtcSignalingFwd, WebrtcSignalingType } from 'mezon-js';
import * as React from 'react';
import { memo, useEffect, useMemo } from 'react';
import { BackHandler, Image, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import { Bounce } from 'react-native-animated-spinkit';
import NotificationPreferences from '../../utils/NotificationPreferences';
import { DirectMessageCall } from '../messages/DirectMessageCall';

import { load, STORAGE_MY_USER_ID } from '@mezon/mobile-components';
import LOTTIE_PHONE_DECLINE from './phone-decline.json';
import LOTTIE_PHONE_RING from './phone-ring.json';
import { style } from './styles';

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import BG_CALLING from './bgCalling.png';

const AVATAR_DEFAULT = `${process.env.NX_BASE_IMG_URL}/1775731152322039808/1820659489792069632/mezon_logo.png`;
const IncomingHomeScreen = memo((props: any) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const dispatch = useAppDispatch();
	const [isInCall, setIsInCall] = React.useState(false);
	const userId = useMemo(() => {
		return load(STORAGE_MY_USER_ID);
	}, []);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userId || ''));
	const mezon = useMezon();

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
			} else if (notificationData) {
				await NotificationPreferences.clearValue('notificationDataCalling');
			} else {
				/* empty */
			}
		} catch (error) {
			console.error('Failed to retrieve data', error);
		}
	};

	useEffect(() => {
		let timer;
		if (props?.isForceAnswer && signalingData?.[signalingData?.length - 1]?.callerId) {
			timer = setTimeout(() => {
				onJoinCall();
			}, 1000);
		}

		return () => {
			if (timer) {
				clearTimeout(timer);
			}
		};
	}, [signalingData]);

	useEffect(() => {
		if (props && props?.payload && Platform.OS === 'android') {
			getDataCall();
		}
	}, [props]);

	const params = {
		receiverId: signalingData?.[signalingData?.length - 1]?.callerId,
		receiverAvatar: props?.avatar || '',
		isAnswerCall: true,
		isFromNative: true
	};

	const onDeniedCall = async () => {
		const latestSignalingEntry = signalingData?.[signalingData?.length - 1];
		if (!latestSignalingEntry || !mezon.socketRef.current) {
			BackHandler.exitApp();
			return;
		}

		await mezon.socketRef.current?.forwardWebrtcSignaling(
			latestSignalingEntry?.callerId,
			WebrtcSignalingType.WEBRTC_SDP_QUIT,
			'{}',
			latestSignalingEntry?.signalingData?.channel_id,
			userId
		);
		dispatch(DMCallActions.removeAll());
		BackHandler.exitApp();
	};

	const onJoinCall = () => {
		if (!signalingData?.[signalingData?.length - 1]?.callerId) return;
		dispatch(DMCallActions.setIsInCall(true));
		setIsInCall(true);
	};

	if (isInCall) {
		return <DirectMessageCall route={{ params }} />;
	}

	return (
		<ImageBackground source={BG_CALLING} style={styles.container}>
			{/* Caller Info */}
			<View style={styles.headerCall}>
				<Text style={styles.callerName}>{'Incoming Call'}</Text>
				<Image
					source={{
						uri: props?.avatar || AVATAR_DEFAULT
					}}
					style={styles.callerImage}
				/>
				<Text style={styles.callerInfo}>{props?.info || ''}</Text>
			</View>

			{/* Decline and Answer Buttons */}
			{!props?.isForceAnswer ? (
				<View style={styles.buttonContainer}>
					<TouchableOpacity onPress={onDeniedCall}>
						{/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
						{/*// @ts-expect-error*/}
						<LottieView source={LOTTIE_PHONE_DECLINE} autoPlay loop style={styles.deniedCall} />
					</TouchableOpacity>

					<TouchableOpacity onPress={onJoinCall}>
						<LottieView source={LOTTIE_PHONE_RING} autoPlay loop style={styles.answerCall} />
					</TouchableOpacity>
				</View>
			) : (
				<View style={styles.wrapperConnecting}>
					<Bounce size={size.s_80} color="#fff" />
					<Text style={styles.callerName}>Connecting...</Text>
				</View>
			)}
		</ImageBackground>
	);
});

export default IncomingHomeScreen;
