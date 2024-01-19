
import { useChat } from '@mezon/core';
import { authActions, selectIsLogin, selectSession, useAppDispatch } from '@mezon/store';
import { MezonSuspense } from '@mezon/transport';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate, useParams } from 'react-router-dom';

const MainLayout = () => {
  const { serverId: serverIdParams } = useParams();
  const { changeCurrentClan, currentClan, fetchClans } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClans()
  }, [fetchClans]);

  useEffect(() => {
    if (!serverIdParams || serverIdParams == currentClan?.id) {
      return
    }
    changeCurrentClan(serverIdParams);
  }, [changeCurrentClan, currentClan, serverIdParams]);

  useEffect(() => {
    if (!currentClan) {
      return;
    }

    const url = `/chat/servers/${currentClan?.id}`;
    navigate(url);
  }, [currentClan, navigate]);

  return (
    <div id="main-layout">
      <Outlet />
    </div>
  )
}

const MainLayoutWrapper = () => {
  const isLogin = useSelector(selectIsLogin)
  const session = useSelector(selectSession);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (!session) {
      return;
    }
    dispatch(authActions.refreshSession())
  }, [dispatch, session])

  useEffect(() => {
    if (!isLogin) {
      navigate('/guess/login');
      return;
    }
  }, [isLogin, navigate]);

  return (
    <MezonSuspense>
      <MainLayout />
    </MezonSuspense>
  )
}

export default MainLayoutWrapper;