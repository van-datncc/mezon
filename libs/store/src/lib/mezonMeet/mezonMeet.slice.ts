import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';

type fetchJoinMezonMeetPayload = {
	channelId: string;
	roomName: string;
};

export const fetchJoinMezonMeet = createAsyncThunk(
	'mezonmeet/fetchJoinMezonMeet',
	async ({ channelId, roomName }: fetchJoinMezonMeetPayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			const response = await mezon.client.getJoinMezonMeet(mezon.session, channelId, roomName);
			if (!response) {
				return;
			}
			return response.token;
		} catch (error) {
			captureSentryError(error, 'mezonMeet/fetchJoinMezonMeet');
			return thunkAPI.rejectWithValue(error);
		}
	}
);
