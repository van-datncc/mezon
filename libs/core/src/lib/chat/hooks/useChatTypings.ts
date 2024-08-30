import { messagesActions, selectChannelMemberByUserIds, selectCurrentClanId, selectTypingUserIdsByChannelId, useAppDispatch } from '@mezon/store';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';

interface UseChatTypingsOptions {
	channelId: string;
	mode: number;
	isPublic: boolean;
}

export function useChatTypings({ channelId, mode, isPublic }: UseChatTypingsOptions) {
	const { userId } = useAuth();
	const typingUsersIds = useSelector(selectTypingUserIdsByChannelId(channelId));
	const typingUsers = useSelector(selectChannelMemberByUserIds(channelId, typingUsersIds?.filter((userID) => userID !== userId) || []));
	const currentClanId = useSelector(selectCurrentClanId);

	const dispatch = useAppDispatch();

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(
			messagesActions.sendTypingUser({
				clanId: currentClanId || '',
				channelId,
				mode,
				isPublic: isPublic
			})
		);
	}, [channelId, currentClanId, dispatch, isPublic, mode]);

	return useMemo(
		() => ({
			typingUsers,
			sendMessageTyping
		}),
		[typingUsers, sendMessageTyping]
	);
}
