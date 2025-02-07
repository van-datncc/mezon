import { captureSentryError } from '@mezon/logger';
import { createAsyncThunk } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiHandleParticipantMeetStateRequest } from 'mezon-js/api.gen';
import { ensureSession, getMezonCtx, MezonValueContext } from '../helpers';

type generateMeetTokenPayload = {
	channelId: string;
	roomName: string;
};

const MEET_TOKEN_CACHE_TIME = 30 * 1000;

const generateMeetTokenCached = memoizee(
	async (mezon: MezonValueContext, channelId: string, roomName: string) => {
		const body = {
			channel_id: channelId,
			room_name: roomName
		};
		return await mezon.client.generateMeetToken(mezon.session, body);
	},
	{
		promise: true,
		maxAge: MEET_TOKEN_CACHE_TIME,
		normalizer: (args) => {
			return args[2] + args[1] + args[0].session.username;
		}
	}
);

export const generateMeetToken = createAsyncThunk('meet/generateMeetToken', async ({ channelId, roomName }: generateMeetTokenPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));

		const response = await generateMeetTokenCached(mezon, channelId, roomName);
		if (!response) {
			return;
		}
		return response.token;
	} catch (error) {
		captureSentryError(error, 'meet/generateMeetToken');
		return thunkAPI.rejectWithValue(error);
	}
});

export const handleParticipantMeetState = createAsyncThunk(
	'meet/handleParticipantMeetState',
	async ({ clan_id, channel_id, user_id, display_name, state }: ApiHandleParticipantMeetStateRequest, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const body = {
				clan_id: clan_id,
				channel_id: channel_id,
				user_id: user_id,
				display_name: display_name,
				state: state
			};
			const response = await mezon.client.handleParticipantMeetState(mezon.session, body);

			return response;
		} catch (error) {
			captureSentryError(error, 'meet/handleParticipantMeetState');
			return thunkAPI.rejectWithValue(error);
		}
	}
);
