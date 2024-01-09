import { useChannels } from './useChannels';
import { useMessages } from './useMessages';
import { useClans } from './useClans';
import { useThreads } from './useThreads';
import { useNakama } from '@mezon/transport';
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  selectChannelsEntities,
  selectCurrentChannel,
  selectCurrentChannelId,
  clansActions,
  channelsActions,
  selectCurrentClan,
  selectClansEntities,
} from '@mezon/store';
import { IChannel } from '@mezon/utils';

export function useChat() {
  const { client } = useNakama();
  const { channels } = useChannels();
  const { clans } = useClans();
  const { threads } = useThreads();
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const ChannelsEntities = useSelector(selectChannelsEntities);
  const chanEntities = useSelector(selectClansEntities);
  
  
  const currentClan = useSelector(selectCurrentClan);
  const currentChanel = useSelector(selectCurrentChannel);
  const currentChannelId = useSelector(selectCurrentChannelId);
  
  const { messages } = useMessages({ channelId: currentChannelId });

  const dispatch = useDispatch();

  const categorizedChannels = React.useMemo(() => {
    const categories = currentClan?.categories || [];

    const results = categories.map((category) => {
      const categoryChannels = channels
        .filter(
          (channel) => channel && channel?.categoryId === category.id
        ) as IChannel[];

      return {
        ...category,
        channels: categoryChannels,
      };
    });

    return results;
  }, [currentClan, channels]);

  const changeCurrentClan = React.useCallback((optionalId?: string) => {
    let clanId = optionalId;
    if (!clanId) {
      clanId = clans[0]?.id;
    }
    if (!clanId) {
      return;
    }
    const clan =  chanEntities[clanId]
    if (!clan) {
      return;
    }
    const channelIds = clan.channelIds || [];

    dispatch(clansActions.changeCurrentClan(clanId));

    const channelId = channelIds[0];
    if (!channelId) {
      return;
    }
    dispatch(channelsActions.changeCurrentChanel(channelId));
  }, [clans, chanEntities, dispatch]);

  const changeCurrentChannel = React.useCallback((optionalId?: string) => {
    let channelId = optionalId;
    if (!channelId) {
      channelId = channels[0]?.id;
    }
    if (!channelId) {
      return;
    }

    dispatch(channelsActions.changeCurrentChanel(channelId));
  }, [channels, dispatch]);

    React.useEffect(() => {
        if(!currentClan) {
            return
        }
        const channels = currentClan.channelIds || []
        if(!channels.length) {
            return
        }
        const channelId = channels[0]
        if(!channelId) {
            return
        }
        dispatch(channelsActions.changeCurrentChanel(channelId))
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
    changeCurrentClan,
    changeCurrentChannel,
  };
}
