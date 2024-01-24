import { useMezon } from '@mezon/transport';
import React, { useCallback, useEffect } from 'react';
import { ChannelMessage } from 'vendors/mezon-js/packages/nakama-js/dist';
import { useChat } from '../hooks/useChat';
import { useNavigate, useParams } from 'react-router-dom';
import { messagesActions, useAppDispatch } from '@mezon/store';
import { IMessageWithUser } from '@mezon/utils';

type ChatContextProviderProps = {
  children: React.ReactNode
}

export type ChatContextValue = {
  // TODO: add your context value here
}

const ChatContext = React.createContext<ChatContextValue>({} as ChatContextValue);

const ChatContextProvider: React.FC<ChatContextProviderProps> = ({ children }) => {
  const { fetchClans } = useChat();
  const { socketRef } = useMezon();
  const dispatch = useAppDispatch();

  const onchannelmessage = useCallback((message: ChannelMessage) => {
    console.log('onchannelmessage', message);
    const payload = { ...message.content as IMessageWithUser };
    dispatch(messagesActions.add(payload));
  }, []);

  const onchannelpresence = useCallback((message: ChannelMessage) => {
    console.log('onchannelpresence', message);
  }, []);

  const ondisconnect = useCallback(() => {
    console.log('disconnect');
  }, []);

  const { channelId: channelIdParam } = useParams();
  const { serverId: serverIdParams } = useParams();
  const { changeCurrentClan, changeCurrentChannel, currentClanId, currentChannelId } = useChat();
  const navigate = useNavigate();

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

  useEffect(() => {
    console.log('fetchClans222');
    fetchClans();
  }, [fetchClans]);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (!serverIdParams || serverIdParams == currentClanId) {
      return
    }

    changeCurrentClan(serverIdParams);
  }, [changeCurrentClan, currentClanId, serverIdParams]);

  useEffect(() => {
    // eslint-disable-next-line eqeqeq
    if (!channelIdParam || channelIdParam == currentChannelId) {
      return
    }
    changeCurrentChannel(channelIdParam);
  }, [changeCurrentChannel, currentChannelId, channelIdParam]);

  useEffect(() => {
    if (!currentClanId || !currentChannelId) {
      return;
    }
    if (serverIdParams === currentClanId && channelIdParam === currentChannelId) {
      return;
    }
    if (!channelIdParam) {
      const url = `/chat/servers/${currentClanId}/channels/${currentChannelId}`;
      navigate(url);
    }
  }, [currentClanId, currentChannelId, channelIdParam, serverIdParams, navigate]);

  return (
    <ChatContext.Provider value={value}>
      {children}
    </ChatContext.Provider>
  );
}

const ChatContextConsumer = ChatContext.Consumer;


export { ChatContext, ChatContextProvider, ChatContextConsumer };