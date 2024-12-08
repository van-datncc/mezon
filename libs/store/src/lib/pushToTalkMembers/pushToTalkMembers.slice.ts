import { IChannelMember, LoadingStatus } from '@mezon/utils';
import { EntityState, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const PTT_USERS_FEATURES_KEY = 'pushToTalkUsers';

export interface IPttUsersEntity {
	id: string;
	user_id: string;
	channel_id: string;
}

export interface IPttUsersState extends EntityState<IPttUsersEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	usersInPTT: IChannelMember[];
}

export const pttUsersAdapter = createEntityAdapter({
	selectId: (user: IPttUsersEntity) => user.id
});

const initialState: IPttUsersState = pttUsersAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null,
	usersInPTT: []
});

export const pushToTalkMembersSlice = createSlice({
	name: PTT_USERS_FEATURES_KEY,
	initialState: initialState,
	reducers: {
		add: pttUsersAdapter.addOne,
		addMany: pttUsersAdapter.addMany,
		remove: pttUsersAdapter.removeOne
	},
	extraReducers: (builder) => {
		//
	}
});

export const pttMembersActions = {
	...pushToTalkMembersSlice.actions
};

const { selectEntities } = pttUsersAdapter.getSelectors();
export const pushToTalkMembersReducer = pushToTalkMembersSlice.reducer;
export const getPttMembersState = (rootState: { [PTT_USERS_FEATURES_KEY]: IPttUsersState }): IPttUsersState => rootState[PTT_USERS_FEATURES_KEY];

export const selectPttMembersEntities = createSelector(getPttMembersState, selectEntities);

export const selectPttMembersByChannelId = (channelId: string) =>
	createSelector(selectPttMembersEntities, (entities) => {
		const inPttMembers = Object.values(entities);
		return inPttMembers.filter((user) => user && user.channel_id === channelId);
	});
