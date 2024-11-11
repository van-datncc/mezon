import { debounce } from '@mezon/mobile-components';
import { Block, useTheme } from '@mezon/mobile-ui';
import { searchMessagesActions, selectMessageSearchByChannelId, useAppDispatch } from '@mezon/store-mobile';
import { SIZE_PAGE_SEARCH, SearchFilter } from '@mezon/utils';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';
import MessagesSearchTab from '../../MessagesSearchTab';
import { SearchMessageChannelContext } from '../SearchMessageChannel';
import HeaderTabSearch from '../SearchMessageChannel/SearchMessagePage/HeaderTabSearch';
import HeaderSearchMessageDm from './HeaderSearchMessageDm/HeaderSearchMessageDm';
export enum ACTIVE_TAB {
	MESSAGES = 0
}

export default function SearchMessageDm({ navigation, route }: any) {
	const { themeValue } = useTheme();
	const [activeTab, setActiveTab] = useState<number>(ACTIVE_TAB.MESSAGES);
	const handelHeaderTabChange = useCallback((index: number) => {
		setActiveTab(index);
	}, []);
	const [filtersSearch, setFiltersSearch] = useState<SearchFilter[]>();

	const { currentChannel } = route?.params || {};
	const dispatch = useAppDispatch();

	const messageSearchByChannelId = useSelector(selectMessageSearchByChannelId(currentChannel?.channel_id));

	const TabList = useMemo(
		() =>
			[
				{
					title: 'Messages',
					quantitySearch: messageSearchByChannelId && messageSearchByChannelId?.length,
					display: !!messageSearchByChannelId?.length,
					index: ACTIVE_TAB?.MESSAGES
				}
			].filter((tab) => tab?.display),
		[messageSearchByChannelId]
	);
	const handleTextChange = useCallback(
		debounce((searchText) => {
			handleSearchMessageDm(searchText);
		}, 200),
		[]
	);

	const handleSearchMessageDm = async (searchText: string) => {
		const filter = [
			{
				field_name: 'content',
				field_value: searchText
			},
			{ field_name: 'channel_id', field_value: currentChannel?.channel_id },
			{ field_name: 'clan_id', field_value: currentChannel?.clan_id }
		];
		setFiltersSearch(filter || []);
		const payload = {
			filters: filter,
			from: 1,
			size: SIZE_PAGE_SEARCH
		};
		await dispatch(searchMessagesActions.fetchListSearchMessage(payload));
	};

	const renderSearchPage = useCallback(() => {
		switch (activeTab) {
			case ACTIVE_TAB.MESSAGES:
				return <MessagesSearchTab messageSearchByChannelId={messageSearchByChannelId} />;
			default:
				return null;
		}
	}, [messageSearchByChannelId, activeTab]);

	useEffect(() => {
		return () => {
			handleSearchMessageDm('');
		};
	}, []);

	return (
		<SearchMessageChannelContext.Provider value={filtersSearch}>
			<Block width={'100%'} height={'100%'} backgroundColor={themeValue.primary}>
				<HeaderSearchMessageDm onChangeText={handleTextChange} />
				<HeaderTabSearch tabList={TabList} activeTab={activeTab} onPress={handelHeaderTabChange} />
				{renderSearchPage()}
			</Block>
		</SearchMessageChannelContext.Provider>
	);
}
