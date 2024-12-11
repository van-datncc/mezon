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
	const searchMessages = useSelector(selectAllMessageSearch);
	const totalResult = useSelector(selectTotalResultSearchMessage);
	const currentPage = useSelector(selectCurrentPage);
	const currentChannelId = useSelector(selectCurrentChannelId) as string;
	const currentDirectId = useSelector(selectDmGroupCurrentId) as string;
	const isClanView = useSelector(selectClanView);
	const messageSearchByChannelId = useAppSelector((state) =>
		selectMessageSearchByChannelId(state, isClanView ? currentChannelId : currentDirectId)
	);
	const valueSearchMessage = useSelector(selectValueInputSearchMessage((isClanView ? currentChannelId : currentDirectId) ?? ''));

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
