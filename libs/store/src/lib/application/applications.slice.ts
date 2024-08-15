import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiAddAppRequest, ApiAppList } from 'mezon-js/api.gen';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';

export const ADMIN_APPLICATIONS = 'adminApplication';

export interface IApplicationState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	allApps: ApiAppList;
}

export const applicationInitialState: IApplicationState = {
	loadingStatus: 'not loaded',
	error: null,
	allApps: {
		apps: [],
		next_cursor: undefined,
		total_count: undefined,
	},
};

const FETCH_CACHED_TIME = 3 * 60 * 1000;

export interface IFetchAppsArg {
	noCache: boolean;
}

const fetchApplicationsCached = memoizee((mezon: MezonValueContext) => mezon.client.ListApp(mezon.session), {
	promise: true,
	maxAge: FETCH_CACHED_TIME,
	normalizer: (args) => {
		return args[0].session.username as string;
	},
});

export const fetchApplications = createAsyncThunk('adminApplication/fetchApplications', async ({ noCache }: IFetchAppsArg, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		if (noCache) {
			fetchApplicationsCached.clear(mezon);
		}
		const response = await fetchApplicationsCached(mezon);
		return response;
	} catch (err) {
		console.log(err);
		return thunkAPI.rejectWithValue({});
	}
});

export const createApplication = createAsyncThunk('adminApplication/createApplication', async (data: { request: ApiAddAppRequest }, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.addApp(mezon.session, data.request);
		console.log(response);
	} catch (err) {
		console.log(err);
		return thunkAPI.rejectWithValue({ err });
	}
});

export const adminApplicationSlice = createSlice({
	name: ADMIN_APPLICATIONS,
	initialState: applicationInitialState,
	reducers: {},
	extraReducers(builder) {
		builder.addCase(fetchApplications.fulfilled, (state, action) => {
			state.allApps = action.payload;
			state.loadingStatus = 'loaded';
		});
	},
});

export const adminApplicationReducer = adminApplicationSlice.reducer;
