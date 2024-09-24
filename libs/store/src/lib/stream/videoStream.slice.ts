import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const VIDEO_STREAM_FEATURE_KEY = 'videostream';

export interface StreamState {
	currentStreamId: string | null;
	isPlaying: boolean;
}

const initialState: StreamState = {
	currentStreamId: null,
	isPlaying: false
};

const videoStreamSlice = createSlice({
	name: 'stream',
	initialState,
	reducers: {
		startStream(state, action: PayloadAction<string>) {
			state.currentStreamId = action.payload;
			state.isPlaying = true;
		},
		stopStream(state) {
			state.isPlaying = false;
			// state.currentStreamId = null;
		}
	}
});

export const videoStreamReducer = videoStreamSlice.reducer;

export const videoStreamActions = {
	...videoStreamSlice.actions
};

export const getVideoStreamState = (rootState: { [VIDEO_STREAM_FEATURE_KEY]: StreamState }): StreamState => rootState[VIDEO_STREAM_FEATURE_KEY];

export const selectCurrentStreamId = createSelector(getVideoStreamState, (state) => state.currentStreamId);

export const selectStatusStream = createSelector(getVideoStreamState, (state) => state.isPlaying);
