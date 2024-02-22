import {
	messagesActions,
	selectAllAccount,
	selectChannelMemberByUserIds,
	selectCurrentClanId,
	selectHasMoreMessageByChannelId,
	selectLastMessageIdByChannelId,
	selectTypingUserIdsByChannelId,
	selectUnreadMessageIdByChannelId,
	useAppDispatch,
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessage } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChannelMembers } from './useChannelMembers';
import { useMessages } from './useMessages';
import { useThreads } from './useThreads';

export function useChatChannel(channelId: string) {
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	// const { clans } = useClans();
	const { threads } = useThreads();
	// TODO: maybe add hook for current clan
	const currentClanId = useSelector(selectCurrentClanId);
	const { userProfile } = useSelector(selectAllAccount);
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
		async (message: IMessage) => {
			// TODO: send message to server using mezon client
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				console.log(client, session, socket, channel, currentClanId);
				throw new Error('Client is not initialized');
			}

			const payload = {
				...message,
				id: Math.random().toString(),
				date: new Date().toLocaleString(),
				user: {
					name: userProfile?.user?.display_name || '',
					username: userProfile?.user?.username || '',
					id: userProfile?.user?.id || 'idUser',
					avatarSm: userProfile?.user?.avatar_url || '',
				},
			};
			if (!payload.channel_id) {
				payload.channel_id = channelId || '';
			}
			await socket.writeChatMessage(currentClanId, channel.id, payload);
		},
		[
			sessionRef,
			clientRef,
			socketRef,
			channelRef,
			currentClanId,
			userProfile?.user?.display_name,
			userProfile?.user?.username,
			userProfile?.user?.id,
			userProfile?.user?.avatar_url,
			channelId,
		],
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
