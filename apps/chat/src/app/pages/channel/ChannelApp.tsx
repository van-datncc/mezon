import { LiveKitRoom, RoomAudioRenderer } from '@livekit/components-react';
import { fetchJoinMezonMeet, selectEnableCall, selectEnableVideo, selectEnableVoice, selectGetRoomId, useAppDispatch } from '@mezon/store';
import { Loading } from '@mezon/ui';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { RefObject, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

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
	const [loading, setLoading] = useState<boolean>(false);
	const joinVoice = useSelector(selectEnableVoice);
	const [token, setToken] = useState<string | undefined>(undefined);
	useEffect(() => {
		const fetchData = async () => {
			if (!roomId) return;
			setLoading(true);

			try {
				const result = await dispatch(
					fetchJoinMezonMeet({
						channelId: appChannel.channel_id || '',
						roomName: roomId
					})
				).unwrap();

				if (result) {
					setToken(result);
				} else {
					setToken(undefined);
				}
			} catch (err) {
				console.error('Failed to join room:', err);
				setToken(undefined);
			} finally {
				setLoading(false);
			}
		};

		fetchData();
	}, [appChannel.channel_id, dispatch, roomId]);
	// console.log('token', token);
	// console.log('roomId', roomId);

	const enableMic = useSelector(selectEnableCall);
	const enableVideo = useSelector(selectEnableVideo);
	return appChannel?.url ? (
		<>
			<iframe ref={miniAppRef} title={appChannel?.url} src={`${appChannel?.url}#${miniAppDataHash}`} className="w-full h-full"></iframe>
			<br></br>
			<LiveKitRoom video={enableVideo} audio={enableMic} token={token} serverUrl={serverUrl} data-lk-theme="default">
				<RoomAudioRenderer />
			</LiveKitRoom>
		</>
	) : (
		<div className="w-full h-full flex items-center justify-center">
			<Loading />
		</div>
	);
}
