import { ICanvas, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiEditChannelCanvasRequest } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx } from '../helpers';

export const CANVAS_API_FEATURE_KEY = 'canvasapi';

/*
 * Update these interfaces according to your requirements.
 */
export interface CanvasAPIEntity extends ICanvas {
	id: string; // Primary ID
}

export interface CanvasAPIState extends EntityState<ApiEditChannelCanvasRequest, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
}

export const canvasAPIAdapter = createEntityAdapter({
	selectId: (canvas: ApiEditChannelCanvasRequest) => canvas.id || ''
});

// type EditCanvasPayload = {
// 	id: string;
// 	title: string;
// 	content: string;
// };

// type CreateEditPayload = {
// 	clanId: string;
// 	channelId: string;
// 	noFetchMembers?: boolean;
// 	messageId?: string;
// 	isDmGroup?: boolean;
// 	isClearMessage?: boolean;
// };

// type JoinChatPayload = {
// 	clanId: string;
// 	channelId: string;
// 	channelType: number;
// 	isPublic: boolean;
// };

export const createEditCanvas = createAsyncThunk('canvas/editChannelCanvases', async (body: ApiEditChannelCanvasRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await mezon.client.editChannelCanvases(mezon.session, body);
		console.log(response, 'response');
		return response;
	} catch (error: any) {
		const errstream = await error.json();
		return thunkAPI.rejectWithValue(errstream.message);
	}
});

// export const getChannelCanvasDetail = createAsyncThunk(
// 	'canvas/getChannelCanvasDetail',
// 	async ({ id, clan_id, channel_id, limit, page }: CanvasAPIEntity, thunkAPI) => {
// 		try {
// 			const mezon = await ensureSession(getMezonCtx(thunkAPI));

// 			const response = await mezon.client.getChannelCanvasList(mezon.session, channel_id, clan_id, limit, page);

// 			return response;
// 		} catch (error: any) {
// 			const errstream = await error.json();
// 			return thunkAPI.rejectWithValue(errstream.message);
// 		}
// 	}
// );

// export const getChannelCanvasList = createAsyncThunk(
// 	'canvas/getChannelCanvasDetail',
// 	async ({ id, clan_id, channel_id }: ApiEditChannelCanvasRequest, thunkAPI) => {
// 		try {
// 			const mezon = await ensureSession(getMezonCtx(thunkAPI));

// 			const response = await mezon.client.getChannelCanvasDetail(mezon.session, id, clan_id, channel_id);

// 			return response;
// 		} catch (error: any) {
// 			const errstream = await error.json();
// 			return thunkAPI.rejectWithValue(errstream.message);
// 		}
// 	}
// );

export const initialCanvasAPIState: CanvasAPIState = canvasAPIAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null
});

export const canvasAPISlice = createSlice({
	name: CANVAS_API_FEATURE_KEY,
	initialState: initialCanvasAPIState,
	reducers: {
		add: canvasAPIAdapter.addOne,
		addMany: canvasAPIAdapter.addMany,
		remove: canvasAPIAdapter.removeOne
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(createEditCanvas.pending, (state: CanvasAPIState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(createEditCanvas.fulfilled, (state: CanvasAPIState, action: PayloadAction<any>) => {
				state.loadingStatus = 'loaded';
			})
			.addCase(createEditCanvas.rejected, (state: CanvasAPIState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

/*
 * Export reducer for store configuration.
 */
export const canvasAPIReducer = canvasAPISlice.reducer;

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
 *   dispatch(usersActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const canvasAPIActions = {
	...canvasAPISlice.actions,
	createEditCanvas
};

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllUsers);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectById, selectEntities } = canvasAPIAdapter.getSelectors();

export const getCanvasAPIState = (rootState: { [CANVAS_API_FEATURE_KEY]: CanvasAPIState }): CanvasAPIState => rootState[CANVAS_API_FEATURE_KEY];

export const selectAllCanvas = createSelector(getCanvasAPIState, selectAll);

export const selectCanvasEntities = createSelector(getCanvasAPIState, selectEntities);

export const CanvasById = (Id: string) => createSelector(getCanvasAPIState, (state) => selectById(state, Id));
