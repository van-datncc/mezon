import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiWalletLedger } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const WALLET_LEDGER_FEATURE_KEY = 'walletLedger';

export interface WalletLedgerState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	walletLedger?: ApiWalletLedger[] | null;
	nextCursor?: string;
	prevCursor?: string;
}

export const fetchListWalletLedger = createAsyncThunk('walletLedger/fetchList', async ({ cursor }: { cursor?: string }, thunkAPI) => {
	const mezon = await ensureSession(getMezonCtx(thunkAPI));
	const response = await mezon.client.listWalletLedger(mezon.session, 8, cursor || '');

	return {
		ledgers: response.wallet_ledger || [],
		nextCursor: response.next_cursor,
		prevCursor: response.prev_cursor
	};
});

export const initialWalletLedgerState: WalletLedgerState = {
	loadingStatus: 'not loaded',
	error: null,
	walletLedger: null,
	nextCursor: undefined,
	prevCursor: undefined
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
				state.nextCursor = action.payload.nextCursor;
				state.prevCursor = action.payload.prevCursor;
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
export const selectWalletLedgerCursors = createSelector(getWalletLedgerState, (state) => ({
	nextCursor: state.nextCursor,
	prevCursor: state.prevCursor
}));
