import { useChatChannel } from '@mezon/core';
import { ChannelMessage } from './ChannelMessage';

type ChannelMessagesProps = {
    channelId: string;
};

export default function ChannelMessages({ channelId }: ChannelMessagesProps) {
	const { messages, unreadMessageId, lastMessageId } = useChatChannel(channelId);
	return (
		<>
			{messages.map((message, i) => (
				<ChannelMessage
					key={message.id}
					lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
					message={message}
					preMessage={i > 0 ? messages[i - 1] : undefined}
				/>
			))}
		</>
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
