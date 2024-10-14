import {
	selectAllChannels,
	selectCurrentChannelId,
	selectIsPrivate,
	selectIsShowCreateThread,
	selectListThreadId,
	selectMessageThreadError,
	selectNameThreadError,
	selectNameValueThread,
	selectValueThread,
	threadsActions,
	useAppDispatch
} from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useThreads() {
	const dispatch = useAppDispatch();
	const channels = useSelector(selectAllChannels);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const isPrivate = useSelector(selectIsPrivate);
	const nameThreadError = useSelector(selectNameThreadError);
	const messageThreadError = useSelector(selectMessageThreadError);
	const listThreadId = useSelector(selectListThreadId);
	const isShowCreateThread = useSelector(selectIsShowCreateThread(currentChannelId as string));
	const nameValueThread = useSelector(selectNameValueThread(currentChannelId as string));
	const valueThread = useSelector(selectValueThread);

	const setTurnOffThreadMessage = useCallback(() => {
		setOpenThreadMessageState(false);
		setValueThread(null);
	}, [dispatch]);

	const setOpenThreadMessageState = useCallback(
		(value: boolean) => {
			dispatch(threadsActions.setOpenThreadMessageState(value));
		},
		[dispatch]
	);

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean, channelId?: string) => {
			dispatch(threadsActions.setIsShowCreateThread({ channelId: channelId ? channelId : (currentChannelId as string), isShowCreateThread }));
		},
		[currentChannelId, dispatch]
	);

	const setNameValueThread = useCallback(
		(nameValue: string) => {
			dispatch(threadsActions.setNameValueThread({ channelId: currentChannelId as string, nameValue }));
		},
		[currentChannelId, dispatch]
	);

	const setValueThread = useCallback(
		(value: IMessageWithUser | null) => {
			dispatch(threadsActions.setValueThread(value));
		},
		[dispatch]
	);

	const threadCurrentChannel = useMemo(() => {
		if (listThreadId && currentChannelId) {
			return channels.find((channel) => channel.channel_id === listThreadId[currentChannelId]);
		}
	}, [channels, currentChannelId, listThreadId]);

	return useMemo(
		() => ({
			isShowCreateThread,
			isPrivate,
			nameThreadError,
			messageThreadError,
			threadCurrentChannel,
			nameValueThread,
			valueThread,
			setIsShowCreateThread,
			setNameValueThread,
			setValueThread,
			setOpenThreadMessageState,
			setTurnOffThreadMessage
		}),
		[
			isPrivate,
			isShowCreateThread,
			messageThreadError,
			nameThreadError,
			nameValueThread,
			threadCurrentChannel,
			valueThread,
			setNameValueThread,
			setIsShowCreateThread,
			setValueThread,
			setOpenThreadMessageState,
			setTurnOffThreadMessage
		]
	);
}
