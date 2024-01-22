import { useState } from 'react';
import { useChat } from '@mezon/core';
import * as Icons from '../Icons';
import ChannelLink from '../ChannelLink';
import { ICategory, IChannel, ICategoryChannel } from '@mezon/utils';

export type MemberListProps = { className?: string };

function MemberList() {
  const { categorizedChannels, currentChannelId } = useChat();
  const [categoriesState, setCategoriesState] = useState<
    Record<string, boolean>
  >({});

  function toggleCategory(categoryId: string) {
    setCategoriesState((state) => ({
      ...state,
      [categoryId]: state[categoryId] ? !state[categoryId] : false,
    }));
  }
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <>
      <div className="self-stretch h-[268px] px-4 flex-col justify-start items-start gap-3 flex mt-[24px]">
      {categorizedChannels.map((category: ICategoryChannel) => (
          <div key={category.id}>
            {category.category_name && (
              <text
                className="font-['Manrope'] text-[#AEAEAE] font-bold flex items-center px-0.5 w-full font-title text-xs tracking-wide hover:text-gray-100 uppercase"
              >
                {category.category_name}
              </text>
            )}
            {isOpen && (
              <div className="mt-[5px] space-y-0.5 font-['Manrope'] text-[#AEAEAE]">
                {category?.channels
                  ?.filter((channel: IChannel) => {
                    const categoryIsOpen = !categoriesState[category.id];
                    return categoryIsOpen || channel?.unread;
                  })
                  .map((channel: IChannel) => (
                    <ChannelLink
                      serverId={channel?.clan_id}
                      channel={channel}
                      active={currentChannelId === channel.id}
                      key={channel.id}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

export default MemberList;
