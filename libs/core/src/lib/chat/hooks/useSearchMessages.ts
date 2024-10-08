import {
	searchMessagesActions,
	selectAllMessageSearch,
	selectCurrentChannelId,
	selectCurrentPage,
	selectDmGroupCurrentId,
	selectMessageSearchByChannelId,
	selectTotalResultSearchMessage,
	selectValueInputSearchMessage,
	useAppDispatch
} from '@mezon/store';
import { ApiSearchMessageRequest } from 'mezon-js/api.gen';
import { useCallback, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useLocation } from 'react-router-dom';

export function useSearchMessages() {
	const dispatch = useAppDispatch();
	const location = useLocation();
	const isDirectViewPage = location.pathname.includes('/chat/direct/message/');
	const searchMessages = useSelector(selectAllMessageSearch);
	const totalResult = useSelector(selectTotalResultSearchMessage);
	const currentPage = useSelector(selectCurrentPage);
	const currentChannelId = useSelector(selectCurrentChannelId) as string;
	const currentDirectId = useSelector(selectDmGroupCurrentId) as string;
	const messageSearchByChannelId = useSelector(selectMessageSearchByChannelId(isDirectViewPage ? currentDirectId : currentChannelId));
	const valueSearchMessage = useSelector(selectValueInputSearchMessage((isDirectViewPage ? currentDirectId : currentChannelId) ?? ''));

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
