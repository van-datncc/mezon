import { ChannelList, ChannelTopbar, ServerHeader } from '@mezon/components';

import ChannelMessages from './ChanneMessages';
import { useChat } from '@mezon/core';
import { ChannelMessageBox } from './ChannelMessageBox';
import { useEffect, useState } from 'react';
import { Loading } from 'libs/ui/src/lib/Loading';
import { LogOutButton } from 'libs/ui/src/lib/LogOutButton/index';

function LoadingComponent() {
  const [showLoading, setShowLoading] = useState(true);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setShowLoading(false);
    }, 500);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);

  return showLoading && <Loading />;
}

export default function Server() {
  const { currentChanel, currentClan } = useChat();

  if (!currentClan || !currentChanel) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <LoadingComponent />{' '}
      <div className="hidden flex-col w-60 bg-gray-800 md:flex">
        <ServerHeader name={currentClan?.name} />
        <ChannelList />
        <LogOutButton />
      </div>
      <div className="flex flex-col flex-1 shrink min-w-0 bg-gray-700">
        <ChannelTopbar channel={currentChanel} />

        <div className="overflow-y-scroll flex-1">
          <ChannelMessages />
        </div>

        <div className="flex-shrink-0">
          <ChannelMessageBox />
        </div>
      </div>
    </>
  );
}
