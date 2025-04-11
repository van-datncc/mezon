/* eslint-disable no-console */
import { LiveKitRoom, TrackReference, VideoTrack } from '@livekit/components-react';
import { useAuth } from '@mezon/core';
import {
	handleParticipantVoiceState,
	selectCurrentChannel,
	selectShowCamera,
	selectShowMicrophone,
	selectTokenJoinVoice,
	selectVoiceFullScreen,
	selectVoiceInfo,
	useAppDispatch,
	voiceActions
} from '@mezon/store';
import { ParticipantMeetState } from '@mezon/utils';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useSelector } from 'react-redux';

const VoicePopout: React.FC = () => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	const token = useSelector(selectTokenJoinVoice);
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;
	const showMicrophone = useSelector(selectShowMicrophone);
	const showCamera = useSelector(selectShowCamera);
	const isVoiceFullScreen = useSelector(selectVoiceFullScreen);
	const currentChannel = useSelector(selectCurrentChannel);

	const voiceInfo = useSelector(selectVoiceInfo);
	const dispatch = useAppDispatch();
	const { userProfile } = useAuth();

	const participantMeetState = async (state: ParticipantMeetState, clanId?: string, channelId?: string): Promise<void> => {
		if (!clanId || !channelId || !userProfile?.user?.id) return;

		await dispatch(
			handleParticipantVoiceState({
				clan_id: clanId,
				channel_id: channelId,
				display_name: userProfile?.user?.display_name ?? '',
				state
			})
		);
	};

	const handleLeaveRoom = useCallback(async () => {
		if (!voiceInfo?.clanId || !voiceInfo?.channelId) return;

		dispatch(voiceActions.resetVoiceSettings());
		await participantMeetState(ParticipantMeetState.LEAVE, voiceInfo.clanId, voiceInfo.channelId);
		if (window.location.pathname === '/popout') {
			dispatch(voiceActions.setOpenPopOut(false));
			window.close();
			return;
		}
	}, [dispatch, voiceInfo]);

	const handleFullScreen = useCallback(() => {
		if (!containerRef.current) return;

		if (!document.fullscreenElement) {
			containerRef.current
				.requestFullscreen()
				.then(() => dispatch(voiceActions.setFullScreen(true)))
				.catch((err) => {
					console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
				});
		} else {
			document.exitFullscreen().then(() => dispatch(voiceActions.setFullScreen(false)));
		}
	}, [dispatch]);
	const track = (window.opener as any)?.sharedTracks?.screenShare;

	const [trackVideo, setTrackVideo] = useState<TrackReference | null>(null);
	const renderVideo = () => {
		if (track) {
			setTrackVideo(track);
		}
	};
	useEffect(() => {
		renderVideo();
	}, []);

	return (
		<div className="h-screen w-screen">
			{' '}
			<LiveKitRoom
				ref={containerRef}
				id="livekitRoom"
				key={token}
				className={`${isVoiceFullScreen ? '!fixed !inset-0 !z-50 !w-screen !h-screen' : ''}`}
				audio={showMicrophone}
				video={showCamera}
				token={token}
				serverUrl={serverUrl}
				data-lk-theme="default"
				connectOptions={{
					autoSubscribe: false
				}}
				connect={false}
			>
				{/* <MyVideoConference
					channelLabel={currentChannel?.channel_label as string}
					onLeaveRoom={handleLeaveRoom}
					onFullScreen={handleFullScreen}
				/> */}
				{trackVideo && <VideoTrack trackRef={trackVideo as TrackReference} />}
			</LiveKitRoom>
		</div>
	);
};

export default VoicePopout;
