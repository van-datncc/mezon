import {Link} from 'react-router-dom'
import { IChannel } from '@mezon/utils'
import { Hashtag, AddPerson } from '../Icons'


export type ChannelLinkProps = {
  serverId: string
  channel: IChannel
}

function ChannelLink({ serverId, channel }: ChannelLinkProps) {

  const state = 'inactiveUnread'

  const classes = {
    active: 'text-white bg-gray-550/[0.32]',
    inactiveUnread:
      'text-white hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]',
    inactiveRead:
      'text-gray-300 hover:text-gray-100 hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]'
  }

  return (
    <Link to={`/servers/${serverId}/channels/${channel.id}`}>
      <span
        className={`${classes[state]} flex items-center px-2 mx-2 py-1 rounded group relative`}
      >
        {state === 'inactiveUnread' && (
          <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>
        )}
        <Hashtag className="mr-1.5 w-5 h-5 text-gray-400" />
        {channel.name}
        <AddPerson className="ml-auto w-4 h-4 text-gray-200 hover:text-gray-100 opacity-0 group-hover:opacity-100" />
      </span>
    </Link>
  )
}

export default ChannelLink
