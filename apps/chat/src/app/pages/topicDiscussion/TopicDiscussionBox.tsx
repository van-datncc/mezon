import { MentionReactInput, UserMentionList } from '@mezon/components';
import { useTopics } from '@mezon/core';
import {
	RootState,
	fetchMessages,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectCurrentClanId,
	selectCurrentTopicId,
	topicsActions,
	useAppDispatch
} from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { IMessageSendPayload } from '@mezon/utils';
import { ChannelStreamMode, ChannelType } from 'mezon-js';
import { ApiMessageAttachment, ApiMessageMention, ApiMessageRef } from 'mezon-js/api.gen';
import { ApiSdTopic, ApiSdTopicRequest } from 'mezon-js/dist/api.gen';
import React, { useCallback, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';
import MemoizedChannelMessages from '../channel/ChannelMessages';

const TopicDiscussionBox = () => {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentClanId = useSelector(selectCurrentClanId);
	const { valueTopic } = useTopics();
	const sessionUser = useSelector((state: RootState) => state.auth.session);
	const { clientRef, sessionRef, socketRef } = useMezon();
	const [isTopicCreated, setIsTopicCreated] = useState(true);
	const currentTopicId = useSelector(selectCurrentTopicId);
	const [isFetchMessageDone, setIsFetchMessageDone] = useState(false);
	useEffect(() => {
		// const fetchMsgResult = dispatch(fetchMessages({ channelId: currentTopicId as string, clanId: currentClanId as string }));
		const fetchMsgResult = async () => {
			await dispatch(fetchMessages({ channelId: currentTopicId as string, clanId: currentClanId as string }));
			setIsFetchMessageDone(true);
			console.log('isFetchMessageDone: ', isFetchMessageDone);
		};
		fetchMsgResult();
	}, [currentClanId, currentTopicId]);

	const createTopic = useCallback(async () => {
		const body: ApiSdTopicRequest = {
			clan_id: currentClanId?.toString(),
			channel_id: currentChannelId as string,
			message_id: valueTopic?.id
		};

		const topic = (await dispatch(topicsActions.createTopic(body))).payload as ApiSdTopic;
		dispatch(topicsActions.setCurrentTopicId(topic.id || ''));
		return topic;
	}, [currentChannelId, currentClanId, dispatch, valueTopic?.id]);

	const sendMessageTopic = React.useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
			topicId?: string
		) => {
			const session = sessionRef.current;
			const client = clientRef.current;
			const socket = socketRef.current;

			if (!client || !session || !socket || !currentClanId) {
				throw new Error('Client is not initialized');
			}

			await socket.writeChatMessage(
				currentClanId,
				currentChannel?.channel_id as string,
				ChannelStreamMode.STREAM_MODE_CHANNEL,
				currentChannel?.channel_private === 0,
				content,
				mentions,
				attachments,
				references,
				false,
				false,
				'',
				0
				// topicId
			);
		},
		// eslint-disable-next-line react-hooks/exhaustive-deps
		[sessionRef, clientRef, socketRef, currentClanId, dispatch]
	);

	const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

	const handleSend = useCallback(
		async (
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>
		) => {
			if (sessionUser) {
				// 	if (value?.nameValueThread) {
				if (isTopicCreated) {
					await sendMessageTopic(content, mentions, attachments, references, currentTopicId || '');
				} else {
					const topic = (await createTopic()) as ApiSdTopic;
					if (topic) {
						await sleep(10);
						await sendMessageTopic(content, mentions, attachments, references, topic.id || '');
						setIsTopicCreated(true);
					}
				}
			} else {
				console.error('Session is not available');
			}
		},
		[createTopic, currentTopicId, isTopicCreated, sendMessageTopic, sessionUser]
	);

	console.log('currentTopicId: ', currentTopicId);
	const handleTyping = useCallback(() => {
		// sendMessageTyping();
	}, []);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);
	const mode =
		currentChannel?.type === ChannelType.CHANNEL_TYPE_THREAD ? ChannelStreamMode.STREAM_MODE_THREAD : ChannelStreamMode.STREAM_MODE_CHANNEL;

	console.log('isFetchMessageDone: ', isFetchMessageDone);
	return (
		<div className="flex flex-col flex-1 justify-end">
			<div className="flex-shrink-0 flex flex-col pb-4 px-4 dark:bg-bgPrimary bg-bgLightPrimary h-auto relative">
				{isFetchMessageDone && (
					<div>
						asdads vao con me m di
						<MemoizedChannelMessages
							channelId={currentTopicId as string}
							clanId={currentClanId as string}
							type={ChannelType.CHANNEL_TYPE_TEXT}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
							isTopicBox
						/>
					</div>
				)}
				<MentionReactInput
					onSend={handleSend}
					onTyping={handleTypingDebounced}
					listMentions={UserMentionList({
						channelID: currentChannel?.channel_id as string,
						channelMode: ChannelStreamMode.STREAM_MODE_CHANNEL
					})}
					isThread
					isTopic
				/>
			</div>
		</div>
	);
};

export default TopicDiscussionBox;
