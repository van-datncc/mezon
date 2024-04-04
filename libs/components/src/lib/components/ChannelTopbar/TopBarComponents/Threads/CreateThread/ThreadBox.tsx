import { useAppNavigation, useThreads } from '@mezon/core';
import { ChannelType } from '@mezon/mezon-js';
import { createNewChannel, selectCurrentChannel, selectCurrentChannelId, selectCurrentClanId, useAppDispatch } from '@mezon/store';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { ApiChannelDescription, ApiCreateChannelDescRequest } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';
import * as Icons from '../../../../Icons';
import ThreadMessage from './ThreadMessage';
import ThreadNameTextField from './ThreadNameTextField';

type ErrorProps = {
	name: string;
	message: string;
};

const ThreadBox = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const { toThreadPage } = useAppNavigation();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentClanId = useSelector(selectCurrentClanId);

	const { currentThread } = useThreads();

	const [isError, setIsError] = useState<ErrorProps>({ name: '', message: '' });
	const [threadName, setThreadName] = useState('');
	const [startMessage, setStartMessage] = useState('');

	const handleThreadNameChange = (value: string) => {
		setIsError((pre) => ({ ...pre, name: '' }));
		setThreadName(value);
	};

	const handleChangeMessage = (event: string) => {
		setStartMessage(event);
	};
	const handleKeySubmit = async (key: string) => {
		if (key === 'Enter') {
			if (threadName === '') {
				setIsError((pre) => ({ ...pre, name: `Thread's name is required` }));
				return;
			}

			if (startMessage === '') {
				setIsError((pre) => ({ ...pre, message: `Thread's message is required` }));
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
				setStartMessage('');
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
						placeholder="Enter Thread Name"
						error={isError.name}
						value={threadName}
						className="h-10 p-[10px] bg-black text-base rounded placeholder:text-sm"
					/>
				)}
			</div>
			<div className="mb-6">
				<ThreadNameTextField
					onChange={handleChangeMessage}
					onKeyDown={handleKeySubmit}
					placeholder="Enter a message to start the conversation!"
					error={isError.message}
					value={startMessage}
					className="w-full h-10 p-[10px] bg-[#26262B] text-base rounded placeholder:text-sm"
				/>
			</div>
		</div>
	);
};

export default ThreadBox;
