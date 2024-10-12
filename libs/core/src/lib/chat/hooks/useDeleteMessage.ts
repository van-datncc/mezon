import { messagesActions, selectClanView, selectCurrentChannel, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { transformPayloadWriteSocket } from '@mezon/utils';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type UseDeleteMessageOptions = {
	channelId: string;
	mode: number;
};

export function useDeleteMessage({ channelId, mode }: UseDeleteMessageOptions) {
	const dispatch = useAppDispatch();
	const currentClanId = useSelector(selectCurrentClanId);
	const isClanView = useSelector(selectClanView);
	const { socketRef } = useMezon();
	const channel = useSelector(selectCurrentChannel);

	const deleteSendMessage = React.useCallback(
		async (messageId: string) => {
			const socket = socketRef.current;
			if (!socket) return;

			dispatch(
				messagesActions.remove({
					channelId,
					messageId
				})
			);

			const payload = transformPayloadWriteSocket({
				clanId: currentClanId as string,
				isPublicChannel: !channel?.channel_private,
				isClanView: isClanView as boolean
			});

			await socket.removeChatMessage(payload.clan_id, channelId, mode, payload.is_public, messageId);
		},
		[socketRef, channel, channelId, dispatch, currentClanId, mode, isClanView]
	);

	return useMemo(
		() => ({
			deleteSendMessage
		}),
		[deleteSendMessage]
	);
}
