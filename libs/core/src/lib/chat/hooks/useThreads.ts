import {
	selectAllChannels,
	selectAllThreads,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectCurrentThread,
	selectIsPrivate,
	selectIsShowCreateThread,
	selectMessageThreadError,
	selectNameThreadError,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
import { isGreaterOneMonth } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useThreads() {
	const dispatch = useAppDispatch();
	const threads = useSelector(selectAllThreads);
	const currentThread = useSelector(selectCurrentThread);
	const channels = useSelector(selectAllChannels);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const isShowCreateThread = useSelector(selectIsShowCreateThread);
	const isPrivate = useSelector(selectIsPrivate);
	const nameThreadError = useSelector(selectNameThreadError);
	const messageThreadError = useSelector(selectMessageThreadError);

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean) => {
			dispatch(threadsActions.setIsShowCreateThread(isShowCreateThread));
		},
		[dispatch],
	);

	const threadChannel = useMemo(() => {
		const threads = channels.filter((channel) => {
			if (currentChannel && currentChannel.parrent_id !== '0') {
				return channel.parrent_id === currentChannel.parrent_id;
			}
			if (currentChannel && currentChannel.parrent_id === '0') {
				return channel.parrent_id === currentChannelId;
			}
		});
		return threads;
	}, [channels, currentChannel, currentChannelId]);

	const threadChannelOld = threadChannel.filter((thread) => isGreaterOneMonth(thread.last_sent_message?.timestamp as string) > 30);

	const threadChannelOnline = threadChannel.filter((thread) => isGreaterOneMonth(thread.last_sent_message?.timestamp as string) <= 30);

	return {
		threads,
		threadChannel,
		currentThread,
		isShowCreateThread,
		isPrivate,
		nameThreadError,
		messageThreadError,
		threadChannelOld,
		threadChannelOnline,
		setIsShowCreateThread,
	};
}
