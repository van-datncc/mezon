
import { useChat } from '@mezon/core';
import { authActions, selectIsLogin, selectSession, useAppDispatch } from '@mezon/store';
import { MezonSuspense } from '@mezon/transport';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const MainLayout = () => {
  const isLogin  = useSelector(selectIsLogin)
  const { serverId: serverIdParams } = useParams();
  const { changeCurrentClan, currentClan, fetchClans } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isLogin) {
      return;
    }

    fetchClans()
  }, [fetchClans, isLogin]);

  useEffect(() => {
    if(!isLogin || !serverIdParams || serverIdParams == currentClan?.id) {
      return
    }
    changeCurrentClan(serverIdParams);
  }, [changeCurrentClan, currentClan, serverIdParams, isLogin]);

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
      <MezonSuspense>
        <Outlet />
      </MezonSuspense>
    </div>
  )
}

const MainLayoutWrapper = () => {
  const session = useSelector(selectSession);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!session) {
      return;
    }
    dispatch(authActions.refreshSession())
  }, [dispatch, session])

  return (
    <MezonSuspense>
      <MainLayout />
    </MezonSuspense>
  )
}

export default MainLayoutWrapper;