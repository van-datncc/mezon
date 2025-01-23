import { DisconnectButton, GridLayout, LiveKitRoom, ParticipantTile, RoomAudioRenderer, TrackToggle, useTracks } from '@livekit/components-react';

import '@livekit/components-styles';
import { fetchJoinMezonMeet, useAppDispatch } from '@mezon/store';

import { Track } from 'livekit-client';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import React, { useState } from 'react';

const serverUrl = 'wss://abc-1qsisfgg.livekit.cloud';
interface ChannelVoiceProps {
	channel: ApiChannelAppResponse;
	roomName: string;
}

const ChannelVoice: React.FC<ChannelVoiceProps> = ({ channel, roomName }) => {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const handleJoinRoom = async () => {
		if (!roomName) return;
		setLoading(true);

		try {
			const result = await dispatch(
				fetchJoinMezonMeet({
					channelId: channel.channel_id || '',
					roomName: roomName
				})
			).unwrap();

			if (result) {
				setToken(result);
			} else {
				setToken(null);
			}
		} catch (err) {
			console.error('Failed to join room:', err);
			setToken(null);
		} finally {
			setLoading(false);
		}
	};

	const handleLeaveRoom = async () => {
		setToken(null);
	};

	return (
		<>
			{!token ? (
				<div className="w-full h-full bg-black flex justify-center items-center">
					<div className="flex flex-col justify-center items-center gap-4 w-full">
						<div className="w-full flex gap-2 justify-center p-2">
							{/* {memberJoin.length > 0 && <UserListStreamChannel memberJoin={memberJoin} memberMax={3}></UserListStreamChannel>} */}
						</div>
						<button
							disabled={!roomName}
							className={`bg-green-700 rounded-3xl p-2 ${roomName ? 'hover:bg-green-600' : 'opacity-50'}`}
							onClick={handleJoinRoom}
						>
							{loading ? 'Joining...' : 'Join Room'}
						</button>
					</div>
				</div>
			) : (
				<LiveKitRoom
					video={true}
					audio={true}
					token={token}
					serverUrl={serverUrl}
					data-lk-theme="default"
					style={{ height: 'calc(100vh - 117px)' }}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					{/* <ControlBar className="lk-control-bar dark:bg-bgSecondary600 bg-channelTextareaLight !p-[5px] !border-none" /> */}
					<div className="lk-control-bar dark:bg-bgSecondary600 bg-channelTextareaLight !p-[5px] !border-none">
						<TrackToggle source={Track.Source.Microphone} />
						<TrackToggle source={Track.Source.Camera} />
						<TrackToggle source={Track.Source.ScreenShare} />
						<DisconnectButton onClick={handleLeaveRoom} className="!p-[4px]">
							Leave
						</DisconnectButton>
					</div>
				</LiveKitRoom>
			)}
		</>
	);
};

export default ChannelVoice;

function MyVideoConference() {
	const tracks = useTracks(
		[
			{ source: Track.Source.Camera, withPlaceholder: true },
			{ source: Track.Source.ScreenShare, withPlaceholder: false }
		],
		{ onlySubscribed: false }
	);

	return (
		<GridLayout tracks={tracks} style={{ height: 'calc(100vh - var(--lk-control-bar-height))' }}>
			<ParticipantTile />
		</GridLayout>
	);
}
