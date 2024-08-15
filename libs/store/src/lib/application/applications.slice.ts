import { LoadingStatus } from '@mezon/utils';
import { createSlice } from '@reduxjs/toolkit';
import { ApiAppList } from 'mezon-js/api.gen';

export const ADMIN_APPLICATIONS = 'adminApplication';

export interface IApplicationState {
	loadingStatus: LoadingStatus;
	error?: string | null;
	allApps: ApiAppList;
}

export const applicationInitialState: IApplicationState = {
	loadingStatus: 'loading',
	error: null,
	allApps: {
		apps: [],
		next_cursor: undefined,
		total_count: undefined,
	},
};

export const adminApplicationSlice = createSlice({
	name: ADMIN_APPLICATIONS,
	initialState: applicationInitialState,
	reducers: {},
	// extraReducers(builder){
	//     builder.addCase()
	// }
});

export const adminApplicationReducer = adminApplicationSlice.reducer;
