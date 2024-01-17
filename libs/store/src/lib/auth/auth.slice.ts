import { createSelector, createSlice } from '@reduxjs/toolkit';
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
  vars: string | undefined;
}

export const initialAuthState: AuthState = {
  loadingStatus: 'not loaded',
  session: null,
  isLogin: false,
};

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
});

/*
 * Export reducer for store configuration.
 */
export const authReducer = authSlice.reducer;

export const authActions = authSlice.actions;

export const getAuthState = (rootState: {
  [AUTH_FEATURE_KEY]: AuthState;
}): AuthState => rootState[AUTH_FEATURE_KEY];

export const selectAllAuth = createSelector(
  getAuthState,
  (state: AuthState) => state
);
