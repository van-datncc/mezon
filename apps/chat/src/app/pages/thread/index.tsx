import { ThreadBox, ThreadHeader } from '@mezon/components';
import { useAppNavigation, useThreads } from '@mezon/core';
import { selectCurrentChannel } from '@mezon/store';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const ThreadsMain = () => {
	const { isShowCreateThread, currentThread, setIsShowCreateThread } = useThreads();
	const currentChannel = useSelector(selectCurrentChannel);
	const { toChannelPage } = useAppNavigation();
	const navigate = useNavigate();

	if (!isShowCreateThread) {
		navigate(toChannelPage(currentChannel?.channel_id as string, currentChannel?.clan_id as string));
	}

	return (
		<div className="flex flex-col h-full">
			<ThreadHeader currentThread={currentThread} setIsShowCreateThread={setIsShowCreateThread} />
			<ThreadBox />
		</div>
	);
};

export default ThreadsMain;
