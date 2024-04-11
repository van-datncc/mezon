import { ApiChannelDescription } from 'mezon-js/api.gen';
import { IThread, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const THREADS_FEATURE_KEY = 'threads';

/*
 * Update these interfaces according to your requirements.
 */
export interface ThreadsEntity extends IThread {
	id: string; // Primary ID
}

export interface ThreadsState extends EntityState<ThreadsEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	isShowCreateThread?: boolean;
	currentThread?: ApiChannelDescription;
	nameThreadError?: string;
	messageThreadError?: string;
	isPrivate: number;
}

export const threadsAdapter = createEntityAdapter<ThreadsEntity>();

/**
 * Export an effect using createAsyncThunk from
 * the Redux Toolkit: https://redux-toolkit.js.org/api/createAsyncThunk
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
 *   dispatch(fetchThreads())
 * }, [dispatch]);
 * ```
 */
export const fetchThreads = createAsyncThunk<ThreadsEntity[]>('threads/fetchStatus', async (_, thunkAPI) => {
	/**
	 * Replace this with your custom fetch call.
	 * For example, `return myApi.getThreadss()`;
	 * Right now we just return an empty array.
	 */
	return Promise.resolve([]);
});

export const initialThreadsState: ThreadsState = threadsAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	isShowCreateThread: false,
	isPrivate: 0,
});

export const threadsSlice = createSlice({
	name: THREADS_FEATURE_KEY,
	initialState: initialThreadsState,
	reducers: {
		add: threadsAdapter.addOne,
		remove: threadsAdapter.removeOne,
		setIsShowCreateThread: (state: ThreadsState, action: PayloadAction<boolean>) => {
			state.isShowCreateThread = action.payload;
			state.currentThread = undefined;
		},
		setCurrentThread: (state, action: PayloadAction<ApiChannelDescription>) => {
			state.currentThread = action.payload;
		},
		setNameThreadError: (state, action: PayloadAction<string>) => {
			state.nameThreadError = action.payload;
		},
		setMessageThreadError: (state, action: PayloadAction<string>) => {
			state.messageThreadError = action.payload;
		},
		setIsPrivate: (state, action: PayloadAction<number>) => {
			state.isPrivate = action.payload;
		},
		// ...
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchThreads.pending, (state: ThreadsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchThreads.fulfilled, (state: ThreadsState, action: PayloadAction<ThreadsEntity[]>) => {
				threadsAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchThreads.rejected, (state: ThreadsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	},
});

/*
 * Export reducer for store configuration.
 */
export const threadsReducer = threadsSlice.reducer;

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
 *   dispatch(threadsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const threadsActions = { ...threadsSlice.actions };

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllThreads);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = threadsAdapter.getSelectors();

export const getThreadsState = (rootState: { [THREADS_FEATURE_KEY]: ThreadsState }): ThreadsState => rootState[THREADS_FEATURE_KEY];

export const selectCurrentThread = createSelector(getThreadsState, (state) => state.currentThread);

export const selectAllThreads = createSelector(getThreadsState, selectAll);

export const selectThreadsEntities = createSelector(getThreadsState, selectEntities);

export const selectIsShowCreateThread = createSelector(getThreadsState, (state) => state.isShowCreateThread);

export const selectIsPrivate = createSelector(getThreadsState, (state) => state.isPrivate);

export const selectNameThreadError = createSelector(getThreadsState, (state) => state.nameThreadError);

export const selectMessageThreadError = createSelector(getThreadsState, (state) => state.messageThreadError);
