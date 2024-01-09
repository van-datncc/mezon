
import { useChat } from '@mezon/core';
import React, { useEffect } from 'react';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const MainLayout = () => {
    const { serverId: serverIdParams, channelId: channelIdParams } = useParams();
    const { changeCurrentClan, changeCurrentChannel ,currentClan, currentChanel } = useChat();
    const navigate = useNavigate();

   useEffect(() => {
    changeCurrentClan(serverIdParams);
   }, [changeCurrentClan, serverIdParams]);


   useEffect(() => {
    changeCurrentChannel(channelIdParams);
   }, [changeCurrentChannel, channelIdParams]);

   useEffect(() => {
    if (!currentClan?.id) {
      return;
    }
    const channelSlug = currentChanel ? `/channels/${currentChanel.id}` : '';
    const url = `/chat/servers/${currentClan?.id}${channelSlug}`;
    navigate(url);
   }, [currentClan, currentChanel, navigate]);

    return (
      <div id="main-layout">
        <Outlet />
      </div>
    )
  }
  
  export default MainLayout;