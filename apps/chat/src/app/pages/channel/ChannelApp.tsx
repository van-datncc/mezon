import { Loading } from '@mezon/ui';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import { RefObject } from 'react';

export function ChannelApps({
	appChannel,
	miniAppRef,
	miniAppDataHash
}: {
	appChannel: ApiChannelAppResponse;
	miniAppRef: RefObject<HTMLIFrameElement>;
	miniAppDataHash: string;
}) {
	// const handleJoinRoom = async () => {
	// 	if (!roomName) return;
	// 	setLoading(true);

	// 	try {
	// 		const result = await dispatch(
	// 			fetchJoinMezonMeet({
	// 				channelId: channel.channel_id || '',
	// 				roomName: roomName
	// 			})
	// 		).unwrap();

	// 		if (result) {
	// 			setToken(result);
	// 		} else {
	// 			setToken(null);
	// 		}
	// 	} catch (err) {
	// 		console.error('Failed to join room:', err);
	// 		setToken(null);
	// 	} finally {
	// 		setLoading(false);
	// 	}
	// };

	// const handleLeaveRoom = async () => {
	// 	setToken(null);
	// };
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;

	return appChannel?.url ? (
		<>
			<iframe ref={miniAppRef} title={appChannel?.url} src={`${appChannel?.url}#${miniAppDataHash}`} className="w-full h-full"></iframe>

			{/* <LiveKitRoom
				video={false}
				audio={true}
				token={token}
				serverUrl={serverUrl}
				data-lk-theme="default"
				style={{ height: 'calc(100vh - 117px)' }}
			>
				<RoomAudioRenderer />
	
				<div className="lk-control-bar dark:bg-bgSecondary600 bg-channelTextareaLight !p-[5px] !border-none">
					<TrackToggle source={Track.Source.Microphone} />
					<TrackToggle source={Track.Source.Camera} />
					<TrackToggle source={Track.Source.ScreenShare} />
					<DisconnectButton onClick={handleLeaveRoom} className="!p-[4px]">
						Leave
					</DisconnectButton>
				</div>
			</LiveKitRoom> */}
		</>
	) : (
		<div className="w-full h-full flex items-center justify-center">
			<Loading />
		</div>
	);
}
