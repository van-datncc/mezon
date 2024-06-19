import { messagesActions, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useClans } from './useClans';

export type UseDeleteMessageOptions = {
	channelId: string;
	channelLabel: string;
	mode: number;
};

export function useDeleteMessage({ channelId, channelLabel, mode }: UseDeleteMessageOptions) {
	const dispatch = useAppDispatch();
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
			dispatch(messagesActions.remove(messageId));

			await socket.removeChatMessage(channelId, channel.chanel_label ?? '', mode, messageId);
		},
		[sessionRef, clientRef, socketRef, channelRef, currentClanId, dispatch, channelId, mode],
	);

	return useMemo(
		() => ({
			DeleteSendMessage,
		}),
		[DeleteSendMessage],
	);
}
