import { useChatMessage, useChatMessages, useChatReaction, useChatTypings } from '@mezon/core';
import { ArrowDownIcon } from '@mezon/mobile-components';
import { Colors, useAnimatedState } from '@mezon/mobile-ui';
import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { ActivityIndicator, FlatList, Text, TouchableOpacity, View } from 'react-native';
import MessageItem from './MessageItem';
import WelcomeMessage from './WelcomeMessage';
import { styles } from './styles';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};

const ChannelMessages = React.memo(({ channelId, channelLabel, type, mode }: ChannelMessagesProps) => {
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const { typingUsers } = useChatTypings({ channelId, channelLabel, mode });
	const { markMessageAsSeen } = useChatMessage(unreadMessageId);
	const [showScrollToBottomButton, setShowScrollToBottomButton] = useAnimatedState(false);
	const flatListRef = useRef(null);

	useEffect(() => {
		if (flatListRef.current) {
			flatListRef.current.scrollToEnd({ animated: true });
		}
	}, []);

	const { dataReactionCombine } = useChatReaction();

	const typingLabel = useMemo(() => {
		if (typingUsers.length === 1) {
			return `${typingUsers[0].user?.username} is typing...`;
		}
		if (typingUsers.length > 1) {
			return 'Several people are typing...';
		}
		return '';
	}, [typingUsers]);

	useEffect(() => {
		if (messages?.[0]) {
			markMessageAsSeen(messages?.[0]);
		}
	}, [markMessageAsSeen, messages]);

	const [isLoadMore, setIsLoadMore] = React.useState<boolean>(false);
	const onLoadMore = () => {
		setIsLoadMore(true);
		loadMoreMessage().finally(() => setIsLoadMore(false));
	};

	const handleScroll = (event: { nativeEvent: { contentOffset: { y: any } } }) => {
		const offsetY = event.nativeEvent.contentOffset.y;
		const threshold = 300; // Adjust this value to determine when to show the button

		if (offsetY > threshold && !showScrollToBottomButton) {
			setShowScrollToBottomButton(true);
		} else if (offsetY <= threshold && showScrollToBottomButton) {
			setShowScrollToBottomButton(false);
		}
	};

	const scrollToBottom = () => {
		flatListRef.current.scrollToOffset({ animated: true, offset: 0 });
	};

	const ViewLoadMore = () => {
		return (
			<View style={styles.loadMoreChannelMessage}>
				<ActivityIndicator size="large" color={Colors.tertiary} />
			</View>
		);
	};

	const renderItem = useCallback(
		({ item, index }) => {
			return (
				<MessageItem
					message={item}
					mode={mode}
					channelId={channelId}
					dataReactionCombine={dataReactionCombine}
					channelLabel={channelLabel}
					preMessage={messages.length > 0 ? messages[index + 1] : undefined}
				/>
			);
		},
		[dataReactionCombine, messages],
	);

	return (
		<View style={styles.wrapperChannelMessage}>
			{!messages?.length && <WelcomeMessage channelTitle={channelLabel} />}
			<FlatList
				ref={flatListRef}
				inverted
				data={messages || []}
				onScroll={handleScroll}
				keyboardShouldPersistTaps={'handled'}
				contentContainerStyle={styles.listChannels}
				renderItem={renderItem}
				keyExtractor={(item) => `${item?.id}`}
				windowSize={10}
				removeClippedSubviews={true}
				maxToRenderPerBatch={20}
				updateCellsBatchingPeriod={50}
				onEndReached={onLoadMore}
				onEndReachedThreshold={0.5}
				ListFooterComponent={isLoadMore && hasMoreMessage ? <ViewLoadMore /> : null}
			/>
			{showScrollToBottomButton && (
				<TouchableOpacity style={styles.btnScrollDown} onPress={scrollToBottom} activeOpacity={0.8}>
					<ArrowDownIcon color={Colors.tertiary} />
				</TouchableOpacity>
			)}
			{!!typingLabel && <Text style={styles.typingLabel}>{typingLabel}</Text>}
		</View>
	);
});

export default ChannelMessages;
