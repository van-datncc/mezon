import { useChatMessages } from '@mezon/core';
import { useVirtualizer } from '@mezon/virtual';
import { useEffect, useRef } from 'react';
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
		reverse: true,
	});

	useEffect(() => {
		const [lastItem] = [...rowVirtualizer.getVirtualItems()];
		if (!lastItem) return;

		if (lastItem.index <= messages.length && hasMoreMessage) {
			loadMoreMessage();
		}
	}, [hasMoreMessage, loadMoreMessage, messages.length, rowVirtualizer]);

	return (
		<div
			className="bg-bgPrimary relative h-full flex overflow-x-hidden"
		>
			<div
				ref={parentRef}
				className="flex flex-col-reverse overflow-y-auto w-full min-h-0 justify-start"
			>
				<div
					className='relative flex flex-col-reverse w-full min-h-0 justify-start mb-auto flex-shrink-0'
				>
					{messages.map((message) => {
						const hasAttachment = (message?.attachments?.length ?? 0) > 0;
						const minHeight = hasAttachment ? '300px' : 'auto';

						return (
							<div
								key={message.id}
								style={{
									height: 'auto',
									minHeight,
								}}
							>
								<ChannelMessage
									mode={mode}
									lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
									message={message}
									preMessage={messages.length > 0 ? messages[messages.length - 1] : undefined}
									channelId={channelId}
									channelLabel={channelLabel || ''}
								/>
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
