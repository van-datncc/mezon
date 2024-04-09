import { ThreadHeader } from '@mezon/components';
import { useThreads } from '@mezon/core';
import ThreadBox from './ThreadBox';

const ThreadsMain = () => {
	const { currentThread, setIsShowCreateThread } = useThreads();

	return (
		<div className="flex flex-col h-full">
			<ThreadHeader currentThread={currentThread} setIsShowCreateThread={setIsShowCreateThread} />
			<ThreadBox />
		</div>
	);
};

export default ThreadsMain;
