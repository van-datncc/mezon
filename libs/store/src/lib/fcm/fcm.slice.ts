import {  createAsyncThunk } from '@reduxjs/toolkit';
import { ensureSession, getMezonCtx } from '../helpers';

type FcmDeviceTokenPayload = {
	tokenId: string;
	deviceId: string;
	platform?: string;
};

export const registFcmDeviceToken = createAsyncThunk('fcm/registFcmDeviceToken', async ( {tokenId, deviceId, platform}:FcmDeviceTokenPayload, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.registFCMDeviceToken(mezon.session, tokenId, deviceId, platform||"");
		if (!response) {
			return thunkAPI.rejectWithValue([]);
		}
		return response;
	} catch(error : any) {		
		const errmsg = await error.json();
		return thunkAPI.rejectWithValue(errmsg.message);
	}
});
export const fcmActions = {  registFcmDeviceToken };