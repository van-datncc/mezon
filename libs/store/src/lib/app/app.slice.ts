import { LoadingStatus } from '@mezon/utils';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export const APP_FEATURE_KEY = 'app';

export interface AppState {
	theme: 'light' | 'dark';
	loadingStatus: LoadingStatus;
	error?: string | null;
	isShowMemberList: boolean;
}

export const initialAppState: AppState = {
	loadingStatus: 'not loaded',
	theme: 'light',
	isShowMemberList: true,
};

export const appSlice = createSlice({
	name: APP_FEATURE_KEY,
	initialState: initialAppState,
	reducers: {
		setTheme: (state, action) => {
			state.theme = action.payload;
		},
		setIsShowMemberList: (state, action) => {
			state.isShowMemberList = action.payload;
		},
		toggleIsShowMemberList: (state) => {
			state.isShowMemberList = !state.isShowMemberList;
		},
	},
});

/*
 * Export reducer for store configuration.
 */
export const appReducer = appSlice.reducer;

export const appActions = appSlice.actions;

export const getAppState = (rootState: { [APP_FEATURE_KEY]: AppState }): AppState => rootState[APP_FEATURE_KEY];

export const selectAllApp = createSelector(getAppState, (state: AppState) => state);

export const selectTheme = createSelector(getAppState, (state: AppState) => state.theme);

export const selectError = createSelector(getAppState, (state: AppState) => state.error);

export const selectIsShowMemberList = createSelector(getAppState, (state: AppState) => state.isShowMemberList);
