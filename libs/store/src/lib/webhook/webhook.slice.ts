import { LoadingStatus } from "@mezon/utils";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ApiWebhook, ApiWebhookCreateRequest } from "mezon-js/api.gen";
import { ensureSession, getMezonCtx } from "../helpers";

export const INTEGRATION_WEBHOOK = 'integrationWebhook';

export interface IWebHookState {
    loadingStatus: LoadingStatus;
    errors?: string | null;
    webhookList: Array<ApiWebhook>;
}

export const initialWebhookState: IWebHookState ={
    loadingStatus: "not loaded",
    errors: null,
    webhookList: [],
}

export const generateWebhook = createAsyncThunk(
    'integration/createWebhook',
    async(request: ApiWebhookCreateRequest, thunkAPI) => {
        try{
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
            const response = await mezon.client.generateWebhookLink(mezon.session, request);
            console.log(response);
        }
        catch(error){
            console.log(error);
            return thunkAPI.rejectWithValue({});
        }
    }
)

export const integrationWebhookSlice = createSlice({
    name: INTEGRATION_WEBHOOK,
    initialState: initialWebhookState,
    reducers: {},
    // extraReducers(builder) {

    // }
})

export const integrationWebhookReducer = integrationWebhookSlice.reducer;