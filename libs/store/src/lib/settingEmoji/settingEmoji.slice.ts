import { LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiClanEmoji, ApiClanEmojiList } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const SETTING_CLAN_EMOJI = 'settingClanEmoji';

export interface SettingClanEmojiState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listEmoji: Array<ApiClanEmoji>;
}

export const initialSettingClanEmojiState: SettingClanEmojiState = {
	loadingStatus: 'not loaded',
	error: null,
	listEmoji: [],
};
// export const stickersAdapter = createEntityAdapter<StickersEntity>();

export const settingClanEmoji = createAsyncThunk('settingClan/settingClanEmoji', async (clanId,thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await mezon.client.listClanEmoji(mezon.session, '1775732550744936448');

		if (response) {
			thunkAPI.dispatch(settingClanEmojiActions.settingClanEmoji());
		}
    return response;
	} catch (error) {
		return thunkAPI.rejectWithValue([]);
	}
});

export const settingClanEmojiSlice = createSlice({
	name: SETTING_CLAN_EMOJI,
	initialState: initialSettingClanEmojiState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(settingClanEmoji.fulfilled, (state: SettingClanEmojiState, actions: PayloadAction<ApiClanEmojiList>) => {
				state.loadingStatus = 'loaded';
				state.listEmoji = actions.payload.emoji_list ?? [];
			})
			.addCase(settingClanEmoji.pending, (state: SettingClanEmojiState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(settingClanEmoji.rejected, (state: SettingClanEmojiState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const settingClanEmojiReducer = settingClanEmojiSlice.reducer;

export const settingClanEmojiActions = { ...settingClanEmojiSlice.actions, settingClanEmoji };

// export const getSearchMessageState = (rootState: { [SEARCH_MESSAGES_FEATURE_KEY]: SearchMessageState }): SearchMessageState =>rootState[SEARCH_MESSAGES_FEATURE_KEY];

// export const selectIsSearchMessage = createSelector(getSearchMessageState, (state) => state.isSearchMessage);

// export const selectSearchMessagesChannel = createSelector(getSearchMessageState, (state) => state.searchMessagesChannel);

// export const selectCurrentPage = createSelector(getSearchMessageState, (state) => state.currentPage);
