import { useMezon } from '@mezon/transport';
import JitsiConference from 'lib-mezon-meet/dist/esm/JitsiConference';
import { JitsiConferenceErrors } from 'lib-mezon-meet/dist/esm/JitsiConferenceErrors';
import JitsiConnection from 'lib-mezon-meet/dist/esm/JitsiConnection';
import JitsiMeetJS from 'lib-mezon-meet/dist/esm/JitsiMeetJS';
import JitsiParticipant from 'lib-mezon-meet/dist/esm/JitsiParticipant';
import JitsiLocalTrack from 'lib-mezon-meet/dist/esm/modules/RTC/JitsiLocalTrack';
import JitsiRemoteTrack from 'lib-mezon-meet/dist/esm/modules/RTC/JitsiRemoteTrack';
import JitsiTrack from 'lib-mezon-meet/dist/esm/modules/RTC/JitsiTrack';
import { MediaType } from 'lib-mezon-meet/dist/esm/service/RTC/MediaType';
import { VideoType } from 'lib-mezon-meet/dist/esm/service/RTC/VideoType';
import options from 'libs/voice/src/lib/voice/options/config';
import React, { useCallback, useEffect } from 'react';

type VoiceContextProviderProps = {
	children: React.ReactNode;
};

export type VoiceContextOption = {
	channelId?: string;
	channelName?: string;
	displayName?: string;
	clanId?: string;
	clanName?: string;
	voiceStart: boolean;
};

export type VoiceContextValue = {
	voiceConnRef: React.MutableRefObject<JitsiConnection | null>;
	voiceChannelRef: React.MutableRefObject<JitsiConference | null>;
	setTargetTrackNode: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
	setScreenVideoElement: React.Dispatch<React.SetStateAction<HTMLVideoElement | undefined>>;
	setScreenCanvasElement: React.Dispatch<React.SetStateAction<HTMLCanvasElement | undefined>>;
	setScreenCanvasCtx: React.Dispatch<React.SetStateAction<CanvasRenderingContext2D | undefined>>;

	changeAudioOutput: (selected: any) => void;
	createLocalTrack: (devices: string[]) => void;
	createScreenShare: () => void;
	stopScreenShare: () => void;
	voiceDisconnect: () => void;
	attachMedia: () => void;
	setVoiceOptions: React.Dispatch<React.SetStateAction<VoiceContextOption | undefined>>;
};

const VoiceContext = React.createContext<VoiceContextValue>({} as VoiceContextValue);

const VoiceContextProvider: React.FC<VoiceContextProviderProps> = ({ children }) => {
	const voiceConnRef = React.useRef<JitsiConnection | null>(null);
	const voiceChannelRef = React.useRef<JitsiConference | null>(null);
	const localTracksRef = React.useRef<JitsiLocalTrack[]>([]);
	const remoteTracksRef = React.useRef<Map<string, JitsiRemoteTrack[]>>(new Map());
	const [isJoinedConf, setIsJoinedConf] = React.useState<boolean>(false);
	const [voiceOptions, setVoiceOptions] = React.useState<VoiceContextOption>();

	const [targetTrackNode, setTargetTrackNode] = React.useState<HTMLElement>();
	const [screenCanvasElement, setScreenCanvasElement] = React.useState<HTMLCanvasElement>();
	const [screenCanvasCtx, setScreenCanvasCtx] = React.useState<CanvasRenderingContext2D>();
	const [rafId, setRafId] = React.useState<number>();
	const [screenVideoElement, setScreenVideoElement] = React.useState<HTMLVideoElement>();

	const { socketRef } = useMezon();

	/**
	 * Internal Polyfill to simulate
	 * window.requestAnimationFrame
	 * since the browser will kill canvas
	 * drawing when tab is inactive
	 */
	const requestVideoFrame = useCallback((callback: any) => {
		return window.setTimeout(function () {
			callback(Date.now());
		}, 1000 / 60); // 60 fps - just like requestAnimationFrame
	}, []);

	/**
	 * Internal polyfill to simulate
	 * window.cancelAnimationFrame
	 */
	const cancelVideoFrame = useCallback(() => {
		clearTimeout(rafId);
	}, [rafId]);

	const makeComposite = useCallback(() => {
		if (screenVideoElement && screenCanvasElement) {
			if (!screenCanvasCtx) {
				return;
			}

			screenCanvasCtx.save();
			screenCanvasElement.setAttribute('width', `${screenVideoElement.videoWidth}px`);
			screenCanvasElement.setAttribute('height', `${screenVideoElement.videoHeight}px`);
			screenCanvasCtx.clearRect(0, 0, screenVideoElement.videoWidth, screenVideoElement.videoHeight);

			screenCanvasCtx.drawImage(screenVideoElement, 0, 0, screenVideoElement.videoWidth, screenVideoElement.videoHeight);

			const imageData = screenCanvasCtx.getImageData(0, 0, screenVideoElement.videoWidth, screenVideoElement.videoHeight); // this makes it work
			screenCanvasCtx.putImageData(imageData, 0, 0); // properly on safari/webkit browsers too
			screenCanvasCtx.restore();
		}
		setRafId(requestVideoFrame(makeComposite));
	}, [screenVideoElement, screenCanvasElement, requestVideoFrame, screenCanvasCtx]);

	const onScreenShareTrack = useCallback(
		(tracks: JitsiLocalTrack[] | JitsiConferenceErrors) => {
			console.log('onShareScreenTrack');

			const screenTrack = tracks[0] as JitsiLocalTrack;

			screenVideoElement?.addEventListener(
				'loadedmetadata',
				function (e) {
					makeComposite();
				},
				false,
			);

			screenTrack.attach(screenVideoElement as HTMLVideoElement);

			/*const screenCanvasDraw = new CanvasFreeDrawing({
				canvas: screenCanvasElement as HTMLCanvasElement,
				canvasCtx: screenCanvasCtx as CanvasRenderingContext2D,
				width: screenElem.width,
				height: screenElem.height,
			});
		
			// set properties
			screenCanvasDraw.setLineWidth(10); // in px
			screenCanvasDraw.setStrokeColor([0, 0, 255]); // in RGB*/

			const fullVideoStream = screenCanvasElement?.captureStream();
			if (fullVideoStream) {
				const localOverlayStream = new MediaStream([...fullVideoStream.getVideoTracks()]);
				const trackInfo = {
					stream: localOverlayStream,
					sourceType: 'canvas',
					mediaType: MediaType.VIDEO,
					videoType: VideoType.DESKTOP,
				};
				const newTracks = JitsiMeetJS.createLocalTracksFromMediaStreams([trackInfo]);
				newTracks.forEach((track) => {
					voiceChannelRef.current?.addTrack(track);
				});
			}
		},
		[makeComposite, screenCanvasElement, targetTrackNode],
	);

	const attachMedia = useCallback(() => {
		remoteTracksRef.current.forEach((remoteTrack: JitsiRemoteTrack[], key: string) => {
			if (targetTrackNode) {
				remoteTrack[0].attach(targetTrackNode);
			}
		});
	}, [targetTrackNode]);

	const createScreenShare = useCallback(() => {
		JitsiMeetJS.createLocalTracks({
			devices: ['desktop'],
		})
			.then((tracks) => {
				onScreenShareTrack(tracks);
			})
			.catch((error) => {
				console.log('no local track', error);
			});
	}, [onScreenShareTrack]);

	const stopScreenShare = useCallback(() => {
		cancelVideoFrame();
	}, [cancelVideoFrame]);

	const onConnectionFailed = useCallback(() => {
		console.log('onConnectionFailed');
		voiceDisconnect();
	}, []);

	const onDisconnect = useCallback(() => {
		console.log('onDisconnect');
		voiceDisconnect();
	}, []);

	const onLocalTracks = useCallback(
		(tracks: JitsiLocalTrack[] | JitsiConferenceErrors) => {
			localTracksRef.current = [...(tracks as JitsiLocalTrack[])];

			for (let i = 0; i < localTracksRef.current.length; i++) {
				const localtrack = localTracksRef.current[i];
				localtrack.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
				localtrack.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
				localtrack.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
				localtrack.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOuputChanged);

				console.log('local track type', localtrack.getType());
				if (localtrack.getType() === 'video') {
					const localVideoElem = document.createElement('video');
					localVideoElem.id = 'localvideo' + i;
					localVideoElem.autoplay = true;
					localtrack.attach(localVideoElem);
					const localTrack = targetTrackNode?.getElementsByClassName('localTrack');
					if (localTrack !== undefined && localTrack?.length > 0) {
						localTrack[0]?.appendChild(localVideoElem);
					}
				} else {
					const localAudioElem = document.createElement('audio');
					localAudioElem.id = 'localaudio' + i;
					localAudioElem.autoplay = true;
					localAudioElem.muted = true;
					localtrack.attach(localAudioElem);
					const localTrack = targetTrackNode?.getElementsByClassName('localTrack');
					if (localTrack !== undefined && localTrack?.length > 0) {
						localTrack[0]?.appendChild(localAudioElem);
					}
				}

				if (isJoinedConf && voiceChannelRef.current) {
					if (voiceChannelRef.current.getLocalAudioTrack() == null || localtrack.getType() === 'video') {
						voiceChannelRef.current.addTrack(localtrack);
					}
				}
			}
		},
		[isJoinedConf, targetTrackNode],
	);

	const onRemoteTrackRemoved = useCallback(
		(track: JitsiRemoteTrack) => {
			console.log('onRemoteTrackRemoved');
			const participant = track.getParticipantId();
			const index = remoteTracksRef.current.get(participant)?.indexOf(track);
			if (index !== -1 && index !== undefined) {
				remoteTracksRef.current.get(participant)?.splice(index, 1);
			}
			const elem = targetTrackNode?.getElementsByClassName('remoteTrack');
			if (elem && elem?.length > 0) {
				track.detach(elem[0] as HTMLElement);
			}
		},
		[targetTrackNode],
	);

	const onRemoteTrackAdded = useCallback(
		(track: JitsiRemoteTrack) => {
			if (track.isLocal()) {
				return;
			}

			const participant = track.getParticipantId();
			if (remoteTracksRef?.current) {
				const remoteTrack = remoteTracksRef.current.get(participant);
				const filter = remoteTrack?.filter((item) => item.getId() === track.getId());
				if ((filter?.length as number) > 0) {
					console.log('already in');
					return; // already added
				}

				remoteTracksRef.current.get(participant)?.push(track);

				track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
				track.addEventListener(JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
				track.addEventListener(JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
				track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOuputChanged);

				if (track.getType() === 'video') {
					const remoteVideo = document.createElement('video');
					remoteVideo.autoplay = true;
					remoteVideo.id = 'remotevideo_' + participant;
					track.attach(remoteVideo);

					const remoteTrack = targetTrackNode?.getElementsByClassName('remoteTrack');
					if (remoteTrack !== undefined && remoteTrack?.length > 0) {
						remoteTrack[0]?.appendChild(remoteVideo);
					}
				} else {
					const remoteAudioElem = document.createElement('audio');
					remoteAudioElem.id = 'remoteaudio_' + participant;
					remoteAudioElem.autoplay = true;
					remoteAudioElem.muted = true;
					track.attach(remoteAudioElem);
					const remoteTrack = targetTrackNode?.getElementsByClassName('remoteTrack');
					if (remoteTrack !== undefined && remoteTrack?.length > 0) {
						remoteTrack[0]?.appendChild(remoteAudioElem);
					}
				}
			}
		},
		[remoteTracksRef, targetTrackNode],
	);

	const onConferenceJoined = useCallback(() => {
		setIsJoinedConf(true);

		localTracksRef.current.forEach((localTrack) => {
			voiceChannelRef.current?.addTrack(localTrack);
		});
		const myUserId = voiceChannelRef.current?.myUserId() || '';

		if (socketRef?.current && voiceOptions) {
			socketRef.current.writeVoiceJoined(
				myUserId,
				voiceOptions.clanId as string,
				voiceOptions.clanName as string,
				voiceOptions.channelId as string,
				voiceOptions.channelName as string,
				voiceOptions.displayName as string,
				'',
			);
		}
	}, [voiceOptions, socketRef]);

	const onUserJoined = useCallback(
		(id: string, user: JitsiParticipant) => {
			remoteTracksRef.current.set(id, []);
			if (socketRef?.current && voiceOptions) {
				socketRef.current.writeVoiceJoined(
					id,
					voiceOptions.clanId as string,
					voiceOptions.clanName as string,
					voiceOptions.channelId as string,
					voiceOptions.channelName as string,
					user.getDisplayName(),
					'',
				);
			}
		},
		[voiceOptions, socketRef],
	);

	const onUserLeft = useCallback(
		(id: string, user: JitsiParticipant) => {
			remoteTracksRef.current.set(id, []);
			if (socketRef?.current && voiceOptions) {
				socketRef.current.writeVoiceLeaved(id, voiceOptions.clanId as string, voiceOptions.channelId as string, false);
			}
		},
		[voiceOptions, socketRef],
	);

	const onTrackMuteChanged = useCallback((track: JitsiTrack) => {
		console.log('onTrackMuteChanged');
	}, []);

	const onDisplayNameChanged = useCallback((userID: string, displayName: string) => {
		console.log(`${userID} - ${displayName}`);
	}, []);

	const onAudioLevelChanged = useCallback((userID: string, audioLevel: string) => {
		console.log(`${userID} - ${audioLevel}`);
	}, []);

	const onPhoneNumberChanged = useCallback(() => {
		console.log(`${voiceChannelRef.current?.getPhoneNumber()} - ${voiceChannelRef.current?.getPhonePin()}`);
	}, []);

	const onTrackAudioLevelChanged = useCallback((audioLevel: number) => {
		console.log(`Audio Level: ${audioLevel}`);
	}, []);

	const onTrackAudioOuputChanged = useCallback((deviceId: number) => {
		console.log(`track audio output device was changed to ${deviceId}`);
	}, []);

	const onLocalTrackStoped = useCallback((track: JitsiLocalTrack) => {
		console.log('local track stoped');
	}, []);

	const createLocalTrack = useCallback(
		(devices: string[]) => {
			JitsiMeetJS.createLocalTracks({ devices: devices })
				.then((tracks) => {
					onLocalTracks(tracks);
				})
				.catch((error) => {
					console.log('no local track', error);
				});

			if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
				JitsiMeetJS.mediaDevices.enumerateDevices((devices) => {
					const audioOutputDevices = devices.filter((d) => d.kind === 'audiooutput');

					if (audioOutputDevices.length > 1) {
						console.log('#audioOutputSelect');
					}
				});
			}
		},
		[onLocalTracks],
	);

	const leaveVoiceChannel = useCallback(async () => {
		if (!voiceConnRef.current) {
			return;
		}

		if (!voiceChannelRef.current) {
			return;
		}

		await voiceChannelRef.current.leave();
	}, [voiceChannelRef, voiceConnRef]);

	const createVoiceChannel = useCallback(async () => {
		if (!voiceOptions) {
			throw new Error('voice channel params is undefined');
		}
		if (!voiceConnRef.current) {
			throw new Error('voice connection not init');
		}

		const confOptions = {
			enableLayerSuspension: true,
			p2p: {
				enabled: true,
			},
		};

		const { channelName, displayName } = voiceOptions;

		if ( voiceChannelRef?.current?.getName() === channelName) {
			return voiceChannelRef.current;
		}

		voiceChannelRef.current = voiceConnRef.current.initJitsiConference(channelName as string, confOptions);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrackAdded);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoteTrackRemoved);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.USER_JOINED, onUserJoined);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, onTrackMuteChanged);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, onDisplayNameChanged);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, onAudioLevelChanged);
		voiceChannelRef.current.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, onPhoneNumberChanged);
		voiceChannelRef.current.join('password');
		voiceChannelRef.current.setReceiverVideoConstraint(360); // max 720

		voiceChannelRef.current.setDisplayName(displayName as string);

		return voiceChannelRef.current;
	}, [
		onAudioLevelChanged,
		onConferenceJoined,
		onDisplayNameChanged,
		onPhoneNumberChanged,
		onRemoteTrackAdded,
		onRemoteTrackRemoved,
		onTrackMuteChanged,
		onUserJoined,
		onUserLeft,
		voiceOptions,
	]);

	const onConnectionSuccess = useCallback(() => {
		if (voiceChannelRef.current?.getName()) {
			leaveVoiceChannel();
		}
		createVoiceChannel();
	}, [createVoiceChannel, leaveVoiceChannel]);

	/**
	 * This function is called when we disconnect.
	 */
	const voiceDisconnect = useCallback(async () => {
		console.log('disconnect to voice channel', voiceChannelRef.current?.getName());

		const myUserId = voiceChannelRef.current?.myUserId();

		if (myUserId && socketRef?.current && voiceOptions) {
			console.log('write to socket voice leaved');
			socketRef.current.writeVoiceLeaved(myUserId, voiceOptions.clanId as string, voiceOptions.channelId as string, false);
		}

		if (voiceConnRef?.current) {
			voiceConnRef.current.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
			voiceConnRef.current.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
			voiceConnRef.current.removeEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, onDisconnect);
		}

		localTracksRef.current.forEach((track) => {
			track.stopStream();
		});
		voiceChannelRef.current?.leave();
		voiceConnRef.current?.disconnect();

		voiceChannelRef.current = null;
		voiceConnRef.current = null;
	}, [voiceOptions, onConnectionFailed, onConnectionSuccess, onDisconnect, socketRef]);

	const createVoiceConnection = useCallback(
		async (vChannelName: string, jwt: string) => {
			if (vChannelName && vChannelName === voiceChannelRef.current?.getName()) {
				console.log('connection already establish');
				return voiceConnRef.current;
			} else {
				console.log('disconnect old channel', voiceChannelRef.current?.getName());
				voiceDisconnect(); // reconnect to another channel
			}

			const optionsWithRoom = {
				...options,
				serviceUrl: options.serviceUrl + vChannelName,
			};

			JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
			const initOptions = {
				disableAudioLevels: true,
			};

			JitsiMeetJS.init(initOptions);

			const connection = new JitsiMeetJS.JitsiConnection('mezon', jwt, optionsWithRoom);

			connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED, onConnectionSuccess);
			connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_FAILED, onConnectionFailed);
			connection.addEventListener(JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED, onDisconnect);

			connection.connect(optionsWithRoom);

			voiceConnRef.current = connection;

			if (localTracksRef.current.length === 0) {
				// get local video, audio
				createLocalTrack(['audio']);
			}

			return connection;
		},
		[onConnectionSuccess, onConnectionFailed, onDisconnect, voiceDisconnect, createLocalTrack],
	);

	useEffect(() => {
		if (voiceOptions?.voiceStart) {
			createVoiceConnection((voiceOptions.channelName as string).toLowerCase(), '');
		}
	}, [createVoiceConnection, voiceOptions]);

	/**
	 *
	 * @param selected
	 */
	const changeAudioOutput = useCallback((selected: any) => {
		// eslint-disable-line no-unused-vars
		JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
	}, []);

	const value = React.useMemo<VoiceContextValue>(
		() => ({
			voiceConnRef,
			voiceChannelRef,
			setTargetTrackNode,
			setScreenVideoElement,
			setScreenCanvasElement,
			setScreenCanvasCtx,
			setVoiceOptions,
			createVoiceChannel,
			leaveVoiceChannel,
			voiceDisconnect,
			changeAudioOutput,
			createLocalTrack,
			createScreenShare,
			stopScreenShare,
			attachMedia,
		}),
		[
			createVoiceChannel,
			leaveVoiceChannel,
			voiceDisconnect,
			changeAudioOutput,
			createLocalTrack,
			createScreenShare,
			stopScreenShare,
			attachMedia,
		],
	);

	return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

const VoiceContextConsumer = VoiceContext.Consumer;

export { VoiceContext, VoiceContextConsumer, VoiceContextProvider };
