import {
	messagesActions,
	selectHasMoreMessageByChannelId,
	selectLastMessageIdByChannelId,
	selectMessageByChannelId,
	selectUnreadMessageIdByChannelId,
	useAppDispatch,
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type useMessagesOptions = {
	channelId: string;
	clanId?: string;
};

export function useChatMessages({ channelId, clanId }: useMessagesOptions) {
	const { clientRef } = useMezon();

	const client = clientRef.current;
	const dispatch = useAppDispatch();

	const messages = useSelector(selectMessageByChannelId(channelId));
	const hasMoreMessage = useSelector(selectHasMoreMessageByChannelId(channelId));
	const lastMessageId = useSelector(selectLastMessageIdByChannelId(channelId));
	const unreadMessageId = useSelector(selectUnreadMessageIdByChannelId(channelId));

	const loadMoreMessage = React.useCallback(async () => {
		dispatch(messagesActions.loadMoreMessage({ channelId }));
	}, [dispatch, channelId]);

	const jumpToMessage = React.useCallback(async ( messageId: string) => {
		await dispatch(messagesActions.jumpToMessage({ messageId, channelId }));
		const messageElement = document.getElementById(messageId);
		if (messageElement) {
			messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
		}

	}, [channelId, dispatch]);

	return useMemo(
		() => ({
			client,
			messages,
			unreadMessageId,
			lastMessageId,
			hasMoreMessage,
			loadMoreMessage,
			jumpToMessage,
		}),
		[client, messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage, jumpToMessage],
	);
}
