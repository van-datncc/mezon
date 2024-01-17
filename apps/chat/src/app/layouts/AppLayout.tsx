import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@mezon/store';
import { authActions } from '@mezon/store';
import { useDispatch } from 'react-redux';

const AppLayout = () => {
  const dispatch = useDispatch();
  const isLoginPersist = useSelector((state: RootState) => state.auth.isLogin);
  const navigate = useNavigate();
  useEffect(() => {
    if (isLoginPersist) {
      navigate('/chat/servers/clan1/channels/channel1');
    } else {
      dispatch(authActions.logOut());
      navigate('guess/login');
    }
  }, [navigate, dispatch, isLoginPersist]);

  return (
    <div id="app-layout">
      <Outlet />
    </div>
  );
};

export default AppLayout;
