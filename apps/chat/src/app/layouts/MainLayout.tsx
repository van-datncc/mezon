
import { useChat } from '@mezon/core';
import { selectIsLogin } from '@mezon/store';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const MainLayout = () => {
  const isLogin  = useSelector(selectIsLogin)
  const { serverId: serverIdParams } = useParams();
  const { changeCurrentClan, currentClan, fetchClans } = useChat();
  const navigate = useNavigate();

  
  useEffect(() => {
    fetchClans()
  }, []);

  useEffect(() => {
    if(!serverIdParams || serverIdParams == currentClan?.id) {
      return
    }
    changeCurrentClan(serverIdParams);
  }, [changeCurrentClan, currentClan, serverIdParams]);

  useEffect(() => {
    if (!isLogin) {
      navigate('/guess/login');
      return;
    }

    if (!currentClan) {
      return;
    }

    const url = `/chat/servers/${currentClan?.id}`;
    navigate(url);
  }, [currentClan, navigate, isLogin]);

  return (
    <div id="main-layout">
      <Outlet />
    </div>
  )
}

export default MainLayout;