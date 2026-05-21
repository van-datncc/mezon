import {
	searchMessagesActions,
	selectAllMessageSearch,
	selectClanView,
	selectCurrentChannelId,
	selectCurrentPage,
	selectDmGroupCurrentId,
	selectMessageSearchByChannelId,
	selectTotalResultSearchMessage,
	selectValueInputSearchMessage,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import type { ApiSearchMessageRequest } from 'mezon-js';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useSearchMessages() {
	const dispatch = useAppDispatch();
	const isClanView = useSelector(selectClanView);
	const currentChannelId = useSelector(selectCurrentChannelId) as string;
	const currentDirectId = useSelector(selectDmGroupCurrentId) as string;
	const currentViewChannelId = isClanView ? currentChannelId : currentDirectId;

	const searchedChannelId = useMemo(() => {
		return isClanView ? currentChannelId : currentDirectId;
	}, [isClanView, currentChannelId, currentDirectId]);

	const searchMessages = useAppSelector((state) => selectAllMessageSearch(state, isClanView ? currentChannelId : currentDirectId));
	const totalResult = useAppSelector((state) => selectTotalResultSearchMessage(state, searchedChannelId));
	const currentPage = useAppSelector((state) => selectCurrentPage(state, currentViewChannelId));

	const messageSearchByChannelId = useAppSelector((state) => selectMessageSearchByChannelId(state, searchedChannelId));
	const valueSearchMessage = useSelector((state) => selectValueInputSearchMessage(state, currentViewChannelId ?? ''));

	const fetchSearchMessages = useCallback(
		async ({ filters, from, size, sorts }: ApiSearchMessageRequest) => {
			await dispatch(searchMessagesActions.fetchListSearchMessage({ filters, from, size, sorts }));
		},
		[dispatch]
	);
	return useMemo(
		() => ({
			fetchSearchMessages,
			searchMessages,
			messageSearchByChannelId,
			totalResult,
			currentPage,
			valueSearchMessage
		}),
		[fetchSearchMessages, searchMessages, messageSearchByChannelId, totalResult, currentPage, valueSearchMessage]
	);
}
