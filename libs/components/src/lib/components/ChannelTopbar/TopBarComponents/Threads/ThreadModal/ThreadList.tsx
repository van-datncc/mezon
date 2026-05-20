import { useOnScreen } from '@mezon/core';
import type { ThreadsEntity } from '@mezon/store';
import { selectTheme, useAppSelector } from '@mezon/store';
import { useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import GroupThreads from './GroupThreads';
import { filterThreadList } from './hepler';

type ThreadListProps = {
	isLoading: boolean;
	loadMore: () => void | undefined | null;
	threads: ThreadsEntity[];
	preventClosePannel: React.MutableRefObject<boolean>;
};

export default function ThreadList({ isLoading, threads, loadMore, preventClosePannel }: ThreadListProps) {
	const { t } = useTranslation('channelTopbar');
	const ulRef = useRef<HTMLUListElement | null>(null);

	const { listJoin, listArchived, listOther } = filterThreadList(threads);

	const { measureRef, isIntersecting, observer } = useOnScreen({ root: ulRef.current });

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
			className={`pb-4 pr-4 pl-4 overflow-y-auto overflow-x-hidden h-[500px] ${appearanceTheme === 'light' ? 'customScrollLightMode' : 'app-scroll'}`}
		>
			<GroupThreads preventClosePannel={preventClosePannel} title={t('activeThreads')} threads={listOther} />
			<GroupThreads preventClosePannel={preventClosePannel} title={t('joinedThreads')} threads={listJoin} />
			<GroupThreads preventClosePannel={preventClosePannel} title={t('olderThreads')} threads={listArchived} />
			{isLoading && <li>{t('loading')}</li>}
		</ul>
	);
}
