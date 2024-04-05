import {
	selectAllChannels,
	selectAllThreads,
	selectCurrentChannelId,
	selectCurrentThread,
	selectIsShowCreateThread,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export function useThreads() {
	const dispatch = useAppDispatch();
	const threads = useSelector(selectAllThreads);
	const currentThread = useSelector(selectCurrentThread);
	const channels = useSelector(selectAllChannels);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const isShowCreateThread = useSelector(selectIsShowCreateThread);

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean) => {
			dispatch(threadsActions.setIsShowCreateThread(isShowCreateThread));
		},
		[dispatch],
	);

	const threadChannel = channels.filter((channel) => channel.parrent_id === currentChannelId);

	return {
		threads,
		threadChannel,
		currentThread,
		isShowCreateThread,
		setIsShowCreateThread,
	};
}
