import { RoleUserListRoleUser } from '@mezon/mezon-js/dist/api.gen';
import { IUsersRole, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
export const LIST_MEMBERS_ROLE_FEATURE_KEY = 'membersRole';

/*
 * Update these interfaces according to your requirements.
 */

export interface MembersRoleEntity extends IUsersRole {
	id: string; // Primary ID
}

export const mapMembersRoleToEntity = (MembersRoleRes: RoleUserListRoleUser) => {
	const id = (MembersRoleRes as unknown as any).id;
	return { ...MembersRoleRes, id };
};

export interface MembersRoleState extends EntityState<MembersRoleEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	MembersRoleId?: string | null;
}

export const MembersRoleAdapter = createEntityAdapter<MembersRoleEntity>();

type fetchMembersRolePayload = {
	roleId: string;
};
export const fetchMembersRole = createAsyncThunk(
	'MembersRole/fetchMembersRole',
	async ({ roleId }: fetchMembersRolePayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.listRoleUsers(mezon.session,roleId, 100,'');
		if (!response.role_users) {
			return thunkAPI.rejectWithValue([]);
		}
		return response.role_users.map(mapMembersRoleToEntity);
	},
);

export const initialMembersRoleState: MembersRoleState = MembersRoleAdapter.getInitialState({
	loadingStatus: 'not loaded',
	MembersRole: [],
	error: null,
});

export const MembersRoleSlice = createSlice({
	name: LIST_MEMBERS_ROLE_FEATURE_KEY,
	initialState: initialMembersRoleState,
	reducers: {
		add: MembersRoleAdapter.addOne,
		remove: MembersRoleAdapter.removeOne,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchMembersRole.pending, (state: MembersRoleState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchMembersRole.fulfilled, (state: MembersRoleState, action: PayloadAction<IUsersRole[]>) => {
				MembersRoleAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})

			.addCase(fetchMembersRole.rejected, (state: MembersRoleState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const MembersRoleReducer = MembersRoleSlice.reducer;

export const MembersRoleActions = { ...MembersRoleSlice.actions, fetchMembersRole };

const { selectAll } = MembersRoleAdapter.getSelectors();

export const getMembersRoleState = (rootState: { [LIST_MEMBERS_ROLE_FEATURE_KEY]: MembersRoleState }): MembersRoleState =>
	rootState[LIST_MEMBERS_ROLE_FEATURE_KEY];

export const selectAllMembersRole = createSelector(getMembersRoleState, selectAll);
