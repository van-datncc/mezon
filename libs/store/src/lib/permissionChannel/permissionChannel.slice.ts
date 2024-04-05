import {  createAsyncThunk } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';
import { channelMembersActions } from '../channelmembers/channel.members';

type addChannelUsersPayload = {
	channelId: string;
	channelType?: number;
    userIds: string[];
};
export const addChannelUsers = createAsyncThunk('channelUsers/addChannelUsers', async ( {channelId, channelType, userIds} : addChannelUsersPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.addChannelUsers(mezon.session, channelId, userIds);
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		const body ={
			clanId: '', 
			channelId: channelId, 
			noCache: true, 
			channelType: channelType|| 0,
			repace : true
		}
		thunkAPI.dispatch(channelMembersActions.fetchChannelMembers(body))
		return response;
	} catch(error : any) {		
		const errmsg = await error.json();
		return thunkAPI.rejectWithValue(errmsg.message);
	}
});
type removeChannelUsersPayload = {
	channelId: string;
    userId: string
};
export const removeChannelUsers = createAsyncThunk('channelUsers/removeChannelUsers', async ( {channelId, userId} : removeChannelUsersPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const userIds = [userId]
		const response = await mezon.client.removeChannelUsers(mezon.session, channelId, userIds);
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		thunkAPI.dispatch(channelMembersActions.remove(`${channelId}${userId}`))
		return response;
	} catch(error : any) {		
		const errmsg = await error.json();
		return thunkAPI.rejectWithValue(errmsg.message);
	}
});

export const channelUsersActions = {  addChannelUsers, removeChannelUsers };