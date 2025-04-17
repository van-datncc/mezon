/* eslint-disable no-console */
import { LiveKitRoom, TrackReference, VideoTrack } from '@livekit/components-react';
import { useEffect, useRef, useState } from 'react';

const VoicePopout = ({ trackData }: { trackData: any }) => {
	const containerRef = useRef<HTMLDivElement | null>(null);
	// const token = useSelector(selectTokenJoinVoice);
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;
	// const showMicrophone = useSelector(selectShowMicrophone);
	// const showCamera = useSelector(selectShowCamera);
	// const isVoiceFullScreen = useSelector(selectVoiceFullScreen);
	// const currentChannel = useSelector(selectCurrentChannel);

	// const voiceInfo = useSelector(selectVoiceInfo);
	// const dispatch = useAppDispatch();
	// const { userProfile } = useAuth();

	// const participantMeetState = async (state: ParticipantMeetState, clanId?: string, channelId?: string): Promise<void> => {
	// 	if (!clanId || !channelId || !userProfile?.user?.id) return;

	// 	await dispatch(
	// 		handleParticipantVoiceState({
	// 			clan_id: clanId,
	// 			channel_id: channelId,
	// 			display_name: userProfile?.user?.display_name ?? '',
	// 			state
	// 		})
	// 	);
	// };

	// const handleLeaveRoom = useCallback(async () => {
	// 	if (!voiceInfo?.clanId || !voiceInfo?.channelId) return;

	// 	dispatch(voiceActions.resetVoiceSettings());
	// 	await participantMeetState(ParticipantMeetState.LEAVE, voiceInfo.clanId, voiceInfo.channelId);
	// 	if (window.location.pathname === '/popout') {
	// 		dispatch(voiceActions.setOpenPopOut(false));
	// 		window.close();
	// 		return;
	// 	}
	// }, [dispatch, voiceInfo]);

	// const handleFullScreen = useCallback(() => {
	// 	if (!containerRef.current) return;

	// 	if (!document.fullscreenElement) {
	// 		containerRef.current
	// 			.requestFullscreen()
	// 			.then(() => dispatch(voiceActions.setFullScreen(true)))
	// 			.catch((err) => {
	// 				console.error(`Error attempting to enable fullscreen mode: ${err.message} (${err.name})`);
	// 			});
	// 	} else {
	// 		document.exitFullscreen().then(() => dispatch(voiceActions.setFullScreen(false)));
	// 	}
	// }, [dispatch]);
	const track = trackData;

	const [trackVideo, setTrackVideo] = useState<TrackReference | null>(null);
	const [token, setToken] = useState('');
	const renderVideo = () => {
		if (track) {
			setTrackVideo(track?.screenShare);
			setToken(track?.token);
		}
	};
	useEffect(() => {
		Object.assign(document.body.style, {
			margin: '0px !important',
			padding: '0px',
			backgroundColor: 'black'
		});
		renderVideo();
	}, [track]);

	return (
		<LiveKitRoom
			ref={containerRef}
			id="livekitRoom"
			key={token}
			// eslint-disable-next-line no-constant-condition
			className={`${true ? '!fixed !inset-0 !z-50 !w-screen !h-screen' : ''}`}
			audio={true}
			video={false}
			token={token}
			serverUrl={serverUrl}
			data-lk-theme="default"
			connectOptions={{
				autoSubscribe: false
			}}
			connect={false}
		>
			{trackVideo && <VideoTrack trackRef={trackVideo as TrackReference} style={{ width: '100%', height: '100%' }} />}
		</LiveKitRoom>
	);
};

export default VoicePopout;
