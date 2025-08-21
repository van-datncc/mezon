import { useOnScreen } from '@mezon/core';
import { selectChannelsEntitiesByClanId, selectCurrentClanId, selectTheme, ThreadsEntity, useAppSelector } from '@mezon/store';
import { useEffect, useMemo, useRef } from 'react';
import GroupThreads from './GroupThreads';
import { getActiveThreads, getJoinedThreadsWithinLast30Days, getThreadsOlderThan30Days } from './hepler';

type ThreadListProps = {
	isLoading: boolean;
	loadMore: () => void | undefined | null;
	threads: ThreadsEntity[];
	preventClosePannel: React.MutableRefObject<boolean>;
};

export default function ThreadList({ isLoading, threads, loadMore, preventClosePannel }: ThreadListProps) {
	const ulRef = useRef<HTMLUListElement | null>(null);

	const currentClanId = useAppSelector(selectCurrentClanId);
	const channelsEntities = useAppSelector((state) => selectChannelsEntitiesByClanId(state, currentClanId || '')) as Record<string, any>;
	const visibleThreads = useMemo(() => {
		const filtered = threads.filter((t) => {
			const channelEntity = channelsEntities?.[t.id];
			const existsInChannels = Boolean(channelEntity);
			const notPrivate = channelEntity ? channelEntity.channel_private !== 1 : (t as any)?.channel_private !== 1;
			return existsInChannels && notPrivate;
		});
		return filtered;
	}, [threads, channelsEntities]);

	const activeThreads = getActiveThreads(visibleThreads);
	const joinedThreads = getJoinedThreadsWithinLast30Days(visibleThreads);
	const oldThreads = getThreadsOlderThan30Days(visibleThreads);

	const { measureRef, isIntersecting, observer } = useOnScreen({ root: ulRef.current });

	const lastThread = visibleThreads[visibleThreads.length - 1];

	const isLastInActive = activeThreads.includes(lastThread);
	const isLastInJoined = joinedThreads.includes(lastThread);
	const isLastInOld = oldThreads.includes(lastThread);
	const appearanceTheme = useAppSelector(selectTheme);
	useEffect(() => {
		if (isIntersecting) {
			loadMore();
			observer?.disconnect();
		}
	}, [isIntersecting, loadMore]);

	return (
		<ul
			ref={ulRef}
			className={`pb-4 pr-4 pl-4  overflow-y-auto h-[500px] ${appearanceTheme === 'light' ? 'customScrollLightMode' : 'app-scroll'}`}
		>
			<GroupThreads
				preventClosePannel={preventClosePannel}
				title="Active Threads"
				threads={activeThreads}
				measureRef={isLastInActive ? measureRef : undefined}
			/>
			<GroupThreads
				preventClosePannel={preventClosePannel}
				title="Joined Threads (Last 30 Days)"
				threads={joinedThreads}
				measureRef={isLastInJoined ? measureRef : undefined}
			/>
			<GroupThreads
				preventClosePannel={preventClosePannel}
				title="Older Threads"
				threads={oldThreads}
				measureRef={isLastInOld ? measureRef : undefined}
			/>
			{isLoading && <li>Loading...</li>}
		</ul>
	);
}
