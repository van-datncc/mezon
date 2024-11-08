import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { MezonapiListAuditLog } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';
import { memoizeAndTrack } from '../memoize';

export const AUDIT_LOG_FEATURE_KEY = 'auditlog';
const FETCH_AUDIT_LOG_CACHED_TIME = 1000 * 60 * 3;

export interface IAuditLogState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	auditLogData: MezonapiListAuditLog;
}

type getAuditLogListPayload = {
	actionLog: string;
	userId: string;
	clanId: string;
	page: number;
	pageSize: number;
	noCache?: boolean;
};

export const auditLogInitialState: IAuditLogState = {
	loadingStatus: 'not loaded',
	error: null,
	auditLogData: {
		logs: [],
		page: undefined,
		page_size: undefined,
		total_count: undefined
	}
};

export const fetchAuditLogCached = memoizeAndTrack(
	async (mezon: MezonValueContext, actionLog: string, userId: string, clanId?: string, page?: number, page_size?: number) => {
		const response = await mezon.client.listAuditLog(mezon.session, actionLog, userId, clanId, page, page_size);
		return { ...response, time: Date.now() };
	},
	{
		promise: true,
		maxAge: FETCH_AUDIT_LOG_CACHED_TIME,
		normalizer: (args) => {
			// set default value
			return args[1] + args[2] + args[3] + args[4] + args[5] + args[0].session.username;
		}
	}
);

export const auditLogList = createAsyncThunk(
	'auditLog/auditLogList',
	async ({ actionLog, userId, clanId, page, pageSize, noCache }: getAuditLogListPayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			if (noCache) {
				fetchAuditLogCached.clear(mezon, actionLog, userId, clanId, page, pageSize);
			}
			const response = await fetchAuditLogCached(mezon, actionLog, userId, clanId, page, pageSize);
			return response;
		} catch (error: any) {
			const errstream = await error.json();
			return thunkAPI.rejectWithValue(errstream.message);
		}
	}
);

// export const initialAuditLogState: IAuditLogState = auditLogAdapter.getInitialState({
// 	loadingStatus: 'not loaded',
// 	error: null,
// 	auditLogData: {}
// });

export const auditLogSlice = createSlice({
	name: AUDIT_LOG_FEATURE_KEY,
	initialState: auditLogInitialState,
	reducers: {
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(auditLogList.pending, (state: IAuditLogState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(auditLogList.fulfilled, (state: IAuditLogState, action: PayloadAction<any>) => {
				state.loadingStatus = 'loaded';
				state.auditLogData = action.payload;
			})
			.addCase(auditLogList.rejected, (state: IAuditLogState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

export const auditLogReducer = auditLogSlice.reducer;

export const auditLogActions = {
	...auditLogSlice.actions,
	auditLogList
};

export const getAuditLogState = (rootState: { [AUDIT_LOG_FEATURE_KEY]: IAuditLogState }): IAuditLogState => rootState[AUDIT_LOG_FEATURE_KEY];
export const selectAllAuditLog = createSelector(getAuditLogState, (state) => state.auditLogData || []);
