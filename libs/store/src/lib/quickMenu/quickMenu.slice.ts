import { captureSentryError } from '@mezon/logger';
import { LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { Snowflake } from '@theinternetfolks/snowflake';
import { ApiQuickMenuAccess, ApiQuickMenuAccessRequest } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';
import { RootState } from '../store';

export const QUICK_MENU_FEATURE_KEY = 'quickMenu';

export interface QuickMenuState {
	byChannels: Record<string, ApiQuickMenuAccess[]>;
	timestamps: Record<string, number>;
	loadingStatus: LoadingStatus;
	error?: string | null;
}

export const initialQuickMenuState: QuickMenuState = {
	byChannels: {},
	timestamps: {},
	loadingStatus: 'not loaded',
	error: null
};

export const addQuickMenuAccess = createAsyncThunk(
	'quickMenu/addQuickMenuAccess',
	async (body: ApiQuickMenuAccessRequest & { channelId: string; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const data = {
				id: Snowflake.generate(),
				bot_id: '0',
				channel_id: body.channelId,
				clan_id: body.clanId,
				menu_name: body.menu_name,
				action_msg: body.action_msg || ''
			};
			const response = await mezon.client.addQuickMenuAccess(mezon.session, data);
			if (response) {
				return { data, channelId: body.channelId };
			}
			return { data: null, channelId: body.channelId };
		} catch (error) {
			captureSentryError(error, 'quickMenu/addQuickMenuAccess');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const updateQuickMenuAccess = createAsyncThunk(
	'quickMenu/updateQuickMenuAccess',
	async (body: ApiQuickMenuAccessRequest & { channelId: string; clanId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const data = {
				id: body.id,
				bot_id: '0',
				channel_id: body.channelId,
				clan_id: body.clanId,
				menu_name: body.menu_name,
				action_msg: body.action_msg || ''
			};
			const response = await mezon.client.updateQuickMenuAccess(mezon.session, data);
			if (response) {
				return { data, channelId: body.channelId };
			}
			return { data: null, channelId: body.channelId };
		} catch (error) {
			captureSentryError(error, 'quickMenu/updateQuickMenuAccess');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const deleteQuickMenuAccess = createAsyncThunk(
	'quickMenu/deleteQuickMenuAccess',
	async ({ id, channelId }: { id: string; channelId: string }, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			await mezon.client.deleteQuickMenuAccess(mezon.session, id);
			return { id, channelId };
		} catch (error) {
			captureSentryError(error, 'quickMenu/deleteQuickMenuAccess');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const listQuickMenuAccess = createAsyncThunk('quickMenu/listQuickMenuAccess', async ({ channelId }: { channelId: string }, thunkAPI) => {
	try {
		const state = thunkAPI.getState() as RootState;
		const quickMenuState = getQuickMenuState(state);

		const cachedData = quickMenuState.byChannels[channelId];
		const lastFetchTime = quickMenuState.timestamps[channelId];
		const now = Date.now();
		const CACHE_DURATION = 5 * 60 * 1000;

		if (cachedData && lastFetchTime && now - lastFetchTime < CACHE_DURATION) {
			return { channelId, quickMenuItems: cachedData, fromCache: true };
		}

		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.listQuickMenuAccess(mezon.session, '0', channelId);

		return { channelId, quickMenuItems: response.list_menus || [], fromCache: false };
	} catch (error) {
		captureSentryError(error, 'quickMenu/listQuickMenuAccess');
		return thunkAPI.rejectWithValue(error);
	}
});

export const quickMenuSlice = createSlice({
	name: QUICK_MENU_FEATURE_KEY,
	initialState: initialQuickMenuState,
	reducers: {
		clearQuickMenuByChannel: (state, action: PayloadAction<string>) => {
			const channelId = action.payload;
			delete state.byChannels[channelId];
			delete state.timestamps[channelId];
		},
		clearAllQuickMenu: (state) => {
			state.byChannels = {};
			state.timestamps = {};
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(listQuickMenuAccess.pending, (state) => {
				state.loadingStatus = 'loading';
			})
			.addCase(listQuickMenuAccess.fulfilled, (state, action) => {
				state.loadingStatus = 'loaded';
				const { channelId, quickMenuItems, fromCache } = action.payload;
				state.byChannels[channelId] = quickMenuItems;

				if (!fromCache) {
					state.timestamps[channelId] = Date.now();
				}
			})
			.addCase(listQuickMenuAccess.rejected, (state, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			})
			.addCase(addQuickMenuAccess.pending, (state) => {
				state.loadingStatus = 'loading';
			})
			.addCase(addQuickMenuAccess.fulfilled, (state, action) => {
				state.loadingStatus = 'loaded';
				const { channelId, data } = action.payload;
				if (data) {
					state.byChannels[channelId].push(data);
				}
			})
			.addCase(addQuickMenuAccess.rejected, (state, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			})
			.addCase(updateQuickMenuAccess.pending, (state) => {
				state.loadingStatus = 'loading';
			})
			.addCase(updateQuickMenuAccess.fulfilled, (state, action) => {
				state.loadingStatus = 'loaded';
				const { channelId, data } = action.payload;
				if (data) {
					const indexUpdate = state.byChannels[channelId].findIndex((item) => item.id === data.id);
					state.byChannels[channelId][indexUpdate] = data;
				}
			})
			.addCase(updateQuickMenuAccess.rejected, (state, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			})
			.addCase(deleteQuickMenuAccess.pending, (state) => {
				state.loadingStatus = 'loading';
			})
			.addCase(deleteQuickMenuAccess.fulfilled, (state, action) => {
				state.loadingStatus = 'loaded';
				const { channelId, id } = action.payload;
				if (state.byChannels[channelId]) {
					state.byChannels[channelId] = state.byChannels[channelId].filter((item) => item.id !== id);
				}
			})
			.addCase(deleteQuickMenuAccess.rejected, (state, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

export const quickMenuReducer = quickMenuSlice.reducer;

export const quickMenuActions = {
	...quickMenuSlice.actions,
	addQuickMenuAccess,
	updateQuickMenuAccess,
	deleteQuickMenuAccess,
	listQuickMenuAccess
};

export const getQuickMenuState = (rootState: { [QUICK_MENU_FEATURE_KEY]: QuickMenuState }): QuickMenuState => rootState[QUICK_MENU_FEATURE_KEY];

export const selectQuickMenuByChannelId = createSelector(
	[getQuickMenuState, (_state: RootState, channelId: string) => channelId],
	(quickMenuState, channelId) => quickMenuState?.byChannels?.[channelId] || []
);

export const selectQuickMenuLoadingStatus = createSelector(getQuickMenuState, (state) => state?.loadingStatus || 'not loaded');

export const selectQuickMenuError = createSelector(getQuickMenuState, (state) => state?.error || null);
