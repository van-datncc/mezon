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
import ErrorRoutes from './ErrorRoutes';
import InvitePage from '../pages/invite';

// Loaders
import { authLoader } from '../loaders/authLoader';
import { mainLoader } from '../loaders/mainLoader';
import { serverLoader } from '../loaders/serverLoader';
import { channelLoader } from '../loaders/channelLoader';

// Components
export const routes = createBrowserRouter([
  {
    path: "",
    element: <AppLayout />,
    errorElement: <ErrorRoutes />,
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
        path: "chat",
        loader: authLoader,
        element: <ProtectedRoutes />,
        children: [{
          path: "",
          loader: mainLoader,
          element: <MainLayout />,
          children: [{
            path: "",
            element: <Main />,
            children: [{
              path: "servers/:serverId",
              loader: serverLoader,
              element: <ServerLayout />,
              children: [{
                path: "channels/:channelId",
                loader: channelLoader,
                element: <Chanel />,
              }]
            }, {
              path: "direct",
              element: <Direct />,
            },
            {
              path: "invite/:inviteId",
              element: <InvitePage />,
            },
            ]
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