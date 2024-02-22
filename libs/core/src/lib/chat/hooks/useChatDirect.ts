import { selectAllAccount, selectAllDirectMessages, selectAllFriends } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChannelMembers } from './useChannelMembers';
import { useMessages } from './useMessages';
import { IMessageSendPayload } from '@mezon/utils';

export function useChatDirect(directMessageID: string | undefined) {
	const friends = useSelector(selectAllFriends);
	const listDM = useSelector(selectAllDirectMessages);
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();	
	const { messages } = useMessages({ channelId: directMessageID });
	const client = clientRef.current;
	
	const { members } = useChannelMembers({ channelId: directMessageID });

	const sendDirectMessage = React.useCallback(
		async (message: IMessageSendPayload) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel) {
				console.log(client, session, socket, channel);
				throw new Error('Client is not initialized');
			}

			await socket.writeChatMessage('', channel.id, message);
		},
		[sessionRef, clientRef, socketRef, channelRef],
	);

	return useMemo(
		() => ({
			friends,
			client,
			messages,
			sendDirectMessage,
			directMessageID,
			listDM,
			members,
		}),
		[friends, client, messages, sendDirectMessage, directMessageID, listDM, members],
	);
}
