import { ChatWelcome } from '@mezon/components';
import { useChatMessages } from '@mezon/core';
import { useEffect, useRef, useState } from 'react';
import { ChannelMessage } from './ChannelMessage';
import AutoSizer from "react-virtualized-auto-sizer";
import { VariableSizeList as List } from "react-window";

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};

export default function ChannelMessages({ channelId, channelLabel, type, avatarDM, mode }: ChannelMessagesProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });
	const fetchData = () => {
		loadMoreMessage();
	};

	const listRef = useRef<any>({});
	const rowHeights = useRef<any>({});

	useEffect(() => {
		if (messages.length > 0) {
			scrollToBottom();
		}
	}, [messages.length]);

	function getRowHeight(index: any) {
		return rowHeights.current[index] + 1 || 60;
	}

	function Row({ index, style }: any) {
		const rowRef = useRef<any>({});
		useEffect(() => {
			if (rowRef.current) {
				const newHeight = rowRef.current.clientHeight;
				setRowHeight(index, newHeight);
			}
		}, [rowRef.current]);
		return (
			<div style={style}>
				<div ref={rowRef}>
					<ChannelMessage
						mode={mode}
						key={messages[index].id}
						lastSeen={messages[index].id === unreadMessageId && messages[index].id !== lastMessageId}
						message={messages[index]}
						preMessage={messages.length > 0 ? messages[index - 1] : undefined}
						channelId={channelId}
						channelLabel={channelLabel || ''}
					/>
				</div>
			</div>
		);
	}

	function setRowHeight(index: any, size: any) {
		listRef.current.resetAfterIndex(0);
		rowHeights.current = { ...rowHeights.current, [index]: size };
	}

	function scrollToBottom() {
		console.log('on Bottom:', messages.length - 50)
		if (listRef.current) {
			if (messages.length > 50) {
				listRef.current?.scrollToItem(60, "end");
			} else {
				listRef.current?.scrollToItem(messages.length, "end");
			}
		}
	}

	const onScroll = ({ scrollOffset }: any) => {
		if (scrollOffset < 50 && hasMoreMessage && messages.length > 49) {
			loadMoreMessage();
		}
	};


	return (
		<div
			className="bg-[#26262B] relative"
			style={{
				height: '100%',
				display: 'flex',
				flexDirection: 'column-reverse',
				overflowX: 'hidden',
			}}
		>
			<AutoSizer style={{ width: '100%', height: '100%' }}>
				{({ height, width }) => (
					<List
						height={height - 15}
						itemCount={messages.length}
						itemSize={getRowHeight}
						ref={listRef}
						width={width}
						onScroll={onScroll}
					>
						{Row}
					</List>
				)}

			</AutoSizer>
		</div>
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
