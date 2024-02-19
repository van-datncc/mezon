
import { ChatContextProvider } from '@mezon/core';
import { MezonSuspense } from '@mezon/transport';
import { Outlet } from 'react-router-dom';


const MainLayout = () => {
  return (
    <div id="main-layout">
      <Outlet />
    </div>
  )
}

const MainLayoutWrapper = () => {
  return (
    <MezonSuspense>
      <ChatContextProvider>
        <MainLayout />
      </ChatContextProvider>
    </MezonSuspense>
  )
}

export default MainLayoutWrapper;
