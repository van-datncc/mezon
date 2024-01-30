import { MessageWithUser, UnreadMessageBreak } from '@mezon/components'
import { useChatMessage } from '@mezon/core'
import { IMessageWithUser } from '@mezon/utils'
import { useEffect } from 'react'

type MessageProps = {
    message: IMessageWithUser,
    lastSeen?: boolean
}

export function ChannelMessage(props: MessageProps) {
    const { message, lastSeen } = props
    const { markMessageAsSeen } = useChatMessage(message.id);

    useEffect(() => {
        markMessageAsSeen(message)
    }, [markMessageAsSeen, message]);

    return (
        <div>
            <MessageWithUser message={message} />
            {lastSeen && (
                <UnreadMessageBreak />
            )}
        </div>
    )
}

ChannelMessage.Skeleton = () => {
    return (
        <div>
            <MessageWithUser.Skeleton />
        </div>
    )
}