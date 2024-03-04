import { useMezon } from '@mezon/transport';
import React, { useCallback, useMemo } from 'react';
import { useClans } from './useClans';

export type UseMessageReactionOption = {
	currentChannelId: string | null | undefined;
};

export function useChatReactionMessage({ currentChannelId }: UseMessageReactionOption) {
	const { currentClanId } = useClans();
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	const reactionMessage = React.useCallback(
		async (channelId: string, messageId: string, emoji: string) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			await socket.writeMessageReaction(channelId, messageId, emoji);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId],
	);

	const reactionMessageAction = useCallback(
		async (channelId: string, messageId: string, emoji: string) => {
			try {
				await reactionMessage(channelId, messageId, emoji);
			} catch (error) {
				console.error('Error reacting to message:', error);
			}
		},
		[reactionMessage],
	);

	return useMemo(
		() => ({
			reactionMessage,
			reactionMessageAction,
		}),
		[reactionMessage, reactionMessageAction],
	);
}
