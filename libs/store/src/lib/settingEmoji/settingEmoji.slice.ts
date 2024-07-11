import { LoadingStatus } from '@mezon/utils';
import {PayloadAction, createAsyncThunk, createSlice, createEntityAdapter} from '@reduxjs/toolkit';
import { ApiClanEmoji, ApiClanEmojiList } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';
import {StickersEntity} from "../giftStickerEmojiPanel/stickers.slice";

export const SETTING_CLAN_EMOJI = 'emojiSettingClan';

export interface SettingClanEmojiState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listEmoji: Array<ApiClanEmoji>;
}

type fetchEmojiRequest = {
  clanId: number;
}

export const initialSettingClanEmojiState: SettingClanEmojiState = {
	loadingStatus: 'not loaded',
	error: null,
	listEmoji: [],
};
export const emojiAdapter = createEntityAdapter<StickersEntity>();

export const fetchEmojisByClanId = createAsyncThunk('settingClan/settingClanEmoji', async ({clanId}: fetchEmojiRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await mezon.client.listClanEmoji(mezon.session, "1810155153890742272");
    console.log ('emoji: ', response)
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
			.addCase(fetchEmojisByClanId.fulfilled, (state: SettingClanEmojiState, actions: PayloadAction<ApiClanEmojiList>) => {
				state.loadingStatus = 'loaded';
				state.listEmoji = actions.payload.emoji_list ?? [];
			})
			.addCase(fetchEmojisByClanId.pending, (state: SettingClanEmojiState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEmojisByClanId.rejected, (state: SettingClanEmojiState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

export const settingClanEmojiReducer = settingClanEmojiSlice.reducer;

export const settingClanEmojiActions = { ...settingClanEmojiSlice.actions, fetchEmojisByClanId };

// export const getSearchMessageState = (rootState: { [SEARCH_MESSAGES_FEATURE_KEY]: SearchMessageState }): SearchMessageState =>rootState[SEARCH_MESSAGES_FEATURE_KEY];

// export const selectIsSearchMessage = createSelector(getSearchMessageState, (state) => state.isSearchMessage);

// export const selectSearchMessagesChannel = createSelector(getSearchMessageState, (state) => state.searchMessagesChannel);

// export const selectCurrentPage = createSelector(getSearchMessageState, (state) => state.currentPage);

export const { selectAll, selectEntities } = emojiAdapter.getSelectors();