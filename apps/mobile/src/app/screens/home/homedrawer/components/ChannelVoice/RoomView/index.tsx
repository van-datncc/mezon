import { TrackReference, useLocalParticipant, useParticipants, useRoomContext, useTracks, VideoTrack } from '@livekit/react-native';
import {
	ActionEmitEvent,
	getUpdateOrAddClanChannelCache,
	Icons,
	jumpToChannel,
	save,
	STORAGE_DATA_CLAN_CHANNEL_CACHE
} from '@mezon/mobile-components';
import { baseColor, Block, size, useTheme } from '@mezon/mobile-ui';
import { selectCurrentClanId, selectVoiceChannelId } from '@mezon/store';
import { useNavigation } from '@react-navigation/native';
import { LocalParticipant, RemoteParticipant, Track } from 'livekit-client';
import React, { useCallback, useEffect, useState } from 'react';
import { DeviceEventEmitter, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSelector } from 'react-redux';
import { MezonAvatar } from '../../../../../../componentUI';
import useTabletLandscape from '../../../../../../hooks/useTabletLandscape';
import { APP_SCREEN } from '../../../../../../navigation/ScreenTypes';
import { style } from '../styles';

const RoomView = ({
	isAnimationComplete,
	onPressMinimizeRoom,
	channelId
}: {
	isAnimationComplete: boolean;
	onPressMinimizeRoom: () => void;
	channelId: string;
}) => {
	const tracks = useTracks([Track.Source.Camera, Track.Source.ScreenShare]);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const room = useRoomContext();
	const participants = useParticipants();
	const navigation = useNavigation<any>();
	const isTabletLandscape = useTabletLandscape();
	const { isCameraEnabled, isMicrophoneEnabled, isScreenShareEnabled, localParticipant } = useLocalParticipant();
	const currentClanId = useSelector(selectCurrentClanId);
	const voiceChannelId = useSelector(selectVoiceChannelId);
	const [focusedScreenShare, setFocusedScreenShare] = useState<TrackReference | null>(null);

	useEffect(() => {
		localParticipant.setCameraEnabled(false);
		localParticipant.setMicrophoneEnabled(false);
	}, [localParticipant]);

	const sortedParticipants = [...participants].sort((a, b) => (b.isScreenShareEnabled ? 1 : 0) - (a.isScreenShareEnabled ? 1 : 0));
	const videoTracks = tracks.filter(
		(t) =>
			t.source === Track.Source.Camera ||
			t.source === Track.Source.ScreenShare ||
			t.participant.isCameraEnabled === true ||
			t.participant.isScreenShareEnabled === true
	);
	const videoTrackCount = videoTracks.length + sortedParticipants.length;
	const isGridLayout = videoTrackCount >= 3;

	const renderParticipant = (participant: LocalParticipant | RemoteParticipant) => {
		const videoTrackRef = tracks.find(
			(t) => t.participant.identity === participant.identity && t.source === Track.Source.Camera && t.participant.isCameraEnabled === true
		);

		const screenTrackRef = tracks.find((t) => t.participant.identity === participant.identity && t.source === Track.Source.ScreenShare);
		const handleFocusScreen = (screenTrack: TrackReference) => {
			setFocusedScreenShare(screenTrack);
		};

		const isFocusedScreen = focusedScreenShare === screenTrackRef;

		return (
			<>
				{screenTrackRef && (
					<Block style={[styles.userView, !isGridLayout ? { width: '100%', height: 250 } : { width: '48%', height: 150 }]}>
						<VideoTrack trackRef={screenTrackRef} style={styles.participantView} />
						<Block style={styles.userName} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
							<Icons.ShareScreenIcon height={size.s_14} />
							<Text
								numberOfLines={1}
								ellipsizeMode="tail"
								style={[styles.subTitle, isFocusedScreen ? { width: '100%' } : { width: '48%' }]}
							>
								{participant.identity} {isFocusedScreen && `(Share Screen)`}
							</Text>
						</Block>
						<TouchableOpacity style={styles.focusIcon} onPress={() => handleFocusScreen(screenTrackRef)}>
							<Icons.ArrowSaltIcon height={size.s_14} />
						</TouchableOpacity>
					</Block>
				)}

				{videoTrackRef && (
					<Block style={[styles.userView, isGridLayout && { width: '48%', height: 150 }]}>
						<VideoTrack trackRef={videoTrackRef} style={styles.participantView} />
						<Block style={styles.userName} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
							{participant.isMicrophoneEnabled ? (
								<Icons.MicrophoneIcon height={size.s_14} />
							) : (
								<Icons.MicrophoneSlashIcon height={size.s_14} />
							)}
							<Text style={styles.subTitle}>{participant.identity || 'Unknown'}</Text>
						</Block>
					</Block>
				)}

				{!videoTrackRef && (
					<Block style={[styles.userView, isGridLayout && { width: '48%', height: 150 }]}>
						<Block display="flex" flexDirection="row" alignItems="center" justifyContent="center" marginBottom={10}>
							<MezonAvatar width={size.s_50} height={size.s_50} username={participant.identity} avatarUrl={participant.metadata} />
						</Block>
						<Block style={styles.userName} display="flex" flexDirection="row" alignItems="center" justifyContent="center">
							{participant.isMicrophoneEnabled ? (
								<Icons.MicrophoneIcon height={size.s_14} />
							) : (
								<Icons.MicrophoneSlashIcon height={size.s_14} />
							)}
							<Text style={styles.subTitle}>{participant.identity || 'Unknown'}</Text>
						</Block>
					</Block>
				)}
			</>
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
		DeviceEventEmitter.emit(ActionEmitEvent.ON_OPEN_MEZON_MEET, { isEndCall: true, voiceChannelId });
	}, [room, voiceChannelId]);

	const handleShowChat = () => {
		if (!isTabletLandscape) {
			navigation.navigate(APP_SCREEN.MESSAGES.STACK, {
				screen: APP_SCREEN.MESSAGES.CHAT_STREAMING
			});
		}
		joinChannel();
		onPressMinimizeRoom();
	};

	const joinChannel = async () => {
		const clanId = currentClanId;
		DeviceEventEmitter.emit(ActionEmitEvent.FETCH_MEMBER_CHANNEL_DM, {
			isFetchMemberChannelDM: true
		});
		const dataSave = getUpdateOrAddClanChannelCache(clanId, channelId);
		save(STORAGE_DATA_CLAN_CHANNEL_CACHE, dataSave);
		await jumpToChannel(channelId, clanId);
	};

	if (focusedScreenShare) {
		return (
			<Block style={{ width: '100%', flex: 1, alignItems: 'center', justifyContent: 'center' }}>
				<Block style={{ height: 300, width: '100%', alignSelf: 'center' }}>
					<VideoTrack trackRef={focusedScreenShare} style={{ height: 300, width: '100%', alignSelf: 'center' }} />
				</Block>
				<TouchableOpacity style={styles.focusIcon} onPress={() => setFocusedScreenShare(null)}>
					<Icons.ArrowShrinkIcon height={size.s_16} />
				</TouchableOpacity>
			</Block>
		);
	}

	return (
		<View style={styles.roomViewcontainer}>
			<Block marginBottom={'30%'}>
				<ScrollView
					style={{ marginLeft: size.s_10, marginRight: size.s_10 }}
					contentContainerStyle={
						isGridLayout
							? { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', gap: size.s_10, alignItems: 'center' }
							: { gap: size.s_10 }
					}
				>
					{sortedParticipants.map((participant) => renderParticipant(participant))}
				</ScrollView>
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
