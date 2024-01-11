import {
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';

export const ACCOUNT_FEATURE_KEY = 'account';

export interface AccountState {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
}

export const initialAccountState: AccountState = {
  loadingStatus: 'not loaded',
}

export const accountSlice = createSlice({
  name: ACCOUNT_FEATURE_KEY,
  initialState: initialAccountState,
  reducers: {

  },
});

/*
 * Export reducer for store configuration.
 */
export const accountReducer = accountSlice.reducer;

export const accountActions = accountSlice.actions;


export const getAccountState = (rootState: {
  [ACCOUNT_FEATURE_KEY]: AccountState;
}): AccountState => rootState[ACCOUNT_FEATURE_KEY];

export const selectAllAccount = createSelector(getAccountState, (state: AccountState) => state);