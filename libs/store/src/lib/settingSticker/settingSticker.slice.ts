import { LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';

import memoizee from 'memoizee';
import { ApiClanSticker, ApiClanStickerAddRequest, ApiClanStickerListByClanIdResponse, MezonUpdateClanStickerByIdBody } from 'mezon-js/api.gen';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';

export const SETTING_CLAN_STICKER = 'settingSticker';
const LIST_STICKER_CACHED_TIME = 1000 * 60 * 3;

export interface SettingClanStickerState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	listSticker: Array<ApiClanSticker>;
}

export const initialSettingClanStickerState: SettingClanStickerState = {
	loadingStatus: 'not loaded',
	error: null,
	listSticker: [],
};

export interface FetchStickerArgs {
	clanId: string;
	noCache: boolean;
}
export interface UpdateStickerArgs {
	request: MezonUpdateClanStickerByIdBody;
	stickerId: string;
}
const fetchStickerCached = memoizee((mezon: MezonValueContext, clanId: string) => mezon.client.listClanStickersByClanId(mezon.session, clanId), {
	promise: true,
	maxAge: LIST_STICKER_CACHED_TIME,
	normalizer: (args) => {
		return args[0]!.session!.username!;
	},
});

export const fetchStickerByClanId = createAsyncThunk(
	'settingClanSticker/fetchClanSticker',
	async ({ clanId, noCache }: FetchStickerArgs, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			if (noCache) {
				fetchStickerCached.clear(mezon, clanId);
			}
			const response = await fetchStickerCached(mezon, clanId);
			if (!response.stickers) {
				throw new Error('Emoji list is undefined or null');
			}
			return response;
		} catch (error) {
			return thunkAPI.rejectWithValue([]);
		}
	},
);
export const createSticker = createAsyncThunk(
	'settingClanSticker/createSticker',
	async (form: { request: ApiClanStickerAddRequest; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const res = await mezon.client.addClanSticker(mezon.session, form.request);
			if (res) {
				thunkAPI.dispatch(fetchStickerByClanId({ clanId: form.clanId, noCache: true }));
			} else {
				return thunkAPI.rejectWithValue({});
			}
		} catch (error) {
			return thunkAPI.rejectWithValue({});
		}
	},
);
export const updateSticker = createAsyncThunk('settingClanSticker/updateSticker', async ({ request, stickerId }: UpdateStickerArgs, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.updateClanStickerById(mezon.session, stickerId, request);
		if (res) {
			return { request, stickerId };
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
	}
});
export const deleteSticker = createAsyncThunk('settingClanSticker/deleteSticker', async (stickerId: string, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const res = await mezon.client.deleteClanStickerById(mezon.session, stickerId);
		if (res) {
			return { stickerId };
		}
	} catch (error) {
		return thunkAPI.rejectWithValue({});
	}
});
export const settingClanStickerSlice = createSlice({
	name: SETTING_CLAN_STICKER,
	initialState: initialSettingClanStickerState,
	reducers: {},
	extraReducers(builder) {
		builder
			.addCase(fetchStickerByClanId.fulfilled, (state: SettingClanStickerState, actions: PayloadAction<ApiClanStickerListByClanIdResponse>) => {
				state.loadingStatus = 'loaded';
				state.listSticker = actions.payload.stickers ?? [];
			})
			.addCase(fetchStickerByClanId.pending, (state: SettingClanStickerState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchStickerByClanId.rejected, (state: SettingClanStickerState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(updateSticker.fulfilled, (state: SettingClanStickerState, action) => {
				if (action.payload) {
					const indexUpdateEmoji = state.listSticker.findIndex((sticker) => sticker.id === action.payload?.stickerId);
					state.listSticker[indexUpdateEmoji].shortname = action.payload.request.shortname;
				}
			})
			.addCase(deleteSticker.fulfilled, (state: SettingClanStickerState, action) => {
				if (action.payload) {
					state.listSticker = state.listSticker.filter((sticker) => sticker.id !== action.payload?.stickerId);
				}
			});
	},
});
export const getStickerSettingState = (rootState: { [SETTING_CLAN_STICKER]: SettingClanStickerState }): SettingClanStickerState =>
	rootState[SETTING_CLAN_STICKER];
export const selectListStickerByClanID = createSelector(getStickerSettingState, (state) => state?.listSticker);
export const settingStickerReducer = settingClanStickerSlice.reducer;
export const settingClanStickerActions = { ...settingClanStickerSlice.actions, fetchStickerByClanId };
