import { Channel, ChannelStreamMode, ChannelType, Client, Session, Socket, Status } from '@mezon/mezon-js';
import { WebSocketAdapterPb } from "@mezon/mezon-js-protobuf"
import { DeviceUUID } from 'device-uuid';
import React, { useCallback } from 'react';
import { CreateMezonClientOptions, createClient as createMezonClient } from '../mezon';
import JitsiConnection from 'vendors/lib-jitsi-meet/dist/esm/JitsiConnection';
import JitsiMeetJS from 'vendors/lib-jitsi-meet/dist/esm/JitsiMeetJS';
import options from '../voice/options/config';
import JitsiConference from 'vendors/lib-jitsi-meet/dist/esm/JitsiConference';
import JitsiLocalTrack from 'vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiLocalTrack';
import JitsiRemoteTrack from 'vendors/lib-jitsi-meet/dist/esm/modules/RTC/JitsiRemoteTrack';
import { JitsiConferenceErrors } from 'vendors/lib-jitsi-meet/dist/esm/JitsiConferenceErrors';

type MezonContextProviderProps = {
	children: React.ReactNode;
	mezon: CreateMezonClientOptions;
	connect?: boolean;
};

type Sessionlike = {
	token: string;
	refresh_token: string;
	created: boolean;
};

export type MezonContextValue = {
	clientRef: React.MutableRefObject<Client | null>;
	sessionRef: React.MutableRefObject<Session | null>;
	socketRef: React.MutableRefObject<Socket | null>;
	channelRef: React.MutableRefObject<Channel | null>;
	voiceConnRef: React.MutableRefObject<JitsiConnection | null>;
	createVoiceConnection: (roomName: string, token: string) => Promise<JitsiConnection>,
	createClient: () => Promise<Client>;
	authenticateEmail: (email: string, password: string) => Promise<Session>;
	authenticateDevice: (username: string) => Promise<Session>;
	authenticateGoogle: (token: string) => Promise<Session>;
	logOutMezon: () => Promise<void>;
	refreshSession: (session: Sessionlike) => Promise<Session>;
	joinChatChannel: (channelId: string) => Promise<Channel>;
	joinChatDirectMessage: (channelId: string, channelName?: string, channelType?: number) => Promise<Channel>;
	addStatusFollow: (ids: string[]) => Promise<Status>;
	reconnect: () => Promise<void>;
	createVoiceRoom: (roomName: string) => Promise<JitsiConference>;
	createLocalTrack: () => void;
};

const MezonContext = React.createContext<MezonContextValue>({} as MezonContextValue);

const MezonContextProvider: React.FC<MezonContextProviderProps> = ({ children, mezon, connect }) => {
	const clientRef = React.useRef<Client | null>(null);
	const sessionRef = React.useRef<Session | null>(null);
	const socketRef = React.useRef<Socket | null>(null);
	const channelRef = React.useRef<Channel | null>(null);
	const voiceConnRef = React.useRef<JitsiConnection | null>(null);
	const voiceRoomRef = React.useRef<JitsiConference | null>(null);
	const localTracks = React.useRef<JitsiLocalTrack[]>(null);
	//const remoteTracks = React.useRef<JitsiRemoteTrack[]>(null);

	const createVoiceRoom = useCallback(async (roomName: string) => {
		if (!voiceConnRef.current) {
			throw new Error('voice connection not init');
		}
		
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
		voiceRoomRef.current.join("password");

		return voiceRoomRef.current;
	}, [voiceConnRef])

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

	const createSocket = useCallback(async () => {
		if (!clientRef.current) {
			throw new Error('Mezon client not initialized');
		}
		const socket = clientRef.current.createSocket(clientRef.current.useSSL, false, new WebSocketAdapterPb());
		socketRef.current = socket;
		return socket;
	}, [clientRef, socketRef]);

	const createClient = useCallback(async () => {
		const client = await createMezonClient(mezon);
		clientRef.current = client;
		return client;
	}, [mezon]);

	const authenticateEmail = useCallback(
		async (email: string, password: string) => {
			if (!clientRef.current) {
				throw new Error('Mezon client not initialized');
			}
			const session = await clientRef.current.authenticateEmail(email, password, false);
			sessionRef.current = session;

			const socket = await createSocket(); // Create socket after authentication
			socketRef.current = socket;

			if (!socketRef.current) {
				return session;
			}

			const session2 = await socketRef.current.connect(session, true);
			sessionRef.current = session2;

			await createVoiceConnection(session.token);

			return session;
		},
		[clientRef, socketRef],
	);

	const authenticateGoogle = useCallback(
		async (token: string) => {
			if (!clientRef.current) {
				throw new Error('Mezon client not initialized');
			}
			const session = await clientRef.current.authenticateGoogle(token);
			sessionRef.current = session;

			const socket = await createSocket(); // Create socket after authentication
			socketRef.current = socket;

			if (!socketRef.current) {
				return session;
			}

			const session2 = await socketRef.current.connect(session, true);
			sessionRef.current = session2;

			await createVoiceConnection(session.token);

			return session;
		},
		[clientRef, socketRef],
	);

	const logOutMezon = useCallback(async () => {
		if (socketRef.current) {
			await socketRef.current.disconnect(true);
		}
		socketRef.current = null;
		sessionRef.current = null;

		voiceDisconnect();
		voiceConnRef.current = null;
		
	}, [socketRef]);

	const authenticateDevice = useCallback(
		async (username: string) => {
			if (!clientRef.current) {
				throw new Error('Mezon client not initialized');
			}

			const deviceId = new DeviceUUID().get();

			const session = await clientRef.current.authenticateDevice(deviceId, true, username);
			sessionRef.current = session;

			await createVoiceConnection(session.token);

			return session;
		},
		[clientRef],
	);

	const refreshSession = useCallback(
		async (session: Sessionlike) => {
			if (!clientRef.current) {
				throw new Error('Mezon client not initialized');
			}
			const newSession = await clientRef.current.sessionRefresh(new Session(session.token, session.refresh_token, session.created));
			sessionRef.current = newSession;

			if (!socketRef.current) {
				return newSession;
			}

			const session2 = await socketRef.current.connect(newSession, true);
			sessionRef.current = session2;

			await createVoiceConnection(session.token);

			return newSession;
		},
		[clientRef, socketRef],
	);

	const joinChatChannel = React.useCallback(
		async (channelId: string) => {			
			const socket = socketRef.current;

			if (!socket) {
				throw new Error('Socket is not initialized');
			}

			const join = await socket.joinChat(channelId, '', ChannelStreamMode.STREAM_MODE_CHANNEL, ChannelType.CHANNEL_TYPE_TEXT, true, false); // mode: 2 - channel, type: 1 - Text and voice

			channelRef.current = join;
			return join;
		},
		[socketRef],
	);

	const reconnect = React.useCallback(async () => {
		if (!clientRef.current) {
			return;
		}
		
		const session = sessionRef.current;
		if (!session) {
			return;
		}
	
		if (!socketRef.current) {
			return;
		}

		const session2 = await socketRef.current.connect(session, true);
		sessionRef.current = session2;

	}, [clientRef, sessionRef, socketRef]);

	const addStatusFollow = React.useCallback(
		async (userIds: string[]) => {
			const socket = socketRef.current;

			if (!socket) {
				throw new Error('Socket is not initialized');
			}

			const statusFollow = await socket.followUsers(userIds);
			return statusFollow;
		},
		[socketRef],
	);

	// TODO: use same function for joinChatChannel and joinChatDirectMessage

	const joinChatDirectMessage = React.useCallback(
		async (channelId: string, channelLabel?: string | undefined, channelType?: number | undefined) => {
			const socket = socketRef.current;

			if (!socket) {
				throw new Error('Socket is not initialized');
			}

			let mode = ChannelStreamMode.STREAM_MODE_CHANNEL; // channel
			if (channelType === ChannelType.CHANNEL_TYPE_DM) { // DM
				mode = ChannelStreamMode.STREAM_MODE_DM;
			} else if (channelType === ChannelType.CHANNEL_TYPE_GROUP) { // GROUP
				mode = ChannelStreamMode.STREAM_MODE_GROUP;
			}

			const join = await socket.joinChat(channelId, channelLabel ?? '', mode, channelType ?? 0, true, false);

			if (join) {
				channelRef.current = join;
			}
			return join;
		},
		[socketRef],
	);

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

	const value = React.useMemo<MezonContextValue>(
		() => ({
			clientRef,
			sessionRef,
			socketRef,
			channelRef,
			voiceConnRef,
			createVoiceConnection,
			createClient,
			authenticateDevice,
			authenticateEmail,
			authenticateGoogle,
			refreshSession,
			joinChatChannel,
			joinChatDirectMessage,
			createSocket,
			addStatusFollow,
			logOutMezon,
			reconnect,
			voiceDisconnect,
			createVoiceRoom,
			createLocalTrack,
		}),
		[
			clientRef,
			sessionRef,
			socketRef,
			channelRef,
			voiceConnRef,
			createVoiceConnection,
			createClient,
			authenticateDevice,
			authenticateEmail,
			authenticateGoogle,
			refreshSession,
			joinChatChannel,
			joinChatDirectMessage,
			createSocket,
			addStatusFollow,
			logOutMezon,
			reconnect,
			voiceDisconnect,
			createVoiceRoom,
			createLocalTrack,
		],
	);

	React.useEffect(() => {
		if (connect) {
			createClient().then(() => {
				return createSocket();
			});
		}
	}, [connect, createClient, createSocket]);

	return <MezonContext.Provider value={value}>{children}</MezonContext.Provider>;
};

const MezonContextConsumer = MezonContext.Consumer;

export type MezonSuspenseProps = {
	children: React.ReactNode;
};

const MezonSuspense: React.FC<MezonSuspenseProps> = ({ children }: MezonSuspenseProps) => {
	const { clientRef, sessionRef, socketRef } = React.useContext(MezonContext);
	if (!clientRef.current || !sessionRef.current || !socketRef.current) {
		return <>Loading...</>;
	}
	// eslint-disable-next-line react/jsx-no-useless-fragment
	return <>{children}</>;
};

export { MezonContext, MezonContextConsumer, MezonContextProvider, MezonSuspense };
