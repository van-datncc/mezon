import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Layouts
import GuessLayout from '../layouts/GuessLayout';
import MainLayout from '../layouts/MainLayout';
import AppLayout from '../layouts/AppLayout';
import ServerLayout from '../layouts/ServerLayout';

// Pages
import Main from '../pages/main';
import Chanel from '../pages/channel';
import Login from '../pages/login';

// Components
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      {
        path: "/guess",
        element: <GuessLayout />,
        children: [{
          path: "login",
          element: <Login />,
        }]
      },
      {
        path: "/chat",
        element: <MainLayout />,
        children: [{
          path: "servers/:serverId",
          element: <ServerLayout />,
          children: [{
            path: "",
            element: <Main />,
            children: [{
              path: "channels/:channelId",
              element: <Chanel />,
            }]
          }]
        }]
      },
    ]
  }
])