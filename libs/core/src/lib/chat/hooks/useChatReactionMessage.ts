import { useMezon } from '@mezon/transport';
import { useCallback, useMemo } from 'react';
import { useClans } from './useClans';

export type UseMessageReactionOption = {
	currentChannelId: string | null | undefined;
};

export function useChatReactionMessage({ currentChannelId }: UseMessageReactionOption) {
	const { currentClanId } = useClans();
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	const reactionMessage = useCallback(
		async (channelId: string, messageId: string, emoji: string, action_delete: boolean) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			await socket.writeMessageReaction(channelId, messageId, emoji, action_delete);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId],
	);

	const reactionMessageAction = useCallback(
		async (channelId: string, messageId: string, emoji: string, action_delete: boolean) => {
			try {
				console.log('reactionMessageAction', channelId, messageId, emoji, action_delete);
				await reactionMessage(channelId, messageId, emoji, action_delete);
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
