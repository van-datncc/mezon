import { useAuth } from '@mezon/core';
import { Icons, peerConstraints, sessionConstraints } from '@mezon/mobile-components';
import { Block, baseColor, size, useTheme } from '@mezon/mobile-ui';
import { selectSignalingDataByUserId, useAppSelector } from '@mezon/store-mobile';
import { useMezon } from '@mezon/transport';
import { useNavigation } from '@react-navigation/native';
import { WebrtcSignalingType } from 'mezon-js';
import React, { memo, useMemo } from 'react';
import { TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { RTCPeerConnection } from 'react-native-webrtc';
import { style } from './styles';

interface IDirectMessageCallProps {
	route: any;
}
export const DirectMessageCall = memo(({ route }: IDirectMessageCallProps) => {
	const { themeValue } = useTheme();
	const navigation = useNavigation();
	const styles = style(themeValue);
	const mezon = useMezon();
	const receiverId = route.params?.receiverId;
	const { userId } = useAuth();

	const peerConnection = useMemo(() => {
		return new RTCPeerConnection(peerConstraints);
	}, []);
	const signalingData = useAppSelector((state) => selectSignalingDataByUserId(state, userId || ''));

	const startCall = async () => {
		// create answer SDP and set as localDescription
		const offer = await peerConnection.createOffer(sessionConstraints);
		await peerConnection.setLocalDescription(offer);
		if (offer) {
			await mezon.socketRef.current?.forwardWebrtcSignaling(receiverId, WebrtcSignalingType.WEBRTC_SDP_OFFER, JSON.stringify(offer));
		}
	};

	return (
		<SafeAreaView edges={['top']} style={styles.container}>
			<Block style={[styles.menuHeader]}>
				<Block flexDirection="row" alignItems="center" gap={size.s_20}>
					<TouchableOpacity onPress={() => navigation.goBack()} style={styles.buttonCircle}>
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
			<Block style={[styles.main]}></Block>
			<Block style={[styles.menuFooter]}>
				<Block borderRadius={size.s_40} backgroundColor={themeValue.primary}>
					<Block gap={size.s_30} flexDirection="row" alignItems="center" justifyContent="space-between" padding={size.s_14}>
						<TouchableOpacity onPress={() => {}} style={styles.menuIcon}>
							<Icons.VideoIcon />
						</TouchableOpacity>
						<TouchableOpacity onPress={() => {}} style={styles.menuIcon}>
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
