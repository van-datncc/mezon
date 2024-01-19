import { MessageWithUser } from '@mezon/components'
import { IMessage, IMessageWithUser } from '@mezon/utils'

type MessageProps = {
    message: IMessageWithUser
}

export function ChannelMessage(props: MessageProps) {
    const { message } = props
    return (
        <div>
            <MessageWithUser message={message} />
        </div>
    )
}