import { useState } from 'react';
import { useChat } from '@mezon/core';
import ChannelLink from '../ChannelLink';
import { IChannel, ICategoryChannel } from '@mezon/utils';
import { Events, BrowseChannel } from './ChannelListComponents';
import {
  channelsActions,
  useAppDispatch,
} from '@mezon/store';
import * as Icons from '../Icons';
import { CreateNewChannelModal } from 'libs/components/src/lib/components/CreateChannelModal/index';
import { Modal } from '@mezon/ui';

export type ChannelListProps = { className?: string };

function ChannelList() {
  const { categorizedChannels, currentChanel } = useChat();
  const [categoriesState, setCategoriesState] = useState<
    Record<string, boolean>
  >({});
  const { currentClan, createLinkInviteUser } = useChat();
  function toggleCategory(categoryId: string) {
    setCategoriesState((state) => ({
      ...state,
      [categoryId]: state[categoryId] ? !state[categoryId] : false,
    }));
  }
  const [isOpen, setIsOpen] = useState<boolean>(true);

  const dispatch = useAppDispatch();

  const openModalCreateNewChannel = (paramCategory: string) => {
    console.log('paramCategory', paramCategory);
    dispatch(channelsActions.openCreateNewModalChannel());
    dispatch(channelsActions.getCurrentCategoryId(paramCategory));
  };

  const [openInvite, setOpenInvite] = useState(false);

  const [urlInvite, setUrlInvite] = useState('');


  const handleOpenInvite = (currentServerId: string, currentChannelId: string) => {
    //call api
    // console.log("clan_id: ", currentServerId, "channel_id: ", currentChannelId?., "category_id: ", channel?.category_id)
    setOpenInvite(true)
    createLinkInviteUser(currentServerId ?? '', currentChannelId ?? '', 10).then(res => {
      if (res && res.invite_link) {
        setUrlInvite(window.location.origin + '/chat/invite/' + res.invite_link)
      }
    })
  }

  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(urlInvite)
  }

  return (
    <>
      {<CreateNewChannelModal />}

      <div className="self-stretch h-[52px] px-4 flex-col justify-start items-start gap-3 flex mt-[24px]">
        <Events />
        <BrowseChannel />
      </div>
      <hr className="h-[0.08px] w-[272px] mt-[24px] border-[#1E1E1E]" />

      <div className="overflow-y-scroll flex-1 pt-3 space-y-[21px] font-medium text-gray-300 scrollbar-hide">
        {categorizedChannels.map((category: ICategoryChannel) => (
          <div key={category.id}>
            {category.category_name && (
              <div className="flex flex-row px-2">
                <button
                  onClick={() => {
                    toggleCategory(category.id);
                    setIsOpen(!isOpen);
                  }}
                  className="font-['Manrope'] text-[#AEAEAE] font-bold flex items-center px-0.5 w-full font-title text-xs tracking-wide hover:text-gray-100 uppercase"
                >
                  {isOpen ? <Icons.ArrowDown /> : <Icons.ArrowRight />}

                  {category.category_name}
                </button>
                <button onClick={() => openModalCreateNewChannel(category.id)}>
                  <Icons.Plus />
                </button>
              </div>
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
                      active={currentChanel?.id === channel.id}
                      key={channel.id}
                      createInviteLink={handleOpenInvite}
                    />
                  ))}
              </div>
            )}
          </div>
        ))}
      </div>
      <Modal title='Invite' onClose={() => { setOpenInvite(false) }} showModal={openInvite} confirmButton={handleCopyToClipboard} titleConfirm='Copy'>
        <p><span>{urlInvite}</span></p>
      </Modal>
    </>
  );
}

export default ChannelList;
