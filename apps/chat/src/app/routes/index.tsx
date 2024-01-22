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
import Direct from '../pages/directMessage';
import Login from '../pages/login';
import ProtectedRoutes from './ProtectedRoutes';
import InitialRoutes from './InititalRoutes';

// Components
export const routes = createBrowserRouter([
  {
    path: "/",
    element: <AppLayout />,
    children: [
      // initial route to redirect to /chat
      {
        path: "",
        element: <InitialRoutes />,
      },
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
        element: <ProtectedRoutes />,
        children: [{
          path: "",
          element: <MainLayout />,
          children: [{
            path: "",
            element: <Main />,
            children: [{
              path: "servers/:serverId",
              element: <ServerLayout />,
              children: [{
                path: "channels/:channelId",
                element: <Chanel />,
              }]
            }, {
              path: "direct",
              element: <Direct />,
            }]
          }]
        }]
      },
      // fallback route, renders when no other route is matched
      {
        path: "*",
        element: <InitialRoutes />,
      },
    ]
  }
])