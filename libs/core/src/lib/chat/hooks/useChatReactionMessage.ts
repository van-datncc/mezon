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

	const isOpenEmojiReactedBottom = useSelector(selectEmojiReactedBottomState);
	const refMessage = useSelector(selectReference);
	const dataReactionServerAndSocket = useSelector(getDataReactionCombine);
	const reactionDataSocket = useSelector(selectMessageReacted);

	function updateOrRemoveEmojiReaction(data: any[]): EmojiDataOptionals[] {
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
		console.log('data-2', dataItemReaction);
		if (reactionDataSocket.action) {
			const itemReactionKey = `${reactionDataSocket.emoji}_${reactionDataSocket.channel_id}_${reactionDataSocket.message_id}`;
			const itemReactionSender = reactionDataSocket.senders[0].sender_id;
			const removeDataReaction = (data: Record<string, EmojiDataOptionals>, keyToRemove: string, senderId: string) => {
				console.log('data', data);
				console.log('keyToRemove', keyToRemove);
				console.log('sender', senderId);
				if (keyToRemove in data) {
					const item = data[keyToRemove];
					console.log('item', item);
					const updatedSenders = item.senders.filter((sender) => sender.sender_id !== senderId);
					// Kiểm tra nếu không còn người gửi nào nữa, thì xóa item
					if (updatedSenders.length === 0) {
						delete data[keyToRemove];
					} else {
						// Cập nhật senders với danh sách senders đã lọc
						data[keyToRemove].senders = updatedSenders;
					}
				}
				return Object.values(data);
			};

			const newDataItemReaction = removeDataReaction(dataItemReaction, itemReactionKey, itemReactionSender ?? '');
			console.log(newDataItemReaction);
			return newDataItemReaction;
		} else {
			return Object.values(dataItemReaction);
		}
	}

	const dataReactionCombine = updateOrRemoveEmojiReaction(dataReactionServerAndSocket);

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
			messageDataReactedFromSocket,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine,
		],
	);
}
