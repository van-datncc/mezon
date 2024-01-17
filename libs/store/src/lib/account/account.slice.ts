import { createSelector, createSlice } from '@reduxjs/toolkit';

export const ACCOUNT_FEATURE_KEY = 'account';
export interface IAccount {
  email: string;
  password: string;
}
export interface AccountState {
  loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
  error?: string | null;
  account?: IAccount | null;
}

export const initialAccountState: AccountState = {
  loadingStatus: 'not loaded',
  account: null,
};

export const accountSlice = createSlice({
  name: ACCOUNT_FEATURE_KEY,
  initialState: initialAccountState,
  reducers: {
    setAccount(state, action) {
      state.account = action.payload;
    },
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

export const selectAllAccount = createSelector(
  getAccountState,
  (state: AccountState) => state
);
