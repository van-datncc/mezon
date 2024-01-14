import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@mezon/store';
import { getMezonSession } from 'libs/utils/src/lib/storage/storage';
import { authActions } from '@mezon/store';
import { useDispatch } from 'react-redux';

const AppLayout = () => {
  const dispatch = useDispatch();
  const isLogin = useSelector((state: RootState) => state.auth.isLogin);
  const account = useSelector((state: RootState) => state.account.account);
  const navigate = useNavigate();

  // console.log("acc", account)

  useEffect(() => {
    const storedSession = getMezonSession();
    if (isLogin && storedSession !== null) {
      navigate('/chat/servers/clan1/channels/channel1');
    } else {
      if (storedSession === null) {
        dispatch(authActions.logOut());
        navigate('guess/login');
      }
    }
  }, [isLogin, navigate, dispatch]);

  return (
    <div id="app-layout">
      <Outlet />
    </div>
  );
};

export default AppLayout;
