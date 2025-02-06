import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';

type fetchJoinMezonMeetPayload = {
	channelId: string;
	roomName: string;
};

const JOIN_MEZON_MEET_CACHE_TIME = 30 * 1000;

const fetchJoinMezonMeetCached = memoizee(
	async (mezon: MezonValueContext, channelId: string, roomName: string) => {
		return await mezon.client.getJoinMezonMeet(mezon.session, channelId, roomName);
	},
	{
		promise: true,
		maxAge: JOIN_MEZON_MEET_CACHE_TIME,
		normalizer: (args) => {
			return args[2] + args[1] + args[0].session.username;
		}
	}
);

export const fetchJoinMezonMeet = createAsyncThunk(
	'mezonmeet/fetchJoinMezonMeet',
	async ({ channelId, roomName }: fetchJoinMezonMeetPayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			const response = await fetchJoinMezonMeetCached(mezon, channelId, roomName);
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
