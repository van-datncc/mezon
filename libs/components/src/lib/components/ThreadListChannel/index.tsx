import { useMenu } from '@mezon/core';
import {
	appActions,
	referencesActions,
	selectChannelMetaById,
	selectCloseMenu,
	selectCurrentChannelId,
	threadsActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { IChannel } from '@mezon/utils';
import React, { forwardRef, memo, useImperativeHandle, useRef } from 'react';
import { useSelector } from 'react-redux';
import ThreadLink, { ThreadLinkRef } from './ThreadLink';

type ThreadListChannelProps = {
	threads: IChannel[];
	isCollapsed: boolean;
};

export type ListThreadChannelRef = {
	scrollIntoThread: (threadId: string, options?: ScrollIntoViewOptions) => void;
};

const ThreadListChannel = React.forwardRef<ListThreadChannelRef, ThreadListChannelProps>(({ threads, isCollapsed }: ThreadListChannelProps, ref) => {
	const dispatch = useAppDispatch();
	const currentChannelId = useAppSelector(selectCurrentChannelId);
	const { setStatusMenu } = useMenu();
	const closeMenu = useSelector(selectCloseMenu);

	const threadLinkRefs = useRef<Record<string, ThreadLinkRef | null>>({});

	useImperativeHandle(ref, () => ({
		scrollIntoThread: (threadId: string, options?: ScrollIntoViewOptions) => {
			const threadLinkElement = threadLinkRefs.current[threadId];
			if (threadLinkElement) {
				threadLinkElement.scrollToIntoView(options);
			}
		}
	}));

	const handleClickLink = (thread: IChannel) => {
		dispatch(referencesActions.setOpenEditMessageState(false));
		if (currentChannelId === thread.parrent_id) {
			dispatch(threadsActions.setIsShowCreateThread({ channelId: thread.parrent_id as string, isShowCreateThread: false }));
		}
		if (closeMenu) {
			setStatusMenu(false);
		}
		dispatch(threadsActions.setOpenThreadMessageState(false));
		dispatch(threadsActions.setValueThread(null));
		dispatch(appActions.setIsShowCanvas(false));
	};

	return (
		<div className="flex flex-col ml-6">
			{threads.map((thread) => {
				const isFirstThread = threads.indexOf(thread) === 0;
				return (
					<ThreadLinkWrapper
						key={thread.id}
						ref={(node) => (threadLinkRefs.current[thread.id] = node)}
						isActive={currentChannelId === thread.id}
						thread={thread}
						isFirstThread={isFirstThread}
						handleClick={handleClickLink}
						isCollapsed={isCollapsed}
					/>
				);
			})}
		</div>
	);
});

export default memo(ThreadListChannel);
type ThreadLinkWrapperProps = {
	thread: IChannel;
	isFirstThread: boolean;
	handleClick: (thread: IChannel) => void;
	isActive: boolean;
	isCollapsed: boolean;
};

const ThreadLinkWrapper = forwardRef<ThreadLinkRef, ThreadLinkWrapperProps>(({ thread, isFirstThread, handleClick, isActive, isCollapsed }, ref) => {
	const currentChannelId = useAppSelector(selectCurrentChannelId);
	const threadMeta = useAppSelector((state) => selectChannelMetaById(state, thread?.id));

	const isShowThread = (thread: IChannel) => {
		const threadId = thread.id;
		return (
			(threadMeta?.isMute !== true && threadMeta?.lastSeenTimestamp < threadMeta?.lastSentTimestamp) ||
			(thread?.count_mess_unread ?? 0) > 0 ||
			threadId === currentChannelId
		);
	};

	const shouldShow = !isCollapsed ? thread?.active === 1 : isShowThread(thread);
	if (!shouldShow) {
		return null;
	}

	return <ThreadLink ref={ref} isActive={isActive} thread={thread} isFirstThread={isFirstThread} handleClick={handleClick} />;
});
