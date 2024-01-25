
import { useAppParams, useChat } from '@mezon/core';
import { Navigate, Outlet } from 'react-router-dom';

const ServerLayout = () => {
  const { channelId } = useAppParams();
  const { currentChanel } = useChat();
  
  if(currentChanel && currentChanel.id !== channelId) {
    return <Navigate to={`/chat/servers/${currentChanel.clan_id}/channels/${currentChanel.id}`} />
  }

  return (
    <div className='flex-row bg-bgSurface md:flex grow'>
      <Outlet />
    </div>
  )
}

export default ServerLayout;