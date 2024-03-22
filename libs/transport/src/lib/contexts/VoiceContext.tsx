import React, { useCallback } from "react";
import JitsiConference from "vendors/lib-jitsi-meet/dist/esm/JitsiConference";
import JitsiMeetJS from "vendors/lib-jitsi-meet/dist/esm/JitsiMeetJS";
import JitsiRemoteTrack from "vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiRemoteTrack";
import JitsiLocalTrack from "vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiLocalTrack";
import { JitsiConferenceErrors } from "vendors/lib-jitsi-meet/dist/esm/JitsiConferenceErrors";
import JitsiConnection from "vendors/lib-jitsi-meet/dist/esm/JitsiConnection";
import options from "libs/transport/src/lib/voice/options/config";


type VoiceContextProviderProps = {
	children: React.ReactNode;
};

export type VoiceContextValue = {
	isVideo: boolean;
	voiceConnRef: React.MutableRefObject<JitsiConnection | null>;
	voiceRoomRef: React.MutableRefObject<JitsiConference | null>;
	localTracks:  React.MutableRefObject<JitsiLocalTrack[] | null>;
	remoteTracks: React.MutableRefObject<JitsiRemoteTrack[] | null>;
	attachLocalTrackElement: HTMLElement | undefined;
	attachRemoteTrackElement: HTMLElement | undefined;
	setAttachRemoteTrackElement: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;
	setAttachLocalTrackElement: React.Dispatch<React.SetStateAction<HTMLElement | undefined>>;	
	createVoiceRoom: (roomName: string) => Promise<JitsiConference>;
	switchVideo: () => void;
	changeAudioOutput: (selected: any) => void;
	createLocalTrack: () => void;	
	createVoiceConnection: (token: string) => Promise<JitsiConnection>;
	voiceDisconnect: () => void;
};

const VoiceContext = React.createContext<VoiceContextValue>({} as VoiceContextValue);

const VoiceContextProvider: React.FC<VoiceContextProviderProps> = ({ children }) => {
	const voiceConnRef = React.useRef<JitsiConnection | null>(null);
	const voiceRoomRef = React.useRef<JitsiConference | null>(null);
	const localTracks = React.useRef<JitsiLocalTrack[]>(null);
	const remoteTracks = React.useRef<JitsiRemoteTrack[]>(null);
	const [attachRemoteTrackElement, setAttachRemoteTrackElement] = React.useState<HTMLElement>();
	const [attachLocalTrackElement, setAttachLocalTrackElement] = React.useState<HTMLElement>();
	const [isVideo, setIsVideo] = React.useState<boolean>(false);
	
	const createVoiceConnection = useCallback(async (jwt: string) => {
		const optionsWithRoom = { 
			...options,
		};

		JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
		const initOptions = {
			disableAudioLevels: true
		};

		JitsiMeetJS.init(initOptions);

		const connection = new JitsiMeetJS.JitsiConnection("mezon", jwt, optionsWithRoom);

		connection.addEventListener(
			JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
			onConnectionSuccess);
		connection.addEventListener(
			JitsiMeetJS.events.connection.CONNECTION_FAILED,
			onConnectionFailed);
		connection.addEventListener(
			JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
			onDisconnect);	
		
		connection.connect(optionsWithRoom);
		
		voiceConnRef.current = connection;
		return connection;
	}, [])

	/**
	 * This function is called when we disconnect.
	 */
	const voiceDisconnect = useCallback(async () => {
		console.log('disconnect!');
		if (voiceConnRef && voiceConnRef.current) {
			voiceConnRef.current.removeEventListener(
				JitsiMeetJS.events.connection.CONNECTION_ESTABLISHED,
				onConnectionSuccess);
			voiceConnRef.current.removeEventListener(
				JitsiMeetJS.events.connection.CONNECTION_FAILED,
				onConnectionFailed);
			voiceConnRef.current.removeEventListener(
				JitsiMeetJS.events.connection.CONNECTION_DISCONNECTED,
				onDisconnect);
		}
	}, []);
	
	const createVoiceRoom = useCallback(async (roomName: string) => {
		if (!voiceConnRef.current) {
			throw new Error('voice connection not init');
		}

		console.log("roomName", roomName);
		
		voiceRoomRef.current = voiceConnRef.current.initJitsiConference(roomName, {});	
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrackAdded);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoteTrackRemoved);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.USER_JOINED, onUserJoined);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, onTrackMuteChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, onDisplayNameChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, onAudioLevelChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, onPhoneNumberChanged);
		voiceRoomRef.current.join("");

		console.log("roomName2", roomName);

		return voiceRoomRef.current;
	}, [voiceConnRef])

	const switchVideo = useCallback(async () => {
		setIsVideo(!isVideo);
		if (localTracks && localTracks.current && localTracks.current[1]) {
			localTracks.current[1].dispose();
			localTracks.current.pop();
		}
		JitsiMeetJS.createLocalTracks({
			devices: [ isVideo ? 'video' : 'desktop' ]
		}).then(tracks => {
			if (localTracks && localTracks.current) {
				localTracks.current.push(tracks[0] as JitsiLocalTrack);
				localTracks.current[1].addEventListener(
					JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
				localTracks.current[1].addEventListener(
					JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
				localTracks.current[1].attach(attachLocalTrackElement as HTMLElement);
				if (voiceRoomRef.current) {
					voiceRoomRef.current.addTrack(localTracks.current[1]);
				}
			}
		}).catch(error => console.log(error));
	}, [attachLocalTrackElement, isVideo, localTracks]);

	
	/**
	 *
	 * @param selected
	 */
	const changeAudioOutput = useCallback((selected: any) => { // eslint-disable-line no-unused-vars
		JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
	}, []);
	
	const createLocalTrack = useCallback(() => {				
		JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
		.then(onLocalTracks)
		.catch(error => {
			throw error;
		});

		if (JitsiMeetJS.mediaDevices.isDeviceChangeAvailable('output')) {
			JitsiMeetJS.mediaDevices.enumerateDevices(devices => {
			const audioOutputDevices
				= devices.filter(d => d.kind === 'audiooutput');

			if (audioOutputDevices.length > 1) {
				console.log('#audioOutputSelect');

				console.log('#audioOutputSelectWrapper');
			}
		});
		}
	}, []);

	const onConnectionSuccess = () => {
		console.log("onConnectionSuccess");
	}

	const onConnectionFailed = () => {
		console.log("onConnectionFailed");
	}

	const onDisconnect = () => {
		console.log("onDisconnect");
	}

	const onLocalTracks = useCallback((tracks: JitsiLocalTrack[] | JitsiConferenceErrors) => {
		if (!localTracks || !localTracks.current) {
			return "local track is not init";
		}
/*		
		localTracks.current = tracks;
		for (let i = 0; i < localTracks.current.length; i++) {
			localTracks.current[i].addEventListener(
				JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
			localTracks[i].addEventListener(
				JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
			localTracks[i].addEventListener(
				JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
			localTracks[i].addEventListener(
				JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED,
				deviceId =>
					console.log(
						`track audio output device was changed to ${deviceId}`));
			if (localTracks[i].getType() === 'video') {
				console.log(`<video autoplay='1' id='localVideo${i}' />`);
				localTracks.current[i].attach(attachLocalTrackElement);
			} else {
				console.log(`<audio autoplay='1' muted='true' id='localAudio${i}' />`);
				localTracks.current[i].attach(attachLocalTrackElement);
			}
			if (isJoined) {
				voiceRoomRef.current.addTrack(localTracks[i]);
			}
		}
*/		
	}, []);

	const onRemoteTrackRemoved = useCallback((track: JitsiRemoteTrack) => {
		console.log("onRemoteTrackRemoved");
	}, []);

	const onRemoteTrackAdded = useCallback((track: JitsiRemoteTrack) => {
		if (track.isLocal()) {
			return;
		}
/*
		const participant = track.getParticipantId();
	
		if (!remoteTracks || !remoteTracks[participant]) {
			remoteTracks[participant] = [];
		}
		const idx = remoteTracks[participant].push(track);
	
		track.addEventListener(
			JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
		track.addEventListener(
			JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
		track.addEventListener(
			JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
		track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOuputChanged);
		const id = participant + track.getType() + idx;
	
		if (track.getType() === 'video') {
			console.log(`<video autoplay='1' id='${participant}video${idx}' />`);
		} else {
			console.log(`<audio autoplay='1' id='${participant}audio${idx}' />`);
		}
		if (attachTrackElement) {
			track.attach(attachTrackElement);
		}
*/		
	}, []);
	
	const onConferenceJoined = useCallback(() => {
		
	}, []);
	
	const onUserJoined = useCallback((id: any) => {
		console.log('user join');
		//remoteTracks[id] = [];
	}, []);

	const onUserLeft = useCallback((id: any) => {
		console.log('user join', id);
	}, []);

	const onTrackMuteChanged = useCallback((track: JitsiRemoteTrack) => {
		console.log('onTrackMuteChanged');
	}, []);

	const onDisplayNameChanged = useCallback((userID: string, displayName: string) => {
		console.log(`${userID} - ${displayName}`);
	}, []);

	const onAudioLevelChanged = useCallback((userID: string, audioLevel: string) => {
		console.log(`${userID} - ${audioLevel}`);
	}, []);

	const onPhoneNumberChanged = useCallback(() => {
		console.log(`${voiceRoomRef.current?.getPhoneNumber()} - ${voiceRoomRef.current?.getPhonePin()}`);
	}, []);

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onTrackAudioLevelChanged = useCallback((audioLevel: number) => {
		console.log(`Audio Level remote: ${audioLevel}`);
		
	}, [])

	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	const onTrackAudioOuputChanged = useCallback((deviceId: number) => {
		console.log(`track audio output device was changed to ${deviceId}`)		
	}, [])
	

	const onLocalTrackStoped = useCallback(() => {
		console.log('remote track stoped')
	}, [])

	const value = React.useMemo<VoiceContextValue>(
		() => ({
			voiceConnRef,
			voiceRoomRef,
			localTracks,
			remoteTracks,
			attachLocalTrackElement,
			attachRemoteTrackElement,
			isVideo,
			createVoiceConnection,
			voiceDisconnect,
			createVoiceRoom,
			switchVideo,
			changeAudioOutput,
			createLocalTrack,
			setAttachRemoteTrackElement,
			setAttachLocalTrackElement,
		}),
		[
			voiceConnRef,
			voiceRoomRef,
			localTracks,
			remoteTracks,
			attachLocalTrackElement,
			attachRemoteTrackElement,
			isVideo,
			createVoiceConnection,
			voiceDisconnect,
			createVoiceRoom,
			switchVideo,
			changeAudioOutput,
			createLocalTrack,
			setAttachRemoteTrackElement,
			setAttachLocalTrackElement,
		],
	);

	return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

const VoiceContextConsumer = VoiceContext.Consumer;

export { VoiceContext, VoiceContextConsumer, VoiceContextProvider };

