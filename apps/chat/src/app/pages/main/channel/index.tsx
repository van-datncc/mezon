
import { ChannelList, ChannelTopbar, Message, MessageWithUser, ServerHeader } from '@mezon/components'

import { data } from '@mezon/core'

export default function Server() {
    const server = data[0]
    const channel = server.categories[0].channels[0]

    return (
        <>
            <div className="hidden flex-col w-60 bg-gray-800 md:flex">
                <ServerHeader name={server.label} />
                <ChannelList server={server} />
            </div>

            <div className="flex flex-col flex-1 shrink min-w-0 bg-gray-700">
                <ChannelTopbar channel={channel} />

                <div className="overflow-y-scroll flex-1">
                    {channel?.messages.map((message, i) => (
                        <div key={message.id}>
                            {i === 0 || message.user !== channel?.messages[i - 1].user ? (
                                <MessageWithUser message={message} />
                            ) : (
                                <Message message={message} />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}
