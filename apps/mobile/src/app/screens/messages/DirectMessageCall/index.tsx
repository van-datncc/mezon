import { Icons } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { DMCallActions, selectAllAccount, selectIsInCall, selectSignalingDataByUserId, useAppDispatch, useAppSelector } from '@mezon/store-mobile';
import React, { memo, useEffect, useState } from 'react';
import { Text, TouchableOpacity } from 'react-native';
import FastImage from 'react-native-fast-image';
import InCallManager from 'react-native-incall-manager';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCView } from 'react-native-webrtc';
import { useSelector } from 'react-redux';
import Images from '../../../../assets/Images';
import { MezonConfirm } from '../../../componentUI';
import { useWebRTCCallMobile } from '../../../hooks/useWebRTCCallMobile';
import { style } from './styles';

interface IDirectMessageCallProps {
	route: any;
}

export const DirectMessageCall = memo(({ route }: IDirectMessageCallProps) => {
	const { themeValue } = useTheme();
	const dispatch = useAppDispatch();
	const styles = style(themeValue);
	const receiverId = route.params?.receiverId;
	const receiverAvatar = route.params?.receiverAvatar;
	const isVideoCall = route.params?.isVideoCall;
	const userProfile = useSelector(selectAllAccount);
	const [showModalConfirm, setShowModalConfirm] = useState<boolean>(false);
	const [isShowControl, setIsShowControl] = useState<boolean>(true);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userProfile?.user?.id || ''));
	const isInCall = useSelector(selectIsInCall);

	const { callState, localMediaControl, startCall, handleEndCall, toggleSpeaker, toggleAudio, toggleVideo, handleSignalingMessage } =
		useWebRTCCallMobile(receiverId, '' as string, userProfile?.user?.id as string, isVideoCall);

	useEffect(() => {
		if (callState.peerConnection && signalingData?.[signalingData?.length - 1]?.signalingData?.data_type === 4) {
			handleEndCall();
		}
		if (signalingData?.[signalingData?.length - 1] && isInCall) {
			const data = signalingData?.[signalingData?.length - 1]?.signalingData;
			handleSignalingMessage(data);
		}
	}, [callState.peerConnection, isInCall, signalingData]);

	useEffect(() => {
		dispatch(DMCallActions.setIsInCall(true));
		const timer = setTimeout(() => {
			startCall(isVideoCall);
		}, 2000);

		return () => {
			clearTimeout(timer);
			InCallManager.stop();
		};
	}, [isVideoCall]);

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

					<Block flexDirection="row" alignItems="center" gap={size.s_20}>
						<TouchableOpacity onPress={toggleSpeaker} style={styles.buttonCircle}>
							{localMediaControl.speaker ? <Icons.VoiceNormalIcon /> : <Icons.VoiceLowIcon />}
						</TouchableOpacity>
					</Block>
				</Block>
			)}

			<TouchableOpacity activeOpacity={1} style={[styles.main, !isShowControl && { marginBottom: size.s_20 }]} onPress={toggleControl}>
				<Block flex={1}>
					{callState.remoteStream ? (
						<Block style={styles.card}>
							<RTCView streamURL={callState.remoteStream.toURL()} style={{ flex: 1 }} mirror={true} objectFit={'cover'} />
						</Block>
					) : (
						<Block style={[styles.card, styles.cardNoVideo]}>
							<FastImage source={receiverAvatar ? { uri: receiverAvatar } : Images.ANONYMOUS_AVATAR} style={styles.avatar} />
						</Block>
					)}
					{callState.localStream && localMediaControl?.camera ? (
						<Block style={styles.card}>
							<RTCView streamURL={callState.localStream.toURL()} style={{ flex: 1 }} mirror={true} objectFit={'cover'} />
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
							<TouchableOpacity onPress={toggleVideo} style={[styles.menuIcon, localMediaControl?.camera && styles.menuIconActive]}>
								{localMediaControl?.camera ? (
									<Icons.VideoIcon width={size.s_24} height={size.s_24} color={themeValue.black} />
								) : (
									<Icons.VideoSlashIcon width={size.s_24} height={size.s_24} color={themeValue.white} />
								)}
							</TouchableOpacity>
							<TouchableOpacity onPress={toggleAudio} style={[styles.menuIcon, localMediaControl?.mic && styles.menuIconActive]}>
								{localMediaControl?.mic ? (
									<Icons.MicrophoneIcon width={size.s_24} height={size.s_24} color={themeValue.black} />
								) : (
									<Icons.MicrophoneDenyIcon width={size.s_24} height={size.s_24} color={themeValue.white} />
								)}
							</TouchableOpacity>
							<TouchableOpacity onPress={() => {}} style={styles.menuIcon}>
								<Icons.ChatIcon />
							</TouchableOpacity>

							<TouchableOpacity onPress={handleEndCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
								<Icons.PhoneCallIcon />
							</TouchableOpacity>
						</Block>
					</Block>
				</Block>
			)}

			<MezonConfirm
				visible={showModalConfirm}
				onVisibleChange={setShowModalConfirm}
				onConfirm={handleEndCall}
				title="End Call"
				confirmText="Yes, End Call"
				hasBackdrop={true}
			>
				<Text style={styles.titleConfirm}>Are you sure you want to end the call?</Text>
			</MezonConfirm>
		</SafeAreaView>
	);
});
