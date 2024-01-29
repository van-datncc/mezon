import { useChat } from '@mezon/core';
import { Button } from '@mezon/ui';
import { useNavigate, useParams } from 'react-router-dom';

export default function InvitePage() {
  const { inviteId: inviteIdParam } = useParams();
  const navigate = useNavigate();
  const { inviteUser } = useChat();

  const joinChannel = async () => {
    if (inviteIdParam) {
      inviteUser(inviteIdParam).then(res => {
        if (res.channel_id && res.clan_id) {
          navigate(`/chat/servers/${res.clan_id}/channels/${res.channel_id}`)
        }
      })
    }
  }
  // console.log('DDDD: ', inviteIdParam);
  return (
    <>
      <div className="hidden flex-col w-60 bg-bgSurface md:flex">
        <h1>Invite Page</h1>
        <Button label="JOIN" onClick={joinChannel} />
      </div>
    </>
  );
}
