import { useAppNavigation, useThreads } from '@mezon/core';
import { ChannelType } from '@mezon/mezon-js';
import { createNewChannel, selectCurrentChannel, selectCurrentChannelId, selectCurrentClanId, threadsActions, useAppDispatch } from '@mezon/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ApiChannelDescription, ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../../../../Icons';
import MessageTextField from './MessageTextField';
import ThreadMessage from './ThreadMessage';
import ThreadNameTextField from './ThreadNameTextField';

const ThreadBox = () => {
	const dispatch = useAppDispatch();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentClanId = useSelector(selectCurrentClanId);
	const { toThreadPage } = useAppNavigation();

	const { currentThread } = useThreads();

	const [isErrorName, setIsErrorName] = useState<string>('');
	const [threadName, setThreadName] = useState('');
	const [startMessage, setStartMessage] = useState('');
	// const [currentThread, setCurrentThread] = useState<ApiChannelDescription | null>(null);
	const navigate = useNavigate();

	const handleThreadNameChange = (value: string) => {
		setIsErrorName('');
		setThreadName(value);
	};

	const handleChangeMessage = (event: string) => {
		setStartMessage(event);
	};
	const handleKeySubmit = async (key: string) => {
		if (key === 'Enter') {
			if (threadName === '') {
				setIsErrorName("Thread's name is required");
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
				dispatch(threadsActions.setCurrentThread(newThread));
				navigate(toThreadPage(newThread.parrent_id as string, newThread.clan_id as string, newThread.channel_id as string));
			}
		}
	};
	return (
		<div className="flex flex-col flex-1 justify-end px-4">
			<div className="my-4">
				<div className="flex items-center justify-center w-16 h-16 bg-[#26262B] rounded-full pointer-events-none">
					<Icons.ThreadIcon defaultSize="w-7 h-7" />
				</div>

				{currentThread ? (
					<ThreadMessage currentChannelId={currentChannelId as string} currentThread={currentThread} />
				) : (
					<ThreadNameTextField
						onKeyDown={handleKeySubmit}
						onChange={handleThreadNameChange}
						threadNameProps="Thread Name"
						error={isErrorName}
					/>
				)}
			</div>
			<MessageTextField onChange={handleChangeMessage} />
		</div>
	);
};

export default ThreadBox;
