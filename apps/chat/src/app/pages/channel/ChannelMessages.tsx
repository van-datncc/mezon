import { useChatMessages } from '@mezon/core';
import { useEffect, useRef } from 'react';
import { useVirtualizer } from '@mezon/virtual';
import { ChannelMessage } from './ChannelMessage';

type ChannelMessagesProps = {
	channelId: string;
	type: string;
	channelLabel?: string;
	avatarDM?: string;
	mode: number;
};

export default function ChannelMessages({ channelId, channelLabel, type, avatarDM, mode }: ChannelMessagesProps) {
	const { messages, unreadMessageId, lastMessageId, hasMoreMessage, loadMoreMessage } = useChatMessages({ channelId });

	const parentRef = useRef<any>();

	const rowVirtualizer = useVirtualizer({
		count: messages.length + 1, // Add 1 to account for loader row
		estimateSize: () => 100,
		getScrollElement: () => parentRef.current,
		overscan: 50,
		reverse: true
	});

	const rowVirtualizerRef = useRef(rowVirtualizer);

	useEffect(() => {
		const [lastItem] = [...rowVirtualizerRef.current.getVirtualItems()]

		if (!lastItem) return;

		if (lastItem.index >= messages.length - 1 && hasMoreMessage) {
			loadMoreMessage();
		}
	}, [hasMoreMessage, loadMoreMessage, messages.length]);

	return (
		<div
			className="bg-bgPrimary relative"
			style={{
				height: '100%',
				display: 'flex',
				overflowX: 'hidden',
			}}
		>
			<div
				ref={parentRef}
				className="List"
				style={{
					display: 'flex',
					flexDirection: 'column-reverse',
					// height: '500px',
					justifyContent: 'flex-start',
					minHeight: '0',
					overflow: 'auto',
					width: '100%'
				}}
			>
				<div
					style={{
						display: 'flex',
						flexDirection: 'column-reverse',
						flexShrink: '0',
						height: `${rowVirtualizer.getTotalSize()}px`,
						justifyContent: 'flex-start',
						marginBottom: 'auto',
						position: 'relative',
						width: '100%'
					}}
				>
					{rowVirtualizer.getVirtualItems().map((virtualRow) => {
						const isLoaderRow = virtualRow.index === messages.length;
						const message = messages[virtualRow.index];
						const hasAttachment = (message?.attachments?.length ?? 0) > 0;
						const minHeight = hasAttachment ? '300px' : 'auto';
						return (
							<div
								ref={virtualRow.measureElement}
								key={virtualRow.index}
								className={virtualRow.index % 2 ? 'ListItemOdd' : 'ListItemEven'}
								style={{
									position: 'absolute',
									bottom: 0,
									left: 0,
									width: '100%',
									transform: `translateY(${virtualRow.end}px)`,
								}}
							>
								<div style={{
									height: isLoaderRow ? '100px' : 'auto',
									minHeight,
								}}>
									{isLoaderRow
										? hasMoreMessage
											? 'Loading more...'
											: 'Nothing more to load'
										: (
											<ChannelMessage
												mode={mode}
												lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
												message={message}
												preMessage={messages[virtualRow.index - 1]}
												channelId={channelId}
												channelLabel={channelLabel || ''}
											/>
										)}
								</div>
							</div>
						);
					})}
				</div>
			</div>
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
