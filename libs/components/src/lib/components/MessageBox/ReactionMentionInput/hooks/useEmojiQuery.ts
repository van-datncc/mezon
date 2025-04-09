import { useEmojiSuggestionContext } from '@mezon/core';
import { useCallback } from 'react';

export const useEmojiQuery = () => {
	const { emojis } = useEmojiSuggestionContext();

	const queryEmojis = useCallback(
		(query: string, callback: (data: any[]) => void) => {
			if (query.length === 0) return;
			const seenIds = new Set();
			const matches = emojis
				.filter((emoji) => emoji.shortname && emoji.shortname.toLowerCase().indexOf(query.toLowerCase()) > -1)
				.filter((emoji) => {
					if (emoji.id && !seenIds.has(emoji.id)) {
						seenIds.add(emoji.id);
						return true;
					}
					return false;
				})
				.slice(0, 20)
				.map((emojiDisplay) => ({ id: emojiDisplay?.id, display: emojiDisplay?.shortname }));

			callback(matches);
		},
		[emojis]
	);

	return { queryEmojis };
};
