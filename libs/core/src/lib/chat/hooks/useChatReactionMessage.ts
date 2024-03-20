import { selectMessageReacted } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useClans } from './useClans';

export type UseMessageReactionOption = {
	currentChannelId: string | null | undefined;
};

export function useChatReactionMessage({ currentChannelId }: UseMessageReactionOption) {
	const { currentClanId } = useClans();
	const messageDataReactedFromSocket = useSelector(selectMessageReacted);
	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	const reactionMessage = useCallback(
		async (id: string, mode: number, messageId: string, emoji: string, count: number, message_sender_id: string, action_delete: boolean) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			await socket.writeMessageReaction(id, channel.id, channel.chanel_label, mode, messageId, emoji, count, message_sender_id, action_delete);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId],
	);

	const reactionMessageAction = useCallback(
		async (id: string, mode: number, messageId: string, emoji: string, count: number, message_sender_id: string, action_delete: boolean) => {
			try {
				await reactionMessage(id, mode, messageId, emoji, count, message_sender_id, action_delete);
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
			messageDataReactedFromSocket,
		}),
		[reactionMessage, reactionMessageAction, messageDataReactedFromSocket],
	);
}
