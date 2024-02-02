import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
  PayloadAction,
} from '@reduxjs/toolkit';
import { LoadingStatus } from '@mezon/utils';
import {ensureSession, getMezonCtx } from '../helpers';
import { Friend } from 'vendors/mezon-js/packages/mezon-js/dist';
export const FRIEND_FEATURE_KEY = 'friends';

export interface FriendsEntity extends Friend {
  id:string
}

export interface IFriend extends Friend {
  id:string
}


export const mapFriendToEntity = (FriendRes: Friend) => {
  return { ...FriendRes, id: FriendRes.user?.id || '' }
}

export interface FriendsState extends EntityState<FriendsEntity, string> {
  loadingStatus: LoadingStatus;
  error?: string | null;
}

export const friendsAdapter = createEntityAdapter<FriendsEntity>();

export const fetchListFriends = createAsyncThunk(
  'friends/fetchListFriends',
  async (_, thunkAPI) => {
 
    const mezon  = await ensureSession(getMezonCtx(thunkAPI));
    const response = await mezon.client.listFriends(mezon.session, 1, 100, '');

    if(!response.friends) {
      return thunkAPI.rejectWithValue([])
    }
    return response.friends.map(mapFriendToEntity);
  }
);

export type requestAddFriendParam = {
  ids?: string[];
  usernames?: string[]
}


export const sendRequestAddFriend = createAsyncThunk(
  'friends/requestFriends',
  async ({ids, usernames} : requestAddFriendParam, thunkAPI) => {
 
    const mezon  = await ensureSession(getMezonCtx(thunkAPI));
    const response = await mezon.client.addFriends(mezon.session,ids,usernames);

    if(!response) {
      return thunkAPI.rejectWithValue([])
    }
    return response;
  }
);

export const initialFriendsState: FriendsState = friendsAdapter.getInitialState({
  loadingStatus: 'not loaded',
  friends: [],
  error: null,
});

export const friendsSlice = createSlice({
  name: FRIEND_FEATURE_KEY,
  initialState: initialFriendsState,
  reducers: {
    add: friendsAdapter.addOne,
    remove: friendsAdapter.removeOne,
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchListFriends.pending, (state: FriendsState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        fetchListFriends.fulfilled,
        (state: FriendsState, action: PayloadAction<IFriend[]>) => {
          friendsAdapter.setAll(state, action.payload)
          state.loadingStatus = 'loaded';
        }
      )
      .addCase(fetchListFriends.rejected, (state: FriendsState, action) => {
        state.loadingStatus = 'error';
        state.error = action.error.message;
      });
  },
});

export const friendsReducer = friendsSlice.reducer;


export const friendsActions = 
{...friendsSlice.actions, fetchListFriends, sendRequestAddFriend}

const { selectAll, selectEntities } = friendsAdapter.getSelectors();

export const getFriendsState = (rootState: {
  [FRIEND_FEATURE_KEY]: FriendsState;
}): FriendsState => rootState[FRIEND_FEATURE_KEY];
export const selectAllFriends = createSelector(getFriendsState, selectAll);