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
	roles: IRolesClan[];
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
			return [];
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

export const fetchDeleteRole = createAsyncThunk(

	'DeleteRole/fetchDeleteRole',

	async ({ roleId }: FetchMembersRolePayload, thunkAPI) => {
		try{
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.deleteRole(mezon.session,roleId);
			thunkAPI.dispatch(RolesClanActions.remove(roleId))
			if (!response) {
				return thunkAPI.rejectWithValue([]);
			}
			return response;
		}catch{
			return thunkAPI.rejectWithValue([]);
		}
	},
);



type CreateRolePayload = {
	title: string;
	role_icon?: string;
	display_online?: number;
	description?:string;
	active_permission_ids?: Array<string>,
	add_user_ids?: Array<string>,
	allow_mention?: number,
	clan_id?: string,
	color?: string,
	logo?: string;
};

export const fetchCreateRole = createAsyncThunk(
	'DeleteRole/fetchDeleteRole',
	async ({ title,role_icon, allow_mention, display_online, description, clan_id, color, active_permission_ids, add_user_ids }: CreateRolePayload, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const body = {
			active_permission_ids: active_permission_ids || [],
    		add_user_ids: add_user_ids || [],
    		allow_mention: allow_mention || 0,
    		clan_id: clan_id,
    		color: color || '',
    		description: description || '',
    		display_online: display_online || 0,
    		role_icon: role_icon ||'',
    		title: title,
		}
		const response = await mezon.client.createRole(mezon.session,body);
		if (!response) {
			
			return thunkAPI.rejectWithValue([]);
		}
		return response;
	},
);


export const initialRolesClanState: RolesClanState = RolesClanAdapter.getInitialState({
	loadingStatus: 'not loaded',
	RolesClan: [],
	roleMembers: {},
	roles: [],
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
export const RolesClanActions = { ...RolesClanSlice.actions, fetchRolesClan, fetchMembersRole, fetchDeleteRole };


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