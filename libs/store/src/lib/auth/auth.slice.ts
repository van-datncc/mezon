import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { getMezonCtx } from '../helpers';
import { Session } from '@heroiclabs/nakama-js'
export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  session?: ISession | null;
  isLogin?: boolean;
}

export interface ISession {
  created: boolean;
  token: string;
  refreshToken: string;
  createdAt: number;
  refreshExpiresAt: number;
  expiresAt: number;
  username: string;
  userId: string;
  vars: object | undefined;
}

export const initialAuthState: AuthState = {
  loadingStatus: 'not loaded',
  session: null,
  isLogin: false,
};

function normalizeSession(session: Session): ISession {
  return {
    created: session.created,
    token: session.token,
    refreshToken: '',
    createdAt: Date.now(),
    refreshExpiresAt: Date.now(),
    expiresAt: Date.now(),
    username: session.username || '',
    userId: session.user_id || '',
    vars: session.vars,
  };
}

export const authenticateGoogle = createAsyncThunk(
  'auth/authenticateGoogle',
  async (token: string, thunkAPI) => {
    const { client } = getMezonCtx(thunkAPI);
    const session = await client?.authenticateGoogle(token);
    if (!session) {
      return thunkAPI.rejectWithValue('Invalid session');
    }
    return normalizeSession(session);
  }
);

export type AuthenticateEmailPayload = {
  username: string;
  password: string;
}

export const authenticateEmail = createAsyncThunk(
  'auth/authenticateEmail',
  async ({ username, password }: AuthenticateEmailPayload, thunkAPI) => {
    const { client } = getMezonCtx(thunkAPI);
    const session = await client?.authenticateEmail(username, password);
    if (!session) {
      return thunkAPI.rejectWithValue('Invalid session');
    }
    return normalizeSession(session);
  }
);

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
  reducers: {
    setSession(state, action) {
      state.session = action.payload;
      state.isLogin = true;
    },
    logOut(state) {
      state.session = null;
      state.isLogin = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(authenticateGoogle.pending, (state: AuthState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        authenticateGoogle.fulfilled,
        (state: AuthState, action) => {
          state.loadingStatus = 'loaded';
          state.session = action.payload;
          state.isLogin = true;
        }
      )
      .addCase(
        authenticateGoogle.rejected,
        (state: AuthState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        }
      );

    builder
      .addCase(authenticateEmail.pending, (state: AuthState) => {
        state.loadingStatus = 'loading';
      })
      .addCase(
        authenticateEmail.fulfilled,
        (state: AuthState, action) => {
          state.loadingStatus = 'loaded';
          state.session = action.payload;
          state.isLogin = true;
        }
      )
      .addCase(
        authenticateEmail.rejected,
        (state: AuthState, action) => {
          state.loadingStatus = 'error';
          state.error = action.error.message;
        }
      );
  }
});

/*
 * Export reducer for store configuration.
 */
export const authReducer = authSlice.reducer;

export const authActions = {
  ...authSlice.actions,
  authenticateGoogle,
  authenticateEmail,
}

export const getAuthState = (rootState: {
  [AUTH_FEATURE_KEY]: AuthState;
}): AuthState => rootState[AUTH_FEATURE_KEY];

export const selectAllAuth = createSelector(
  getAuthState,
  (state: AuthState) => state
);
