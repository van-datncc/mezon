import { IMessageWithUser } from '@mezon/utils'
import { ChannelMessage } from './ChannelMessage'
import { useChatChannel } from '@mezon/core'

type ChannelMessagesProps = {
    channelId: string
}

export default function ChannelMessages({ channelId }: ChannelMessagesProps) {
    const { messages, unreadMessageId, lastMessageId } = useChatChannel(channelId)

    return (
        <>
            {messages.map((message, i) => (
                <ChannelMessage
                    key={message.id}
                    lastSeen={message.id === unreadMessageId && message.id !== lastMessageId}
                    message={message.content as IMessageWithUser}
                />
            ))}
        </>
    )
}

ChannelMessages.Skeleton = () => {
    return (
        <>
            <ChannelMessage.Skeleton />
            <ChannelMessage.Skeleton />
            <ChannelMessage.Skeleton />
        </>
    )
}