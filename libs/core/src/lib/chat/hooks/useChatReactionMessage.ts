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
			messageDataReactedFromSocket,
		}),
		[reactionMessage, reactionMessageAction, messageDataReactedFromSocket],
	);
}

const message = {
	channel_id: '48d71b5d-ef38-4a72-ab88-c726ea6b2bff',
	code: 0,
	create_time: '2024-03-05T06:18:48Z',
	message_id: '65ff2ceb-7dfa-42a6-9fc2-9a99a12db258',
	sender_id: '2640ec35-9de3-44c1-8481-07615e66d240',
	update_time: '2024-03-05T06:18:48Z',
	content: {
		t: 'htt-03',
	},
	attachments: [],
	mentions: [],
	reactions: [
		{
			id: '60d948c6-e0e2-449e-a3aa-7928596e994a',
			sender_id: '2640ec35-9de3-44c1-8481-07615e66d240',
			emoji: '🤣',
		},
	],
	references: [],
	creationTime: '2024-03-05T06:18:48.000Z',
	creationTimeMs: 1709619528000,
	id: '65ff2ceb-7dfa-42a6-9fc2-9a99a12db258',
	date: '13:19:19 5/3/2024',
	user: {
		name: '',
		username: '',
		id: '2640ec35-9de3-44c1-8481-07615e66d240',
		avatarSm: '',
	},
	lastSeen: true,
};

const messReactConvert = {
	channelId: '48d71b5d-ef38-4a72-ab88-c726ea6b2bff',
	messageId: '65ff2ceb-7dfa-42a6-9fc2-9a99a12db258',
	data: {
		id: '',
		sender_id: '2640ec35-9de3-44c1-8481-07615e66d240',
		emoji: '🤣',
	},
};
