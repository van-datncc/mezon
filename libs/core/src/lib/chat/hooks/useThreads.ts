import { selectAllThreads, selectIsShowCreateThread, threadsActions, useAppDispatch } from '@mezon/store';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

export function useThreads() {
	const dispatch = useAppDispatch();
	const threads = useSelector(selectAllThreads);
	const isShowCreateThread = useSelector(selectIsShowCreateThread);

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean) => {
			dispatch(threadsActions.setIsShowCreateThread(isShowCreateThread));
		},
		[dispatch],
	);

	return {
		threads,
		isShowCreateThread,
		setIsShowCreateThread,
	};
}
