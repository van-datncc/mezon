import { MessageWithUser } from '@mezon/components'
import { IMessage } from '@mezon/utils'

type MessageProps = {
    message: IMessage

}

export function ChannelMessage(props: MessageProps) {
    const { message } = props
    return (
        <div>
           <MessageWithUser message={message} />
        </div>
    )
}