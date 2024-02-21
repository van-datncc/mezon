import { MessagesEntity, selectMessageByChannelId } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type useMessagesOptions = {
	channelId?: string | null;
};

export function useMessages({ channelId }: useMessagesOptions = {}) {
	const rawMessage = useSelector(selectMessageByChannelId(channelId));

	const messages = useMemo(() => {
		if (!rawMessage) {
			return [];
		}

		return rawMessage.filter((message) => message) as MessagesEntity[];
	}, [rawMessage]);

	return {
		messages,
	};
}
