
import React, { useCallback } from 'react';
import { useChannels } from './useChannels';
import { useMessages } from './useMessages';
import { useClans } from './useClans';
import { useThreads } from './useThreads';
import { useMezon } from '@mezon/transport';
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
  selectSession,
  selectAllClans,
  categoriesActions,
  ChannelsEntity,
  selectAllCategories,
  MessagesEntity
} from '@mezon/store';
import { ICategoryChannel, ICategory, IChannel, IMessage } from '@mezon/utils';

export function useChat() {
  const { clientRef, createClient } = useMezon();
  const { channels } = useChannels();
  // const { clans } = useClans();
  const { threads } = useThreads();

  const client = clientRef.current;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ChannelsEntities = useSelector(selectChannelsEntities);
  const chanEntities = useSelector(selectClansEntities);
  const clans = useSelector(selectAllClans);
  const currentClan = useSelector(selectCurrentClan);
  const currentChanel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  const currentClanId = useSelector(selectCurrentClanId);
  const categories = useSelector(selectAllCategories)
  const { messages } = useMessages({ channelId: currentChannelId });
  
  const dispatch = useAppDispatch();

  const categorizedChannels = React.useMemo(() => {
    console.log('Channel', channels)
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
  }, [currentClan, channels, categories]);

  const fetchChannels = React.useCallback(
    async (clanId:string) => {
      const action = await  dispatch(channelsActions.fetchChannels({clanId}))
      console.log('Action:', action)
      const payload = action.payload as ChannelsEntity[];
      if (payload.length > 0) {
        const defaultChannelId = payload[0].id;
       changeCurrentChannel(defaultChannelId);
      }
      return payload;
    },
    [dispatch]
  );

  const changeCurrentClan = React.useCallback(
    (optionalId?: string) => {
      let clanId = optionalId;
      if (!clanId) {
        clanId = clans[0]?.id;
      }
      dispatch(clansActions.changeCurrentClan(clanId));
      dispatch(categoriesActions.fetchCategories({clanId}))
      fetchChannels(clanId)
    },
    [clans, chanEntities,fetchChannels, dispatch]
  );
  const fetchClans = React.useCallback(
    async () => {
      const action = await dispatch(clansActions.fetchClans());

      const payload = action.payload as ClansEntity[];
      if (payload.length > 0) {
        const defaultClanId = payload[0].id;
       changeCurrentClan(defaultClanId);
      }
      return payload;
    },
    [dispatch]
  );

  const fetchMessageChannel = React.useCallback(
    async (channelId:string) => {
      const action = await dispatch(messagesActions.fetchMessages({channelId}));
      return action;
    },
    [dispatch]
  );

  const changeCurrentChannel = React.useCallback(
    (optionalId?: string) => {
      let channelId = optionalId;
      if (!channelId) {
        channelId = channels[0]?.id;
      }
      if (!channelId) {
        return;
      }
      dispatch(channelsActions.changeCurrentChanel(channelId));
      fetchMessageChannel(channelId)
    },
    [channels, dispatch, fetchMessageChannel]
  );

  const sendMessage = React.useCallback(
    (message: IMessage) => {
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

      dispatch(messagesActions.add(payload));
    },
    [currentChannelId, currentClanId, dispatch]
  );

  const init = useCallback(() => {
    createClient();
  }, [createClient]);

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

  React.useEffect(() => {
    if (!currentClan) {
      return;
    }
    const channels = [] as string[];
    if (!channels.length) {
      return;
    }
    const channelId = channels[0];
    if (!channelId) {
      return;
    }
    dispatch(channelsActions.changeCurrentChanel(channelId));
  }, [currentClan, dispatch]);

  return {
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
    init,
    sendMessage,
    changeCurrentClan,
    changeCurrentChannel,
    loginEmail,
    loginByGoogle,
    fetchClans
  };
}
