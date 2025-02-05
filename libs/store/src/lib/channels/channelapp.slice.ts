import { captureSentryError } from '@mezon/logger';
import { LoadingStatus } from '@mezon/utils';
import { createAsyncThunk, createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';

type CreateChannelAppMeetPayload = {
	channelId: string;
	roomName: string;
};

export const CHANNEL_APP = 'channelApp';

export interface ChannelAppEntity {
	id: string;
}

export interface ChannelAppState {
	loadingStatus: LoadingStatus;
	roomName: string | null;
	roomId: string | null;
	enableVoice: boolean;
	enableVideo: boolean;
	enableCall: boolean;
}

export const initialChannelAppState: ChannelAppState = {
	loadingStatus: 'not loaded',
	roomName: null,
	roomId: '123',
	enableVoice: false,
	enableVideo: false,
	enableCall: false
};

export const createChannelAppMeet = createAsyncThunk(
	`${CHANNEL_APP}/CreateMeetingRoom`,
	async ({ channelId, roomName }: CreateChannelAppMeetPayload, thunkAPI) => {
		if (!channelId || roomName.trim() === '') return thunkAPI.rejectWithValue('Invalid input');
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.createRoomChannelApps(mezon.session, {
				channel_id: channelId,
				room_name: roomName
			});

			if (!response) {
				return thunkAPI.rejectWithValue('Failed to create room');
			}
			return response;
		} catch (error) {
			captureSentryError(error, `${CHANNEL_APP}/CreateMeetingRoom`);
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const channelAppSlice = createSlice({
	name: CHANNEL_APP,
	initialState: initialChannelAppState,
	reducers: {
		setRoomName: (state, action: PayloadAction<string>) => {
			state.roomName = action.payload;
		},
		setRoomId: (state, action: PayloadAction<string | null>) => {
			state.roomId = action.payload;
		},
		setEnableVoice: (state, action: PayloadAction<boolean>) => {
			state.enableVoice = action.payload;
		},
		setEnableVideo: (state, action: PayloadAction<boolean>) => {
			state.enableVideo = action.payload;
		},
		setEnableCall: (state, action: PayloadAction<boolean>) => {
			state.enableCall = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(createChannelAppMeet.pending, (state) => {
				state.loadingStatus = 'loading';
			})
			.addCase(createChannelAppMeet.fulfilled, (state, action) => {
				state.loadingStatus = 'loaded';
				state.roomName = action.payload?.room_name ?? '';
			})
			.addCase(createChannelAppMeet.rejected, (state) => {
				state.loadingStatus = 'error';
			});
	}
});

// Selectors
export const getChannelAppState = (rootState: { [CHANNEL_APP]: ChannelAppState }): ChannelAppState => rootState[CHANNEL_APP];

export const selectLoadingStatusChannelApp = createSelector(getChannelAppState, (state) => state.loadingStatus);
export const selectEnableVideo = createSelector(getChannelAppState, (state) => state.enableVideo);
export const selectGetRoomId = createSelector(getChannelAppState, (state) => state.roomId);
export const selectEnableVoice = createSelector(getChannelAppState, (state) => state.enableVoice);
export const selectEnableCall = createSelector(getChannelAppState, (state) => state.enableCall);
export const selectRoomName = createSelector(getChannelAppState, (state) => state.roomName);
export const channelAppReducer = channelAppSlice.reducer;

// Export actions & reducer
export const channelAppActions = {
	...channelAppSlice.actions,
	createChannelAppMeet
};
