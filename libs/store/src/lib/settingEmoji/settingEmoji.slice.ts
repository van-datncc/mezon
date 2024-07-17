import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiClanEmojiCreateRequest, ApiClanEmojiList, ApiClanEmojiListResponse, MezonUpdateClanEmojiByIdBody } from 'mezon-js/api.gen';
import { StickersEntity } from '../giftStickerEmojiPanel/stickers.slice';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';

export const SETTING_CLAN_EMOJI = 'settingEmoji';
const LIST_EMOJI_CACHED_TIME = 1000 * 60 * 3;

export interface SettingClanEmojiState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listEmoji: Array<ApiClanEmojiListResponse>;
}

type UpdateEmojiRequest = {
	request: MezonUpdateClanEmojiByIdBody;
	emojiId: string;
};
type FetchEmojiArgs = {
	clanId: string;
	noCache?: boolean;
};

export const initialSettingClanEmojiState: SettingClanEmojiState = {
	loadingStatus: 'not loaded',
	error: null,
	listEmoji: [],
};

export const emojiAdapter = createEntityAdapter<StickersEntity>();
const fetchEmojiCached = memoizee((mezon: MezonValueContext, clanId: string) => mezon.client.listClanEmoji(mezon.session, clanId), {
	promise: true,
	maxAge: LIST_EMOJI_CACHED_TIME,
	normalizer: (args) => {
		return args[0]!.session!.username!;
	},
});

export const fetchEmojisByClanId = createAsyncThunk('settingClanEmoji/fetchClanEmoji', async ({ clanId, noCache }: FetchEmojiArgs, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		if (noCache) {
			fetchEmojiCached.clear(mezon, clanId);
		}
		const response = await fetchEmojiCached(mezon, clanId);
		if (!response.emoji_list) {
			throw new Error('Emoji list is undefined or null');
		}
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
			console.log(res);
			if (res) {
				thunkAPI.dispatch(fetchEmojisByClanId({ clanId: form.clanId, noCache: true }));
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
			return { request, emojiId };
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
			.addCase(updateEmoji.fulfilled, (state: SettingClanEmojiState, action) => {
				if (action.payload) {
					const indexUpdateEmoji = state.listEmoji.findIndex((emoji) => emoji.id === action.payload?.emojiId);
					state.listEmoji[indexUpdateEmoji].shortname = action.payload.request.shortname;
				}
			})
			.addCase(deleteEmoji.fulfilled, (state: SettingClanEmojiState, action) => {
				if (action.payload) {
					state.listEmoji = state.listEmoji.filter((emoji) => emoji.id !== action.payload?.id);
				}
			});
	},
});

export const { selectAll, selectEntities } = emojiAdapter.getSelectors();

export const getEmojiSettingState = (rootState: { [SETTING_CLAN_EMOJI]: SettingClanEmojiState }): SettingClanEmojiState =>
	rootState[SETTING_CLAN_EMOJI];
export const selectAllEmoji = createSelector(getEmojiSettingState, (state) => state?.listEmoji);
export const selectEmojiLoading = createSelector(getEmojiSettingState, (state) => state?.loadingStatus);
export const settingClanEmojiReducer = settingClanEmojiSlice.reducer;
export const settingClanEmojiActions = { ...settingClanEmojiSlice.actions, fetchEmojisByClanId, createEmoji, updateEmoji, deleteEmoji };
