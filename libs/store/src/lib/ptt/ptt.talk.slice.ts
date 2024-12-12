import { ITalkPtt, LoadingStatus } from '@mezon/utils';
import { EntityState, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';
import { TalkPTTChannel } from 'mezon-js';

export const TALK_PTT_FEATURE_KEY = 'talkPTT';

/*
 * Update these interfaces according to your requirements.
 */
export interface TalkPTTEntity extends ITalkPtt {
	id: string; // Primary ID
}

export interface TalkPTTState extends EntityState<TalkPTTEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	talkPttData: TalkPTTChannel;
}

export const TalkPTTAdapter = createEntityAdapter<TalkPTTEntity>();

export const initialTalkPTTState: TalkPTTState = TalkPTTAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	talkPttData: {
		data_type: 0,
		json_data: '',
		channel_id: '',
		user_id: '',
		clan_id: '',
		is_talk: false,
		state: 0
	}
});

export const TalkPTTSlice = createSlice({
	name: TALK_PTT_FEATURE_KEY,
	initialState: initialTalkPTTState,
	reducers: {
		add: TalkPTTAdapter.addOne,
		addMany: TalkPTTAdapter.addMany,
		remove: TalkPTTAdapter.removeOne
		// ...
	}
});

/*
 * Export reducer for store configuration.
 */
export const TalkPTTReducer = TalkPTTSlice.reducer;

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
 *   dispatch(usersActions.add({ id: 1 }))
 * }, [dispatch]);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#usedispatch
 */
export const TalkPTTActions = {
	...TalkPTTSlice.actions
};

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 *
 * e.g.
 * ```
 * import { useSelector } from 'react-redux';
 *
 * // ...
 *
 * const entities = useSelector(selectAllUsers);
 * ```
 *
 * See: https://react-redux.js.org/next/api/hooks#useselector
 */
const { selectAll, selectEntities } = TalkPTTAdapter.getSelectors();

export const getTalkPTTState = (rootState: { [TALK_PTT_FEATURE_KEY]: TalkPTTState }): TalkPTTState => rootState[TALK_PTT_FEATURE_KEY];

export const selectAllTalkPTT = createSelector(getTalkPTTState, selectAll);

export const selectTalkPTTEntities = createSelector(getTalkPTTState, selectEntities);

export const selectTalkPTTByChannelId = createSelector([selectTalkPTTEntities, (state, channelId) => channelId], (entities, channelId) => {
	const talks = Object.values(entities);
	return talks.filter((talk) => talk && talk.talkPttData?.channel_id === channelId);
});

export const selectTalkingUser = createSelector([selectTalkPTTEntities, (state, userId) => userId], (entities, userId) => {
	const talks = Object.values(entities);
	return talks.filter((talk) => talk && talk.talkPttData?.user_id === userId && talk.talkPttData?.is_talk === true);
});
