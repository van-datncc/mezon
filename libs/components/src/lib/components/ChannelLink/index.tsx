import { Link, useNavigate } from 'react-router-dom';
import { IChannel } from '@mezon/utils';
import { Hashtag, AddPerson, Speaker } from '../Icons';
import { MouseEvent, useCallback, useState } from 'react';
import { bool } from 'yup';
import { Modal } from '@mezon/ui';
import { useChat } from '@mezon/core';

export type ChannelLinkProps = {
  serverId?: string;
  channel: IChannel;
  active?: boolean;
};

function ChannelLink({ serverId, channel, active }: ChannelLinkProps) {
  const state = active
    ? 'active'
    : channel?.unread
      ? 'inactiveUnread'
      : 'inactiveRead';

  const classes = {
    active: 'text-white bg-gray-550/[0.32]',
    inactiveUnread:
      'text-white hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]',
    inactiveRead:
      'text-gray-300 hover:text-gray-100 hover:bg-gray-550/[0.16] active:bg-gray-550/[0.24]',
  };

  const { currentClan, createLinkInviteUser } = useChat();
  const[openInvite, setOpenInvite] = useState(false);
  const [urlInvite, setUrlInvite] = useState('');
  const navigate = useNavigate();

  const handleOpenInvite = () => {
    //call api
    console.log("clan_id: ", currentClan?.id, "channel_id: " ,channel?.channel_id, "category_id: ",channel?.category_id)
    console.log('dddd: ', window.location.origin)
    setOpenInvite(true)
    createLinkInviteUser(currentClan?.id ?? '', channel?.channel_id ?? '', 10).then(res => {
      if(res && res.invite_link){
        setUrlInvite(window.location.origin +'/chat/invite/'+ res.invite_link)
      }
    })
  }
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(urlInvite)
  }

  const handleClickChannel = useCallback((e: MouseEvent) => {
    e.preventDefault();
    return navigate(`../${channel?.channel_id}`, { replace: true, relative: 'route' })
  }, [channel, navigate]);
  
  return (
    <Link to={`/chat/servers/${serverId}/channels/${channel?.channel_id}`} onClick={handleClickChannel}>
      <span
        className={`${classes[state]} ${state} hover:bg-[#36373D] flex flex-row items-center px-2 mx-2  rounded group relative`}
      >
        {state === 'inactiveUnread' && (
          <div className="absolute left-0 -ml-2 w-1 h-2 bg-white rounded-r-full"></div>
        )}
        <Speaker />
        <p className="ml-2 text-[#AEAEAE] w-full h-[28px] hover:text-white">
          {channel?.channel_lable}
        </p>
        <div>
          <AddPerson className="ml-auto w-4 h-4 text-gray-200 hover:text-gray-100 opacity-0 group-hover:opacity-100" onClick={handleOpenInvite} />
        </div>
        <Modal title='Invite' onClose={() => { setOpenInvite(false) }} showModal={openInvite} confirmButton={handleCopyToClipboard} titleConfirm='Copy'>
        <p><span>{urlInvite}</span></p>
        </Modal>
      </span>
    </Link>
  );
}

export default ChannelLink;
