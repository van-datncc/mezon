
import React, { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

const AppLayout = () => {
    const navigate = useNavigate();

    useEffect(() => {
      // go to main page if user is not logged in
      navigate('/chat');
    }, [navigate]);

    return (
      <div id="app-layout">
        <Outlet />
      </div>
    )
  }
  
  export default AppLayout;