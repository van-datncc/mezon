import {
	DisconnectButton,
	GridLayout,
	LiveKitRoom,
	MediaDeviceMenu,
	ParticipantPlaceholder,
	ParticipantTile,
	RoomAudioRenderer,
	TrackToggle,
	usePreviewTracks,
	useTracks
} from '@livekit/components-react';

import '@livekit/components-styles';
import { fetchJoinMezonMeet, useAppDispatch } from '@mezon/store';

import { facingModeFromLocalTrack, LocalAudioTrack, LocalVideoTrack, Track, TrackProcessor } from 'livekit-client';
import { ApiChannelAppResponse } from 'mezon-js/api.gen';
import React, { useEffect, useMemo, useRef, useState } from 'react';

interface ChannelVoiceProps {
	channel: ApiChannelAppResponse;
	roomName: string;
	videoProcessor?: TrackProcessor<Track.Kind.Video>;
}

const ChannelVoice: React.FC<ChannelVoiceProps> = ({ channel, roomName, videoProcessor }) => {
	const [token, setToken] = useState<string | null>(null);
	const [loading, setLoading] = useState<boolean>(false);
	const dispatch = useAppDispatch();
	const serverUrl = process.env.NX_CHAT_APP_MEET_WS_URL;

	const [audioEnabled, setAudioEnabled] = useState<boolean>(true);
	const [videoEnabled, setVideoEnabled] = useState<boolean>(true);
	const [audioDeviceId, setAudioDeviceId] = useState<string | null>(null);
	const [videoDeviceId, setVideoDeviceId] = useState<string | null>(null);

	useEffect(() => {
		const loadDevices = async () => {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const audioInput = devices.find((device) => device.kind === 'audioinput');
			const videoInput = devices.find((device) => device.kind === 'videoinput');

			if (audioInput) setAudioDeviceId(audioInput.deviceId);
			if (videoInput) setVideoDeviceId(videoInput.deviceId);
		};

		loadDevices();
	}, []);

	const tracks = usePreviewTracks({
		audio: audioEnabled && audioDeviceId ? { deviceId: audioDeviceId } : false,
		video: videoEnabled && videoDeviceId ? { deviceId: videoDeviceId, processor: videoProcessor } : false
	});

	const videoEl = useRef(null);

	const videoTrack = useMemo(() => tracks?.filter((track) => track.kind === Track.Kind.Video)[0] as LocalVideoTrack, [tracks]);

	const facingMode = useMemo(() => {
		if (videoTrack) {
			const { facingMode } = facingModeFromLocalTrack(videoTrack);
			return facingMode;
		} else {
			return 'undefined';
		}
	}, [videoTrack]);

	const audioTrack = useMemo(() => tracks?.filter((track) => track.kind === Track.Kind.Audio)[0] as LocalAudioTrack, [tracks]);

	useEffect(() => {
		if (videoEl.current && videoTrack) {
			videoTrack.unmute();
			videoTrack.attach(videoEl.current);
		}

		return () => {
			videoTrack?.detach();
		};
	}, [videoTrack, videoEnabled, token]);

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

	const toggleAudio = async () => {
		setAudioEnabled(!audioEnabled);
	};

	const toggleVideo = async () => {
		setVideoEnabled(!videoEnabled);
	};

	const handleLeaveRoom = async () => {
		setToken(null);
		setAudioEnabled(true);
		setVideoEnabled(true);
	};

	return (
		<div className="w-full">
			{!token || !serverUrl ? (
				<div className="w-full h-full flex flex-col" data-lk-theme="default">
					<div className="flex justify-center items-center" style={{ height: `calc(100vh - 116px)` }}>
						{videoTrack && videoEnabled && (
							<video
								ref={videoEl}
								width="1280"
								height="720"
								data-lk-facing-mode={facingMode}
								style={{
									transform: facingMode === 'user' ? 'rotateY(180deg)' : 'rotateY(0deg)'
								}}
							/>
						)}
						{(!videoTrack || !videoEnabled) && (
							<div className="w-[1280px] h-[720px] flex flex-row justify-center items-center border-bgLightSecondary">
								<ParticipantPlaceholder />
							</div>
						)}
					</div>
					<div className="lk-control-bar dark:bg-bgSecondary600 bg-channelTextareaLight !p-[6px] !border-none">
						<div className="lk-button-group audio">
							<TrackToggle initialState={audioEnabled} source={Track.Source.Microphone} onClick={toggleAudio}>
								Microphone
							</TrackToggle>
							<div className="lk-button-group-menu">
								<MediaDeviceMenu
									initialSelection={audioDeviceId || 'default'}
									kind="audioinput"
									disabled={!audioTrack}
									tracks={{ audioinput: audioTrack }}
									onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
								/>
							</div>
						</div>
						<div className="lk-button-group video">
							<TrackToggle initialState={videoEnabled} source={Track.Source.Camera} onClick={toggleVideo}>
								Camera
							</TrackToggle>
							<div className="lk-button-group-menu">
								<MediaDeviceMenu
									initialSelection={videoDeviceId || 'default'}
									kind="videoinput"
									disabled={!videoTrack}
									tracks={{ videoinput: videoTrack }}
									onActiveDeviceChange={(_, id) => setVideoDeviceId(id)}
								/>
							</div>
						</div>
						<button
							disabled={!roomName}
							className={`bg-green-700 rounded-xl p-2 ${roomName ? 'hover:bg-green-600' : 'opacity-50'}`}
							onClick={handleJoinRoom}
							aria-label="Join Room"
						>
							{loading ? 'Joining...' : 'Join Room'}
						</button>
					</div>
				</div>
			) : (
				<LiveKitRoom
					video={videoEnabled}
					audio={audioEnabled}
					token={token}
					serverUrl={serverUrl}
					data-lk-theme="default"
					style={{ height: 'calc(100vh - 116px)' }}
				>
					<MyVideoConference />
					<RoomAudioRenderer />
					<div className="lk-control-bar dark:bg-bgSecondary600 bg-channelTextareaLight !pt-[6px] !pb-[14px] !border-none">
						<div className="lk-button-group audio" data-lk-theme="default">
							<TrackToggle source={Track.Source.Microphone} onClick={toggleAudio}>
								Microphone
							</TrackToggle>
							<div className="lk-button-group-menu">
								<MediaDeviceMenu
									initialSelection={audioDeviceId || 'default'}
									kind="audioinput"
									disabled={!audioTrack}
									tracks={{ audioinput: audioTrack }}
									onActiveDeviceChange={(_, id) => setAudioDeviceId(id)}
								/>
							</div>
						</div>
						<div className="lk-button-group video" data-lk-theme="default">
							<TrackToggle source={Track.Source.Camera} onClick={toggleVideo}>
								Camera
							</TrackToggle>
							<div className="lk-button-group-menu">
								<MediaDeviceMenu
									initialSelection={videoDeviceId || 'default'}
									kind="videoinput"
									disabled={!videoTrack}
									tracks={{ videoinput: videoTrack }}
									onActiveDeviceChange={(_, id) => {
										if (id !== 'default') setAudioDeviceId(id);
									}}
								/>
							</div>
						</div>
						<TrackToggle source={Track.Source.ScreenShare}>ScreenShare</TrackToggle>
						<DisconnectButton onClick={handleLeaveRoom} className="!p-[7px]">
							Leave Room
						</DisconnectButton>
					</div>
				</LiveKitRoom>
			)}
		</div>
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
