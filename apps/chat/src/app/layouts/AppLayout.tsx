
// import { useChat } from '@mezon/core';
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AppLayout = () => {
    // const {  } = useChat();
    const navigate = useNavigate();

    useEffect(() => {
      // go to main page if user is not logged in
      navigate('/guess/login');
    }, [navigate]);

    return (
      <div id="app-layout">
        <Outlet />
      </div>
    )
  }
  
  export default AppLayout;