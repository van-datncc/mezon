import { useOnScreen } from '@mezon/core';
import { ThreadsEntity } from '@mezon/store';
import { MutableRefObject, useEffect } from 'react';
import GroupThreads from './GroupThreads';
import { getActiveThreads, getJoinedThreadsWithinLast30Days, getThreadsOlderThan30Days } from './hepler';

type ThreadListProps = {
	hasMore: boolean;
	isLoading: boolean;
	loadMore: () => void | undefined | null;
	threads: ThreadsEntity[];
	preventClosePannel: MutableRefObject<boolean>;
};

export default function ThreadList({ hasMore, isLoading, loadMore, threads, preventClosePannel }: ThreadListProps) {
	const activeThreads = getActiveThreads(threads);
	const joinedThreads = getJoinedThreadsWithinLast30Days(threads);
	const oldThreads = getThreadsOlderThan30Days(threads);

	const { measureRef, isIntersecting, observer } = useOnScreen();

	useEffect(() => {
		if (isIntersecting && hasMore) {
			loadMore();
			observer?.disconnect();
		}
	}, [isIntersecting, hasMore, loadMore]);

	return (
		<ul className="pb-4 pr-4 pl-4">
			<GroupThreads preventClosePannel={preventClosePannel} title="Active Threads" threads={activeThreads} />
			<GroupThreads preventClosePannel={preventClosePannel} title="Joined Threads (Last 30 Days)" threads={joinedThreads} />
			<GroupThreads preventClosePannel={preventClosePannel} title="Older Threads" threads={oldThreads} measureRef={measureRef} />
			{isLoading && <li>Loading...</li>}
		</ul>
	);
}
