import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { IClan } from '@mezon/utils';
import { ensureClient, getMezonCtx } from '../helpers';
import { ApiClanDesc } from '@heroiclabs/nakama-js/dist/api.gen';
export const CLANS_FEATURE_KEY = 'clans';

/*
 * Update these interfaces according to your requirements.
 */

export interface ClansEntity extends IClan {
  id: string; // Primary ID
}

export const mapClanToEntity  = (clanRes: ApiClanDesc ) => {
  return {...clanRes, id: clanRes.clan_id || ''}
}

export interface ClansState extends EntityState<ClansEntity, string> {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  currentClanId?: string | null;
}

export const clansAdapter = createEntityAdapter<ClansEntity>();

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
 *   dispatch(fetchClans())
 * }, [dispatch]);
 * ```
 */
export const fetchClans = createAsyncThunk<ClansEntity[]>(
  'clans/fetchClans',
  async (_, thunkAPI) => {
 
    const mezon  = ensureClient(getMezonCtx(thunkAPI));
    const response = await mezon.client.listClanDescs(mezon.session, 100, 1, '')
    if(!response.clandesc) {
      return thunkAPI.rejectWithValue([])
    }
    /**
     * Replace this with your custom fetch call.
     * For example, `return myApi.getClanss()`;
     * Right now we just return an empty array.
     */
    
    return response.clandesc.map(mapClanToEntity);
  }
);

export const initialClansState: ClansState = clansAdapter.getInitialState({
  loadingStatus: 'not loaded',
  clans: [],
  error: null,
});

export const clansSlice = createSlice({
  name: CLANS_FEATURE_KEY,
  initialState: initialClansState,
  reducers: {
    add: clansAdapter.addOne,
    remove: clansAdapter.removeOne,
    changeCurrentClan: (state, action: PayloadAction<string>) => {
      state.currentClanId = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchClans.pending, (state: ClansState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchClans.fulfilled,
        (state: ClansState, action: PayloadAction<IClan[]>) => {
          clansAdapter.setAll(state,action.payload)
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchClans.rejected, (state: ClansState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

/*
 * Export reducer for store configuration.
 */
export const clansReducer = clansSlice.reducer;

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
 *   dispatch(clansActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const clansActions = 
{...clansSlice.actions, fetchClans }

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllClans);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = clansAdapter.getSelectors();

export const getClansState = (rootState: {
  [CLANS_FEATURE_KEY]: ClansState;
}): ClansState => rootState[CLANS_FEATURE_KEY];
export const selectAllClans = createSelector(getClansState, selectAll);
export const selectCurrentClanId = createSelector(
  getClansState,
  (state) => state.currentClanId
);

export const selectClansEntities = createSelector(
  getClansState,
  selectEntities
);

export const selectClanById = (id: string) => createSelector(
  selectClansEntities,
  (clansEntities) => clansEntities[id]
);

export const selectLoadingStatus = createSelector(
  getClansState,
  (state) => state.loadingStatus
);

export const selectCurrentClan = createSelector(
  selectClansEntities,
  selectCurrentClanId,
  (clansEntities, clanId) => clanId ? clansEntities[clanId] : null
);