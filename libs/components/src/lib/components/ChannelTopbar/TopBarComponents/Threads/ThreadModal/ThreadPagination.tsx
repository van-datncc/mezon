import { ThreadsEntity } from '@mezon/store';
import { useEffect } from 'react';
import useOnScreen from './useOnScreen';

interface ThreadPaginationProps {
	channelId: string;
	onClose: () => void;
	preventClosePannel: React.MutableRefObject<boolean>;
	handleCreateThread: () => void;
	//
	loadMore: () => void | undefined;
	threadList: any;
	isLoading: boolean;
	hasMore: boolean;
}

const ThreadPagination: React.FC<ThreadPaginationProps> = ({
	channelId,
	onClose,
	preventClosePannel,
	handleCreateThread,
	loadMore,
	threadList,
	isLoading,
	hasMore
}) => {
	const { measureRef, isIntersecting, observer } = useOnScreen();

	useEffect(() => {
		if (isIntersecting && hasMore) {
			loadMore();
			observer?.disconnect();
		}
	}, [isIntersecting, hasMore, loadMore]);

	return (
		<ul className={`w-[500px] list-none `}>
			{threadList.map((thread: ThreadsEntity, index: number) => {
				if (index === threadList.length - 1) {
					return (
						<li key={thread.id} className="h-50 border" ref={measureRef}>
							{thread.channel_label}
						</li>
					);
				}
				return (
					<li className="h-50 border" key={thread.id}>
						{thread.channel_label}
					</li>
				);
			})}
			{isLoading && <li>Loading...</li>}
		</ul>
	);
};

export default ThreadPagination;
