import { messagesActions, selectChannelMemberByUserIds, selectCurrentClanId, selectTypingUserIdsByChannelId, useAppDispatch } from '@mezon/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

interface UseChatTypingsOptions {
	channelId: string;
	mode: number;
}

export function useChatTypings({ channelId, mode }: UseChatTypingsOptions) {
	const typingUsersIds = useSelector(selectTypingUserIdsByChannelId(channelId));
	const typingUsers = useSelector(selectChannelMemberByUserIds(channelId, typingUsersIds || []));
	const currentClanId = useSelector(selectCurrentClanId)

	const dispatch = useAppDispatch();

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ clanId: currentClanId || '', channelId, mode }));
	}, [channelId, currentClanId, dispatch, mode]);

	return useMemo(
		() => ({
			typingUsers,
			sendMessageTyping,
		}),
		[typingUsers, sendMessageTyping],
	);
}
