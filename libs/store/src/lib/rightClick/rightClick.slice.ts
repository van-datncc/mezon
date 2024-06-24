import { RightClickPos } from '@mezon/utils';
import { createSelector, createSlice } from '@reduxjs/toolkit';

export const RIGHT_CLICK_FEATURE_KEY = 'rightClick';

export interface RightClickState {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
	rightClickXy: { x: number; y: number };
	messageIdClickedRightClicked: string;
	posClickActive: RightClickPos;
}

export const initialRightClickState: RightClickState = {
	loadingStatus: 'not loaded',
	error: null,
	rightClickXy: {
		x: NaN,
		y: NaN,
	},
	messageIdClickedRightClicked: '',
	posClickActive: RightClickPos.NONE,
};

export const rightClickSlice = createSlice({
	name: RIGHT_CLICK_FEATURE_KEY,
	initialState: initialRightClickState,
	reducers: {
		setRightClickXy: (state, action) => {
			state.rightClickXy = action.payload;
		},
		setMessageRightClick: (state, action) => {
			state.messageIdClickedRightClicked = action.payload;
		},
		setPosClickActive: (state, action) => {
			state.posClickActive = action.payload;
		},
	},
});

export const rightClickReducer = rightClickSlice.reducer;

export const rightClickAction = { ...rightClickSlice.actions };

export const getRightClickState = (rootState: { [RIGHT_CLICK_FEATURE_KEY]: RightClickState }): RightClickState => rootState[RIGHT_CLICK_FEATURE_KEY];

export const selectRightClickXy = createSelector(getRightClickState, (state: RightClickState) => state.rightClickXy);

export const selectMessageIdRightClicked = createSelector(getRightClickState, (state: RightClickState) => state.messageIdClickedRightClicked);

export const selectPosClickingActive = createSelector(getRightClickState, (state: RightClickState) => state.posClickActive);
