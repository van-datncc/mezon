import {
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

export const AUTH_FEATURE_KEY = 'auth';

export interface AuthState {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
}

export const initialAuthState: AuthState = {
  loadingStatus: 'not loaded',
}

export const authSlice = createSlice({
  name: AUTH_FEATURE_KEY,
  initialState: initialAuthState,
  reducers: {

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

export const selectAllAuth = createSelector(getAuthState, (state: AuthState) => state);