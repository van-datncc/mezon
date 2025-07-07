import { captureSentryError } from '@mezon/logger';
import { INotifiReactMessage, LoadingStatus } from '@mezon/utils';
import { PayloadAction, createAsyncThunk, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiNotifiReactMessage } from 'mezon-js/api.gen';
import { CacheMetadata, createApiKey, createCacheMetadata, markApiFirstCalled, shouldForceApiCall } from '../cache-metadata';
import { MezonValueContext, ensureSession, fetchDataWithSocketFallback, getMezonCtx } from '../helpers';
import { RootState } from '../store';

export const NOTIFI_REACT_MESSAGE_FEATURE_KEY = 'notifireactmessage';

export interface NotifiReactMessageState {
	byChannels: Record<
		string,
		{
			notifiReactMessage?: INotifiReactMessage | null;
			cache?: CacheMetadata;
		}
	>;
	loadingStatus: LoadingStatus;
	error?: string | null;
}

const getInitialChannelState = () => ({
	notifiReactMessage: null
});

export const initialNotifiReactMessageState: NotifiReactMessageState = {
	byChannels: {},
	loadingStatus: 'not loaded',
	error: null
};

type fetchNotifiReactMessArgs = {
	channelId: string;
	noCache?: boolean;
};

export const fetchNotifiReactMessageCached = async (getState: () => RootState, mezon: MezonValueContext, channelId: string, noCache = false) => {
	const currentState = getState();
	const notifiReactState = currentState[NOTIFI_REACT_MESSAGE_FEATURE_KEY];
	const channelData = notifiReactState.byChannels[channelId] || getInitialChannelState();

	const apiKey = createApiKey('fetchNotifiReactMessage', channelId, mezon.session.username || '');

	const shouldForceCall = shouldForceApiCall(apiKey, channelData.cache, noCache);

	if (!shouldForceCall) {
		return {
			...channelData.notifiReactMessage,
			fromCache: true,
			time: channelData.cache?.lastFetched || Date.now()
		};
	}

	const response = await fetchDataWithSocketFallback(
		mezon,
		{
			api_name: 'GetNotificationReactMessage',
			notification_message: {
				channel_id: channelId
			}
		},
		() => mezon.client.getNotificationReactMessage(mezon.session, channelId),
		'notification_react_message'
	);

	markApiFirstCalled(apiKey);

	return {
		...response,
		fromCache: false,
		time: Date.now()
	};
};

export const getNotifiReactMessage = createAsyncThunk(
	'notifireactmessage/getNotifiReactMessage',
	async ({ channelId, noCache }: fetchNotifiReactMessArgs, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await fetchNotifiReactMessageCached(thunkAPI.getState as () => RootState, mezon, channelId, Boolean(noCache));

			if (!response) {
				return thunkAPI.rejectWithValue('Invalid getNotifiReactMessage');
			}

			if (response.fromCache) {
				return {
					channelId: channelId,
					notifiReactMessage: {},
					fromCache: true
				};
			}

			return {
				channelId: channelId,
				notifiReactMessage: response,
				fromCache: false
			};
		} catch (error) {
			captureSentryError(error, 'notifireactmessage/getNotifiReactMessage');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

type SetNotifiReactMessagePayload = {
	channel_id?: string;
};

export const setNotifiReactMessage = createAsyncThunk(
	'notifireactmessage/setNotifiReactMessage',
	async ({ channel_id }: SetNotifiReactMessagePayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.setNotificationReactMessage(mezon.session, channel_id || '');
			if (!response) {
				return thunkAPI.rejectWithValue([]);
			}
			thunkAPI.dispatch(getNotifiReactMessage({ channelId: channel_id || '', noCache: true }));
			return response;
		} catch (error) {
			captureSentryError(error, 'notifireactmessage/setNotifiReactMessage');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

type DeleteNotifiReactMessagePayload = {
	channel_id?: string;
};

export const deleteNotifiReactMessage = createAsyncThunk(
	'notifireactmessage/deleteNotifiReactMessage',
	async ({ channel_id }: DeleteNotifiReactMessagePayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.deleteNotiReactMessage(mezon.session, channel_id || '');
			if (!response) {
				return thunkAPI.rejectWithValue([]);
			}
			thunkAPI.dispatch(getNotifiReactMessage({ channelId: channel_id || '', noCache: true }));
			return response;
		} catch (error) {
			captureSentryError(error, 'notifireactmessage/deleteNotifiReactMessage');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const notifiReactMessageSlice = createSlice({
	name: NOTIFI_REACT_MESSAGE_FEATURE_KEY,
	initialState: initialNotifiReactMessageState,
	reducers: {},
	extraReducers: (builder) => {
		builder
			.addCase(getNotifiReactMessage.pending, (state: NotifiReactMessageState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(
				getNotifiReactMessage.fulfilled,
				(
					state: NotifiReactMessageState,
					action: PayloadAction<{ channelId: string; notifiReactMessage: ApiNotifiReactMessage; fromCache?: boolean }>
				) => {
					const { channelId, fromCache, notifiReactMessage } = action.payload;

					if (!state.byChannels[channelId]) {
						state.byChannels[channelId] = getInitialChannelState();
					}

					if (!fromCache) {
						state.byChannels[channelId].notifiReactMessage = notifiReactMessage as any;
						state.byChannels[channelId].cache = createCacheMetadata();
					}

					state.loadingStatus = 'loaded';
				}
			)
			.addCase(getNotifiReactMessage.rejected, (state: NotifiReactMessageState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
	}
});

/*
 * Export reducer for store configuration.
 */
export const notifiReactMessageReducer = notifiReactMessageSlice.reducer;

export const notifiReactMessageActions = {
	...notifiReactMessageSlice.actions,
	getNotifiReactMessage,
	setNotifiReactMessage,
	deleteNotifiReactMessage
};

export const getNotifiReactMessageState = (rootState: { [NOTIFI_REACT_MESSAGE_FEATURE_KEY]: NotifiReactMessageState }): NotifiReactMessageState =>
	rootState[NOTIFI_REACT_MESSAGE_FEATURE_KEY];

export const selectNotifiReactMessageByChannelId = createSelector(
	[getNotifiReactMessageState, (state: RootState, channelId: string) => channelId],
	(state, channelId) => state?.byChannels[channelId]?.notifiReactMessage
);
