import { useSearchMessages } from '@mezon/core';
import {
	appActions,
	searchMessagesActions,
	selectCurrentChannel,
	selectCurrentClanId,
	selectDmGroupCurrentId,
	selectIsSearchMessage,
	selectIsShowMemberList,
	selectIsShowMemberListDM,
	selectIsUseProfileDM,
	selectSearchedRequestByChannelId,
	selectTheme,
	selectValueInputSearchMessage,
	threadsActions,
	useAppDispatch,
	useAppSelector
} from '@mezon/store';
import { Platform, SIZE_PAGE_SEARCH, SearchFilter, getPlatform } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiSearchMessageRequest } from 'mezon-js/api.gen';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { OnChangeHandlerFunc } from 'react-mentions';
import { useSelector } from 'react-redux';
import { useDebouncedCallback } from 'use-debounce';
import { hasKeySearch, searchFieldName } from './constant';

export const useSearchLogic = (mode?: ChannelStreamMode) => {
	const dispatch = useAppDispatch();
	const { fetchSearchMessages, currentPage } = useSearchMessages();

	const isActive = useSelector(selectIsShowMemberList);
	const isShowMemberListDM = useSelector(selectIsShowMemberListDM);
	const isUseProfileDM = useSelector(selectIsUseProfileDM);
	const currentClanId = useSelector(selectCurrentClanId);
	const currentChannel = useSelector(selectCurrentChannel);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const appearanceTheme = useSelector(selectTheme);

	const channelId = useMemo(
		() => (mode === ChannelStreamMode.STREAM_MODE_CHANNEL ? (currentChannel?.id ?? '') : (currentDmGroupId ?? '')),
		[mode, currentChannel, currentDmGroupId]
	);

	const searchedRequest = useSelector((state) => selectSearchedRequestByChannelId(state, channelId));
	const valueInputSearch = useSelector((state) => selectValueInputSearchMessage(state, channelId));
	const isSearchMessage = useAppSelector((state) => selectIsSearchMessage(state, channelId));

	const [expanded, setExpanded] = useState(false);
	const [isShowSearchMessageModal, setIsShowSearchMessageModal] = useState(false);
	const [isShowSearchOptions, setIsShowSearchOptions] = useState('');
	const [valueDisplay, setValueDisplay] = useState<string>('');
	const [isShowMemberListBefore, setIsShowMemberListBefore] = useState<boolean>(false);
	const [isShowMemberListDMBefore, setIsShowMemberListDMBefore] = useState<boolean>(false);
	const [isUseProfileDMBefore, setIsUseProfileDMBefore] = useState<boolean>(false);
	const inputRef = useRef<HTMLInputElement>(null);
	const searchRef = useRef<HTMLInputElement | null>(null);
	const previousCurrentPageRef = useRef<Record<string, number>>({});

	const setIsShowCreateThread = useCallback(
		(isShowCreateThread: boolean, channelId?: string) => {
			channelId && dispatch(threadsActions.setIsShowCreateThread({ channelId: channelId, isShowCreateThread }));
		},
		[dispatch]
	);

	const handleInputClick = useCallback(() => {
		setIsShowMemberListBefore(isActive);
		setIsShowMemberListDMBefore(isShowMemberListDM);
		setIsUseProfileDMBefore(isUseProfileDM);
		setExpanded(true);
		if (!hasKeySearch(valueInputSearch)) {
			setIsShowSearchMessageModal(true);
		}
	}, [isActive, isShowMemberListDM, isUseProfileDM, valueInputSearch]);

	const handleOutsideClick = useCallback(
		(event: MouseEvent) => {
			const targetIsOutside = inputRef.current && !inputRef.current.contains(event.target as Node);

			if (targetIsOutside && !valueInputSearch) {
				setExpanded(false);
				setIsShowSearchMessageModal(false);
				dispatch(searchMessagesActions.setIsSearchMessage({ channelId, isSearchMessage: false }));
			}
			if (targetIsOutside && valueInputSearch) {
				setExpanded(true);
				setIsShowSearchMessageModal(false);
			}
		},
		[channelId, valueInputSearch, dispatch]
	);

	const handleChange: OnChangeHandlerFunc = useCallback(
		(event, newValue, newPlainTextValue, mentions) => {
			const value = event.target.value;
			const words = value.split(' ');
			const cleanedWords = words.filter((word) => {
				const mentionPrefixes = ['from:', 'mention:', 'has:'];
				const isMentionStart = mentionPrefixes.some((prefix) => word.startsWith(prefix));
				return !isMentionStart;
			});
			const cleanedValue = cleanedWords.join(' ').trim();

			dispatch(searchMessagesActions.setValueInputSearch({ channelId, value }));
			setValueDisplay(newPlainTextValue);
			const filter: SearchFilter[] = [];

			if (cleanedValue) {
				filter.push({
					field_name: 'content',
					field_value: cleanedValue
				});
			}

			for (const mention of mentions) {
				const convertMention = mention.display.split(':');
				filter.push({
					field_name: searchFieldName?.[convertMention[0]],
					field_value: convertMention?.[0] === 'mentions' ? `"user_id":"${mention.id}"` : convertMention?.[1]
				});
			}
			const search: ApiSearchMessageRequest = { ...searchedRequest, filters: filter };
			dispatch(searchMessagesActions.setSearchedRequest({ channelId: channelId, value: search }));
		},
		[channelId, currentClanId, dispatch, searchedRequest]
	);

	const clearSearchInput = useCallback(() => {
		dispatch(searchMessagesActions.setValueInputSearch({ channelId, value: '' }));
		setValueDisplay('');
	}, [channelId, dispatch]);

	const resetSearchBar = useCallback(() => {
		dispatch(searchMessagesActions.setIsSearchMessage({ channelId, isSearchMessage: false }));
		dispatch(appActions.setIsShowMemberList(isShowMemberListBefore));
		dispatch(appActions.setIsShowMemberListDM(isShowMemberListDMBefore));
		dispatch(appActions.setIsUseProfileDM(isUseProfileDMBefore));
		setIsShowSearchMessageModal(false);
		setExpanded(false);
		searchRef.current?.blur();
	}, [channelId, isShowMemberListBefore, isShowMemberListDMBefore, isUseProfileDMBefore, dispatch]);

	const executeSearchWithQueue = useDebouncedCallback(() => {
		if (searchedRequest && channelId && currentClanId) {
			const requestFilter = [
				...(searchedRequest.filters || []),
				{ field_name: 'channel_id', field_value: channelId },
				{ field_name: 'clan_id', field_value: currentClanId }
			];

			const requestBody = {
				...searchedRequest,
				filters: requestFilter,
				from: currentPage,
				size: SIZE_PAGE_SEARCH
			};

			fetchSearchMessages(requestBody);
		}
	}, 100);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLTextAreaElement> | React.KeyboardEvent<HTMLInputElement>) => {
			if (valueInputSearch && event.key === 'Enter') {
				setIsShowSearchMessageModal(false);
				dispatch(searchMessagesActions.setIsSearchMessage({ channelId, isSearchMessage: true }));
				dispatch(searchMessagesActions.setCurrentPage({ channelId: channelId, page: 1 }));
				setIsShowCreateThread(false, currentChannel?.parent_id !== '0' ? currentChannel?.parent_id : currentChannel.channel_id);

				if (isActive) dispatch(appActions.setIsShowMemberList(!isActive));
				if (isShowMemberListDM) dispatch(appActions.setIsShowMemberListDM(!isShowMemberListDM));
				if (isUseProfileDM) dispatch(appActions.setIsUseProfileDM(!isUseProfileDM));

				executeSearchWithQueue();
			}

			if (event.key === 'Escape') {
				event.preventDefault();
				event.stopPropagation();
				if (valueInputSearch) {
					clearSearchInput();
				} else {
					resetSearchBar();
				}
			}
		},
		[
			channelId,
			currentChannel,
			valueInputSearch,
			isActive,
			isShowMemberListDM,
			isUseProfileDM,
			dispatch,
			setIsShowCreateThread,
			clearSearchInput,
			resetSearchBar,
			executeSearchWithQueue
		]
	);

	const handleClose = useCallback(() => {
		clearSearchInput();
		searchRef.current?.focus();
		if (isSearchMessage) {
			resetSearchBar();
		}
	}, [isSearchMessage, clearSearchInput, resetSearchBar]);

	const handleClickSearchOptions = useCallback(
		(value: string) => {
			dispatch(
				searchMessagesActions.setValueInputSearch({
					channelId,
					value: !valueInputSearch ? value : valueInputSearch + value
				})
			);
			searchRef.current?.focus();
		},
		[channelId, valueInputSearch, dispatch]
	);

	const handleSearchFocus = useCallback(
		(event: KeyboardEvent) => {
			const platform = getPlatform();
			const prefixKey = platform === Platform.MACOS ? 'metaKey' : 'ctrlKey';
			if (event[prefixKey] && (event.key === 'f' || event.key === 'F')) {
				event.preventDefault();
				searchRef?.current?.focus();
				handleInputClick();
			}
		},
		[handleInputClick]
	);

	useEffect(() => {
		if (!currentPage || !channelId || !isSearchMessage) return;

		const previousCurrentPage = previousCurrentPageRef.current[channelId];

		if (previousCurrentPage !== currentPage) {
			previousCurrentPageRef.current[channelId] = currentPage;
			executeSearchWithQueue();
		}
	}, [executeSearchWithQueue, currentPage, channelId, isSearchMessage]);

	useEffect(() => {
		if (isShowSearchMessageModal) {
			document.addEventListener('click', handleOutsideClick);
			return () => {
				document.removeEventListener('click', handleOutsideClick);
			};
		}
	}, [isShowSearchMessageModal, handleOutsideClick]);

	useEffect(() => {
		document.addEventListener('keydown', handleSearchFocus);

		return () => {
			document.removeEventListener('keydown', handleSearchFocus);
		};
	}, [handleSearchFocus]);

	return {
		// State
		expanded,
		isShowSearchMessageModal,
		isShowSearchOptions,
		valueDisplay,
		inputRef,
		searchRef,

		// Data
		channelId,
		currentClanId,
		searchedRequest,
		valueInputSearch,
		isSearchMessage,

		// Handlers
		handleInputClick,
		handleChange,
		handleKeyDown,
		handleClose,
		handleClickSearchOptions,
		setIsShowSearchOptions,

		// Theme and appearance
		appearanceTheme
	};
};
