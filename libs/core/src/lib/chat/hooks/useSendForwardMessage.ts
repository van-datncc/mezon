import { toastActions, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageWithUser } from '@mezon/utils';
import React, { useMemo } from 'react';

export function useSendForwardMessage() {
	const { clientRef, sessionRef, socketRef } = useMezon();
	const dispatch = useAppDispatch();

	const client = clientRef.current;

	const sendForwardMessage = React.useCallback(
		async (clanid: string, channel_id: string, mode: number, isPublic: boolean, message: IMessageWithUser) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !channel_id) {
				console.log(client, session, socket, channel_id);
				throw new Error('Client is not initialized');
			}

			try {
				await socket.writeChatMessage(
					clanid,
					'0',
					channel_id,
					mode,
					isPublic,
					false,
					message.content,
					message.mentions,
					message.attachments,
					message.references
				);

				dispatch(
					toastActions.addToast({
						type: 'success',
						message: 'Message forwarded successfully'
					})
				);
			} catch (e) {
				dispatch(
					toastActions.addToast({
						type: 'error',
						message: 'Failed to forward message'
					})
				);
			}
		},
		[sessionRef, clientRef, socketRef]
	);

	return useMemo(
		() => ({
			client,
			sendForwardMessage
		}),
		[client, sendForwardMessage]
	);
}
