import { LiveKitRoom, RoomAudioRenderer, useLocalParticipant, VideoConference } from '@livekit/components-react';
import {
	channelAppActions,
	fetchJoinMezonMeet,
	selectEnableCall,
	selectEnableMic,
	selectEnableVideo,
	selectGetRoomId,
	useAppDispatch
} from '@mezon/store';
import { Loading } from '@mezon/ui';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { RefObject, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

export function VideoRoom({ token, serverUrl }: { token: string; serverUrl: string | undefined }) {
	const enableMic = useSelector(selectEnableMic);
	const enableVideo = useSelector(selectEnableVideo);

	return (
		<LiveKitRoom
			video={enableVideo}
			audio={enableMic}
			token={token}
			serverUrl={serverUrl}
			data-lk-theme="empty"
			className="w-full h-full flex justify-center items-center"
		>
			<RoomAudioRenderer />
			<div
				style={{
					position: 'relative',
					width: '100%',
					height: '100%',
					backgroundColor: '#000',
					overflow: 'hidden'
				}}
			>
				<VideoConference
					style={{
						position: 'absolute',
						top: 0,
						left: 0,
						width: '100%',
						height: '100%',
						objectFit: 'cover'
					}}
				/>
				<VideoControls />
			</div>
		</LiveKitRoom>
	);
}
export function ChannelApps({
	appChannel,
	miniAppRef,
	miniAppDataHash
}: {
	appChannel: ApiChannelAppResponse;
	miniAppRef: RefObject<HTMLIFrameElement>;
	miniAppDataHash: string;
}) {
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;
	const roomId = useSelector(selectGetRoomId);
	const dispatch = useAppDispatch();

	const [loading, setLoading] = useState(false);
	const joinCall = useSelector(selectEnableCall);
	const [token, setToken] = useState<string | undefined>(undefined);

	useEffect(() => {
		dispatch(channelAppActions.setRoomId(null));
	}, [appChannel, dispatch]);

	useEffect(() => {
		const fetchData = async () => {
			if (!roomId || !joinCall || !appChannel.channel_id) {
				setToken(undefined);
				return;
			}
			setLoading(true);

			try {
				const result = await dispatch(
					fetchJoinMezonMeet({
						channelId: appChannel.channel_id,
						roomName: appChannel.channel_id + '-' + roomId
					})
				).unwrap();

				setToken(result || undefined);
			} catch (err) {
				console.error('Failed to join room:', err);
				setToken(undefined);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [appChannel, dispatch, roomId, joinCall]);

	return appChannel?.url ? (
		<div className="flex flex-col w-full h-full">
			<div className="flex-1 h-[80%]">
				<iframe ref={miniAppRef} title={appChannel?.url} src={`${appChannel?.url}#${miniAppDataHash}`} className="w-full h-full" />
			</div>

			{token ? (
				<div className="h-[20%] flex justify-center items-center bg-gray-900 p-2">
					<VideoRoom token={token} serverUrl={serverUrl} />
				</div>
			) : loading ? (
				<div className="h-[20%] flex items-center justify-center">
					<Loading />
				</div>
			) : null}
		</div>
	) : (
		<div className="w-full h-full flex items-center justify-center">
			<Loading />
		</div>
	);
}

function VideoControls() {
	const enableVideo = useSelector(selectEnableVideo);
	const enableMic = useSelector(selectEnableMic);
	const { localParticipant } = useLocalParticipant();

	useEffect(() => {
		if (localParticipant) {
			localParticipant.setCameraEnabled(enableVideo).catch(console.error);
			localParticipant.setMicrophoneEnabled(enableMic).catch(console.error);
		}
	}, [enableVideo, enableMic, localParticipant]);

	return null;
}
