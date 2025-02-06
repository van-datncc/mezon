import { useLocalParticipant, useParticipants, useRoomContext, useTracks, VideoTrack } from '@livekit/react-native';
import { ActionEmitEvent, Icons } from '@mezon/mobile-components';
import { baseColor, Block, size, useTheme } from '@mezon/mobile-ui';
import { useNavigation } from '@react-navigation/native';
import { Track } from 'livekit-client';
import React, { useCallback, useEffect } from 'react';
import { DeviceEventEmitter, FlatList, ListRenderItem, Text, TouchableOpacity, View } from 'react-native';
import { MezonAvatar } from '../../../../../../componentUI';
import useTabletLandscape from '../../../../../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../../../../../navigation/ScreenTypes';
import { style } from '../styles';

const RoomView = ({ isAnimationComplete, onPressMinimizeRoom }: { isAnimationComplete: boolean; onPressMinimizeRoom: () => void }) => {
	const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const room = useRoomContext();
	const participants = useParticipants();
	const navigation = useNavigation<any>();
	const isTabletLandscape = useTabletLandscape();
	const { isCameraEnabled, isMicrophoneEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant();

	useEffect(() => {
		localParticipant.setCameraEnabled(false);
		localParticipant.setMicrophoneEnabled(false);
	}, [localParticipant]);

	const renderParticipant: ListRenderItem<any> = ({ item: participant }) => {
		const trackRef = tracks.find((t) => t.participant.identity === participant.identity);

		return (
			<Block style={styles.userView}>
				{participant.isCameraEnabled && trackRef ? (
					<VideoTrack trackRef={trackRef} style={styles.participantView} />
				) : (
					<Block display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={10}>
						<MezonAvatar width={size.s_50} height={size.s_50} username={participant.identity} avatarUrl={participant.metadata} />
					</Block>
				)}

				<Block style={styles.userName} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
					{participant.isMicrophoneEnabled ? <Icons.MicrophoneIcon height={size.s_14} /> : <Icons.MicrophoneSlashIcon height={size.s_14} />}
					<Text style={styles.subTitle}>{participant.identity || 'Unknown'}</Text>
				</Block>
			</Block>
		);
	};

	const handleToggleCamera = useCallback(() => {
		localParticipant.setCameraEnabled(!isCameraEnabled);
	}, [isCameraEnabled, localParticipant]);

	const handleToggleMicrophone = useCallback(() => {
		localParticipant.setMicrophoneEnabled(!isMicrophoneEnabled);
	}, [isMicrophoneEnabled, localParticipant]);

	const handleToggleScreenShare = useCallback(() => {
		localParticipant.setScreenShareEnabled(!isScreenShareEnabled);
	}, [isScreenShareEnabled, localParticipant]);

	const handleEndCall = useCallback(() => {
		room.disconnect();
		DeviceEventEmitter.emit(ActionEmitEvent.ON_OPEN_MEZON_MEET, { isEndCall: true });
	}, [room]);

	const handleShowChat = () => {
		if (!isTabletLandscape) {
			navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
				screen: APP_SCREEN.MESSAGES.CHAT_STREAMING
			});
		}
		onPressMinimizeRoom();
	};

	return (
		<View style={styles.roomViewcontainer}>
			<Block>
				<FlatList data={participants} renderItem={renderParticipant} keyExtractor={(item) => item.identity} />
			</Block>
			{isAnimationComplete && (
				<Block style={[styles.menuFooter]}>
					<Block gap={size.s_20} flexDirection="row" alignItems="center" justifyContent="space-between" padding={size.s_14}>
						<TouchableOpacity onPress={handleToggleCamera} style={styles.menuIcon}>
							{isCameraEnabled ? <Icons.VideoIcon /> : <Icons.VideoSlashIcon />}
						</TouchableOpacity>
						<TouchableOpacity onPress={handleToggleMicrophone} style={styles.menuIcon}>
							{isMicrophoneEnabled ? <Icons.MicrophoneIcon /> : <Icons.MicrophoneSlashIcon />}
						</TouchableOpacity>
						<TouchableOpacity onPress={handleShowChat} style={styles.menuIcon}>
							<Icons.ChatIcon />
						</TouchableOpacity>
						<TouchableOpacity onPress={handleToggleScreenShare} style={styles.menuIcon}>
							{isScreenShareEnabled ? <Icons.ShareScreenIcon /> : <Icons.ShareScreenSlashIcon />}
						</TouchableOpacity>
						<TouchableOpacity onPress={handleEndCall} style={{ ...styles.menuIcon, backgroundColor: baseColor.redStrong }}>
							<Icons.PhoneCallIcon />
						</TouchableOpacity>
					</Block>
				</Block>
			)}
		</View>
	);
};

export default React.memo(RoomView);
