import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { ApiAddAppRequest, ApiAppList } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

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

export const createApplication = createAsyncThunk(
    'adminApplication/createApplication',
    async(data: {request: ApiAddAppRequest}, thunkAPI)=>{
        try{
            const mezon = await ensureSession(getMezonCtx(thunkAPI));
            const response = await mezon.client.addApp(mezon.session, data.request);
            console.log(response);
        }
        catch(err){
            console.log(err);
            return thunkAPI.rejectWithValue({err});
        }
    }
)

export const adminApplicationSlice = createSlice({
	name: ADMIN_APPLICATIONS,
	initialState: applicationInitialState,
	reducers: {},
	// extraReducers(builder){
	//     builder.addCase()
	// }
});

export const adminApplicationReducer = adminApplicationSlice.reducer;
