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
import { useParams } from 'react-router-dom';

export default function InvitePage() {
  const { inviteId: inviteIdParam } = useParams();
  const { inviteUser } = useChat();
  const joinChannel = () => {
    if(inviteIdParam) {
        inviteUser(inviteIdParam)
    }
  }
  return (
    <>
      <div className="hidden flex-col w-60 bg-bgSurface md:flex">
        <h1>Invite Page</h1>
        <Button label="JOIN" onClick={joinChannel}/>
      </div>
    </>
  );
}
