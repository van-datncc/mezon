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
import { ApiSearchMessageRequest } from 'mezon-js/api.gen';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';

export function useSearchMessages() {
	const dispatch = useAppDispatch();
	const isClanView = useSelector(selectClanView);
	const currentChannelId = useSelector(selectCurrentChannelId) as string;
	const currentDirectId = useSelector(selectDmGroupCurrentId) as string;
	const channelId = isClanView ? currentChannelId : currentDirectId;
	const searchMessages = useAppSelector((state) => selectAllMessageSearch(state, channelId));
	const totalResult = useAppSelector((state) => selectTotalResultSearchMessage(state, channelId));
	const currentPage = useAppSelector((state) => selectCurrentPage(state, channelId));

	const messageSearchByChannelId = useAppSelector((state) => selectMessageSearchByChannelId(state, channelId));
	const valueSearchMessage = useSelector((state) => selectValueInputSearchMessage(state, channelId ?? ''));

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
