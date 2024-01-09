
import { ChannelList, ChannelTopbar, ServerHeader } from '@mezon/components'

import ChannelMessages from './ChanneMessages'
import { useChat } from '@mezon/core'

export default function Server() {
    const { currentChanel, currentClan } = useChat()

    if (!currentClan || !currentChanel) {
        return <div>Loading...</div>
    }

    return (
        <>
            <div className="hidden flex-col w-60 bg-gray-800 md:flex">
                <ServerHeader name={currentClan?.name} />
                <ChannelList />
            </div>

            <div className="flex flex-col flex-1 shrink min-w-0 bg-gray-700">
                <ChannelTopbar channel={currentChanel} />

                <div className="overflow-y-scroll flex-1">
                    <ChannelMessages />
                </div>
            </div>
        </>
    )
}
