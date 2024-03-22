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
	voiceConnRef: React.MutableRefObject<JitsiConnection | null>;
	voiceRoomRef: React.MutableRefObject<JitsiConference | null>;
	currentVoiceRoomName: string;
	setTargetTrackNode: React.Dispatch<React.SetStateAction<HTMLMediaElement | undefined>>;
	setCurrentVoiceRoomName: React.Dispatch<React.SetStateAction<string>>;
	setUserDisplayName: React.Dispatch<React.SetStateAction<string>>;
	changeAudioOutput: (selected: any) => void;
	createLocalTrack: () => void;	
	createVoiceConnection: (roomName: string, jwt: string) => Promise<JitsiConnection | null>;
	voiceDisconnect: () => void;
};

const VoiceContext = React.createContext<VoiceContextValue>({} as VoiceContextValue);

const VoiceContextProvider: React.FC<VoiceContextProviderProps> = ({ children }) => {
	const voiceConnRef = React.useRef<JitsiConnection | null>(null);
	const voiceRoomRef = React.useRef<JitsiConference | null>(null);
	const localTracksRef = React.useRef<JitsiLocalTrack[]>([]);
	const remoteTracksRef = React.useRef<Map<string, JitsiRemoteTrack[]>>(new Map());
	const [isJoinedConf, setIsJoinedConf] = React.useState<boolean>(false);	
	const [currentVoiceRoomName, setCurrentVoiceRoomName] = React.useState<string>("");
	const [userDisplayName, setUserDisplayName] = React.useState<string>("");
	const [targetTrackNode, setTargetTrackNode] = React.useState<HTMLMediaElement>();


	const onConnectionFailed = useCallback(() => {
		console.log("onConnectionFailed");
		voiceDisconnect();
	}, []);

	const onDisconnect = useCallback(() => {
		console.log("onDisconnect");
		voiceDisconnect();
	}, []);

	const onLocalTracks = useCallback((tracks: JitsiLocalTrack[] | JitsiConferenceErrors) => {
		console.log("onLocalTracks");
		
		localTracksRef.current = [...(tracks as JitsiLocalTrack[])];

		for (let i = 0; i < localTracksRef.current.length; i++) {
			const localtrack = localTracksRef.current[i] as JitsiLocalTrack
			localtrack.addEventListener(
				JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
			localtrack.addEventListener(
				JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
			localtrack.addEventListener(
				JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
			localtrack.addEventListener(
				JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOuputChanged);
			
			console.log("local track type", localtrack.getType());
			if (localtrack.getType() === 'video') {
				const localVideoElem = document.createElement("video");
				localVideoElem.id = 'localvideo'+i;
				localVideoElem.autoplay = true;
				localtrack.attach(localVideoElem);
				targetTrackNode?.appendChild(localVideoElem);
			} else {
				const localAudioElem = document.createElement("audio");
				localAudioElem.id = 'localaudio'+i;
				localAudioElem.autoplay = true;
				localAudioElem.muted = true;
				localtrack.attach(localAudioElem);
				targetTrackNode?.appendChild(localAudioElem);
			}

			if (isJoinedConf && voiceRoomRef.current) {
				if(voiceRoomRef.current.getLocalAudioTrack() == null || localtrack.getType() === 'video') {
					voiceRoomRef.current.addTrack(localtrack);
				}				
			}
		}
	}, [isJoinedConf, targetTrackNode]);

	const onRemoteTrackRemoved = useCallback((track: JitsiRemoteTrack) => {
		console.log("onRemoteTrackRemoved");
	}, []);

	const onRemoteTrackAdded = useCallback((track: JitsiRemoteTrack) => {
		console.log("onRemoteTrackAdded");
		if (track.isLocal()) {
			return;
		}

		const participant = track.getParticipantId();
		
		if (remoteTracksRef && remoteTracksRef.current) {
			const remoteTrack = remoteTracksRef.current.get(participant);
			const filter = remoteTrack?.filter(item => item.getId() === track.getId());
			console.log(remoteTrack);
			if ((filter?.length as number) > 0) {
				console.log("already in");
				return; // already added
			}
			remoteTracksRef.current.get(participant)?.push(track);
		}
		
		track.addEventListener(
			JitsiMeetJS.events.track.TRACK_AUDIO_LEVEL_CHANGED, onTrackAudioLevelChanged);
		track.addEventListener(
			JitsiMeetJS.events.track.TRACK_MUTE_CHANGED, onTrackMuteChanged);
		track.addEventListener(
			JitsiMeetJS.events.track.LOCAL_TRACK_STOPPED, onLocalTrackStoped);
		track.addEventListener(JitsiMeetJS.events.track.TRACK_AUDIO_OUTPUT_CHANGED, onTrackAudioOuputChanged);
		
		if (track.getType() === 'video') {
			const remoteVideo = document.createElement("video");
			remoteVideo.autoplay = true;
			remoteVideo.id = 'remotevideo_' + participant;
			track.attach(remoteVideo);
			targetTrackNode?.appendChild(remoteVideo);
		} else {
			const localAudioElem = document.createElement("audio");
			localAudioElem.id = 'remoteaudio_'+participant;
			localAudioElem.autoplay = true;
			localAudioElem.muted = true;
			track.attach(localAudioElem);
			targetTrackNode?.appendChild(localAudioElem);
		}
	}, [remoteTracksRef, targetTrackNode]);
	
	const onConferenceJoined = useCallback(() => {
		console.log("onConferenceJoined");
		setIsJoinedConf(true);

		localTracksRef.current.forEach((localTrack) => {
			voiceRoomRef.current?.addTrack(localTrack);
		});
	}, [isJoinedConf]);
	
	const onUserJoined = useCallback((id: string) => {
		console.log('user join', id);
		remoteTracksRef.current.set(id, []);
	}, []);

	const onUserLeft = useCallback((id: string) => {
		console.log('user left', id);
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

	const onTrackAudioLevelChanged = useCallback((audioLevel: number) => {
		console.log(`Audio Level: ${audioLevel}`);
		
	}, [])

	const onTrackAudioOuputChanged = useCallback((deviceId: number) => {
		console.log(`track audio output device was changed to ${deviceId}`)		
	}, [])
	

	const onLocalTrackStoped = useCallback((track: JitsiLocalTrack) => {
		console.log('local track stoped')		
	}, [])

	const createLocalTrack = useCallback(() => {				
		JitsiMeetJS.createLocalTracks({ devices: [ 'audio', 'video' ] })
		.then((tracks) => {
			onLocalTracks(tracks);
		}).catch(error => {
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
	}, [onLocalTracks]);

	const createVoiceRoom = useCallback(async () => {
		console.log("room name", currentVoiceRoomName);
		if (!voiceConnRef.current) {
			throw new Error('voice connection not init');
		}

		const confOptions = {
			enableLayerSuspension: true,
			p2p: {
				enabled: true
			}
		};

		console.log("room name", currentVoiceRoomName);
		if (voiceRoomRef.current?.getName() === currentVoiceRoomName) {
			console.log("already created");
			return null;
		}
		
		console.log("room name", currentVoiceRoomName);
		voiceRoomRef.current = voiceConnRef.current.initJitsiConference(currentVoiceRoomName, confOptions);	
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_ADDED, onRemoteTrackAdded);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_REMOVED, onRemoteTrackRemoved);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.CONFERENCE_JOINED, onConferenceJoined);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.USER_JOINED, onUserJoined);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.USER_LEFT, onUserLeft);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_MUTE_CHANGED, onTrackMuteChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.DISPLAY_NAME_CHANGED, onDisplayNameChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.TRACK_AUDIO_LEVEL_CHANGED, onAudioLevelChanged);
		voiceRoomRef.current.on(JitsiMeetJS.events.conference.PHONE_NUMBER_CHANGED, onPhoneNumberChanged);
		voiceRoomRef.current.join("password");
		voiceRoomRef.current.setReceiverVideoConstraint(720); // max 720

		voiceRoomRef.current.setDisplayName(userDisplayName);

		return voiceRoomRef.current;
	}, [currentVoiceRoomName, onConferenceJoined, onRemoteTrackRemoved])
	
	const onConnectionSuccess = useCallback(() => {
		console.log("onConnectionSuccess");
		createVoiceRoom();		
	}, [createVoiceRoom]);

	const createVoiceConnection = useCallback(async (roomName: string, jwt: string) => {
		if (!currentVoiceRoomName) {
			return null; // init when the channel is set
		}

		if (voiceConnRef && voiceConnRef.current) {
			return voiceConnRef.current;
		}

		const optionsWithRoom = { 
			...options,
			serviceUrl: options.serviceUrl + roomName,
		};

		console.log("options", optionsWithRoom);

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

		if (localTracksRef.current.length === 0) {
			// get local video, audio
			createLocalTrack();
		}

		return connection;
	}, [currentVoiceRoomName, onConnectionSuccess, createLocalTrack])

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

	
	/**
	 *
	 * @param selected
	 */
	const changeAudioOutput = useCallback((selected: any) => { // eslint-disable-line no-unused-vars
		JitsiMeetJS.mediaDevices.setAudioOutputDevice(selected.value);
	}, []);

	const value = React.useMemo<VoiceContextValue>(
		() => ({
			voiceConnRef,
			voiceRoomRef,
			currentVoiceRoomName,
			setTargetTrackNode,
			setCurrentVoiceRoomName,
			setUserDisplayName,
			createVoiceConnection,
			voiceDisconnect,
			changeAudioOutput,
			createLocalTrack,
		}),
		[
			voiceConnRef, 
			voiceRoomRef, 
			currentVoiceRoomName,
			createVoiceConnection, 
			setCurrentVoiceRoomName, 
			setUserDisplayName,
		],
	);

	return <VoiceContext.Provider value={value}>{children}</VoiceContext.Provider>;
};

const VoiceContextConsumer = VoiceContext.Consumer;

export { VoiceContext, VoiceContextConsumer, VoiceContextProvider };

