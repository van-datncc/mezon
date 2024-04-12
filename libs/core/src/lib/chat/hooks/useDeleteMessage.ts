import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useClans } from './useClans';

export type UseChatSendingOptions = {
	channelId: string;
	channelLabel: string;
	mode: number;
};

export function useChatSending({ channelId, channelLabel, mode }: UseChatSendingOptions) {
	const { currentClanId } = useClans();

	const { clientRef, sessionRef, socketRef, channelRef } = useMezon();

	const DeleteSendMessage = React.useCallback(
		async (messageId: string) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			const channel = channelRef.current;

			if (!client || !session || !socket || !channel || !currentClanId) {
				throw new Error('Client is not initialized');
			}
			await socket.removeChatMessage(channelId, channelLabel, mode, messageId);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId, mode, channelId, channelLabel],
	);

	return useMemo(
		() => ({
			DeleteSendMessage,
		}),
		[DeleteSendMessage],
	);
}
