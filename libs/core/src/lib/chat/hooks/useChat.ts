
import React, { useCallback, useMemo } from 'react';
import { useChannels } from './useChannels';
import { useMessages } from './useMessages';
import { useThreads } from './useThreads';
import { useSelector } from 'react-redux';
import {
  selectChannelsEntities,
  selectCurrentChannel,
  selectCurrentChannelId,
  selectCurrentClanId,
  clansActions,
  channelsActions,
  messagesActions,
  selectCurrentClan,
  selectClansEntities,
  authActions,
  accountActions,
  useAppDispatch,
  ClansEntity,
  selectAllClans,
  categoriesActions,
  ChannelsEntity,
  selectAllCategories,
} from '@mezon/store';
import { ICategoryChannel, IChannel, IMessage } from '@mezon/utils';
import { useMezon } from '@mezon/transport';

export function useChat() {
  const { clientRef, sessionRef, socketRef, channelRef } = useMezon();
  const { channels } = useChannels();
  // const { clans } = useClans();
  const { threads } = useThreads();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ChannelsEntities = useSelector(selectChannelsEntities);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const chanEntities = useSelector(selectClansEntities);
  const clans = useSelector(selectAllClans);
  const currentClan = useSelector(selectCurrentClan);
  const currentChanel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentClanId = useSelector(selectCurrentClanId);
  const categories = useSelector(selectAllCategories)
  const { messages } = useMessages({ channelId: currentChannelId });

  const client = clientRef.current;
  
  const dispatch = useAppDispatch();

  const categorizedChannels = React.useMemo(() => {
    const results = categories.map((category) => {
      const categoryChannels = channels.filter(
        (channel) => channel && channel?.category_id === category.id
      ) as IChannel[];
      return {
        ...category,
        channels: categoryChannels,
      };
    });

    return results as ICategoryChannel[];
  }, [channels, categories]);

  const fetchMessageChannel = React.useCallback(
    async (channelId:string) => {
      const action = await dispatch(messagesActions.fetchMessages({channelId}));
      return action;
    },
    [dispatch]
  );


  const changeCurrentChannel = React.useCallback(
    async (channelId: string) => {
      await dispatch(channelsActions.joinChanel(channelId));
      await fetchMessageChannel(channelId)
    },
    [dispatch, fetchMessageChannel]
  );

  const fetchChannels = React.useCallback(
    async (clanId:string) => {
      console.log('fetchChannels', clanId)
      const action = await  dispatch(channelsActions.fetchChannels({clanId}))
      const payload = action.payload as ChannelsEntity[];
      if (payload.length > 0) {
        const defaultChannelId = payload[0].id;
       changeCurrentChannel(defaultChannelId);
      }
      return payload;
    },
    [changeCurrentChannel, dispatch]
  );

  const fetchCategories = React.useCallback(
    async (clanId:string) => {
      console.log('fetchCategories', clanId)
      const action = await  dispatch(categoriesActions.fetchCategories({clanId}))
      return action.payload;
    },
    [dispatch]
  );

  const changeCurrentClan = React.useCallback(
    async (clanId: string) => {
      console.log('changeCurrentClan', clanId)
      await dispatch(clansActions.changeCurrentClan(clanId));
      await fetchCategories(clanId)
      await fetchChannels(clanId)
    },
    [dispatch, fetchCategories, fetchChannels]
  );
  const fetchClans = React.useCallback(
    async () => {
      console.log('fetchClans')
      const action = await dispatch(clansActions.fetchClans());

      const payload = action.payload as ClansEntity[];
      if (payload.length > 0) {
        const defaultClanId = payload[0].id;
        changeCurrentClan(defaultClanId);
      }
      return payload;
    },
    [changeCurrentClan, dispatch]
  );

  const sendMessage = React.useCallback(
    async (message: IMessage) => {
      // TODO: send message to server using nakama client
      const payload = {
        ...message,
        id: Math.random().toString(),
        date: new Date().toLocaleString(),
        user: {
          name: 'My self',
          username: 'myself',
          id: 'myself',
          avatarSm:
            'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png',
        },
      };

      if (!payload.channel_id) {
        payload.channel_id = currentChannelId || '';
      }

      const client = clientRef.current;
      const session = sessionRef.current;
      const socket = socketRef.current;
      const channel = channelRef.current;

      if (!client || !session || !socket || !channel || !currentClanId) {
        console.log(client, session, socket, channel, currentClanId)
        throw new Error('Client is not initialized');
      }

      dispatch(messagesActions.add(payload));

      const ack = await socket.writeChatMessage(currentClanId,  channel.id, payload);
      console.log('Ack:', ack)
    },
    [channelRef, clientRef, currentChannelId, currentClanId, dispatch, sessionRef, socketRef]
  );

  const loginEmail = useCallback(
    async (username: string, password: string) => {
      const action = await dispatch(
        authActions.authenticateEmail({ username, password })
      );
      const session = action.payload;
      dispatch(accountActions.setAccount(session))
    },
    [dispatch]
  );

  const loginByGoogle = useCallback(
    async (token: string) => {
      const action = await dispatch(authActions.authenticateGoogle(token));
      const session = action.payload;
      dispatch(accountActions.setAccount(session))
    },
    [dispatch]
  );

  return useMemo(() => ({
    client,
    channels,
    messages,
    clans,
    threads,
    categorizedChannels,
    currentClan,
    currentChanel,
    currentChannelId,
    currentClanId,
    sendMessage,
    changeCurrentClan,
    changeCurrentChannel,
    loginEmail,
    loginByGoogle,
    fetchClans
  }), [
    client,
    channels,
    messages,
    clans,
    threads,
    categorizedChannels,
    currentClan,
    currentChanel,
    currentChannelId,
    currentClanId,
    sendMessage,
    changeCurrentClan,
    changeCurrentChannel,
    loginEmail,
    loginByGoogle,
    fetchClans
  ]);
}
