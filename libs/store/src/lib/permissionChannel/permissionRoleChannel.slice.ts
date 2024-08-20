import { IPermissionRoleChannel, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import memoize from 'memoizee';
import { PermissionRoleChannel } from 'mezon-js';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';
import { ApiPermissionUpdate } from 'mezon-js/api.gen';

const LIST_PERMISSION_ROLE_CHANNEL_CACHED_TIME = 1000 * 60 * 3;

export const LIST_PERMISSION_ROLE_CHANNEL_FEATURE_KEY = 'listpermissionroleschannel';

/*
 * Update these interfaces according to your requirements.
 */
export interface PermissionRoleChannelsEntity extends IPermissionRoleChannel {
	id: string; // Primary ID
}

export const mapPermissionRoleChannelToEntity = (permission: PermissionRoleChannel, channelId: string, roleId: string) => {
	const id = `${channelId}${roleId}${permission.permission_id}`;
	return { ...permission, id, channel_id: channelId, role_id: roleId};
};

export interface PermissionRoleChannelState extends EntityState<PermissionRoleChannelsEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
}

export const permissionRoleChannelAdapter = createEntityAdapter<PermissionRoleChannelsEntity>();

export const fetchPermissionRoleChannelCached = memoize(
	async (mezon: MezonValueContext, channel_id: string, role_id: string) => {
		const response = await mezon.socketRef.current?.GetPermissionByRoleIdChannelId(role_id, channel_id);
		return { ...response};
	},
	{
		promise: true,
		maxAge: LIST_PERMISSION_ROLE_CHANNEL_CACHED_TIME,
		normalizer: (args) => {
			return args[1] + args[2] + args[0].session.username || "";
		},
	},
);

type fetchChannelsArgs = {
	channelId: string;
	roleId: string;
	noCache?: boolean;
};

export const fetchPermissionRoleChannel = createAsyncThunk(
	'permissionrolechannel/fetchPermissionRoleChannel',
	async ({ noCache, channelId, roleId}: fetchChannelsArgs, thunkAPI) => {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		if (noCache) {
			fetchPermissionRoleChannelCached.clear(mezon, channelId, roleId);
		}
		const response = await fetchPermissionRoleChannelCached(mezon, channelId, roleId);
		if (!response.permission_role_channel) {
			return [];
		}
		return response.permission_role_channel.map((permission) =>mapPermissionRoleChannelToEntity(permission, channelId, roleId));
	},
);

export type SetPermissionRoleChannel = {
	channelId: string;
	roleId: string;
    permission: Array<ApiPermissionUpdate>;
};

export const setPermissionRoleChannel = createAsyncThunk(
	'permissionrolechannel/setPermissionRoleChannel',
	async ({ channelId, roleId, permission }: SetPermissionRoleChannel, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
            const body = {
                channel_id: channelId,
                role_id: roleId,
                permission_update: permission
            }
			const response = await mezon.client.setRoleChannelPermission(mezon.session, body);
			if (response) {
				await thunkAPI.dispatch(
					fetchPermissionRoleChannel({ channelId: channelId, noCache: true, roleId: roleId }),
				);
			}
		} catch (error) {
			return thunkAPI.rejectWithValue([]);
		}
	},
);

export const initialPermissionRoleChannelState: PermissionRoleChannelState = permissionRoleChannelAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
});

export const permissionRoleChannelSlice = createSlice({
	name: LIST_PERMISSION_ROLE_CHANNEL_FEATURE_KEY,
	initialState: initialPermissionRoleChannelState,
	reducers: {
		add: permissionRoleChannelAdapter.addOne,
		removeAll: permissionRoleChannelAdapter.removeAll,
		remove: permissionRoleChannelAdapter.removeOne,
		update: permissionRoleChannelAdapter.updateOne,
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchPermissionRoleChannel.pending, (state: PermissionRoleChannelState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchPermissionRoleChannel.fulfilled, (state: PermissionRoleChannelState, action: PayloadAction<PermissionRoleChannelsEntity[]>) => {
				permissionRoleChannelAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchPermissionRoleChannel.rejected, (state: PermissionRoleChannelState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const permissionRoleChannelReducer = permissionRoleChannelSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(channelsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */

export const permissionRoleChannelActions = {
	...permissionRoleChannelSlice.actions,
	fetchPermissionRoleChannel,
	setPermissionRoleChannel,
};

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
import { channel } from 'process';
import { mess } from '@mezon/store';
 *
 * // ...
 *
 * const entities = useSelector(selectAllChannels);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = permissionRoleChannelAdapter.getSelectors();

export const getPermissionRoleChannelState = (rootState: { [LIST_PERMISSION_ROLE_CHANNEL_FEATURE_KEY]: PermissionRoleChannelState }): PermissionRoleChannelState => rootState[LIST_PERMISSION_ROLE_CHANNEL_FEATURE_KEY];

export const selectAllPermissionRoleChannel = createSelector(getPermissionRoleChannelState, selectAll);

export const selectPermissionRoleChannelsEntities = createSelector(getPermissionRoleChannelState, selectEntities);

