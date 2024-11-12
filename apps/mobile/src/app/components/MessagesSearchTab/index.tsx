import { ETypeSearch, GroupedMessages } from '@mezon/mobile-components';
import { Block, Colors, size, useTheme } from '@mezon/mobile-ui';
import { MessagesEntity, selectAllMessageSearch, selectMessageSearchByChannelId } from '@mezon/store';
import { ISearchMessage, searchMessagesActions, selectCurrentPage, useAppDispatch } from '@mezon/store-mobile';
import { SIZE_PAGE_SEARCH } from '@mezon/utils';
import { FlashList } from '@shopify/flash-list';
import { ChannelStreamMode } from 'mezon-js';
import React, { useContext, useMemo, useState } from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MessageItem from '../../screens/home/homedrawer/MessageItem';
import { EmptySearchPage } from '../EmptySearchPage';
import { SearchMessageChannelContext } from '../ThreadDetail/SearchMessageChannel';
import style from './MessagesSearchTab.styles';

const MessagesSearchTab = React.memo(({ typeSearch, currentChannelId }: { typeSearch: ETypeSearch; currentChannelId: string }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const filtersSearch = useContext(SearchMessageChannelContext);
	const [isLoadingMore, setIsLoadingMore] = useState(true);
	const [hasLoadMore, setHasLoadMore] = useState(true);
	const dispatch = useAppDispatch();
	const [pageSearch, setPageSearch] = useState(1);
	const currentPage = useSelector(selectCurrentPage);

	const messageSearchByChannelId = useSelector(selectMessageSearchByChannelId(currentChannelId));
	const searchMessages = useSelector(selectAllMessageSearch);

	const ViewLoadMore = () => {
		return (
			<View style={styles.loadMoreChannelMessage}>
				<ActivityIndicator size="large" color={Colors.tertiary} />
			</View>
		);
	};

	const searchMessagesData = useMemo(() => {
		let groupedMessages: GroupedMessages = [];
		if (typeSearch === ETypeSearch.SearchChannel) {
			groupedMessages?.push({
				label: messageSearchByChannelId[0]?.channel_label,
				messages: messageSearchByChannelId
			});
		} else {
			groupedMessages = searchMessages?.reduce((acc, message) => {
				const label = message?.channel_label ?? '';
				const channelId = message?.channel_id ?? '';
				const existingGroup = acc?.find((group) => group?.label === label && group?.channel_id === channelId);
				if (existingGroup) {
					existingGroup.messages.push(message);
				} else {
					acc.push({
						label,
						channel_id: channelId,
						messages: [message]
					});
				}
				return acc;
			}, []);
		}
		return groupedMessages;
	}, [messageSearchByChannelId, searchMessages, typeSearch]);

	const loadMoreMessages = async () => {
		setIsLoadingMore(true);
		setPageSearch((prevPage) => prevPage + 1);
		if ((!isLoadingMore && !hasLoadMore) || pageSearch <= currentPage) {
			setIsLoadingMore(false);
			return;
		}

		const payload = {
			filters: filtersSearch,
			from: pageSearch,
			size: SIZE_PAGE_SEARCH,
			isMobile: true
		};

		try {
			const searchMessageResponse = await dispatch(searchMessagesActions.fetchListSearchMessage(payload));
			const searchMessage = (searchMessageResponse?.payload as { searchMessage: ISearchMessage[]; isMobile: boolean })?.searchMessage;
			if (!searchMessage || searchMessage?.length === 0) {
				setHasLoadMore(false);
				return;
			}
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	const renderMessageItem = (message: MessagesEntity, index: number) => (
		<Block key={`${message?.id}_${index}`} marginVertical={size.s_10}>
			<MessageItem message={message} messageId={message.id} mode={ChannelStreamMode.STREAM_MODE_CHANNEL} preventAction />
		</Block>
	);

	const renderGroupItem = ({ item }) => (
		<Block>
			{!!item?.label && <Text style={styles.groupMessageLabel}>{`# ${item?.label}`}</Text>}
			{item?.messages?.map(renderMessageItem)}
		</Block>
	);

	return (
		<Block style={styles.container}>
			{searchMessagesData?.length ? (
				<Block height={'100%'} width={'100%'} paddingBottom={size.s_100}>
					<FlashList
						showsVerticalScrollIndicator={false}
						data={searchMessagesData}
						keyboardShouldPersistTaps={'handled'}
						onScrollBeginDrag={Keyboard.dismiss}
						renderItem={renderGroupItem}
						estimatedItemSize={100}
						removeClippedSubviews={true}
						onEndReached={loadMoreMessages}
						contentContainerStyle={{ paddingBottom: size.s_100 }}
						onEndReachedThreshold={0.5}
						ListFooterComponent={isLoadingMore && <ViewLoadMore />}
					/>
				</Block>
			) : (
				<EmptySearchPage />
			)}
		</Block>
	);
});

export default MessagesSearchTab;
