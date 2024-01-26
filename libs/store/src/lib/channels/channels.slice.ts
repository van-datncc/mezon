import { IChannel, LoadingStatus } from '@mezon/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ensureClient, getMezonCtx } from '../helpers';
import { ApiChannelDescription, ApiCreateChannelDescRequest } from '@mezon/mezon-js/dist/api.gen';
import { messagesActions } from '../messages/messages.slice';
import { channelMembersActions } from '../channelmembers/channel.members';

export const CHANNELS_FEATURE_KEY = 'channels';

/*
 * Update these interfaces according to your requirements.
 */
export interface ChannelsEntity extends IChannel {
  id: string; // Primary ID
}

export const mapChannelToEntity = (channelRes: ApiChannelDescription) => {
  return { ...channelRes, id: channelRes.channel_id || '' };
};

export interface ChannelsState extends EntityState<ChannelsEntity, string> {
  loadingStatus: LoadingStatus;
  error?: string | null;
  currentChannelId?: string | null;
  isOpenCreateNewChannel?: boolean;
  currentCategoryId: string | undefined;
}

export const channelsAdapter = createEntityAdapter<ChannelsEntity>();


type fetchChannelsPayload = {
  clanId: string;
};

function waitUntil<T>(condition: () => T | undefined, ms: number = 1000): Promise<T> {
  return new Promise((resolve) => {
    const interval = setInterval(() => {
      const result = condition();
      if (result !== undefined) {
        clearInterval(interval);
        resolve(result);
      }
    }, ms);
  });
}

export const joinChanel = createAsyncThunk(
  'channels/joinChanel',
  async (channelId : string, thunkAPI) => {
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    thunkAPI.dispatch(channelsActions.setCurrentChannelId(channelId))

    thunkAPI.dispatch(messagesActions.fetchMessages({channelId}));
    thunkAPI.dispatch(channelMembersActions.fetchChannelMembers({channelId}));

    const chanel = await waitUntil(() =>
      selectChannelById(channelId)(
        thunkAPI.getState() as { [CHANNELS_FEATURE_KEY]: ChannelsState },
      ),
    );
    if (!chanel || !chanel.channel_lable) {
      return thunkAPI.rejectWithValue([]);
    }
    await mezon.joinChatChannel(channelId, chanel?.channel_lable || '')
    
    return chanel;
  }
);

export const createNewChannel = createAsyncThunk(
  'channels/createNewChannel',
  async (body: ApiCreateChannelDescRequest, thunkAPI) => {
    try {
      const mezon = ensureClient(getMezonCtx(thunkAPI));
      const response = await mezon.client.createChannelDesc(
        mezon.session,
        body,
      );
      if (!response) {
        return thunkAPI.rejectWithValue([]);
      }

    } catch (error) {
      return thunkAPI.rejectWithValue([]);
    }
  },
)


export const fetchChannels = createAsyncThunk(
  'channels/fetchStatus',
  async ({clanId} : fetchChannelsPayload, thunkAPI) => {
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    const response = await mezon.client.listChannelDescs(mezon.session, 100,1,'', clanId)

    
    if(!response.channeldesc) {
      return thunkAPI.rejectWithValue([])
    }

    const channels = response.channeldesc.map(mapChannelToEntity);

    if (channels.length > 0) {
      thunkAPI.dispatch(channelsActions.joinChanel(channels[0].id));
    }

    return channels;
  }
);

export const initialChannelsState: ChannelsState =
  channelsAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
    isOpenCreateNewChannel: false,
    currentCategoryId: undefined,
  });

export const channelsSlice = createSlice({
  name: CHANNELS_FEATURE_KEY,
  initialState: initialChannelsState,
  reducers: {
    add: channelsAdapter.addOne,
    remove: channelsAdapter.removeOne,
    setCurrentChannelId: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    },
    openCreateNewModalChannel: (state) => {
      state.isOpenCreateNewChannel = !state.isOpenCreateNewChannel;
    },
    getCurrentCategoryId: (state, action: PayloadAction<string>) => {
      state.currentCategoryId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchChannels.pending, (state: ChannelsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchChannels.fulfilled,
        (state: ChannelsState, action: PayloadAction<ChannelsEntity[]>) => {
          channelsAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        },
      )
      .addCase(fetchChannels.rejected, (state: ChannelsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const channelsReducer = channelsSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(channelsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const { openCreateNewModalChannel } = channelsSlice.actions;

export const channelsActions = {
  ...channelsSlice.actions,
  fetchChannels,
  joinChanel,
};

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllChannels);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = channelsAdapter.getSelectors();

export const getChannelsState = (rootState: {
  [CHANNELS_FEATURE_KEY]: ChannelsState;
}): ChannelsState => rootState[CHANNELS_FEATURE_KEY];

export const selectAllChannels = createSelector(getChannelsState, selectAll);

export const selectChannelsEntities = createSelector(
  getChannelsState,
  selectEntities,
);

export const selectChannelById = (id: string) =>
  createSelector(selectChannelsEntities, (clansEntities) => clansEntities[id]);

export const selectCurrentChannelId = createSelector(
  getChannelsState,
  (state) => state.currentChannelId,
);

export const selectCurrentChannel = createSelector(
  selectChannelsEntities,
  selectCurrentChannelId,
  (clansEntities, clanId) => (clanId ? clansEntities[clanId] : null),
);
