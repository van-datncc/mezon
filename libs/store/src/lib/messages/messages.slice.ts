import { IMessageWithUser } from '@mezon/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { ensureClient, getMezonCtx } from '../helpers';
import { ChannelMessage } from 'vendors/mezon-js/packages/nakama-js/dist';

export const MESSAGES_FEATURE_KEY = 'messages';

/*
 * Update these interfaces according to your requirements.
 */

export const mapMessageChannelToEntity  = (channelMess: ChannelMessage  ) => {
  return {...channelMess, id: channelMess.message_id || '', body: {text: 'Hello world'}, user: null}
}

export interface MessagesEntity extends IMessageWithUser {
  id: string; // Primary ID
}

export interface MessagesState extends EntityState<MessagesEntity, string> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
}

export const messagesAdapter = createEntityAdapter<MessagesEntity>();

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
 *   dispatch(fetchMessages())
 * }, [dispatch]);
 * ```
 */

type fetchMessageChannelPayload = {
  channelId: string
}

export const fetchMessages = createAsyncThunk(
  'messages/fetchStatus',
  async ({channelId} : fetchMessageChannelPayload, thunkAPI) => {
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    const response = await mezon.client.listChannelMessages(mezon.session,channelId, 100,false)
    if(!response.messages) {
      return thunkAPI.rejectWithValue([])
    }
    return response.messages.map(mapMessageChannelToEntity);
  }
);

export const initialMessagesState: MessagesState =
  messagesAdapter.getInitialState({
    loadingStatus: 'not loaded',
    error: null,
  });

export const messagesSlice = createSlice({
  name: MESSAGES_FEATURE_KEY,
  initialState: initialMessagesState,
  reducers: {
    add: messagesAdapter.addOne,
    remove: messagesAdapter.removeOne,
    // ...
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state: MessagesState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchMessages.fulfilled,
        (state: MessagesState, action: PayloadAction<MessagesEntity[]>) => {
          messagesAdapter.setAll(state, action.payload);
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchMessages.rejected, (state: MessagesState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const messagesReducer = messagesSlice.reducer;

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
 *   dispatch(messagesActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const messagesActions = {...messagesSlice.actions, fetchMessages };

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllMessages);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = messagesAdapter.getSelectors();

export const getMessagesState = (rootState: {
  [MESSAGES_FEATURE_KEY]: MessagesState;
}): MessagesState => rootState[MESSAGES_FEATURE_KEY];

export const selectAllMessages = createSelector(getMessagesState, selectAll);

export const selectMessagesEntities = createSelector(
  getMessagesState,
  selectEntities
);


export const selectMessageByChannelId = (channelId?: string | null) => createSelector(
  selectMessagesEntities,
  (entities) => {
    const messages = Object.values(entities);
    return messages.filter((message) => message && message.channel_id === channelId);
  }
);