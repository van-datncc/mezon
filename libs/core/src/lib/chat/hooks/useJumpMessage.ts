import React, { useMemo } from 'react';

export type useJumpToMessagesOptions = {
	channelId: string;
	messageID: string;
	clanId: string;
};

let messID: string | null = null;

export function useJumpToMessage({ channelId, messageID, clanId }: useJumpToMessagesOptions) {
	const jumpToMessage = React.useCallback(async (messageId: string | null = null, positionToJump: ScrollLogicalPosition = 'center') => {
		if (messageId) {
			const messageElement = document.getElementById(messageId);
			if (messageElement) {
				messageElement.scrollIntoView({ behavior: 'smooth', block: positionToJump });
			}
			setJumpToMessageId(null);
		}
	}, []);

	return useMemo(
		() => ({
			jumpToMessage
		}),
		[jumpToMessage]
	);
}
export function getJumpToMessageId() {
	return messID;
}
export function setJumpToMessageId(messageID: string | null) {
	messID = messageID;
}
