import {
	emojiActions,
	getDataReactionCombine,
	referencesActions,
	selectEmojiReactedBottomState,
	// selectEmojiSelectedReacted,
	selectMessageReacted,
	selectReference,
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { EmojiDataOptionals, EmojiPlaces } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';
import { useClans } from './useClans';

export type UseMessageReactionOption = {
	currentChannelId?: string | null | undefined;
};

export function useChatReactionMessage() {
	const { currentClanId } = useClans();
	const dispatch = useDispatch();

	const messageDataReactedFromSocket = useSelector(selectMessageReacted);

	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
	const { userId } = useAuth();

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

	const isOpenEmojiReactedBottom = useSelector(selectEmojiReactedBottomState);
	const refMessage = useSelector(selectReference);
	const dataReactionServerAndSocket = useSelector(getDataReactionCombine);

	function combineEmojiActions(data: any[]): EmojiDataOptionals[] {
		const processedItems: Record<string, EmojiDataOptionals> = {};

		data.forEach((item) => {
			const key = `${item.emoji}_${item.channel_id}_${item.message_id}`;

			if (!processedItems[key]) {
				processedItems[key] = {
					id: item.id,
					emoji: item.emoji,
					senders: [
						{
							sender_id: item.senders[0].sender_id,
							count: item.senders[0].count,
						},
					],
					channel_id: item.channel_id,
					message_id: item.message_id,
				};
			} else {
				const existingItem = processedItems[key];
				const senderIndex = existingItem.senders.findIndex((sender) => sender.sender_id === item.senders[0].sender_id);

				if (senderIndex !== -1) {
					existingItem.senders[senderIndex].count += item.senders[0].count;
				} else {
					existingItem.senders.push({
						sender_id: item.senders[0].sender_id,
						count: item.senders[0].count,
					});
				}
			}
		});

		return Object.values(processedItems);
	}

	const dataReactionCombine = combineEmojiActions(dataReactionServerAndSocket);

	const setMessageRef = useCallback(
		(state: any) => {
			dispatch(referencesActions.setReference(state));
		},
		[dispatch],
	);

	const setIsOpenEmojiReacted = useCallback(
		(state: boolean) => {
			dispatch(emojiActions.setEmojiReactedState(state));
		},
		[dispatch],
	);

	const setIsOpenEmojiMessBox = useCallback(
		(state: boolean) => {
			dispatch(emojiActions.setEmojiMessBoxState(state));
		},
		[dispatch],
	);

	const setEmojiPlaceActive = useCallback(
		(state: EmojiPlaces) => {
			dispatch(emojiActions.setEmojiPlaceActive(state));
		},
		[dispatch],
	);

	const setIsOpenEmojiReactedBottom = useCallback(
		(state: boolean) => {
			dispatch(emojiActions.setEmojiMessBoxState(state));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			userId,
			reactionMessage,
			reactionMessageAction,
			messageDataReactedFromSocket,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine,
		}),
		[
			userId,
			reactionMessage,
			reactionMessageAction,
			messageDataReactedFromSocket,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine,
			dataReactionCombine,
		],
	);
}
