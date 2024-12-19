import { captureSentryError } from '@mezon/logger';
import { IMessageWithUser, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createAsyncThunk, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import memoizee from 'memoizee';
import { ApiSdTopic } from 'mezon-js/api.gen';
import { ApiSdTopicRequest } from 'mezon-js/dist/api.gen';
import { MezonValueContext, ensureSession, getMezonCtx } from '../helpers';
const LIST_TOPIC_DISCUSSIONS_CACHED_TIME = 1000 * 60 * 3;

export const TOPIC_DISCUSSIONS_FEATURE_KEY = 'topicdiscussions';

/*
 * Update these interfaces according to your requirements.
 */
export interface TopicDiscussionsEntity extends ApiSdTopic {
	id: string; // Primary ID
}

export interface TopicDiscussionsState extends EntityState<TopicDiscussionsEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	isShowCreateTopic?: Record<string, boolean>;
	messageTopicError?: string;
	listTopicId?: Record<string, string>;
	valueTopic: IMessageWithUser | null;
	openTopicMessageState: boolean;
	currentTopicId?: string;
	firstMessageOfCurrentTopic?: ApiSdTopic;
}

export const topicsAdapter = createEntityAdapter({ selectId: (topic: TopicDiscussionsEntity) => topic.id || '' });

export interface FetchTopicDiscussionsArgs {
	channelId: string;
	noCache?: boolean;
}

const fetchTopicsCached = memoizee(
	async (mezon: MezonValueContext, channelId: string) => {
		const response = await mezon.client.listSdTopic(mezon.session, channelId, 50);
		return { ...response, time: Date.now() };
	},
	{
		promise: true,
		maxAge: LIST_TOPIC_DISCUSSIONS_CACHED_TIME,
		normalizer: (args) => {
			return args[1] + args[0].session.username;
		}
	}
);

const mapToTopicEntity = (topics: ApiSdTopic[]) => {
	return topics.map((topic) => ({
		...topic,
		id: topic.id
	}));
};

export const getFirstMessageOfTopic = createAsyncThunk('topics/getFirstMessageOfTopic', async (topicId: string, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.getTopicDetail(mezon.session, topicId);
		return response;
	} catch (error) {
		captureSentryError(error, 'topics/getFirstMessageOfTopic');
		return thunkAPI.rejectWithValue(error);
	}
});

export const fetchTopics = createAsyncThunk('topics/fetchTopics', async ({ channelId, noCache }: FetchTopicDiscussionsArgs, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		if (noCache) {
			fetchTopicsCached.clear(mezon, channelId);
		}
		const response = await fetchTopicsCached(mezon, channelId);
		if (!response.topics) {
			return [];
		}

		const threads = mapToTopicEntity(response.topics);
		return threads;
	} catch (error) {
		captureSentryError(error, 'topics/fetchTopics');
		return thunkAPI.rejectWithValue(error);
	}
});

export const initialTopicsState: TopicDiscussionsState = topicsAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	isShowCreateTopic: {},
	isPrivate: 0,
	nameValueTopic: {},
	valueTopic: null,
	openTopicMessageState: false
});

export const createTopic = createAsyncThunk('topics/createTopic', async (body: ApiSdTopicRequest, thunkAPI) => {
	try {
		const mezon = await ensureSession(getMezonCtx(thunkAPI));
		const response = await mezon.client.createSdTopic(mezon.session, body);
		if (response) {
			await thunkAPI.dispatch(fetchTopics({ channelId: body.channel_id as string, noCache: true }));
			return response;
		} else {
			return thunkAPI.rejectWithValue([]);
		}
	} catch (error) {
		captureSentryError(error, 'channels/createNewChannel');
		return thunkAPI.rejectWithValue(error);
	}
});

export const topicsSlice = createSlice({
	name: TOPIC_DISCUSSIONS_FEATURE_KEY,
	initialState: initialTopicsState,
	reducers: {
		add: topicsAdapter.addOne,
		remove: topicsAdapter.removeOne,
		update: topicsAdapter.updateOne,

		setIsShowCreateTopic: (state: TopicDiscussionsState, action: PayloadAction<{ channelId: string; isShowCreateTopic: boolean }>) => {
			state.isShowCreateTopic = {
				...state.isShowCreateTopic,
				[action.payload.channelId]: action.payload.isShowCreateTopic
			};
			state.listTopicId = {
				...state.listTopicId,
				[action.payload.channelId]: ''
			};
		},
		setValueTopic: (state, action: PayloadAction<IMessageWithUser | null>) => {
			state.valueTopic = action.payload;
		},
		setMessageTopicError: (state, action: PayloadAction<string>) => {
			state.messageTopicError = action.payload;
		},
		setListTopicId: (state, action: PayloadAction<{ channelId: string; topicId: string }>) => {
			state.listTopicId = {
				...state.listTopicId,
				[action.payload.channelId]: action.payload.topicId
			};
		},
		setOpenTopicMessageState(state, action) {
			state.openTopicMessageState = action.payload;
		},
		setCurrentTopicId: (state, action: PayloadAction<string>) => {
			state.currentTopicId = action.payload;
		}
	},
	extraReducers: (builder) => {
		builder
			.addCase(fetchTopics.pending, (state: TopicDiscussionsState) => {
				state.loadingStatus = 'loading';
			})
			.addCase(fetchTopics.fulfilled, (state: TopicDiscussionsState, action: PayloadAction<any[]>) => {
				topicsAdapter.setAll(state, action.payload);
				state.loadingStatus = 'loaded';
			})
			.addCase(fetchTopics.rejected, (state: TopicDiscussionsState, action) => {
				state.loadingStatus = 'error';
				state.error = action.error.message;
			})
			.addCase(getFirstMessageOfTopic.fulfilled, (state: TopicDiscussionsState, action) => {
				state.firstMessageOfCurrentTopic = action.payload;
			});
	}
});

/*
 * Export reducer for store configuration.
 */
export const topicsReducer = topicsSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 *
 * e.g.
 * ```
 * import React, { useEffect } from 'react';
 * import { useDispatch } from 'react-redux';
 *
 * // ...
 *
 * const dispatch = useDispatch();
 * useEffect(() => {
 *   dispatch(threadsActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const topicsActions = { ...topicsSlice.actions, createTopic, fetchTopics };

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllThreads);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = topicsAdapter.getSelectors();

export const getTopicsState = (rootState: { [TOPIC_DISCUSSIONS_FEATURE_KEY]: TopicDiscussionsState }): TopicDiscussionsState =>
	rootState[TOPIC_DISCUSSIONS_FEATURE_KEY];

export const selectAllTopics = createSelector(getTopicsState, selectAll);

export const selectTopicsEntities = createSelector(getTopicsState, selectEntities);

export const selectTopicById = createSelector([selectTopicsEntities, (state, topicId: string) => topicId], (state, topicId) => state[topicId]);

export const selectMessageTopicError = createSelector(getTopicsState, (state) => state.messageTopicError);

export const selectListTopicId = createSelector(getTopicsState, (state) => state.listTopicId);

export const selectValueTopic = createSelector(getTopicsState, (state) => state.valueTopic);

export const selectOpenTopicMessageState = createSelector(getTopicsState, (state: TopicDiscussionsState) => state.openTopicMessageState);

export const selectCurrentTopicId = createSelector(getTopicsState, (state: TopicDiscussionsState) => state.currentTopicId);

export const selectIsShowCreateTopic = createSelector([getTopicsState, (_, channelId: string) => channelId], (state, channelId) => {
	return !!state.isShowCreateTopic?.[channelId];
});

export const selectFirstMessageOfCurrentTopic = createSelector(getTopicsState, (state) => state.firstMessageOfCurrentTopic);
export const selectTopicsSort = createSelector(selectAllTopics, (data) => {
	return data.sort((a, b) => {
		const timestampA = a?.last_sent_message?.timestamp_seconds || 0;
		const timestampB = b?.last_sent_message?.timestamp_seconds || 0;
		return timestampB - timestampA;
	});
});
