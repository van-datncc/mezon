
import React from 'react';
import { Outlet } from 'react-router-dom';

const GuessLayout = () => {
    return (
      <div>
        <Outlet />
      </div>
    )
  }
  
  export default GuessLayout;