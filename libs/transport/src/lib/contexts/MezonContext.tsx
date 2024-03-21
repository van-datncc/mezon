import { Channel, ChannelStreamMode, ChannelType, Client, Session, Socket, Status } from '@mezon/mezon-js';
import { WebSocketAdapterPb } from "@mezon/mezon-js-protobuf"
import { DeviceUUID } from 'device-uuid';
import React, { useCallback } from 'react';
import { CreateMezonClientOptions, CreateVoiceClientOptions, createClient as createMezonClient } from '../mezon';
import JitsiConnection from 'vendors/lib-jitsi-meet/dist/esm/JitsiConnection';
import JitsiMeetJS from 'vendors/lib-jitsi-meet/dist/esm/JitsiMeetJS';
import options from '../voice/options/config';

type MezonContextProviderProps = {
	children: React.ReactNode;
	mezon: CreateMezonClientOptions;
	connect?: boolean;
	voiceOpt: CreateVoiceClientOptions;
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
	createVoiceConnection: () => Promise<JitsiConnection>,
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
};

const MezonContext = React.createContext<MezonContextValue>({} as MezonContextValue);

const MezonContextProvider: React.FC<MezonContextProviderProps> = ({ children, mezon, connect, voiceOpt }) => {
	const clientRef = React.useRef<Client | null>(null);
	const sessionRef = React.useRef<Session | null>(null);
	const socketRef = React.useRef<Socket | null>(null);
	const channelRef = React.useRef<Channel | null>(null);
	const voiceConnRef = React.useRef<JitsiConnection | null>(null);

	const onConnectionSuccess = () => {
		console.log("onConnectionSuccess");
	}

	const onConnectionFailed = () => {
		console.log("onConnectionFailed");
	}

	const onDisconnect = () => {
		console.log("onDisconnect");
	}

	const createVoiceConnection = useCallback(async () => {
		const optionsWithRoom = { 
			...options,
			serviceUrl: options.serviceUrl + `?room=${voiceOpt.roomName}`,
		};

		JitsiMeetJS.setLogLevel(JitsiMeetJS.logLevels.ERROR);
		const initOptions = {
			disableAudioLevels: true
		};

		JitsiMeetJS.init(initOptions);

		const connection = new JitsiMeetJS.JitsiConnection(voiceOpt.appID, voiceOpt.token, optionsWithRoom);

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
	}, [voiceOpt])

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

			await createVoiceConnection();

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

			await createVoiceConnection();

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
	}, [socketRef]);

	const authenticateDevice = useCallback(
		async (username: string) => {
			if (!clientRef.current) {
				throw new Error('Mezon client not initialized');
			}

			const deviceId = new DeviceUUID().get();

			const session = await clientRef.current.authenticateDevice(deviceId, true, username);
			sessionRef.current = session;

			await createVoiceConnection();

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
