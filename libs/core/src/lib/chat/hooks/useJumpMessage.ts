import React, { useMemo } from "react";

export type useJumpToMessagesOptions = {
	channelId: string;
};

let messID: string | null = null;

export function useJumpToMessage() {
	const jumpToMessage = React.useCallback(async ( messageId: string | null = null) => {
		if (messageId) {
			
			const messageElement = document.getElementById(messageId);
			if (messageElement) {
				messageElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
			}
			setJumpToMessageId(null);
		}

	}, []);
	return useMemo(
		() => ({
			jumpToMessage
		}),
		[jumpToMessage],
	);
}
export function getJumpToMessageId() {
	return messID;
}
export function setJumpToMessageId(messageID : string | null) {
	messID = messageID;
}
