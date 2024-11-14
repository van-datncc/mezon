import { captureSentryError } from '@mezon/logger';
import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { ApiAuditLog, MezonapiListAuditLog } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';
import { memoizeAndTrack } from '../memoize';

export const AUDIT_LOG_FEATURE_KEY = 'auditlog';
const FETCH_AUDIT_LOG_CACHED_TIME = 1000 * 60 * 3;

export interface AuditLogEntity extends ApiAuditLog {
	id: string;
}

export interface IAuditLogState extends EntityState<AuditLogEntity, string> {
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

export const auditLogAdapter = createEntityAdapter({
	selectId: (auditLog: AuditLogEntity) => auditLog.id || ''
});

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
		} catch (error) {
			captureSentryError(error, 'attachment/fetchChannelAttachments');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const initialAuditLogState: IAuditLogState = auditLogAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	auditLogData: {}
});

export const auditLogSlice = createSlice({
	name: AUDIT_LOG_FEATURE_KEY,
	initialState: initialAuditLogState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(auditLogList.pending, (state: IAuditLogState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(auditLogList.fulfilled, (state: IAuditLogState, action: PayloadAction<MezonapiListAuditLog>) => {
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

const { selectAll, selectById, selectEntities } = auditLogAdapter.getSelectors();
export const getAuditLogState = (rootState: { [AUDIT_LOG_FEATURE_KEY]: IAuditLogState }): IAuditLogState => rootState[AUDIT_LOG_FEATURE_KEY];
export const selectAllAuditLog = createSelector(getAuditLogState, selectAll);
export const selectAllAuditLogData = createSelector(getAuditLogState, (state) => {
	return state.auditLogData || [];
});
