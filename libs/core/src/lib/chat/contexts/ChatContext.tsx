import {
	ChannelMessageEvent,
	ChannelPresenceEvent,
	MessageReactionEvent,
	MessageTypingEvent,
	Notification,
	StatusPresenceEvent,
	VoiceJoinedEvent,
	VoiceLeavedEvent,
} from '@mezon/mezon-js';
import { channelMembersActions, channelsActions, emojiActions, friendsActions, mapMessageChannelToEntity, mapNotificationToEntity, mapReactionToEntity, messagesActions, notificationActions, useAppDispatch, voiceActions } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../auth/hooks/useAuth';
import { useSeenMessagePool } from '../hooks/useSeenMessagePool';

type ChatContextProviderProps = {
	children: React.ReactNode;
};

export type ChatContextValue = object;

const ChatContext = React.createContext<ChatContextValue>({} as ChatContextValue);

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {

	const value = React.useMemo<ChatContextValue>(
		() => ({
			// add logic code
		}), []);

	const { socketRef, reconnect } = useMezon();
	const { userId } = useAuth();
	const { initWorker, unInitWorker } = useSeenMessagePool();
	const dispatch = useAppDispatch();

	const onvoicejoined = useCallback((voice: VoiceJoinedEvent) => {
		if (voice) {
			dispatch(voiceActions.add({
				...voice,
			}));
		}
	}, [dispatch]);

	const onvoiceleaved = useCallback(
		(voice: VoiceLeavedEvent) => {
			console.log("VoiceLeavedEvent", voice);
			dispatch(voiceActions.remove(voice.id));
		},
		[dispatch],
	);

	const onchannelmessage = useCallback(
		(message: ChannelMessageEvent) => {
			dispatch(messagesActions.newMessage(mapMessageChannelToEntity(message)));
			const timestamp = Date.now() / 1000;
			dispatch(channelsActions.setChannelLastSentTimestamp({ channelId: message.channel_id, timestamp }));
		},
		[dispatch],
	);

	const onchannelpresence = useCallback(
		(channelPresence: ChannelPresenceEvent) => {
			dispatch(channelMembersActions.fetchChannelMembersPresence(channelPresence));
		},
		[dispatch],
	);

	const onstatuspresence = useCallback(
		(statusPresence: StatusPresenceEvent) => {
			dispatch(channelMembersActions.updateStatusUser(statusPresence));
		},
		[dispatch],
	);

	const onnotification = useCallback(
		(notification: Notification) => {
			dispatch(notificationActions.add(mapNotificationToEntity(notification)));
			if (notification.code === -2 || notification.code === -3) {
				dispatch(friendsActions.fetchListFriends());
				toast.info(notification.subject);
			}
		},
		[dispatch],
	);
	const ondisconnect = useCallback(() => {
		const retry = (attempt: number) => {
			console.log('Reconnecting', attempt);
			const delay = Math.min(100 * Math.pow(2, attempt), 30000); // Exponential backoff with maximum delay of 30 seconds
			const timeoutId = setTimeout(() => {
				reconnect()
					.then(() => {
						console.log('Reconnected');
					})
					.catch(() => {
						retry(attempt + 1);
						if (attempt > 5) { // max retry is 5
							clearTimeout(timeoutId);
						}
					});
			}, delay);
		};
		retry(0);
	}, [reconnect]);

	const onerror = useCallback((event: unknown) => {
		// TODO: handle error
		console.log(event);
	}, []);

	const onmessagetyping = useCallback(
		(e: MessageTypingEvent) => {
			if (e && e.sender_id === userId) {
				return;
			}

			dispatch(
				messagesActions.updateTypingUsers({
					channelId: e.channel_id,
					userId: e.sender_id,
					isTyping: true,
				}),
			);
		},
		[dispatch, userId],
	);

	const onmessagereaction = useCallback(
		(e: MessageReactionEvent) => {
			if (e) {
				dispatch(emojiActions.updateReactionMessage(mapReactionToEntity(e)));
			}
		},
		[dispatch],
	);

	useEffect(() => {
		const socket = socketRef.current;
		if (!socket) {
			return;
		}

		socket.onvoicejoined = onvoicejoined;

		socket.onvoiceleaved = onvoiceleaved;

		socket.onchannelmessage = onchannelmessage;

		socket.onchannelpresence = onchannelpresence;

		socket.ondisconnect = ondisconnect;

		socket.onerror = onerror;

		socket.onmessagetyping = onmessagetyping;

		socket.onmessagereaction = onmessagereaction;

		socket.onnotification = onnotification;

		socket.onstatuspresence = onstatuspresence;

		return () => {
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			socket.onchannelmessage = () => { };
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			socket.onchannelpresence = () => { };
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			socket.onnotification = () => { };
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			socket.onstatuspresence = () => { };
			// eslint-disable-next-line @typescript-eslint/no-empty-function
			socket.ondisconnect = () => { };
		};
	}, [onchannelmessage, onchannelpresence, ondisconnect, onmessagetyping, onmessagereaction, onnotification, onstatuspresence, socketRef, onvoicejoined, onvoiceleaved, onerror]);

	useEffect(() => {
		initWorker();
		return () => {
			unInitWorker();
		};
	}, [initWorker, unInitWorker]);

	return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

const ChatContextConsumer = ChatContext.Consumer;

export { ChatContext, ChatContextConsumer, ChatContextProvider };
