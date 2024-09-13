import { DirectEntity } from '@mezon/store-mobile';
import { IChannel, LoadingStatus } from '@mezon/utils';
import { EntityState, PayloadAction, createEntityAdapter, createSelector, createSlice } from '@reduxjs/toolkit';

export const DIRECT_META_FEATURE_KEY = 'directmeta';

export interface DirectMetaEntity extends IChannel {
	id: string;
}
interface DMMeta {
	id: string;
	lastSeenTimestamp: number;
	lastSentTimestamp: number;
	notifiCount: number;
}

const dmMetaAdapter = createEntityAdapter<DMMeta>();

export interface DirectMetaState extends EntityState<DirectMetaEntity, string> {
	loadingStatus: LoadingStatus;
	error?: string | null;
	dmMetadata: EntityState<DMMeta, string>;
}
export const directMetaAdapter = createEntityAdapter<DirectMetaEntity>();

export const initialDirectMetaState: DirectMetaState = directMetaAdapter.getInitialState({
	loadingStatus: 'not loaded',
	socketStatus: 'not loaded',
	error: null,
	dmMetadata: dmMetaAdapter.getInitialState()
});

function extractDMMeta(channel: DirectEntity): DMMeta {
	return {
		id: channel.id,
		lastSeenTimestamp: Number(channel.last_seen_message?.timestamp_seconds),
		lastSentTimestamp: Number(channel.last_sent_message?.timestamp_seconds),
		notifiCount: Number(channel.count_mess_unread || 0)
	};
}

export const directMetaSlice = createSlice({
	name: DIRECT_META_FEATURE_KEY,
	initialState: initialDirectMetaState,
	reducers: {
		add: directMetaAdapter.addOne,
		removeAll: directMetaAdapter.removeAll,
		remove: directMetaAdapter.removeOne,
		update: directMetaAdapter.updateOne,
		setDirectLastSentTimestamp: (state, action: PayloadAction<{ channelId: string; timestamp: number }>) => {
			const channel = state.dmMetadata.entities[action.payload.channelId];
			if (channel) {
				channel.lastSentTimestamp = action.payload.timestamp;
			}
		},
		setDirectMetaLastSeenTimestamp: (state, action: PayloadAction<{ channelId: string; timestamp: number }>) => {
			const channel = state.dmMetadata.entities[action.payload.channelId];
			if (channel) {
				channel.lastSeenTimestamp = action.payload.timestamp;
				channel.notifiCount = 0;
			}
		},
		setDirectMetaEntities: (state, action: PayloadAction<IChannel[]>) => {
			const channels = action.payload;
			if (channels) {
				const meta = channels.map((ch) => extractDMMeta(ch));
				directMetaAdapter.setAll(state, channels);
				state.dmMetadata = dmMetaAdapter.upsertMany(state.dmMetadata, meta);
			}
		}
	}
});

export const directMetaReducer = directMetaSlice.reducer;

export const directMetaActions = {
	...directMetaSlice.actions
};
const { selectAll } = directMetaAdapter.getSelectors();

export const getDirectMetaState = (rootState: { [DIRECT_META_FEATURE_KEY]: DirectMetaState }): DirectMetaState => rootState[DIRECT_META_FEATURE_KEY];

export const selectAllDirectMetaMessages = createSelector(getDirectMetaState, selectAll);

export const selectIsUnreadDMById = (channelId: string) =>
	createSelector(getDirectMetaState, (state) => {
		const channel = state.dmMetadata.entities[channelId];
		return channel?.lastSeenTimestamp < channel?.lastSentTimestamp;
	});

export const selectDirectsUnreadlist = createSelector(selectAllDirectMetaMessages, getDirectMetaState, (directMessages, state) => {
	return directMessages.filter((dm) => {
		const channel = state.dmMetadata.entities[dm.id];
		return channel ? channel.lastSeenTimestamp < channel.lastSentTimestamp : false;
	});
});

export const selectTotalUnreadDM = createSelector(selectDirectsUnreadlist, (listUnreadDM) => {
	return listUnreadDM.reduce((total, count) => total + (count.count_mess_unread ?? 0), 0);
});
