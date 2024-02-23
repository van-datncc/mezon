import { useMezon } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useClans } from './useClans';
import { messagesActions, useAppDispatch } from '@mezon/store';

export type UseChatSendingOptions = {
	channelId: string;
};

export function useChatSending({ channelId }: UseChatSendingOptions) {
	const { currentClanId } = useClans();
	const dispatch = useAppDispatch();

	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	
	const sendMessage = React.useCallback(
		async (message: IMessageSendPayload) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}

			await socket.writeChatMessage(currentClanId, channel.id, message);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId],
	);


	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ channelId }));
	}, [channelId, dispatch]);

	return useMemo(
		() => ({
			sendMessage,
			sendMessageTyping,
		}),
		[sendMessage, sendMessageTyping],
	);
}
