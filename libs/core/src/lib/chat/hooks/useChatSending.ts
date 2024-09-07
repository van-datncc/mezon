import {
	directActions,
	messagesActions,
	selectChannelById,
	selectCurrentClanId,
	selectCurrentUserId,
	selectDirectById,
	selectNewMesssageUpdateImage,
	useAppDispatch
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageSendPayload, IMessageWithUser } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import React, { useEffect, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useChatMessages } from './useChatMessages';
import { useProcessLink } from './useProcessLink';

export type UseChatSendingOptions = {
	channelIdOrDirectId: string;
	mode: number;
};

// TODO: separate this hook into 2 hooks for send and edit message
export function useChatSending({ channelIdOrDirectId, mode }: UseChatSendingOptions) {
	const currentClanId = useSelector(selectCurrentClanId);
	const currentUserId = useSelector(selectCurrentUserId);
	const newMessageUpdateImage = useSelector(selectNewMesssageUpdateImage);
	const dispatch = useAppDispatch();
	const direct = useSelector(selectDirectById(channelIdOrDirectId));
	console.log(direct);
	const channel = useSelector(selectChannelById(channelIdOrDirectId));
	const { clientRef, sessionRef, socketRef } = useMezon();
	const { lastMessage } = useChatMessages({ channelId: channelIdOrDirectId });
	let isPublic = false;

	if (mode === ChannelStreamMode.STREAM_MODE_CHANNEL) {
		isPublic = !channel?.channel_private;
	} else {
		isPublic = !direct?.channel_private;
	}

	const getClanId = useMemo(() => {
		if (mode === ChannelStreamMode.STREAM_MODE_CHANNEL) {
			return currentClanId;
		} else {
			return '0';
		}
	}, [mode, currentClanId]);
	console.log('getClanId', getClanId);
	const sendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			anonymous?: boolean,
			mentionEveryone?: boolean
		) => {
			console.log('channelIdOrDirectId', channelIdOrDirectId);
			console.log('getClanId', getClanId);
			await dispatch(
				messagesActions.sendMessage({
					channelId: channelIdOrDirectId,
					clanId: getClanId ?? '',
					mode,
					isPublic: isPublic,
					content,
					mentions,
					attachments,
					references,
					anonymous,
					mentionEveryone,
					senderId: currentUserId
				})
			);
			if (direct) {
				const timestamp = Date.now() / 1000;
				dispatch(directActions.setDirectLastSeenTimestamp({ channelId: channelIdOrDirectId, timestamp }));
				if (lastMessage) {
					dispatch(directActions.updateLastSeenTime(lastMessage));
				}
			}
		},
		[dispatch, channelIdOrDirectId, getClanId, mode, isPublic, currentUserId]
	);

	const sendMessageTyping = React.useCallback(async () => {
		dispatch(
			messagesActions.sendTypingUser({
				clanId: getClanId ?? '',
				channelId: channelIdOrDirectId,
				mode,
				isPublic: isPublic
			})
		);
	}, [channelIdOrDirectId, getClanId, dispatch, isPublic, mode]);

	// Move this function to to a new action of messages slice
	const editSendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			messageId: string,
			mentions: ApiMessageMention[],
			attachments?: ApiMessageAttachment[],
			hideEditted?: boolean
		) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}

			await socket.updateChatMessage(
				getClanId ?? '',
				channelIdOrDirectId,
				mode,
				isPublic,
				messageId,
				content,
				mentions,
				attachments,
				hideEditted
			);
		},
		[sessionRef, clientRef, socketRef, channel, direct, getClanId, channelIdOrDirectId, mode, isPublic]
	);

	const updateImageLinkMessage = React.useCallback(
		async (
			clanId?: string,
			channelId?: string,
			mode?: ChannelStreamMode,
			content?: IMessageSendPayload,
			messageId?: string,
			mentions?: ApiMessageMention[],
			attachments?: ApiMessageAttachment[],
			messageEdit?: IMessageWithUser,
			hideEditted?: boolean
		) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || (!channel && !direct)) {
				throw new Error('Client is not initialized');
			}

			await socket.updateChatMessage(
				clanId ?? '',
				channelId ?? '',
				mode ?? 0,
				isPublic,
				messageId ?? '',
				content,
				mentions,
				attachments,
				hideEditted
			);
		},
		[sessionRef, clientRef, socketRef, channel, direct, isPublic]
	);

	const { processLink } = useProcessLink({ updateImageLinkMessage });

	useEffect(() => {
		if (newMessageUpdateImage.mode === ChannelStreamMode.STREAM_MODE_CHANNEL && newMessageUpdateImage.isMe) {
			processLink(
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				newMessageUpdateImage.clan_id!,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				newMessageUpdateImage.channel_id!,
				// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
				newMessageUpdateImage.mode!,
				newMessageUpdateImage.content,
				newMessageUpdateImage.mentions,
				newMessageUpdateImage.attachments,
				newMessageUpdateImage.message_id
			);
		}
	}, [newMessageUpdateImage.message_id]);

	return useMemo(
		() => ({
			updateImageLinkMessage,
			sendMessage,
			sendMessageTyping,
			editSendMessage
		}),
		[updateImageLinkMessage, sendMessage, sendMessageTyping, editSendMessage]
	);
}
