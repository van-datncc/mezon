import { MessageWithUser, UnreadMessageBreak } from '@mezon/components'
import { useChatMessage } from '@mezon/core'
import { IMessageWithUser } from '@mezon/utils'
import { useEffect, useMemo } from 'react'

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

    // TODO: recheck this
    const mess = useMemo(() => {
        if(typeof message.content === 'object' && typeof (message.content as any).id === 'string') {
            console.log('message.content', message.content)
            return message.content
        }
        return message
    }, [message])

    return (
        <div>
            <MessageWithUser message={mess as IMessageWithUser} />
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