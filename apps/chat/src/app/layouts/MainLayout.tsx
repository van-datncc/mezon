
import { ChatContextProvider, useChat } from '@mezon/core';
import { authActions, selectIsLogin, selectLoadingStatus, selectSession, useAppDispatch } from '@mezon/store';
import { MezonSuspense } from '@mezon/transport';
import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Outlet, useNavigate } from 'react-router-dom';

let authLoaded = false

const MainLayout = () => {
  const { currentClanId } = useChat();
  const navigate = useNavigate();

  useEffect(() => {
    if (!currentClanId) {
      return;
    }

    const url = `/chat/servers/${currentClanId}`;
    navigate(url);
  }, [currentClanId, navigate]);

  return (
    <div id="main-layout">
      <Outlet />
    </div>
  )
}

const MainLayoutWrapper = () => {
  const isLogin = useSelector(selectIsLogin);
  const session = useSelector(selectSession);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    if (authLoaded) {
      return;
    }

    if (!session) {
      return;
    }

    dispatch(authActions.refreshSession())
    authLoaded = true
  }, [dispatch, session])

  useEffect(() => {
    if (!isLogin) {
      navigate('/guess/login');
      return;
    }
  }, [isLogin, navigate]);

  return (
    <MezonSuspense>
      <ChatContextProvider>
        <MainLayout />
      </ChatContextProvider>
    </MezonSuspense>
  )
}

export default MainLayoutWrapper;
