import React, { useCallback, useMemo, useState } from 'react';
import { useChannels } from './useChannels';
import { useChannelMembers } from './useChannelMembers';
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
  channelMembersActions,
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
import { checkMessageSendingAction } from "@mezon/store";

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
  const categories = useSelector(selectAllCategories);
  const { messages } = useMessages({ channelId: currentChannelId });
  const { members } = useChannelMembers({ channelId: currentChannelId });

  const client = clientRef.current;

  const dispatch = useAppDispatch();

  const categorizedChannels = React.useMemo(() => {
    const results = categories.map((category) => {
      const categoryChannels = channels.filter(
        (channel) => channel && channel?.category_id === category.id,
      ) as IChannel[];
      return {
        ...category,
        channels: categoryChannels,
      };
    });

    return results as ICategoryChannel[];
  }, [channels, categories]);

  const fetchMessageChannel = React.useCallback(
    async (channelId: string) => {
      const action = await dispatch(
        messagesActions.fetchMessages({ channelId }),
      );
      return action;
    },
    [dispatch],
  );

  const fetchChannelMembers = React.useCallback(
    async (channelId:string) => {
      const action = await  dispatch(channelMembersActions.fetchChannelMembers({channelId}));
      return action;
    },
    [dispatch]
  );

  const changeCurrentChannel = React.useCallback(
    async (channelId: string) => {
      await dispatch(channelsActions.joinChanel(channelId));
      await fetchMessageChannel(channelId);
      await fetchChannelMembers(channelId);
    },
    [dispatch, fetchMessageChannel, fetchChannelMembers],
  );

  const fetchChannels = React.useCallback(
    async (clanId: string) => {
      console.log('fetchChannels', clanId);
      const action = await dispatch(channelsActions.fetchChannels({ clanId }));
      const payload = action.payload as ChannelsEntity[];
      if (payload.length > 0) {
        const defaultChannelId = payload[0].id;
        changeCurrentChannel(defaultChannelId);
      }
      return payload;
    },
    [changeCurrentChannel, dispatch],
  );

  const fetchCategories = React.useCallback(
    async (clanId: string) => {
      console.log('fetchCategories', clanId);
      const action = await dispatch(
        categoriesActions.fetchCategories({ clanId }),
      );
      return action.payload;
    },
    [dispatch],
  );

  const changeCurrentClan = React.useCallback(
    async (clanId: string) => {
      dispatch(channelsActions.changeCurrentChanel(''));
      await dispatch(clansActions.changeCurrentClan(clanId));
      await fetchCategories(clanId);
      await fetchChannels(clanId);
    },
    [dispatch, fetchCategories, fetchChannels],
  );

  const createClans = React.useCallback(
    async (name: string, logoUrl: string) => {
      const action = await dispatch(
        clansActions.createClan({ clan_name: name, logo: logoUrl }),
      );
      const payload = action.payload as ClansEntity;
      return payload;
    },
    [dispatch],
  );

  const fetchClans = React.useCallback(async () => {
    console.log('fetchClans');
    const action = await dispatch(clansActions.fetchClans());

    const payload = action.payload as ClansEntity[];
    if (payload.length > 0) {
      const defaultClanId = payload[0].id;
      changeCurrentClan(defaultClanId);
    }
    return payload;
  }, [changeCurrentClan, dispatch]);
  const [isSent, setIsSent] = useState<boolean>(false);

  const sendMessage = React.useCallback(
    async (message: IMessage) => {
      // TODO: send message to server using nakama client
      const session = sessionRef.current;

      const client = clientRef.current;

      const socket = socketRef.current;
      const channel = channelRef.current;

      if (!client || !session || !socket || !channel || !currentClanId) {
        console.log(client, session, socket, channel, currentClanId);
        throw new Error('Client is not initialized');
      }

      const payload = {
        ...message,
        id: Math.random().toString(),
        date: new Date().toLocaleString(),
        user: {
          name: session.username || '',
          username: session.username || '',
          id: 'myself',
          avatarSm:
            'https://cdn.pixabay.com/photo/2016/11/18/23/38/child-1837375_640.png',
        },
      };
      if (!payload.channel_id) {
        payload.channel_id = currentChannelId || '';
      }
      dispatch(messagesActions.add(payload));
      const ack = await socket.writeChatMessage(
        currentClanId,
        channel.id,
        payload,
      );
      ack && dispatch(checkMessageSendingAction())
    },
    [
      channelRef,
      clientRef,
      currentChannelId,
      currentClanId,
      dispatch,
      sessionRef,
      socketRef,
    ],
  );

  const loginEmail = useCallback(
    async (username: string, password: string) => {
      const action = await dispatch(
        authActions.authenticateEmail({ username, password }),
      );
      const session = action.payload;
      dispatch(accountActions.setAccount(session));
    },
    [dispatch],
  );

  const loginByGoogle = useCallback(
    async (token: string) => {
      const action = await dispatch(authActions.authenticateGoogle(token));
      const session = action.payload;
      dispatch(accountActions.setAccount(session));
    },
    [dispatch],
  );

  return useMemo(
    () => ({
      client,
      channels,
      messages,
      clans,
      threads,
      categorizedChannels,
      members,
      currentClan,
      currentChanel,
      currentChannelId,
      currentClanId,
      sendMessage,
      changeCurrentClan,
      changeCurrentChannel,
      loginEmail,
      loginByGoogle,
      fetchClans,
    }),
    [
      client,
      channels,
      messages,
      clans,
      threads,
      categorizedChannels,
      members,
      currentClan,
      currentChanel,
      currentChannelId,
      currentClanId,
      sendMessage,
      changeCurrentClan,
      changeCurrentChannel,
      loginEmail,
      loginByGoogle,
      fetchClans,
    ],
  );
}