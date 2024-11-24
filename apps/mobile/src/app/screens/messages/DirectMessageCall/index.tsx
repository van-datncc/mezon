import { ActionEmitEvent, Icons, isEmpty, peerConstraints, sessionConstraints } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { DMCallActions, selectAllAccount, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { useNavigation } from '@react-navigation/native';
import { WebrtcSignalingType } from 'mezon-js';
import React, { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { DeviceEventEmitter, Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import { deflate, inflate } from 'react-native-gzip';
import InCallManager from 'react-native-incall-manager';
import { SafeAreaView } from 'react-native-safe-area-context';
import Sound from 'react-native-sound';
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
	const isVideoCall = route.params?.isVideoCall;
	const userProfile = useSelector(selectAllAccount);
	const [remoteStream, setRemoteStream] = useState<MediaStream | undefined>();
	const [localStream, setLocalStream] = useState<MediaStream | undefined>();
	const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
	const [isShowControl, setIsShowControl] = useState<boolean>(true);
	const [isSpeaker, setIsSpeaker] = useState<boolean>(false);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userProfile?.user?.id || ''));
	const dialToneRef = useRef<Sound | null>(null);

	const { cameraPermissionGranted, microphonePermissionGranted, requestMicrophonePermission, requestCameraPermission } = usePermission();

	const [localMediaControl, setLocalMediaControl] = useState<MediaControl>({
		mic: true,
		camera: !!isVideoCall
	});

	const peerConnection = useMemo(() => {
		return new RTCPeerConnection(peerConstraints);
	}, []);

	const openMediaDevices = useCallback(
		async (audio: boolean, video: boolean) => {
			// get media devices stream from webRTC API
			const mediaStream = await mediaDevices.getUserMedia({
				audio: true,
				video: video
			});

			// add track from created mediaStream to peer connection
			mediaStream.getTracks().forEach((track) => peerConnection.addTrack(track, mediaStream));

			setLocalStream(mediaStream);
		},
		[peerConnection]
	);

	useEffect(() => {
		if (cameraPermissionGranted || microphonePermissionGranted) openMediaDevices(microphonePermissionGranted, cameraPermissionGranted);
	}, [microphonePermissionGranted, cameraPermissionGranted, openMediaDevices]);

	useEffect(() => {
		try {
			if (!signalingData?.[signalingData?.length - 1]) return;

			peerConnection.addEventListener('icecandidate', async (event) => {
				if (event?.candidate) {
					await mezon.socketRef.current?.forwardWebrtcSignaling(
						receiverId,
						WebrtcSignalingType.WEBRTC_ICE_CANDIDATE,
						JSON.stringify(event.candidate),
						'',
						userProfile?.user?.id
					);
				}
			});
			peerConnection.addEventListener('track', (event) => {
				if (event.streams[0]) {
					setRemoteStream(event.streams[0] as MediaStream);
				}
			});
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
								'',
								userProfile?.user?.id
							);
						};
						processData().catch(console.error);
					}

					break;
				case WebrtcSignalingType.WEBRTC_SDP_ANSWER:
					{
						stopDialTone();
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
						stopDialTone();
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

	const playDialTone = () => {
		Sound.setCategory('Playback');
		const sound = new Sound('dialtone.mp3', Sound.MAIN_BUNDLE, (error) => {
			if (error) {
				console.error('failed to load the sound', error);
				return;
			}
			sound.play((success) => {
				if (!success) {
					console.error('Sound playback failed');
				}
			});
			sound.setNumberOfLoops(-1);
			dialToneRef.current = sound;
		});
	};

	const stopDialTone = () => {
		if (dialToneRef.current) {
			dialToneRef.current.pause();
			dialToneRef.current.stop();
			dialToneRef.current.release();
			dialToneRef.current = null;
		}
	};

	const startCall = async () => {
		InCallManager.start({ media: 'audio' });
		playDialTone();
		const offer = await peerConnection.createOffer(sessionConstraints);
		await peerConnection.setLocalDescription(offer);
		if (offer) {
			const offerEn = await compress(JSON.stringify(offer));
			await mezon.socketRef.current?.forwardWebrtcSignaling(
				receiverId,
				WebrtcSignalingType.WEBRTC_SDP_OFFER,
				offerEn,
				'',
				userProfile?.user?.id
			);
		}
	};

	const endCall = async () => {
		if (peerConnection) {
			peerConnection.close();
		}
		if (remoteStream) {
			remoteStream?.getVideoTracks().forEach((track) => {
				track.enabled = false;
			});
			remoteStream?.getAudioTracks().forEach((track) => {
				track.enabled = false;
			});
			remoteStream.getTracks().forEach((track) => track.stop());
			setRemoteStream(undefined);
		}
		if (localStream) {
			localStream?.getVideoTracks().forEach((track) => {
				track.enabled = false;
			});
			localStream?.getAudioTracks().forEach((track) => {
				track.enabled = false;
			});
			localStream.getTracks().forEach((track) => track.stop());
			setLocalStream(undefined);
		}
		stopDialTone();
		dispatch(DMCallActions.removeAll());
		DeviceEventEmitter.emit(ActionEmitEvent.ON_SET_STATUS_IN_CALL, { status: false });
		navigation.goBack();
	};

	useEffect(() => {
		dispatch(DMCallActions.setIsInCall(true));
		const timer = setTimeout(() => {
			startCall();
		}, 3000);

		return () => {
			clearTimeout(timer);
			InCallManager.stop();
		};
	}, []);

	useEffect(() => {
		localStream?.getVideoTracks().forEach((track) => {
			if (!localMediaControl?.camera) {
				track.enabled = false;
			}
		});
	}, [localStream, localMediaControl?.camera]);

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

			peerConnection.getSenders().forEach((sender) => {
				if (sender?.track && sender?.track?.kind === 'audio') {
					sender.track.enabled = localMediaControl?.mic ? false : true;
				}
			});
		} else {
			requestMicrophonePermission();
		}
	}, [localMediaControl?.mic, localStream, microphonePermissionGranted, requestMicrophonePermission, peerConnection]);
	const toggleControl = async () => {
		setIsShowControl(!isShowControl);
	};

	const toggleSpeaker = () => {
		try {
			InCallManager.setSpeakerphoneOn(!isSpeaker);
			setIsSpeaker(!isSpeaker);
		} catch (error) {
			console.error('Failed to toggle speaker', error);
		}
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

					<Block flexDirection="row" alignItems="center" gap={size.s_20}>
						<TouchableOpacity onPress={toggleSpeaker} style={styles.buttonCircle}>
							{isSpeaker ? <Icons.VoiceNormalIcon /> : <Icons.VoiceLowIcon />}
						</TouchableOpacity>
					</Block>
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
