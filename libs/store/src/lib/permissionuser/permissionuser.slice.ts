import { createAsyncThunk, createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
import { ApiCreateChannelDescRequest, ApiPermission } from '@mezon/mezon-js/dist/api.gen';
import { LoadingStatus, IPermissionUser } from '@mezon/utils';
export const PERMISSION_USER_FEATURE_KEY = 'permissionuser';

/*
 * Update these interfaces according to your requirements.
 */

export interface PermissionUserEntity extends IPermissionUser {
	id: string; // Primary ID
}

export const mapPermissionUserToEntity = (PermissionsUserRes: ApiPermission) => {
	const id = (PermissionsUserRes as unknown as any).id;
	return { ...PermissionsUserRes, id };
};

export interface PermissionsUserState extends EntityState<PermissionUserEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	PermissionsUserId?: string | null;
}

export const PermissionsUserAdapter = createEntityAdapter<PermissionUserEntity>();

type fetchPermissionsUserPayload = {
	clanId: string;
};
export const fetchPermissionsUser = createAsyncThunk(
	'PermissionsUser/fetchPermissionsUser',
	async ({ clanId }: fetchPermissionsUserPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.GetPermissionOfUserInTheClan(mezon.session, clanId);
		if (!response.permissions) {
			return thunkAPI.rejectWithValue([]);
		}
		return response.permissions.map(mapPermissionUserToEntity);
	},
);

export const initialPermissionsUserState: PermissionsUserState = PermissionsUserAdapter.getInitialState({
	loadingStatus: 'not loaded',
	PermissionsUser: [],
	error: null,
});

export const PermissionsUserSlice = createSlice({
	name: PERMISSION_USER_FEATURE_KEY,
	initialState: initialPermissionsUserState,
	reducers: {
		add: PermissionsUserAdapter.addOne,
		remove: PermissionsUserAdapter.removeOne,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPermissionsUser.pending, (state: PermissionsUserState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchPermissionsUser.fulfilled, (state: PermissionsUserState, action: PayloadAction<IPermissionUser[]>) => {
				PermissionsUserAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
				console.log("action.payload.permission: ", action.payload);
			})

			.addCase(fetchPermissionsUser.rejected, (state: PermissionsUserState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const PermissionsUserReducer = PermissionsUserSlice.reducer;

export const PermissionsUserActions = { ...PermissionsUserSlice.actions, fetchPermissionsUser };

const { selectAll, selectEntities } = PermissionsUserAdapter.getSelectors();

export const getPermissionsUserState = (rootState: { 
	[PERMISSION_USER_FEATURE_KEY]: PermissionsUserState 
}): PermissionsUserState => rootState[PERMISSION_USER_FEATURE_KEY];

export const selectAllPermissionsUser = createSelector(getPermissionsUserState, selectAll);
