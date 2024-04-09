import { Icons, MentionReactInput, ThreadNameTextField, UserMentionList } from '@mezon/components';
import { useThreadMessage, useThreads } from '@mezon/core';
import { ChannelStreamMode, ChannelType } from '@mezon/mezon-js';
import { RootState, createNewChannel, selectCurrentChannel, selectCurrentChannelId, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useMezon } from '@mezon/transport';
import { ETypeMessage, IMessageSendPayload } from '@mezon/utils';
import { useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useThrottledCallback } from 'use-debounce';
import {
	ApiChannelDescription,
	ApiCreateChannelDescRequest,
	ApiMessageAttachment,
	ApiMessageMention,
	ApiMessageRef,
} from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import ChannelMessages from '../channel/ChannelMessages';

type ErrorProps = {
	name: string;
	message: string;
};

const ThreadBox = () => {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentClanId = useSelector(selectCurrentClanId);
	const sessionUser = useSelector((state: RootState) => state.auth.session);

	const { threadRef } = useMezon();
	const thread = threadRef.current;
	const { currentThread } = useThreads();
	const { sendMessageThread, sendMessageTyping } = useThreadMessage({
		channelId: thread?.id as string,
		channelLabel: thread?.chanel_label as string,
		mode: ChannelStreamMode.STREAM_MODE_CHANNEL,
	});

	const [isError, setIsError] = useState<ErrorProps>({ name: '', message: '' });
	const [threadName, setThreadName] = useState('');

	const handleThreadNameChange = (value: string) => {
		setIsError((pre) => ({ ...pre, name: '' }));
		setThreadName(value);
	};

	const handleKeySubmit = async (key: string) => {
		if (key === 'Enter') {
			if (threadName === '') {
				setIsError((pre) => ({ ...pre, name: `Thread's name is required` }));
				return;
			}

			const body: ApiCreateChannelDescRequest = {
				clan_id: currentClanId?.toString(),
				channel_label: threadName,
				parrent_id: currentChannelId as string,
				category_id: currentChannel?.category_id,
				type: ChannelType.CHANNEL_TYPE_TEXT,
			};
			const response = await dispatch(createNewChannel(body));
			const newThread = response.payload as ApiChannelDescription;
			if (newThread) {
				setThreadName('');
			}
		}
	};

	const handleSend = useCallback(
		(
			content: IMessageSendPayload,
			mentions?: Array<ApiMessageMention>,
			attachments?: Array<ApiMessageAttachment>,
			references?: Array<ApiMessageRef>,
		) => {
			if (sessionUser) {
				sendMessageThread(content, mentions, attachments, references);
			} else {
				console.error('Session is not available');
			}
		},
		[sendMessageThread, sessionUser],
	);

	const handleTyping = useCallback(() => {
		sendMessageTyping();
	}, [sendMessageTyping]);

	const handleTypingDebounced = useThrottledCallback(handleTyping, 1000);

	return (
		<div className="flex flex-col flex-1 justify-end">
			<div>
				{!currentThread && (
					<div className="flex items-center justify-center mx-4 w-16 h-16 bg-[#26262B] rounded-full pointer-events-none">
						<Icons.ThreadIcon defaultSize="w-7 h-7" />
					</div>
				)}

				{currentThread ? (
					<div className="overflow-y-auto bg-[#1E1E1E] max-w-widthMessageViewChat overflow-x-hidden max-h-heightMessageViewChatThread h-heightMessageViewChatThread">
						<ChannelMessages
							channelId={thread?.id as string}
							channelLabel={thread?.chanel_label}
							type={ETypeMessage.THREAD}
							mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
						/>
					</div>
				) : (
					<ThreadNameTextField
						onKeyDown={handleKeySubmit}
						onChange={handleThreadNameChange}
						threadNameProps="Thread Name"
						placeholder="Enter Thread Name"
						error={isError.name}
						value={threadName}
						className="h-10 p-[10px] bg-black text-base rounded-md placeholder:text-sm"
					/>
				)}
			</div>
			<div className="flex-shrink-0 flex flex-col pb-4 px-4 bg-[#1E1E1E] h-auto relative">
				<MentionReactInput
					onCreateThread={handleKeySubmit}
					onSend={handleSend}
					onTyping={handleTypingDebounced}
					listMentions={UserMentionList(thread?.id as string)}
				/>
			</div>
		</div>
	);
};

export default ThreadBox;
