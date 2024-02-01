import { IChannel, LoadingStatus } from '@mezon/utils';
import {
  createAsyncThunk,
  createEntityAdapter,
  createSelector,
  createSlice,
  EntityState,
} from '@reduxjs/toolkit';

export const DIRECT_FEATURE_KEY = 'direct';

export interface DirectEntity extends IChannel {
  id: string;
}

export interface DirectState extends EntityState<DirectEntity, string> {
  loadingStatus: LoadingStatus;
  socketStatus: LoadingStatus;
  error?: string | null;
  currentDirectMessageId?: string | null;
}

export interface DirectRootState {
  [DIRECT_FEATURE_KEY]: DirectState;
}

export const directAdapter = createEntityAdapter<DirectEntity>();


export const joinDirectMessage = createAsyncThunk(
  'channels/joinChanel',
  async (userId: string, thunkAPI) => {
  }
);

export const fetchDirectMessage = createAsyncThunk(
  'channels/fetchChannels',
  async (_ , thunkAPI) => {

  },
);

export const initialDirectState: DirectState =
  directAdapter.getInitialState({
    loadingStatus: 'not loaded',
    socketStatus: 'not loaded',
    error: null,
  });

export const directSlice = createSlice({
  name: DIRECT_FEATURE_KEY,
  initialState: initialDirectState,
  reducers: {
    add: directAdapter.addOne,
    remove: directAdapter.removeOne,
    //...action
  },
  // builder....
});

export const directReducer = directSlice.reducer;


export const directActions = {
  ...directSlice.actions,
  fetchDirectMessage,
  joinDirectMessage,
};

const { selectAll } = directAdapter.getSelectors();

export const getDirectState = (rootState: {
  [DIRECT_FEATURE_KEY]: DirectState;
}): DirectState => rootState[DIRECT_FEATURE_KEY];

export const selectAllDirectMessages = createSelector(getDirectState, selectAll);



