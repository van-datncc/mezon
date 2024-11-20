import { Icons, isEmpty, peerConstraints, sessionConstraints } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { DMCallActions, selectAllAccount, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { useNavigation } from '@react-navigation/native';
import { WebrtcSignalingType } from 'mezon-js';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { deflate, inflate } from 'react-native-gzip';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
import { useSelector } from 'react-redux';
import Images from '../../../../assets/Images';
import { MezonConfirm } from '../../../componentUI';
import { usePermission } from '../../../hooks/useRequestPermission';
import { style } from './styles';

interface IDirectMessageCallProps {
	route: any;
}
type MediaControl = {
	mic: boolean;
	camera: boolean;
	speaker?: boolean;
};

const compress = async (str: string) => {
	return await deflate(str);
};

const decompress = async (compressedStr: string) => {
	return await inflate(compressedStr);
};

export const DirectMessageCall = memo(({ route }: IDirectMessageCallProps) => {
	const { themeValue } = useTheme();
	const navigation = useNavigation();
	const dispatch = useAppDispatch();
	const styles = style(themeValue);
	const mezon = useMezon();
	const receiverId = route.params?.receiverId;
	const receiverAvatar = route.params?.receiverAvatar;
	const userProfile = useSelector(selectAllAccount);
	const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
	const [localStream, setLocalStream] = useState<MediaStream | undefined>();
	const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
	const [isShowControl, setIsShowControl] = useState<boolean>(true);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userProfile?.user?.id || ''));

	const { cameraPermissionGranted, microphonePermissionGranted, requestMicrophonePermission, requestCameraPermission } = usePermission();

	const [localMediaControl, setLocalMediaControl] = useState<MediaControl>({
		mic: microphonePermissionGranted,
		camera: cameraPermissionGranted
	});

	const peerConnection = useMemo(() => {
		const pc = new RTCPeerConnection(peerConstraints);
		pc.addEventListener('icecandidate', async (event) => {
			if (event?.candidate) {
				await mezon.socketRef.current?.forwardWebrtcSignaling(
					receiverId,
					WebrtcSignalingType.WEBRTC_ICE_CANDIDATE,
					JSON.stringify(event.candidate),
					userProfile?.user?.id
				);
			}
		});

		pc.addEventListener('track', (event) => {
			if (event.streams[0]) {
				setRemoteStream(event.streams[0] as MediaStream);
			}
		});

		return pc;
	}, [mezon.socketRef, receiverId, userProfile?.user?.id]);

	const openMediaDevices = useCallback(
		async (audio: boolean, video: boolean) => {
			// get media devices stream from webRTC API
			const mediaStream = await mediaDevices.getUserMedia({
				audio,
				video
			});

			// add track from created mediaStream to peer connection
			mediaStream.getTracks().forEach((track) => peerConnection.addTrack(track, mediaStream));

			setLocalStream(mediaStream);
		},
		[peerConnection]
	);

	useEffect(() => {
		setLocalMediaControl({
			mic: microphonePermissionGranted,
			camera: cameraPermissionGranted
		});
		if (cameraPermissionGranted || microphonePermissionGranted) {
			openMediaDevices(microphonePermissionGranted, cameraPermissionGranted);
		}
	}, [cameraPermissionGranted, microphonePermissionGranted, openMediaDevices]);

	useEffect(() => {
		try {
			if (!signalingData?.[signalingData?.length - 1]) return;
			const data = signalingData?.[signalingData?.length - 1]?.signalingData;

			switch (data?.data_type) {
				case WebrtcSignalingType.WEBRTC_SDP_OFFER:
					{
						const processData = async () => {
							const dataDec = await decompress(data?.json_data);
							const objData = JSON.parse(dataDec || '{}');
							await peerConnection.setRemoteDescription(new RTCSessionDescription(objData));
							const answer = await peerConnection.createAnswer();
							await peerConnection.setLocalDescription(answer);
							const answerEn = await compress(JSON.stringify(answer));
							await mezon.socketRef.current?.forwardWebrtcSignaling(
								receiverId,
								WebrtcSignalingType.WEBRTC_SDP_ANSWER,
								JSON.stringify(answerEn),
								userProfile?.user?.id
							);
						};
						processData().catch(console.error);
					}

					break;
				case WebrtcSignalingType.WEBRTC_SDP_ANSWER:
					{
						const processData = async () => {
							const dataDec = await decompress(data?.json_data);
							const objData = JSON.parse(dataDec || '{}');
							await peerConnection.setRemoteDescription(new RTCSessionDescription(objData));
						};

						processData().catch(console.error);
					}
					break;
				case WebrtcSignalingType.WEBRTC_ICE_CANDIDATE:
					{
						const processData = async () => {
							const objData = JSON.parse(data?.json_data || '{}');
							if (!isEmpty(objData)) {
								await peerConnection.addIceCandidate(new RTCIceCandidate(objData));
							}
						};

						processData().catch(console.error);
					}
					break;
				default:
					break;
			}
		} catch (e) {
			console.error('log  => e', e);
		}
	}, [mezon.socketRef, peerConnection, receiverId, signalingData, userProfile?.user?.id]);

	const startCall = async () => {
		const offer = await peerConnection.createOffer(sessionConstraints);
		await peerConnection.setLocalDescription(offer);
		if (offer) {
			const offerEn = await compress(JSON.stringify(offer));
			dispatch(DMCallActions.setIsInCall(true));
			await mezon.socketRef.current?.forwardWebrtcSignaling(receiverId, WebrtcSignalingType.WEBRTC_SDP_OFFER, offerEn, userProfile?.user?.id);
		}
	};

	const endCall = async () => {
		dispatch(DMCallActions.removeAll());
		if (peerConnection) {
			peerConnection.close();
		}
		if (remoteStream) {
			remoteStream.getTracks().forEach((track) => track.stop());
			setRemoteStream(undefined);
		}
		if (localStream) {
			localStream.getTracks().forEach((track) => track.stop());
			setLocalStream(undefined);
		}
		navigation.goBack();
		dispatch(DMCallActions.setIsInCall(false));
	};

	useEffect(() => {
		const timer = setTimeout(() => {
			startCall();
		}, 1000);

		return () => {
			clearTimeout(timer);
		};
	}, [startCall]);

	const toggleCamera = useCallback(() => {
		// check if permission is granted, if not call request permission
		if (cameraPermissionGranted) {
			// update state in local mediaControl
			setLocalMediaControl((prev) => ({
				...prev,
				camera: !prev.camera
			}));

			// update camera value of localStream
			localStream?.getVideoTracks().forEach((track) => {
				localMediaControl?.camera ? (track.enabled = false) : (track.enabled = true);
			});
		} else {
			requestCameraPermission();
		}
	}, [cameraPermissionGranted, localMediaControl?.camera, localStream, requestCameraPermission]);

	const toggleMicrophone = useCallback(() => {
		// check if permission is granted, if not call request permission
		if (microphonePermissionGranted) {
			// update state in local mediaControl
			setLocalMediaControl((prev) => ({
				...prev,
				mic: !prev.mic
			}));

			// update mic value of localStream
			localStream?.getAudioTracks().forEach((track) => {
				localMediaControl?.mic ? (track.enabled = false) : (track.enabled = true);
			});
		} else {
			requestMicrophonePermission();
		}
	}, [localMediaControl?.mic, localStream, microphonePermissionGranted, requestMicrophonePermission]);
	const toggleControl = async () => {
		setIsShowControl(!isShowControl);
	};

	return (
		<SafeAreaView edges={['top']} style={styles.container}>
			{isShowControl && (
				<Block style={[styles.menuHeader]}>
					<Block flexDirection="row" alignItems="center" gap={size.s_20}>
						<TouchableOpacity
							onPress={() => {
								setShowModalConfirm(true);
							}}
							style={styles.buttonCircle}
						>
							<Icons.ChevronSmallLeftIcon />
						</TouchableOpacity>
					</Block>

					{/*<Block flexDirection="row" alignItems="center" gap={size.s_20}>*/}
					{/*	<TouchableOpacity onPress={() => {}} style={styles.buttonCircle}>*/}
					{/*		/!*<Icons.VoiceXIcon />*!/*/}
					{/*		<Icons.VoiceLowIcon />*/}
					{/*	</TouchableOpacity>*/}
					{/*</Block>*/}
				</Block>
			)}

			<TouchableOpacity activeOpacity={1} style={[styles.main, !isShowControl && { marginBottom: size.s_20 }]} onPress={toggleControl}>
				<Block flex={1}>
					{remoteStream ? (
						<Block style={styles.card}>
							<RTCView streamURL={remoteStream.toURL()} style={{ flex: 1 }} mirror={true} objectFit={'cover'} />
						</Block>
					) : (
						<Block style={[styles.card, styles.cardNoVideo]}>
							<FastImage source={receiverAvatar ? { uri: receiverAvatar } : Images.ANONYMOUS_AVATAR} style={styles.avatar} />
						</Block>
					)}
					{localStream && localMediaControl?.camera ? (
						<Block style={styles.card}>
							<RTCView streamURL={localStream.toURL()} style={{ flex: 1 }} mirror={true} objectFit={'cover'} />
						</Block>
					) : (
						<Block style={[styles.card, styles.cardNoVideo]}>
							<FastImage source={{ uri: userProfile?.user?.avatar_url }} style={styles.avatar} />
						</Block>
					)}
				</Block>
			</TouchableOpacity>
			{isShowControl && (
				<Block style={[styles.menuFooter]}>
					<Block borderRadius={size.s_40} backgroundColor={themeValue.primary}>
						<Block gap={size.s_30} flexDirection="row" alignItems="center" justifyContent="space-between" padding={size.s_14}>
							<TouchableOpacity onPress={toggleCamera} style={[styles.menuIcon, localMediaControl?.camera && styles.menuIconActive]}>
								{localMediaControl?.camera ? (
									<Icons.VideoIcon width={size.s_24} height={size.s_24} color={themeValue.black} />
								) : (
									<Icons.VideoSlashIcon width={size.s_24} height={size.s_24} color={themeValue.white} />
								)}
							</TouchableOpacity>
							<TouchableOpacity onPress={toggleMicrophone} style={[styles.menuIcon, localMediaControl?.mic && styles.menuIconActive]}>
								{localMediaControl?.mic ? (
									<Icons.MicrophoneIcon width={size.s_24} height={size.s_24} color={themeValue.black} />
								) : (
									<Icons.MicrophoneDenyIcon width={size.s_24} height={size.s_24} color={themeValue.white} />
								)}
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {}} style={styles.menuIcon}>
								<Icons.ChatIcon />
							</TouchableOpacity>

							<TouchableOpacity onPress={endCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
								<Icons.PhoneCallIcon />
							</TouchableOpacity>
						</Block>
					</Block>
				</Block>
			)}

			<MezonConfirm
				visible={showModalConfirm}
				onVisibleChange={setShowModalConfirm}
				onConfirm={endCall}
				title="End Call"
				confirmText="Yes, End Call"
				hasBackdrop={true}
			>
				<Text style={styles.titleConfirm}>Are you sure you want to end the call?</Text>
			</MezonConfirm>
		</SafeAreaView>
	);
});
