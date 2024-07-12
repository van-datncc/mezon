import { messagesActions, selectCurrentChannel, selectCurrentClanId, selectDirectById, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppParams } from '../../app/hooks/useAppParams';

export type UseDeleteMessageOptions = {
	channelId: string;
	mode: number;
};

export function useDeleteMessage({ channelId, mode }: UseDeleteMessageOptions) {
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId);
	const { directId } = useAppParams();
	const direct = useSelector(selectDirectById(directId || ''));
	const { clientRef, sessionRef, socketRef } = useMezon();
	const channel = useSelector(selectCurrentChannel);

	const deleteSendMessage = React.useCallback(
		async (messageId: string) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}
			let channelIdDelete = channelId;
			if (direct) {
				channelIdDelete = direct.id || '';
			}

			dispatch(
				messagesActions.remove({
					channelId: channelIdDelete,
					messageId,
				}),
			);

			await socket.removeChatMessage(currentClanId || '', channelIdDelete, mode, messageId);
		},
		[sessionRef, clientRef, socketRef, channel, direct, channelId, dispatch, currentClanId, mode],
	);

	return useMemo(
		() => ({
			deleteSendMessage,
		}),
		[deleteSendMessage],
	);
}
