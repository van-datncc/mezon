import {
	messagesActions,
	selectChannelMemberByUserIds,
	selectCurrentClanId,
	selectHasMoreMessageByChannelId,
	selectLastMessageIdByChannelId,
	selectTypingUserIdsByChannelId,
	selectUnreadMessageIdByChannelId,
	useAppDispatch,
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChannelMembers } from './useChannelMembers';
import { useMessages } from './useMessages';
import { useThreads } from './useThreads';
import { IMessageSendPayload } from '@mezon/utils';

export function useChatChannel(channelId: string) {
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	const { threads } = useThreads();
	// TODO: maybe add hook for current clan
	const currentClanId = useSelector(selectCurrentClanId);
	const hasMoreMessage = useSelector(selectHasMoreMessageByChannelId(channelId));

	const { messages } = useMessages({ channelId });
	const { members } = useChannelMembers({ channelId });
	const typingUsersIds = useSelector(selectTypingUserIdsByChannelId(channelId));
	const typingUsers = useSelector(selectChannelMemberByUserIds(channelId, typingUsersIds || []));

	const unreadMessageId = useSelector(selectUnreadMessageIdByChannelId(channelId));
	const lastMessageId = useSelector(selectLastMessageIdByChannelId(channelId));

	const client = clientRef.current;
	const dispatch = useAppDispatch();

	const loadMoreMessage =React.useCallback(
		async () => {
			
			dispatch(messagesActions.loadMoreMessage({channelId}))
		},
		[dispatch, channelId],
	);	

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ channelId }));
	}, [channelId, dispatch]);

	const sendMessage = React.useCallback(
		async (message: IMessageSendPayload) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				console.log(client, session, socket, channel, currentClanId);
				throw new Error('Client is not initialized');
			}
			
			await socket.writeChatMessage(currentClanId, channel.id, message);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId],
	);

	return useMemo(
		() => ({
			client,
			messages,
			threads,
			members,
			unreadMessageId,
			lastMessageId,
			typingUsers,
			hasMoreMessage,
			sendMessage,
			sendMessageTyping,
			loadMoreMessage
		}),
		[
			client,
			messages,
			threads,
			members,
			unreadMessageId,
			lastMessageId,
			typingUsers,
			hasMoreMessage,
			sendMessage,
			sendMessageTyping,
			loadMoreMessage
		],
	);
}
