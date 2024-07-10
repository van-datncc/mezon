import { selectCurrentClanId } from '@mezon/store';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppNavigation } from '../../app/hooks/useAppNavigation';

export type useJumpToMessagesOptions = {
	channelId: string;
	messageID: string;
};

let messID: string | null = null;

export function useJumpToMessage({ channelId, messageID }: useJumpToMessagesOptions) {
	const { navigate, toMessageChannel } = useAppNavigation();
	const currentClanId = useSelector(selectCurrentClanId);

	const jumpToMessage = React.useCallback(async (messageId: string | null = null, positionToJump: ScrollLogicalPosition = 'center') => {
		if (messageId) {
			const messageElement = document.getElementById(messageId);
			if (messageElement) {
				messageElement.scrollIntoView({ behavior: 'smooth', block: positionToJump });
			}
			setJumpToMessageId(null);
		}
	}, []);

	const directToMessageById = useCallback(async () => {
		await navigate(toMessageChannel(channelId, currentClanId ?? '', messageID ?? ''));
	}, [navigate, channelId, currentClanId, messageID]);

	return useMemo(
		() => ({
			directToMessageById,
			jumpToMessage,
		}),
		[directToMessageById, jumpToMessage],
	);
}
export function getJumpToMessageId() {
	return messID;
}
export function setJumpToMessageId(messageID: string | null) {
	messID = messageID;
}
