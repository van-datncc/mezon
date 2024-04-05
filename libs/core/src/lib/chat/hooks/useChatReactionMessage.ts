import {
	emojiActions,
	getDataReactionCombine,
	getGrandParentWidthState,
	referencesActions,
	selectEmojiOpenEditState,
	selectEmojiReactedBottomState,
	selectEmojiReactedState,
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
	const emojiReactedState = useSelector(selectEmojiReactedState);
	const emojiOpenEditState = useSelector(selectEmojiOpenEditState);
	const isOpenEmojiReactedBottom = useSelector(selectEmojiReactedBottomState);
	const refMessage = useSelector(selectReference);
	const dataReactionServerAndSocket = useSelector(getDataReactionCombine);
	const grandParentWidth = useSelector(getGrandParentWidthState);

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

	const updateEmojiReactionData = (data: any[]) => {
		const dataItemReaction: Record<string, EmojiDataOptionals> = {};

		data.forEach((item) => {
			const key = `${item.emoji}_${item.channel_id}_${item.message_id}`;
			if (!dataItemReaction[key]) {
				dataItemReaction[key] = {
					id: item.id,
					emoji: item.emoji,
					senders: [
						{
							sender_id: item.senders[0]?.sender_id ?? '',
							count: item.senders[0]?.count ?? 0,
							emojiIdList: [],
							sender_name: '',
							avatar: '',
						},
					],
					channel_id: item.channel_id,
					message_id: item.message_id,
				};
			} else {
				const existingItem = dataItemReaction[key];
				const senderIndex = existingItem.senders.findIndex((sender) => sender.sender_id === item.senders[0]?.sender_id);

				if (senderIndex !== -1) {
					existingItem.senders[senderIndex].count += item.senders[0]?.count ?? 0;
				} else {
					existingItem.senders.push({
						sender_id: item.senders[0]?.sender_id ?? '',
						count: item.senders[0]?.count ?? 0,
						emojiIdList: [],
						sender_name: '',
						avatar: '',
					});
				}
			}
		});
		return Object.values(dataItemReaction);
	};

	const dataReactionCombine = updateEmojiReactionData(dataReactionServerAndSocket);

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

	const setGrandParentWidthAction = useCallback(
		(state: number) => {
			dispatch(emojiActions.setGrandParentWidthState(state));
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			userId,
			reactionMessage,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine,
			emojiReactedState,
			emojiOpenEditState,
			grandParentWidth,
			setGrandParentWidthAction
		}),
		[
			userId,
			reactionMessage,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine,
			emojiReactedState,
			emojiOpenEditState,
			grandParentWidth,
			setGrandParentWidthAction
		],
	);
}
