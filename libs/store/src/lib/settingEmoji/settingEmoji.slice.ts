import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ApiClanEmojiCreateRequest, ApiClanEmojiList, ApiClanEmojiListResponse, MezonUpdateClanEmojiByIdBody } from 'mezon-js/api.gen';
import { StickersEntity } from '../giftStickerEmojiPanel/stickers.slice';
import { ensureSession, getMezonCtx } from '../helpers';

export const SETTING_CLAN_EMOJI = 'settingEmoji';

export interface SettingClanEmojiState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listEmoji: Array<ApiClanEmojiListResponse>;
}

type UpdateEmojiRequest = {
	request: MezonUpdateClanEmojiByIdBody;
	emojiId: string;
};

export const initialSettingClanEmojiState: SettingClanEmojiState = {
	loadingStatus: 'not loaded',
	error: null,
	listEmoji: [],
};

export const emojiAdapter = createEntityAdapter<StickersEntity>();

export const fetchEmojisByClanId = createAsyncThunk('settingClanEmoji/fetchClanEmoji', async (clanId: string, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await mezon.client.listClanEmoji(mezon.session, clanId);
		return response;
	} catch (error) {
		return thunkAPI.rejectWithValue([]);
	}
});

export const createEmoji = createAsyncThunk(
	'settingClanEmoji/createEmoji',
	async (form: { request: ApiClanEmojiCreateRequest; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const res = await mezon.client.createClanEmoji(mezon.session, form.request);
			if (res) {
				thunkAPI.dispatch(fetchEmojisByClanId(form.clanId));
			} else {
				return thunkAPI.rejectWithValue({});
			}
		} catch (error) {
			return thunkAPI.rejectWithValue({});
		}
	},
);

export const updateEmoji = createAsyncThunk('settingClanEmoji/updateEmoji', async ({ request, emojiId }: UpdateEmojiRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.updateClanEmojiById(mezon.session, emojiId, request);
		if (res) {
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
	}
});

export const deleteEmoji = createAsyncThunk('settingClanEmoji/deleteEmoji', async (emoji: ApiClanEmojiListResponse, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.deleteByIdClanEmoji(mezon.session, emoji.id || '');
		if (res) {
			return emoji;
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
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
		builder
			.addCase(updateEmoji.fulfilled, (state: SettingClanEmojiState, action) => {})
			.addCase(deleteEmoji.fulfilled, (state: SettingClanEmojiState, action) => {
				if (action.payload) {
					state.listEmoji = state.listEmoji.filter((emoji) => emoji.id !== action.payload?.id);
				}
			});
	},
});

export const { selectAll, selectEntities } = emojiAdapter.getSelectors();

export const getEmojiSettingState = (rootState: { [SETTING_CLAN_EMOJI]: SettingClanEmojiState }): SettingClanEmojiState => rootState[SETTING_CLAN_EMOJI];
export const selectAllEmoji = createSelector(getEmojiSettingState, (state) => state?.listEmoji);
export const selectEmojiLoading = createSelector(getEmojiSettingState, (state) => state?.loadingStatus);
export const settingClanEmojiReducer = settingClanEmojiSlice.reducer;
export const settingClanEmojiActions = { ...settingClanEmojiSlice.actions, fetchEmojisByClanId, createEmoji, updateEmoji, deleteEmoji };
