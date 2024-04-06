import {
	selectAllChannels,
	selectAllThreads,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectCurrentThread,
	selectIsShowCreateThread,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
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

	return {
		threads,
		threadChannel,
		currentThread,
		isShowCreateThread,
		setIsShowCreateThread,
	};
}
