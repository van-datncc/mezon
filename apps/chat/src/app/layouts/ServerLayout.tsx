
import { useChat } from '@mezon/core';
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const ServerLayout = () => {
  const { channelId: channelIdParam } = useParams();
  const { serverId: serverIdParams } = useParams();
  const { changeCurrentClan, currentClan, currentChanel, fetchClans } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    // TODO: Fetch channel
  }, [channelIdParam, currentChanel, fetchClans]);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (!serverIdParams || serverIdParams == currentClan?.id) {
      return
    }
    changeCurrentClan(serverIdParams);
  }, [changeCurrentClan, currentClan, serverIdParams]);

  useEffect(() => {
    if (!currentClan || !currentChanel) {
      return;
    }
    const url = `/chat/servers/${currentClan?.id}/channels/${currentChanel?.channel_id}`;
    navigate(url);
  }, [currentClan, currentChanel, navigate]);

  return (
    <div>
      <Outlet />
    </div>
  )
}

export default ServerLayout;