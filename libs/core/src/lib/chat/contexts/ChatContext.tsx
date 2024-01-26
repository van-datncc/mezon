import { useMezon } from '@mezon/transport';
import React, { useCallback, useEffect } from 'react';
import { ChannelMessage } from 'vendors/mezon-js/packages/mezon-js/dist';
import { mapMessageChannelToEntity, messagesActions, useAppDispatch } from '@mezon/store';

type ChatContextProviderProps = {
  children: React.ReactNode
}

export type ChatContextValue = {
  // TODO: add your context value here
}

const ChatContext = React.createContext<ChatContextValue>({} as ChatContextValue);

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {

  const { socketRef } = useMezon();
  const dispatch = useAppDispatch();

  const onchannelmessage = useCallback((message: ChannelMessage) => {
    dispatch(messagesActions.add(mapMessageChannelToEntity(message)));
  }, []);

  const onchannelpresence = useCallback((message: ChannelMessage) => {
    // TODO: handle presence
  }, []);

  const ondisconnect = useCallback(() => {
    // TODO: handle disconnect
  }, []);


  const value = React.useMemo<ChatContextValue>(() => ({

  }), []);


  useEffect(() => {
    const socket = socketRef.current;
    if (!socket) {
      return;
    }

    socket.onchannelmessage = onchannelmessage;

    socket.onchannelpresence = onchannelpresence;

    socket.ondisconnect = ondisconnect;

    return () => {
      socket.onchannelmessage = () => { };
      socket.onchannelpresence = () => { };
      socket.ondisconnect = () => { };
    }
  }, [onchannelmessage, onchannelpresence, ondisconnect, socketRef])

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

const ChatContextConsumer = ChatContext.Consumer;

export { ChatContext, ChatContextProvider, ChatContextConsumer };