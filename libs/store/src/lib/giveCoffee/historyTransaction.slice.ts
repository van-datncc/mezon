import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiWalletLedger } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const WALLET_LEDGER_FEATURE_KEY = 'walletLedger';

export interface WalletLedgerState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	walletLedger?: ApiWalletLedger[] | null;
	count?: number;
}

export const fetchListWalletLedger = createAsyncThunk('walletLedger/fetchList', async ({ page }: { page?: number }, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.listWalletLedger(mezon.session, 8, '', '', page);
	return {
		ledgers: response.wallet_ledger || [],
		count: response.count || 0
	};
});

export const initialWalletLedgerState: WalletLedgerState = {
	loadingStatus: 'not loaded',
	error: null,
	walletLedger: null,
	count: 0
};

export const walletLedgerSlice = createSlice({
	name: WALLET_LEDGER_FEATURE_KEY,
	initialState: initialWalletLedgerState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(fetchListWalletLedger.pending, (state: WalletLedgerState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchListWalletLedger.fulfilled, (state: WalletLedgerState, action) => {
				state.walletLedger = action.payload.ledgers;
				state.count = action.payload.count;
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchListWalletLedger.rejected, (state: WalletLedgerState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

export const getWalletLedgerState = (rootState: { [WALLET_LEDGER_FEATURE_KEY]: WalletLedgerState }): WalletLedgerState =>
	rootState[WALLET_LEDGER_FEATURE_KEY];
export const walletLedgerReducer = walletLedgerSlice.reducer;
export const selectWalletLedger = createSelector(getWalletLedgerState, (state) => state.walletLedger);
export const selectCountWalletLedger = createSelector(getWalletLedgerState, (state) => state.count);
