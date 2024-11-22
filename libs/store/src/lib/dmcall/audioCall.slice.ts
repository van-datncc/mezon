import { IDmCallInfo } from '@mezon/utils';
import { PayloadAction, createSelector, createSlice } from '@reduxjs/toolkit';

export const AUDIO_CALL_FEATURE_KEY = 'audiocall';

export interface DmCallState {
	dmCallInfo: IDmCallInfo | null;
	isDialTone: boolean;
	isRingTone: boolean;
}

const initialState: DmCallState = {
	dmCallInfo: null,
	isDialTone: false,
	isRingTone: false
};

const audioCallSlice = createSlice({
	name: 'stream',
	initialState,
	reducers: {
		startDmCall(state, action: PayloadAction<IDmCallInfo>) {
			state.dmCallInfo = action.payload;
		},
		setIsDialTone(state, action) {
			state.isDialTone = action.payload;
		},
		setIsRingTone(state, action) {
			state.isRingTone = action.payload;
		}
	}
});

export const audioCallReducer = audioCallSlice.reducer;

export const audioCallActions = {
	...audioCallSlice.actions
};

export const getAudioCallState = (rootState: { [AUDIO_CALL_FEATURE_KEY]: DmCallState }): DmCallState => rootState[AUDIO_CALL_FEATURE_KEY];

export const selectCurrentstartDmCall = createSelector(getAudioCallState, (state) => state.dmCallInfo);

export const selectAudioDialTone = createSelector(getAudioCallState, (state) => state.isDialTone);

export const selectAudioRingTone = createSelector(getAudioCallState, (state) => state.isRingTone);
