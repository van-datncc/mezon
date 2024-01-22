import { IChannelMember } from '@mezon/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ensureClient, getMezonCtx } from '../helpers';
import { ChannelUserListChannelUser } from '@heroiclabs/nakama-js/dist/api.gen';

export const CHANNEL_MEMBERS_FEATURE_KEY = 'channels';

/*
 * Update these interfaces according to your requirements.
 */
export interface ChannelMembersEntity extends IChannelMember {
  id: string; // Primary ID
}

export const mapChannelMemberToEntity  = (channelRes: ChannelUserListChannelUser) => {
  return {...channelRes}
}


export interface ChannelMembersState extends EntityState<ChannelMembersEntity, string> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  currentChannelId?: string | null;
}

export const channelMembersAdapter = createEntityAdapter<ChannelMembersEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
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
 *   dispatch(fetchChannels())
 * }, [dispatch]);
 * ```
 */
type fetchChannelMembersPayload = {
  channelId: string
}

export const fetchChannelMembers = createAsyncThunk(
  'channelMembers/fetchStatus',
  async ({channelId} : fetchChannelMembersPayload, thunkAPI) => {
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    const response = await mezon.client.listChannelUsers(mezon.session, channelId, 1, 20, "")
    if(!response.channel_users) {
      return thunkAPI.rejectWithValue([])
    }
    return response.channel_users.map(mapChannelMemberToEntity);
  }
);

export const initialChannelMembersState: ChannelMembersState =
channelMembersAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const channelMembers = createSlice({
  name: CHANNEL_MEMBERS_FEATURE_KEY,
  initialState: initialChannelMembersState,
  reducers: {
    add: channelMembersAdapter.addOne,
    remove: channelMembersAdapter.removeOne,
    changeCurrentChanel: (state, action: PayloadAction<string>) => {
      state.currentChannelId = action.payload;
    }
  },
  // extraReducers: (builder) => {
  //   builder
  //     .addCase(fetchChannelMembers.pending, (state:ChannelMembersState) => {
  //       state.loadingStatus = 'loading';
  //     })
  //     .addCase(
  //       fetchChannelMembers.fulfilled,
  //       (state: ChannelMembersState, action: PayloadAction<IChannelMember[]>) => {
  //         channelMembersAdapter.setAll(state, action.payload);
  //         state.loadingStatus = 'loaded';
  //       }
  //     )
  //     .addCase(fetchChannelMembers.rejected, (state: ChannelMembersState, action) => {
  //       state.loadingStatus = 'error';
  //       state.error = action.error.message;
  //     });
  // },
});

/*
 * Export reducer for store configuration.
 */
export const channelMembersReducer = channelMembers.reducer;

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
export const channelMembersActions = {...channelMembers.actions, fetchChannelMembers};

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
const { selectAll, selectEntities } = channelMembersAdapter.getSelectors();

export const getChannelMembersState = (rootState: {
  [CHANNEL_MEMBERS_FEATURE_KEY]: ChannelMembersState;
}): ChannelMembersState => rootState[CHANNEL_MEMBERS_FEATURE_KEY];

export const selectAllChannelMembers = createSelector(getChannelMembersState, selectAll);

export const selectChannelMembersEntities = createSelector(
  getChannelMembersState,
  selectEntities
);

// export const selectChannelById = (id: string) => createSelector(
//   selectChannelMembersEntities,
//   (clansEntities) => clansEntities[id]
// );

// export const selectCurrentChannelId = createSelector(
//   getChannelMembersState,
//   (state) => state.currentChannelId
// );

// export const selectCurrentChannel = createSelector(
//   selectChannelMembersEntities,
//   selectCurrentChannelId,
//   (clansEntities, clanId) => clanId ? clansEntities[clanId] : null
// );