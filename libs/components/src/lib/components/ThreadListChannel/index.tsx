import { IChannel } from '@mezon/utils';
import ThreadLink from './ThreadLink';

type ThreadListChannelProps = {
	threads: IChannel[];
};

const ThreadListChannel = ({ threads }: ThreadListChannelProps) => {
	return (
		<div className="flex flex-col ml-6">
			{threads.map((thread) => {
				const isFirstThread = threads.indexOf(thread) === 0;
				return <ThreadLink thread={thread} isFirstThread={isFirstThread} />;
			})}
		</div>
	);
};

export default ThreadListChannel;
