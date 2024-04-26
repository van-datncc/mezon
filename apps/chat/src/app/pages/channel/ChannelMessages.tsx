import { ChatWelcome } from '@mezon/components';
import { getJumpToMessageId, useChatMessages, useJumpToMessage, useReference } from '@mezon/core';
import { useEffect, useRef, useState } from 'react';
import { Virtuoso } from 'react-virtuoso'
import { ChannelMessage } from './ChannelMessage';
import { START_INDEX_MESSAGE } from '@mezon/utils';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};
export default function ChannelMessages({ channelId, channelLabel, type, avatarDM, mode }: ChannelMessagesProps) {
	const ref = useRef<any>(null);
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const fetchData = () => {
		loadMoreMessage();
	};

	return (
		<Virtuoso
			style={{ height: "100%", backgroundColor: '#26262B', position: 'relative', display: 'flex', flexDirection: 'column', overflowX: 'hidden' }}
			data={messages}
			increaseViewportBy={200}
			firstItemIndex={START_INDEX_MESSAGE - messages.length}
			startReached={fetchData}
			totalCount={messages.length}
			atBottomThreshold={0}
			followOutput={true}
			itemContent={(i, message) => {
				return <ChannelMessage
					mode={mode}
					key={message.id}
					lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
					message={message}
					preMessage={0 < messages.length - 1 - START_INDEX_MESSAGE + i ? messages[messages.length - 1 - START_INDEX_MESSAGE + i] : undefined}
					channelId={channelId}
					channelLabel={channelLabel || ''}
				/>
			}}
			initialTopMostItemIndex={messages.length - 1}
			components={{ Header: () => <h4 className="h-[50px] py-[18px] text-center">Loading...</h4> }}
		/>
	);
}

ChannelMessages.Skeleton = () => {
	return (
		<>
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
			<ChannelMessage.Skeleton />
		</>
	);
};