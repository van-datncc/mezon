import { ThreadHeader } from '@mezon/components';
import { useEscapeKey, useThreads } from '@mezon/core';
import ThreadBox from './ThreadBox';

const ThreadsMain = () => {
	const { threadCurrentChannel, setIsShowCreateThread } = useThreads();

	useEscapeKey(() => setIsShowCreateThread(false));

	return (
		<div className="flex flex-col h-full">
			<ThreadHeader threadCurrentChannel={threadCurrentChannel} />
			<ThreadBox />
		</div>
	);
};

export default ThreadsMain;
