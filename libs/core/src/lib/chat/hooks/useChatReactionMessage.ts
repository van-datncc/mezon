import {
	emojiActions,
	getDataReactionCombine,
	referencesActions,
	selectEmojiReactedBottomState,
	// selectEmojiSelectedReacted,
	selectMessageReacted,
	selectReference,
	updateReactionMessage
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { EmojiPlaces } from '@mezon/utils';
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
	const dataReactionCombine = useSelector(getDataReactionCombine);

	// const emojiSelectedReacted = useSelector(selectEmojiSelectedReacted);

	// const setEmojiSelectedReacted = useCallback(
	// 	(state: string) => {
	// 		dispatch(emojiActions.setEmojiSelectedReacted(state));
	// 	},
	// 	[dispatch],
	// );

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

	// const updateEmojiData = useCallback(
	// 	(
	// 		id: string,
	// 		channelId: string,
	// 		messageId: string,
	// 		userId: string,
	// 		emoji: string,
	// 		count: number,
	// 		actionRemove: boolean
	// 	) => {
	// 		dispatch(updateReactionMessage({
	// 				id: id
	// 				channelId: channelId,
	// 				messageId: messageId,
	// 				userId: userId,
	// 				emoji: emoji,
	// 				count: count,
	// 				actionRemove: actionRemove
	// 			})
	// 		);
	// 	},
	// 	[dispatch]
	// );

	return useMemo(
		() => ({
			userId,
			reactionMessage,
			reactionMessageAction,
			messageDataReactedFromSocket,
			// setEmojiSelectedReacted,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine
			// emojiSelectedReacted,
			// updateEmojiData,
		}),
		[
			userId,
			reactionMessage,
			reactionMessageAction,
			messageDataReactedFromSocket,
			// setEmojiSelectedReacted,
			setMessageRef,
			setIsOpenEmojiReacted,
			setIsOpenEmojiMessBox,
			setEmojiPlaceActive,
			setIsOpenEmojiReactedBottom,
			isOpenEmojiReactedBottom,
			refMessage,
			dataReactionCombine
			// emojiSelectedReacted,
			// updateEmojiData,
		],
	);
}
