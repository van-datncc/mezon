import {
	selectAllChannels,
	selectAllThreads,
	selectCurrentChannel,
	selectCurrentChannelId,
	selectIsPrivate,
	selectIsShowCreateThread,
	selectListThreadId,
	selectMessageThreadError,
	selectNameThreadError,
	selectNameValueThread,
	threadsActions,
	useAppDispatch,
} from '@mezon/store';
import { isGreaterOneMonth } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useThreads() {
	const dispatch = useAppDispatch();
	const threads = useSelector(selectAllThreads);
	const channels = useSelector(selectAllChannels);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const isPrivate = useSelector(selectIsPrivate);
	const nameThreadError = useSelector(selectNameThreadError);
	const messageThreadError = useSelector(selectMessageThreadError);
	const listThreadId = useSelector(selectListThreadId);
	const isShowCreateThread = useSelector(selectIsShowCreateThread(currentChannelId as string));
	const nameValueThread = useSelector(selectNameValueThread(currentChannelId as string));

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean) => {
			dispatch(threadsActions.setIsShowCreateThread({ channelId: currentChannelId as string, isShowCreateThread }));
		},
		[currentChannelId, dispatch],
	);

	const setNameValueThread = useCallback(
		(nameValue: string) => {
			dispatch(threadsActions.setNameValueThread({ channelId: currentChannelId as string, nameValue }));
		},
		[currentChannelId, dispatch],
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

	const threadCurrentChannel = useMemo(() => {
		if (listThreadId && currentChannelId) {
			return channels.find((channel) => channel.channel_id === listThreadId[currentChannelId]);
		}
	}, [channels, currentChannelId, listThreadId]);

	return {
		threads,
		threadChannel,
		isShowCreateThread,
		isPrivate,
		nameThreadError,
		messageThreadError,
		threadChannelOld,
		threadChannelOnline,
		threadCurrentChannel,
		nameValueThread,
		setIsShowCreateThread,
		setNameValueThread,
	};
}
