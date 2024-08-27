import { ELoadMoreDirection } from '@mezon/chat-scroll';
import { isEqual } from '@mezon/mobile-components';
import { Colors, useTheme } from '@mezon/mobile-ui';
import { channelsActions, MessagesEntity, useAppDispatch } from '@mezon/store';
import { FlashList } from '@shopify/flash-list';
import React, { useCallback } from 'react';
import { ActivityIndicator, View } from 'react-native';
import { style } from './styles';

interface IChannelListMessageProps {
  flatListRef: React.RefObject<FlashList<MessagesEntity>>;
  messages: MessagesEntity[];
  handleScroll: (event) => void;
  renderItem: ({ item }: { item: MessagesEntity }) => React.ReactElement;
  onLoadMore: (direction: ELoadMoreDirection) => void;
  isLoadMore: boolean;
  hasMoreMessage: boolean;
}


const ChannelListMessage = React.memo(({
  flatListRef,
  messages,
  handleScroll,
  renderItem,
  onLoadMore,
  isLoadMore,
  hasMoreMessage
}: IChannelListMessageProps) => {
  const { themeValue } = useTheme();
  const styles = style(themeValue);
  
	const keyExtractor = useCallback((message) => message.id, []);

	const dispatch = useAppDispatch();
  const timestamp = Date.now() / 1000;
  dispatch(channelsActions.setChannelLastSeenTimestamp({ channelId: messages[0].channel_id, timestamp }));

  const ViewLoadMore = () => {
    return (
      <View style={styles.loadMoreChannelMessage}>
        <ActivityIndicator size="large" color={Colors.tertiary} />
      </View>
    );
  };

  return (
    <FlashList
      ref={flatListRef}
      data={messages || []}
      onScroll={handleScroll}
      keyboardShouldPersistTaps={'handled'}
      contentContainerStyle={styles.listChannels}
      renderItem={renderItem}
      removeClippedSubviews={true}
      keyExtractor={keyExtractor}
      estimatedItemSize={100}
      onEndReached={messages?.length ? () => {onLoadMore(ELoadMoreDirection.bottom)} : undefined}
      onEndReachedThreshold={0.1}
      showsVerticalScrollIndicator={false}
      ListHeaderComponent={isLoadMore && hasMoreMessage ? <ViewLoadMore /> : null}
  />
  )
}, (prev, curr) => {
   return  (
    prev.hasMoreMessage === curr.hasMoreMessage &&
    prev.isLoadMore === curr.isLoadMore &&
    isEqual(prev.messages, curr.messages)
  )
});


export default ChannelListMessage;