import { useState } from 'react'

import { useChat } from '@mezon/core'

import { Arrow } from '../Icons'
import ChannelLink from '../ChannelLink'
import { ICategory, IChannel } from '@mezon/utils'

export type ChannelListProps = { className?: string }

function ChannelList() {
  const { categorizedChannels, currentChannelId } = useChat()
  const [categoriesState, setCategoriesState] = useState<Record<string, boolean>>({})

  function toggleCategory(categoryId: string) {
    setCategoriesState((state) => ({
      ...state,
      [categoryId]: state[categoryId] ? !state[categoryId] : false
    }))
  }

  return (
    <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] font-medium text-gray-300 scrollbar-hide">
      {categorizedChannels.map((category: ICategory) => (
        <div key={category.id}>
          {category.name && (
            <button
              onClick={() => toggleCategory(category.id)}
              className="flex items-center px-0.5 w-full font-title text-xs tracking-wide hover:text-gray-100 uppercase"
            >
              <Arrow
                className={`${
                  categoriesState[category.id] ? '-rotate-90' : ''
                } w-3 h-3 mr-0.5 transition duration-200`}
              />
              {category.name}
            </button>
          )}

          <div className="mt-[5px] space-y-0.5">
            {category?.channels?.filter((channel: IChannel) => {
                const categoryIsOpen = !categoriesState[category.id]

                return categoryIsOpen || channel?.unread
              })
              .map((channel: IChannel) => (
                <ChannelLink
                  serverId={channel?.clanId}
                  channel={channel}
                  active={currentChannelId === channel.id}
                  key={channel.id}
                />
              ))}
          </div>
        </div>
      ))}
    </div>
  )
}

export default ChannelList
