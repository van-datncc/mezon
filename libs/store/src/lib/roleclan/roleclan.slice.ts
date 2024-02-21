import { ApiRole, ApiRoleUserList, RoleUserListRoleUser } from '@mezon/mezon-js/dist/api.gen';
import { IRolesClan, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
// import { MembersRoleActions } from '../getlistmemberinrole/getListMembersInRole.slice';
export const ROLES_CLAN_FEATURE_KEY = 'rolesclan';

/*
 * Update these interfaces according to your requirements.
 */

export interface RolesClanEntity extends IRolesClan {
	id: string; // Primary ID
}

export const mapRolesClanToEntity = (RolesClanRes: ApiRole) => {
	const id = (RolesClanRes as unknown as any).id;
	return { ...RolesClanRes, id };
};

export interface RolesClanState extends EntityState<RolesClanEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	currentRoleId?: string | null;
	roleMembers:Record<string,RoleUserListRoleUser[]> 
}

export const RolesClanAdapter = createEntityAdapter<RolesClanEntity>();

type FetchRolesClanPayload = {
	clanId: string;
};
export const fetchRolesClan = createAsyncThunk(
	'RolesClan/fetchRolesClan',
	async ({ clanId }: FetchRolesClanPayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.listRoles(mezon.session, 100,1,'',clanId);
		if (!response.roles) {
			return thunkAPI.rejectWithValue([]);
		}
		return response.roles.map(mapRolesClanToEntity);
	},
);

type FetchReturnMembersRole ={
	roleID:string
	members:RoleUserListRoleUser[]
}

type FetchMembersRolePayload = {
	roleId: string;
};
export const fetchMembersRole = createAsyncThunk(
	'MembersRole/fetchMembersRole',
	async ({ roleId }: FetchMembersRolePayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.listRoleUsers(mezon.session,roleId, 100,'');
		if (!response.role_users) {
			return thunkAPI.rejectWithValue([]);
		}
		return ({
			roleID: roleId,members:response.role_users
		}) as FetchReturnMembersRole;
	},
);
export const initialRolesClanState: RolesClanState = RolesClanAdapter.getInitialState({
	loadingStatus: 'not loaded',
	RolesClan: [],
	roleMembers: {},
	error: null,
});

export const RolesClanSlice = createSlice({
	name: ROLES_CLAN_FEATURE_KEY,
	initialState: initialRolesClanState,
	reducers: {
		add: RolesClanAdapter.addOne,
		remove: RolesClanAdapter.removeOne,
		setCurrentRoleId: (state, action: PayloadAction<string>) => {
			state.currentRoleId = action.payload;
		},
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchRolesClan.pending, (state: RolesClanState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchRolesClan.fulfilled, (state: RolesClanState, action: PayloadAction<IRolesClan[]>) => {
				RolesClanAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})

			.addCase(fetchRolesClan.rejected, (state: RolesClanState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(fetchMembersRole.fulfilled, (state: RolesClanState, action: PayloadAction<FetchReturnMembersRole>) => {
				state.roleMembers[action.payload.roleID]=(action.payload.members);
			})
	},
});

/*
 * Export reducer for store configuration.
 */
export const RolesClanReducer = RolesClanSlice.reducer;

export const RolesClanActions = { ...RolesClanSlice.actions, fetchRolesClan, fetchMembersRole };


const { selectAll, selectEntities } = RolesClanAdapter.getSelectors();

export const getRolesClanState = (rootState: { [ROLES_CLAN_FEATURE_KEY]: RolesClanState }): RolesClanState =>
	rootState[ROLES_CLAN_FEATURE_KEY];

export const selectAllRolesClan = createSelector(getRolesClanState, selectAll);

export const selectCurrentRoleId = createSelector(getRolesClanState, (state) => state.currentRoleId);

export const selectRolesClanEntities = createSelector(getRolesClanState, selectEntities);

export const selectCurrentRole = createSelector(selectRolesClanEntities, selectCurrentRoleId, (RolesClanEntities, RoleId) =>
RoleId ? RolesClanEntities[RoleId] : null,
);
export const selectAllRoleMember = createSelector(getRolesClanState, (state)=>state.roleMembers);
export const selectMembersByRoleID = (roleID:string)=>{createSelector(selectAllRoleMember, (roleMembers)=>{return roleMembers[roleID]});}