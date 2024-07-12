import { messagesActions, selectChannelById, selectCurrentClanId, selectCurrentUserId, selectDirectById, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppParams } from '../../app/hooks/useAppParams';

export type UseChatSendingOptions = {
	channelId: string;
	channelLabel: string;
	mode: number;
	directMessageId?: string;
};

// TODO: separate this hook into 2 hooks for send and edit message
export function useChatSending({ channelId, channelLabel, mode, directMessageId }: UseChatSendingOptions) {
	const { directId } = useAppParams();
	const currentClanId = useSelector(selectCurrentClanId);
	const currentUserId = useSelector(selectCurrentUserId);

	const dispatch = useAppDispatch();
	// TODO: if direct is the same as channel use one slice
	// If not, using 2 hooks for direct and channel
	const direct = useSelector(selectDirectById(directMessageId || directId || ""));
	const { clientRef, sessionRef, socketRef } = useMezon();
	const channel = useSelector(selectChannelById(channelId));
	let channelID = channelId
	if (direct) {
		channelID = direct.id
	}
	const sendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			anonymous?: boolean,
			mentionEveryone?: boolean,
		) => {
			return dispatch(messagesActions.sendMessage({
				channelId: channelID,
				clanId: currentClanId ?? '',
				mode,
				content,
				mentions,
				attachments,
				references,
				anonymous,
				mentionEveryone,
				senderId: currentUserId,
			}))
		},
		[dispatch, channelID, currentClanId, mode, currentUserId],
	);

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ clanId: currentClanId || '', channelId, mode }));
	}, [channelId, currentClanId, dispatch, mode]);

	// TODO: why "Edit" not "edit"?
	// Move this function to to a new action of messages slice
	const EditSendMessage = React.useCallback(
		async (content: string, messageId: string) => {
			const editMessage: IMessageSendPayload = {
				t: content,
			};
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}
			
			await socket.updateChatMessage(currentClanId || '', channelId, mode, messageId, editMessage);
		},
		[sessionRef, clientRef, socketRef, channel, direct, currentClanId, channelId, mode],
	);

	return useMemo(
		() => ({
			sendMessage,
			sendMessageTyping,
			EditSendMessage,
		}),
		[sendMessage, sendMessageTyping, EditSendMessage],
	);
}
