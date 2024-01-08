
import React from 'react';
import { Outlet } from 'react-router-dom';

const ServerLayout = () => {
    return (
      <div>
        <Outlet />
      </div>
    )
  }
  
  export default ServerLayout;