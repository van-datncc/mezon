import { IStreamInfo } from '@mezon/utils';
import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

export const VIDEO_STREAM_FEATURE_KEY = 'videostream';

export interface StreamState {
	streamInfo: IStreamInfo | null;
	isPlaying: boolean;
	isRemoteVideoStream: boolean;
	isRemoteAudioStream: boolean;
}

const initialState: StreamState = {
	streamInfo: null,
	isPlaying: false,
	isRemoteVideoStream: false,
	isRemoteAudioStream: false
};

const videoStreamSlice = createSlice({
	name: 'stream',
	initialState,
	reducers: {
		startStream(state, action: PayloadAction<IStreamInfo>) {
			state.streamInfo = action.payload;
			state.isPlaying = true;
		},
		stopStream(state) {
			state.isPlaying = false;
			// state.currentStreamId = null;
		},
		setIsRemoteVideoStream(state, action) {
			state.isRemoteVideoStream = action.payload;
		},
		setIsRemoteAudioStream(state, action) {
			state.isRemoteAudioStream = action.payload;
		}
	}
});

export const videoStreamReducer = videoStreamSlice.reducer;

export const videoStreamActions = {
	...videoStreamSlice.actions
};

export const getVideoStreamState = (rootState: { [VIDEO_STREAM_FEATURE_KEY]: StreamState }): StreamState => rootState[VIDEO_STREAM_FEATURE_KEY];

export const selectCurrentStreamInfo = createSelector(getVideoStreamState, (state) => state.streamInfo);

export const selectStatusStream = createSelector(getVideoStreamState, (state) => state.isPlaying);

export const selectRemoteVideoStream = createSelector(getVideoStreamState, (state) => state.isRemoteVideoStream);

export const selectRemoteAudioStream = createSelector(getVideoStreamState, (state) => state.isRemoteAudioStream);
