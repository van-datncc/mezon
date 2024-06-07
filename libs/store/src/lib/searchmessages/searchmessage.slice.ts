import { LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiSearchMessageRequest, ApiSearchMessageResponse } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const SEARCH_MESSAGES_FEATURE_KEY = 'searchMessages';

export interface SearchMessageState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	isSearchMessage: boolean;
	searchMessagesChannel: ApiSearchMessageResponse | null;
	currentPage: number;
}

export const initialSearchMessageState = {
	loadingStatus: 'not loaded',
	error: null,
	isSearchMessage: false,
	searchMessagesChannel: {},
	currentPage: 1,
};

export const searchChannelMessages = createAsyncThunk(
	'messages/searchChannelMessages',
	async ({ filters, from, size, sorts }: ApiSearchMessageRequest, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			const response = await mezon.client.searchMessage(mezon.session, { filters, from, size, sorts });

			if (response) {
				thunkAPI.dispatch(searchMessagesActions.setSearchMessages(response));
			}
		} catch (error) {
			return thunkAPI.rejectWithValue([]);
		}
	},
);

export const searchMessageSlice = createSlice({
	name: SEARCH_MESSAGES_FEATURE_KEY,
	initialState: initialSearchMessageState,
	reducers: {
		setIsSearchMessage: (state, action: PayloadAction<boolean>) => {
			state.isSearchMessage = action.payload;
		},
		setSearchMessages: (state, action: PayloadAction<ApiSearchMessageResponse>) => {
			state.searchMessagesChannel = action.payload;
		},
		setCurrentPage: (state, action: PayloadAction<number>) => {
			state.currentPage = action.payload;
		},
	},
});

export const searchMessageReducer = searchMessageSlice.reducer;

export const searchMessagesActions = { ...searchMessageSlice.actions, searchChannelMessages };

export const getSearchMessageState = (rootState: { [SEARCH_MESSAGES_FEATURE_KEY]: SearchMessageState }): SearchMessageState =>
	rootState[SEARCH_MESSAGES_FEATURE_KEY];

export const selectIsSearchMessage = createSelector(getSearchMessageState, (state) => state.isSearchMessage);

export const selectSearchMessagesChannel = createSelector(getSearchMessageState, (state) => state.searchMessagesChannel);

export const selectCurrentPage = createSelector(getSearchMessageState, (state) => state.currentPage);
