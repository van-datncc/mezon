import { captureSentryError } from '@mezon/logger';
import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState } from '@reduxjs/toolkit';
import { ApiAuditLog, MezonapiListAuditLog } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';
import { memoizeAndTrack } from '../memoize';

export const SEND_CODE_FEATURE_KEY = 'sendCode';
const FETCH_SEND_CODE_CACHED_TIME = 1000 * 60 * 60;

export interface SendCodeEntity {
	id: string;
}

export interface ISendCodeState extends EntityState<ApiAuditLog, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	codeData: MezonapiListAuditLog;
}

type getCodePayload = {
	code: string;
	noCache?: boolean;
};

export const sendCodeAdapter = createEntityAdapter({
	selectId: (auditLog: ApiAuditLog) => auditLog.id || '',
	sortComparer: (a: ApiAuditLog, b: ApiAuditLog) => {
		if (a.time_log && b.time_log) {
			return Date.parse(b.time_log) - Date.parse(a.time_log);
		}
		return 0;
	}
});

export const fetchSendCodeCached = memoizeAndTrack(
	async (mezon: MezonValueContext, code: string) => {
		// const response = await mezon.client.listAuditLog(mezon.session, code);
		// return { ...response, time: Date.now() };
	},
	{
		promise: true,
		maxAge: FETCH_SEND_CODE_CACHED_TIME,
		normalizer: (args) => {
			// set default value
			return args[1] + args[0].session.username;
		}
	}
);

export const sendCode = createAsyncThunk('code/sendCode', async ({ code, noCache }: getCodePayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		if (noCache) {
			fetchSendCodeCached.clear(mezon, code);
		}
		const response = await fetchSendCodeCached(mezon, code);
		return response;
	} catch (error) {
		captureSentryError(error, 'attachment/fetchChannelAttachments');
		return thunkAPI.rejectWithValue(error);
	}
});

export const initialSendCodeState: ISendCodeState = sendCodeAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	codeData: {}
});

export const sendCodeSlice = createSlice({
	name: SEND_CODE_FEATURE_KEY,
	initialState: initialSendCodeState,
	reducers: {},
	extraReducers: (builder) => {
		// builder
		// 	.addCase(sendCode.pending, (state: ISendCodeState) => {
		// 		state.loadingStatus = 'loading';
		// 	})
		// 	.addCase(sendCode.fulfilled, (state: ISendCodeState, action: PayloadAction<MezonapiListAuditLog>) => {
		// 		state.loadingStatus = 'loaded';
		// 	})
		// 	.addCase(sendCode.rejected, (state: ISendCodeState, action) => {
		// 		state.loadingStatus = 'error';
		// 		state.error = action.error.message;
		// 	});
	}
});

export const sendCodeReducer = sendCodeSlice.reducer;

export const sendCodeActions = {
	...sendCodeSlice.actions,
	sendCode
};

const { selectAll, selectById, selectEntities } = sendCodeAdapter.getSelectors();
export const getSendCodeState = (rootState: { [SEND_CODE_FEATURE_KEY]: ISendCodeState }): ISendCodeState => rootState[SEND_CODE_FEATURE_KEY];
export const selectAllSendCode = createSelector(getSendCodeState, selectAll);
export const selectAllSendCodeData = createSelector(getSendCodeState, (state) => {
	return state.codeData;
});
