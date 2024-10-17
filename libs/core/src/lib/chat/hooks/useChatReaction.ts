import { reactionActions, selectClanView, useAppDispatch } from '@mezon/store';
import { EmojiStorage, transformPayloadWriteSocket } from '@mezon/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
export type UseMessageReactionOption = {
	currentChannelId?: string | null | undefined;
};
interface ChatReactionProps {
	isMobile?: boolean;
}

export function useChatReaction({ isMobile = false }: ChatReactionProps = {}) {
	const dispatch = useAppDispatch();
	const isClanView = useSelector(selectClanView);

	const reactionMessageDispatch = useCallback(
		async (
			id: string,
			mode: number,
			clanId: string,
			channelId: string,
			messageId: string,
			emoji_id: string,
			emoji: string,
			count: number,
			message_sender_id: string,
			action_delete: boolean,
			is_public: boolean
		) => {
			if (isMobile) {
				const emojiLastest: EmojiStorage = {
					emojiId: emoji_id ?? '',
					emoji: emoji ?? '',
					messageId: messageId ?? '',
					senderId: message_sender_id ?? '',
					action: action_delete ?? false
				};
				saveRecentEmojiMobile(emojiLastest);
			}

			const payload = transformPayloadWriteSocket({
				clanId,
				isPublicChannel: is_public,
				isClanView: isClanView as boolean
			});

			return dispatch(
				reactionActions.writeMessageReaction({
					id,
					clanId: payload.clan_id,
					channelId,
					mode,
					messageId,
					emoji_id,
					emoji,
					count,
					messageSenderId: message_sender_id,
					actionDelete: action_delete,
					isPublic: payload.is_public
				})
			).unwrap();
		},
		[dispatch, isMobile, isClanView]
	);

	return useMemo(
		() => ({
			reactionMessageDispatch
		}),
		[reactionMessageDispatch]
	);
}

function saveRecentEmojiMobile(emojiLastest: EmojiStorage) {
	AsyncStorage.getItem('recentEmojis').then((storedEmojis) => {
		const emojisRecentParse = storedEmojis ? JSON.parse(storedEmojis) : [];

		const duplicateIndex = emojisRecentParse.findIndex((item: any) => {
			return item.emoji === emojiLastest.emoji && item.senderId === emojiLastest.senderId;
		});

		if (emojiLastest.action === true) {
			if (duplicateIndex !== -1) {
				emojisRecentParse.splice(duplicateIndex, 1);
			}
		} else {
			if (duplicateIndex === -1) {
				emojisRecentParse.push(emojiLastest);
			}
		}
		AsyncStorage.setItem('recentEmojis', JSON.stringify(emojisRecentParse));
	});
}
