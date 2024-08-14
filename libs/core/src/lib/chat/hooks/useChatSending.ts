import { useFilteredContent } from '@mezon/core';
import {
	messagesActions,
	selectChannelById,
	selectCurrentClanId,
	selectCurrentUserId,
	selectDirectById,
	selectNewIdMessageResponse,
	useAppDispatch,
} from '@mezon/store';
import { handleUrlInput, useMezon } from '@mezon/transport';
import { ETypeLinkMedia, IMessageSendPayload } from '@mezon/utils';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAppParams } from '../../app/hooks/useAppParams';

export type UseChatSendingOptions = {
	channelId: string;
	mode: number;
	directMessageId?: string;
};

// TODO: separate this hook into 2 hooks for send and edit message
export function useChatSending({ channelId, mode, directMessageId }: UseChatSendingOptions) {
	const { directId } = useAppParams();
	const currentClanId = useSelector(selectCurrentClanId);
	const currentUserId = useSelector(selectCurrentUserId);
	const idNewMessageResponse = useSelector(selectNewIdMessageResponse);
	console.log('idNewMessageResponse: ', idNewMessageResponse);

	const dispatch = useAppDispatch();
	// TODO: if direct is the same as channel use one slice
	// If not, using 2 hooks for direct and channel
	const direct = useSelector(selectDirectById(directMessageId || directId || ''));
	const { clientRef, sessionRef, socketRef } = useMezon();
	const channel = useSelector(selectChannelById(channelId));
	let channelID = channelId;
	let clanID = currentClanId;
	if (direct) {
		channelID = direct.id;
		clanID = '0';
	}
	const [filteredResults, setFilteredResults] = React.useState<ApiMessageAttachment[]>([]);

	const sendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			anonymous?: boolean,
			mentionEveryone?: boolean,
		) => {
			const filteredContent = useFilteredContent(content);

			dispatch(
				messagesActions.sendMessage({
					channelId: channelID,
					clanId: clanID || '',
					mode,
					content: filteredContent ?? {},
					mentions,
					attachments,
					references,
					anonymous,
					mentionEveryone,
					senderId: currentUserId,
				}),
			);

			const resultPromises = (content.lk ?? []).map(async (item) => {
				const result = await handleUrlInput(item.lk as string);
				if (result.filetype && result.filetype.startsWith(ETypeLinkMedia.IMAGE_PREFIX)) {
					return result as ApiMessageAttachment;
				}
				return null;
			});
			const results = await Promise.all(resultPromises);
			const filteredResults = results.filter((result): result is ApiMessageAttachment => result !== null) as ApiMessageAttachment[];
			setFilteredResults(filteredResults);

			// Clean up function to clear the interval
		},
		[dispatch, channelID, clanID, mode, currentUserId, idNewMessageResponse],
	);

	React.useEffect(() => {
		if (!idNewMessageResponse) return;

		const intervalId = setInterval(() => {
			console.log('idNewMessageResponse: ', idNewMessageResponse);
			editSendMessage({ t: 'gggg' }, idNewMessageResponse, [], filteredResults);
			clearInterval(intervalId); // Clear interval once the message is edited
		}, 1000); // Check every 1 second

		// Cleanup function to clear the interval
		return () => clearInterval(intervalId);
	}, [idNewMessageResponse, filteredResults]); // Dependencies

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(messagesActions.sendTypingUser({ clanId: clanID || '', channelId, mode }));
	}, [channelId, clanID, dispatch, mode]);

	// TODO: why "Edit" not "edit"?
	// Move this function to to a new action of messages slice
	const editSendMessage = React.useCallback(
		async (content: IMessageSendPayload, messageId: string, mentions: ApiMessageMention[], attachments?: ApiMessageAttachment[]) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}

			const filteredContent = useFilteredContent(content);

			console.log('clanID: ', clanID);
			console.log('channelId: ', channelId);
			console.log('mode: ', mode);
			console.log('messageId: ', messageId);
			console.log('filteredContent: ', filteredContent);
			console.log('mentions: ', mentions);
			console.log('attachments: ', attachments);
			await socket.updateChatMessage(clanID || '', channelId, mode, messageId, content, mentions, attachments);
		},
		[sessionRef, clientRef, socketRef, channel, direct, clanID, channelId, mode],
	);

	return useMemo(
		() => ({
			sendMessage,
			sendMessageTyping,
			editSendMessage,
		}),
		[sendMessage, sendMessageTyping, editSendMessage],
	);
}
