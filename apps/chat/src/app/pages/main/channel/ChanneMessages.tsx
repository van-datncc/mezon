
import { MessageWithUser } from '@mezon/components'
import { useChat } from '@mezon/core'

export default function ChannelMessages() {
    const { messages } = useChat()

    return (
        <>
            {messages.map((message, i) => (
                <div key={message.id}>
                    <MessageWithUser message={message} />
                </div>
            ))}
        </>
    )
}
