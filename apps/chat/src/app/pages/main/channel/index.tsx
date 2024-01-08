
import { ChannelList, ChannelTopbar, ServerHeader } from '@mezon/components'

import { data } from '@mezon/utils'
import ChannelMessages from './ChanneMessages'

export default function Server() {
    const server = data[0]
    const channel = server.categories[0].channels[0]

    return (
        <>
            <div className="hidden flex-col w-60 bg-gray-800 md:flex">
                <ServerHeader name={server.label} />
                <ChannelList />
            </div>

            <div className="flex flex-col flex-1 shrink min-w-0 bg-gray-700">
                <ChannelTopbar channel={channel} />

                <div className="overflow-y-scroll flex-1">
                    <ChannelMessages />
                </div>
            </div>
        </>
    )
}
