import {
  ChannelTopbar,
  DirectMessageList,
  FooterProfile,
  ServerHeader,
} from '@mezon/components';
import ChannelMessages from '../channel/ChanneMessages';
import { ChannelMessageBox } from '../channel/ChannelMessageBox';
import { useChat } from '@mezon/core';
import { Button } from '@mezon/ui';
import { useNavigate, useParams } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { clansActions, getStoreAsync, useAppDispatch } from '@mezon/store';

export default function InvitePage() {
  const { inviteId: inviteIdParam } = useParams();
  const navigate = useNavigate();
  const { inviteUser } = useChat();

  const joinChannel = async () => {
    if (inviteIdParam) {
      inviteUser(inviteIdParam).then(res => {
        if (res.channel_id && res.clan_id) {
          console.log('LInk : ', `/chat/servers/${res.clan_id}/channels/${res.channel_id}`)
          navigate(`/chat/servers/${res.clan_id}/channels/${res.channel_id}`)
        }
      })
    }
  }
  return (
    <>
      <div className="hidden flex-col w-60 bg-bgSurface md:flex">
        <h1>Invite Page</h1>
        <Button label="JOIN" onClick={joinChannel} />
      </div>
    </>
  );
}
