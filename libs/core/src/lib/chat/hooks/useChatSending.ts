import {
	messagesActions,
	selectAllAccount,
	selectAnonymousMode,
	selectCurrentTopicId,
	selectCurrentTopicInitMessage,
	selectIsFocusOnChannelInput,
	selectIsShowCreateTopic,
	topicsActions,
	useAppDispatch
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageSendPayload, checkTokenOnMarkdown } from '@mezon/utils';
import { ApiChannelDescription, ApiMessageAttachment, ApiMessageMention, ApiMessageRef, ApiSdTopic, ApiSdTopicRequest } from 'mezon-js/api.gen';
import React, { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export type UseChatSendingOptions = {
	mode: number;
	channelOrDirect: ApiChannelDescription | undefined;
};

// TODO: separate this hook into 2 hooks for send and edit message
export function useChatSending({ mode, channelOrDirect }: UseChatSendingOptions) {
	const dispatch = useAppDispatch();
	const getClanId = channelOrDirect?.clan_id;
	const isPublic = !channelOrDirect?.channel_private;
	const channelIdOrDirectId = channelOrDirect?.channel_id;
	const currentTopicId = useSelector(selectCurrentTopicId);
	const isShowCreateTopic = useSelector(selectIsShowCreateTopic);
	const isFocusOnChannelInput = useSelector(selectIsFocusOnChannelInput);
	const userProfile = useSelector(selectAllAccount);
	const currentUserId = userProfile?.user?.id || '';
	const anonymousMode = useSelector(selectAnonymousMode);
	const initMessageOfTopic = useSelector(selectCurrentTopicInitMessage);
	const { clientRef, sessionRef, socketRef } = useMezon();

	const createTopic = useCallback(async () => {
		const body: ApiSdTopicRequest = {
			clan_id: getClanId as string,
			channel_id: channelIdOrDirectId as string,
			message_id: initMessageOfTopic?.id as string
		};

		const topic = (await dispatch(topicsActions.createTopic(body))).payload as ApiSdTopic;
		dispatch(topicsActions.setCurrentTopicId(topic.id || ''));
		return topic;
	}, [channelIdOrDirectId, dispatch, getClanId, initMessageOfTopic?.id]);

	const sendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			anonymous?: boolean,
			mentionEveryone?: boolean,
			isMobile?: boolean,
			code?: number
		) => {
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const trimmedText = content?.t?.trim();
			const { validHashtagList, validMentionList, validEmojiList } = checkTokenOnMarkdown(
				content.mk ?? [],
				content.hg ?? [],
				mentions ?? [],
				content.ej ?? []
			);
			const validatedContent = {
				...content,
				t: trimmedText,
				hg: validHashtagList,
				ej: validEmojiList
			};
			if (!isFocusOnChannelInput && isShowCreateTopic) {
				if (!currentTopicId) {
					const topic = (await createTopic()) as ApiSdTopic;
					if (topic) {
						dispatch(
							topicsActions.handleSendTopic({
								clanId: getClanId as string,
								channelId: channelIdOrDirectId as string,
								mode: mode,
								anonymous: false,
								attachments: attachments,
								code: 0,
								content: validatedContent,
								isMobile: isMobile,
								isPublic: isPublic,
								mentionEveryone: mentionEveryone,
								mentions: validMentionList,
								references: references,
								topicId: topic?.id as string
							})
						);
						dispatch(
							messagesActions.updateToBeTopicMessage({
								channelId: channelIdOrDirectId as string,
								messageId: initMessageOfTopic?.id as string,
								topicId: topic.id as string,
								creatorId: userProfile?.user?.id as string
							})
						);
						return;
					}
				}

				dispatch(
					topicsActions.handleSendTopic({
						clanId: getClanId as string,
						channelId: channelIdOrDirectId as string,
						mode: mode,
						anonymous: false,
						attachments: attachments,
						code: 0,
						content: validatedContent,
						isMobile: isMobile,
						isPublic: isPublic,
						mentionEveryone: mentionEveryone,
						mentions: validMentionList,
						references: references,
						topicId: currentTopicId as string
					})
				);
				return;
			}
			await dispatch(
				messagesActions.sendMessage({
					channelId: channelIdOrDirectId ?? '',
					clanId: getClanId || '',
					mode,
					isPublic: isPublic,
					content: validatedContent,
					mentions: validMentionList,
					attachments,
					references,
					anonymous,
					mentionEveryone,
					senderId: currentUserId,
					avatar: userProfile?.user?.avatar_url,
					isMobile,
					username: userProfile?.user?.display_name,
					code: code
				})
			);
		},
		[
			isFocusOnChannelInput,
			isShowCreateTopic,
			dispatch,
			channelIdOrDirectId,
			getClanId,
			mode,
			isPublic,
			currentUserId,
			userProfile?.user?.avatar_url,
			userProfile?.user?.display_name,
			currentTopicId,
			createTopic
		]
	);

	const sendMessageTyping = React.useCallback(async () => {
		if (!anonymousMode) {
			dispatch(
				messagesActions.sendTypingUser({
					clanId: getClanId || '',
					channelId: channelIdOrDirectId ?? '',
					mode,
					isPublic: isPublic
				})
			);
		}
	}, [channelIdOrDirectId, getClanId, dispatch, isPublic, mode, anonymousMode]);

	// Move this function to to a new action of messages slice
	const editSendMessage = React.useCallback(
		async (
			content: IMessageSendPayload,
			messageId: string,
			mentions: ApiMessageMention[],
			attachments?: ApiMessageAttachment[],
			hide_editted?: boolean,
			topic_id?: string
		) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;
			if (!client || !session || !socket || !channelOrDirect) {
				throw new Error('Client is not initialized');
			}
			// eslint-disable-next-line react-hooks/rules-of-hooks
			const { validHashtagList, validMentionList, validEmojiList } = checkTokenOnMarkdown(
				content.mk ?? [],
				content.hg ?? [],
				mentions ?? [],
				content.ej ?? []
			);
			const validatedContent = {
				...content,
				hg: validHashtagList,
				ej: validEmojiList
			};
			await socket.updateChatMessage(
				getClanId || '',
				channelIdOrDirectId ?? '',
				mode,
				isPublic,
				messageId,
				validatedContent,
				validMentionList,
				attachments,
				hide_editted,
				topic_id
			);
		},
		[sessionRef, clientRef, socketRef, channelOrDirect, getClanId, channelIdOrDirectId, mode, isPublic]
	);

	return useMemo(
		() => ({
			sendMessage,
			sendMessageTyping,
			editSendMessage
		}),
		[sendMessage, sendMessageTyping, editSendMessage]
	);
}
