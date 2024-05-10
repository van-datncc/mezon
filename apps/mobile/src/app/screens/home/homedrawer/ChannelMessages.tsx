import { useChatMessages } from '@mezon/core';
import React from 'react';
import { FlatList } from 'react-native';
import MessageBox from './MessageBox';
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

	return (
		<FlatList
			inverted
			data={messages}
			contentContainerStyle={styles.listChannels}
			renderItem={({ item }) => {
				return <MessageBox data={item} />;
			}}
			keyExtractor={(item) => `${item?.id}`}
		/>
	);
});

export default ChannelMessages;
