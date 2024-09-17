import { useSearchMessages } from '@mezon/core';
import { GroupedMessages } from '@mezon/mobile-components';
import { Block, Colors, size, useTheme } from '@mezon/mobile-ui';
import { DirectEntity, MessagesEntity, SearchMessageEntity, selectMessageSearchByChannelId } from '@mezon/store';
import { IChannel, SIZE_PAGE_SEARCH } from '@mezon/utils';
import { FlashList } from '@shopify/flash-list';
import { ChannelStreamMode } from 'mezon-js';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ActivityIndicator, Keyboard, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import MessageItem from '../../screens/home/homedrawer/MessageItem';
import { SearchMessageChannelContext } from '../ThreadDetail/SearchMessageChannel';
import style from './MessagesSearchTab.styles';

const MessagesSearchTab = React.memo(({ currentChannel }: { currentChannel: IChannel | DirectEntity }) => {
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const filtersSearch = useContext(SearchMessageChannelContext);
	const { totalResult, fetchSearchMessages } = useSearchMessages();
	const messageSearchByChannelId = useSelector(selectMessageSearchByChannelId(currentChannel?.channel_id as string));
	const [isLoadingMore, setIsLoadingMore] = useState(false);
	const [currentPage, setCurrentPage] = useState(1);
	const messagesRef = useRef<SearchMessageEntity[]>([]);

	useEffect(() => {
		if (messageSearchByChannelId?.length > 0) {
			const existingMessages = new Set(messagesRef.current?.map((msg) => msg?.id));
			const newMessages = messageSearchByChannelId?.filter((msg) => !existingMessages.has(msg.id));
			messagesRef.current = [...messagesRef.current, ...newMessages];
		} else {
			messagesRef.current = [];
		}
	}, [messageSearchByChannelId]);

	const ViewLoadMore = () => {
		return (
			<View style={styles.loadMoreChannelMessage}>
				<ActivityIndicator size="large" color={Colors.tertiary} />
			</View>
		);
	};

	const searchMessages = useMemo(() => {
		const groupedMessages: GroupedMessages = [];
		let currentGroup: SearchMessageEntity[] = [];
		let currentLabel: string | null | undefined = null;

		messagesRef.current?.forEach((message) => {
			const label = message?.channel_label ?? '';
			if (label !== currentLabel) {
				if (currentGroup?.length > 0) {
					groupedMessages.push({ label: currentLabel, messages: currentGroup });
					currentGroup = [];
				}
				currentLabel = label;
			}
			currentGroup?.push(message);
		});

		if (currentGroup.length > 0) {
			groupedMessages?.push({ label: currentLabel, messages: currentGroup });
		}

		return groupedMessages;
	}, [messagesRef.current]);

	const loadMoreMessages = async () => {
		if (isLoadingMore || totalResult === messagesRef.current?.length) return;
		setIsLoadingMore(true);
		const payload = {
			filters: filtersSearch,
			from: currentPage,
			size: SIZE_PAGE_SEARCH
		};

		try {
			await fetchSearchMessages(payload);
			setCurrentPage((prevPage) => prevPage + 1);
		} catch (error) {
			console.error(error);
		} finally {
			setIsLoadingMore(false);
		}
	};

	return (
		<Block style={styles.container}>
			<Block height={'100%'} width={'100%'} paddingBottom={size.s_100}>
				<FlashList
					showsVerticalScrollIndicator={false}
					data={searchMessages}
					keyboardShouldPersistTaps={'handled'}
					onScrollBeginDrag={Keyboard.dismiss}
					renderItem={({ item }) => (
						<Block>
							<Text style={styles.groupMessageLabel}>{`# ${item?.label}`}</Text>
							{item?.messages?.map((message) => (
								<Block key={message?.id} marginVertical={size.s_10}>
									<MessageItem
										message={message as MessagesEntity}
										messageId={message.id}
										mode={ChannelStreamMode.STREAM_MODE_CHANNEL}
										preventAction
									/>
								</Block>
							))}
						</Block>
					)}
					estimatedItemSize={100}
					removeClippedSubviews={true}
					onEndReached={loadMoreMessages}
					onEndReachedThreshold={0.5}
					ListFooterComponent={isLoadingMore && <ViewLoadMore />}
				/>
			</Block>
		</Block>
	);
});

export default MessagesSearchTab;
