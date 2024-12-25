import { captureSentryError } from '@mezon/logger';
import { EEventStatus, IEventManagement, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { ApiEventManagement } from 'mezon-js/api.gen';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';
import { memoizeAndTrack } from '../memoize';

export const EVENT_MANAGEMENT_FEATURE_KEY = 'eventmanagement';

export interface EventManagementEntity extends IEventManagement {
	id: string;
}

export const eventManagementAdapter = createEntityAdapter<EventManagementEntity>();

const EVENT_MANAGEMENT_CACHED_TIME = 1000 * 60 * 60;
const fetchEventManagementCached = memoizeAndTrack((mezon: MezonValueContext, clanId: string) => mezon.client.listEvents(mezon.session, clanId), {
	promise: true,
	maxAge: EVENT_MANAGEMENT_CACHED_TIME,
	normalizer: (args) => {
		return args[1] + args[0].session.username;
	}
});

export const mapEventManagementToEntity = (eventRes: ApiEventManagement, clanId?: string) => {
	return { ...eventRes, id: eventRes.id || '' };
};

type fetchEventManagementPayload = {
	clanId: string;
	noCache?: boolean;
};

export const fetchEventManagement = createAsyncThunk(
	'eventManagement/fetchEventManagement',
	async ({ clanId, noCache }: fetchEventManagementPayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));

			if (noCache) {
				fetchEventManagementCached.clear(mezon, clanId);
			}

			const response = await fetchEventManagementCached(mezon, clanId);

			if (!response.events) {
				return [];
			}

			const events = response.events.map((eventRes) => mapEventManagementToEntity(eventRes, clanId));
			return events;
		} catch (error) {
			captureSentryError(error, 'eventManagement/fetchEventManagement');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

type CreateEventManagementpayload = {
	clan_id: string;
	channel_voice_id: string;
	address: string;
	title: string;
	start_time: string;
	end_time: string;
	description: string;
	logo: string;
	channel_id: string;
};

export type UpdateEventManagementPayload = {
	event_id: string;
	clan_id: string;
	channel_voice_id: string;
	address: string;
	title: string;
	start_time: string;
	end_time: string;
	description: string;
	logo: string;
	creator_id: string;
	channel_id: string;
};

export type EventManagementOnGogoing = {
	address: string;
	channel_voice_id: string;
	clan_id: string;
	description: string;
	end_time: Date;
	event_id: string;
	event_status: string;
	logo: string;
	start_time: Date;
	title: string;
	channel_id: string;
};

export const fetchCreateEventManagement = createAsyncThunk(
	'CreatEventManagement/fetchCreateEventManagement',
	async (
		{ clan_id, channel_voice_id, address, title, start_time, end_time, description, logo, channel_id }: CreateEventManagementpayload,
		thunkAPI
	) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const body = {
				clan_id: clan_id,
				channel_voice_id: channel_voice_id || '',
				address: address || '',
				title: title,
				start_time: start_time,
				end_time: end_time,
				description: description || '',
				logo: logo || '',
				channel_id: channel_id
			};
			const response = await mezon.client.createEvent(mezon.session, body);
			if (response) {
				thunkAPI.dispatch(fetchEventManagement({ clanId: clan_id, noCache: true }));
			} else {
				return thunkAPI.rejectWithValue([]);
			}
			return response;
		} catch (error) {
			captureSentryError(error, 'CreatEventManagement/fetchCreateEventManagement');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

type fetchDeleteEventManagementPayload = {
	eventID: string;
	clanId: string;
	creatorId: string;
	eventLabel: string;
};

export interface MezonUpdateEventBody {
	event_id?: string;
	address?: string;
	channel_voice_id?: string;
	clan_id?: string;
	creator_id?: string;
	description?: string;
	end_time?: string;
	logo?: string;
	start_time?: string;
	title?: string;
	channel_id?: string;
}

export const updateEventManagement = createAsyncThunk(
	'updateEventManagement/updateEventManagement',
	async (
		{
			event_id,
			clan_id,
			channel_voice_id,
			address,
			title,
			start_time,
			end_time,
			description,
			logo,
			creator_id,
			channel_id
		}: UpdateEventManagementPayload,
		thunkAPI
	) => {
		try {
			const body: MezonUpdateEventBody = {
				address: address,
				channel_voice_id: channel_voice_id,
				event_id: event_id,
				description: description,
				end_time: end_time,
				logo: logo,
				start_time: start_time,
				title: title,
				clan_id: clan_id,
				creator_id: creator_id,
				channel_id: channel_id
			};

			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.updateEvent(mezon.session, event_id, body);
			if (response) {
				thunkAPI.dispatch(fetchEventManagement({ clanId: body.clan_id || '', noCache: true }));
			}
		} catch (error) {
			captureSentryError(error, 'updateEventManagement/updateEventManagement');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export const fetchDeleteEventManagement = createAsyncThunk(
	'deleteEventManagement/fetchDeleteEventManagement',
	async (body: fetchDeleteEventManagementPayload, thunkAPI) => {
		try {
			const mezon = await ensureSession(getMezonCtx(thunkAPI));
			const response = await mezon.client.deleteEvent(mezon.session, body.eventID, body.clanId, body.creatorId, body.eventLabel);
			if (response) {
				thunkAPI.dispatch(fetchEventManagement({ clanId: body.clanId, noCache: true }));
			}
		} catch (error) {
			captureSentryError(error, 'deleteEventManagement/fetchDeleteEventManagement');
			return thunkAPI.rejectWithValue(error);
		}
	}
);

export interface EventManagementState extends EntityState<EventManagementEntity, string> {
	loadingStatus: LoadingStatus;
	creatingStatus: LoadingStatus;
	error?: string | null;
	chooseEvent: EventManagementEntity | null;
	ongoingEvent: EventManagementOnGogoing | null;
}

export const initialEventManagementState: EventManagementState = eventManagementAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	chooseEvent: null,
	ongoingEvent: null,
	creatingStatus: 'not loaded'
});

export const eventManagementSlice = createSlice({
	name: EVENT_MANAGEMENT_FEATURE_KEY,
	initialState: initialEventManagementState,
	reducers: {
		add: eventManagementAdapter.addOne,
		addMany: eventManagementAdapter.addMany,
		remove: eventManagementAdapter.removeOne,
		clearEntities: (state) => {
			eventManagementAdapter.removeAll(state);
		},
		setChooseEvent: (state, action) => {
			state.chooseEvent = action.payload;
		},
		updateStatusEvent: (state, action) => {
			if (action.payload.event_status === EEventStatus.CREATED) {
				eventManagementAdapter.addOne(state, {
					id: action.payload.event_id,
					event_status: action.payload.event_status,
					...action.payload
				});
			} else {
				eventManagementAdapter.updateOne(state, {
					id: action.payload.event_id,
					changes: {
						event_status: action.payload.event_status
					}
				});
				if (action.payload.event_status === EEventStatus.COMPLETED && state.ongoingEvent?.event_id === action.payload.event_id) {
					state.ongoingEvent = null;
				}
			}
		},
		clearOngoingEvent: (state, action) => {
			state.ongoingEvent = null;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchEventManagement.pending, (state: EventManagementState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchEventManagement.fulfilled, (state: EventManagementState, action: PayloadAction<any>) => {
				eventManagementAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchEventManagement.rejected, (state: EventManagementState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			});
		builder
			.addCase(fetchCreateEventManagement.pending, (state) => {
				state.creatingStatus = 'loading';
				state.error = null;
			})
			.addCase(fetchCreateEventManagement.fulfilled, (state) => {
				state.creatingStatus = 'loaded';
				state.error = null;
			})
			.addCase(fetchCreateEventManagement.rejected, (state, action) => {
				state.creatingStatus = 'error';
				state.error = action.payload as string;
			});
	}
});

export const eventManagementReducer = eventManagementSlice.reducer;

export const eventManagementActions = {
	...eventManagementSlice.actions,
	fetchEventManagement,
	fetchCreateEventManagement,
	fetchDeleteEventManagement,
	updateEventManagement
};

const { selectAll, selectEntities } = eventManagementAdapter.getSelectors();

export const getEventManagementState = (rootState: { [EVENT_MANAGEMENT_FEATURE_KEY]: EventManagementState }): EventManagementState =>
	rootState[EVENT_MANAGEMENT_FEATURE_KEY];

export const selectAllEventManagement = createSelector(getEventManagementState, selectAll);

export const selectEventManagementEntities = createSelector(getEventManagementState, selectEntities);

export const selectNumberEvent = createSelector(selectAllEventManagement, (events) => events.length);

export const selectChooseEvent = createSelector(getEventManagementState, (state) => state.chooseEvent);

export const selectOngoingEvent = createSelector(getEventManagementState, (state) => state.ongoingEvent);

export const selectCreatingLoaded = createSelector(getEventManagementState, (state) => state.creatingStatus);

export const selectEventById = (eventId: string) =>
	createSelector(getEventManagementState, (state) => {
		const entities = selectEventManagementEntities({ eventmanagement: state });
		return entities[eventId] || null;
	});

export const selectNumberEventPrivate = createSelector(
	selectAllEventManagement,
	(events) => events.filter((event) => event.channel_id && event.channel_id !== '0' && event.channel_id !== '').length
);
export const selectEventByChannelId = createSelector([selectAllEventManagement, (_, channelId: string) => channelId], (events, channelId) =>
	events
		.filter((event) => event.channel_id === channelId)
		.sort((a, b) => {
			const startTimeA = a.start_time ? new Date(a.start_time).getTime() : 0;
			const startTimeB = b.start_time ? new Date(b.start_time).getTime() : 0;
			return startTimeA - startTimeB;
		})
);
