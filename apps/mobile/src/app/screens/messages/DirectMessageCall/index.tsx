import { useAuth } from '@mezon/core';
import { Icons, isEmpty, peerConstraints, sessionConstraints } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { DMCallActions, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { useNavigation } from '@react-navigation/native';
import { WebrtcSignalingType } from 'mezon-js';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { deflate, inflate } from 'react-native-gzip';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MediaStream, RTCIceCandidate, RTCPeerConnection, RTCSessionDescription, RTCView, mediaDevices } from 'react-native-webrtc';
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
	const { userId } = useAuth();
	const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
	const [localStream, setLocalStream] = useState<MediaStream | undefined>();
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userId || ''));

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
					JSON.stringify(event.candidate)
				);
			}
		});

		pc.addEventListener('track', (event) => {
			if (event.streams[0]) {
				setRemoteStream(event.streams[0] as MediaStream);
			}
		});

		return pc;
	}, [mezon.socketRef, receiverId]);

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

	const onCleanUp = () => {
		return () => {
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
		};
	};

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
								JSON.stringify(answerEn)
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
	}, [mezon.socketRef, peerConnection, receiverId, signalingData]);

	const startCall = async () => {
		const offer = await peerConnection.createOffer(sessionConstraints);
		await peerConnection.setLocalDescription(offer);
		if (offer) {
			const offerEn = await compress(JSON.stringify(offer));
			await mezon.socketRef.current?.forwardWebrtcSignaling(receiverId, WebrtcSignalingType.WEBRTC_SDP_OFFER, offerEn);
		}
	};

	return (
		<SafeAreaView edges={['top']} style={styles.container}>
			<Block style={[styles.menuHeader]}>
				<Block flexDirection="row" alignItems="center" gap={size.s_20}>
					<TouchableOpacity
						onPress={() => {
							onCleanUp();
							navigation.goBack();
						}}
						style={styles.buttonCircle}
					>
						<Icons.ChevronSmallDownIcon />
					</TouchableOpacity>
				</Block>
				<Block flexDirection="row" alignItems="center" gap={size.s_20}>
					<TouchableOpacity onPress={() => {}} style={styles.buttonCircle}>
						{/*<Icons.VoiceXIcon />*/}
						<Icons.VoiceLowIcon />
					</TouchableOpacity>
				</Block>
			</Block>
			<Block style={[styles.main]}>
				<Block flex={1}>
					{remoteStream ? (
						<Block margin={size.s_10} flex={1}>
							<RTCView streamURL={remoteStream.toURL()} style={{ flex: 1, backgroundColor: 'red' }} mirror={true} objectFit={'cover'} />
						</Block>
					) : (
						<Block flex={1} />
					)}
					{localStream && localMediaControl?.camera ? (
						<Block margin={size.s_10} flex={1}>
							<RTCView streamURL={localStream.toURL()} style={{ flex: 1, backgroundColor: 'red' }} mirror={true} objectFit={'cover'} />
						</Block>
					) : (
						<Block flex={1} />
					)}
				</Block>
			</Block>
			<Block style={[styles.menuFooter]}>
				<Block borderRadius={size.s_40} backgroundColor={themeValue.primary}>
					<Block gap={size.s_30} flexDirection="row" alignItems="center" justifyContent="space-between" padding={size.s_14}>
						<TouchableOpacity onPress={requestCameraPermission} style={styles.menuIcon}>
							<Icons.VideoIcon />
						</TouchableOpacity>
						<TouchableOpacity onPress={requestMicrophonePermission} style={styles.menuIcon}>
							<Icons.MicrophoneIcon />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {}} style={styles.menuIcon}>
							<Icons.ChatIcon />
						</TouchableOpacity>

						<TouchableOpacity onPress={startCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
							<Icons.PhoneCallIcon />
						</TouchableOpacity>
					</Block>
				</Block>
			</Block>
		</SafeAreaView>
	);
});
