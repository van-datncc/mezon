import { UsersClanEntity } from '@mezon/utils';
import { createEntityAdapter, createSelector, createSlice, EntityState, PayloadAction } from '@reduxjs/toolkit';
import { StatusUserArgs } from '../channelmembers/channel.members';

export const CLANMEMBERSMETA_FEATURE_KEY = 'clanMembersMeta';

export interface ClanMembersMetaEntity {
	id: string;
	online: boolean;
	isMobile: boolean;
}

export interface ClanMembersMetaState extends EntityState<ClanMembersMetaEntity, string> {
	loadingStatus: 'not loaded' | 'loading' | 'loaded' | 'error';
	error?: string | null;
}

const clanMembersMetaAdapter = createEntityAdapter<ClanMembersMetaEntity>();

export const initialClanMembersMetaState: ClanMembersMetaState = clanMembersMetaAdapter.getInitialState({
	loadingStatus: 'not loaded',
	error: null
});

export function extracMeta(user: UsersClanEntity): ClanMembersMetaEntity {
	return {
		id: user.id,
		online: !!user.user?.online,
		isMobile: !!user?.user?.is_mobile
	};
}

export const clanMembersMetaSlice = createSlice({
	name: CLANMEMBERSMETA_FEATURE_KEY,
	initialState: initialClanMembersMetaState,
	reducers: {
		addOne: clanMembersMetaAdapter.addOne,
		removeOne: clanMembersMetaAdapter.removeOne,
		updateOne: clanMembersMetaAdapter.updateOne,
		setClanMembersMetaStatus: (state, action: PayloadAction<{ userId: string; online: boolean; isMobile: boolean }>) => {
			const clanMembersMeta = state.entities[action.payload.userId];
			if (clanMembersMeta) {
				clanMembersMeta.online = action.payload.online;
				clanMembersMeta.isMobile = action.payload.isMobile;
			}
		},
		updateBulkMetadata: (state, action: PayloadAction<ClanMembersMetaEntity[]>) => {
			clanMembersMetaAdapter.upsertMany(state, action.payload);
		},
		setManyStatusUser: (state, action: PayloadAction<StatusUserArgs[]>) => {
			action.payload.forEach((statusUser) => {
				const clanMemberMeta = state.entities[statusUser.userId];
				if (clanMemberMeta) {
					clanMemberMeta.online = statusUser.online;
					clanMemberMeta.isMobile = statusUser.isMobile;
				}
			});
		}
	}
});

/*
 * Export reducer for store configuration.
 */
export const clanMembersMetaReducer = clanMembersMetaSlice.reducer;

/*
 * Export action creators to be dispatched. For use with the `useDispatch` hook.
 */
export const clanMembersMetaActions = {
	...clanMembersMetaSlice.actions
};

/*
 * Export selectors to query state. For use with the `useSelector` hook.
 */
const { selectAll, selectEntities } = clanMembersMetaAdapter.getSelectors();

export const getClanMembersMetaState = (rootState: { [CLANMEMBERSMETA_FEATURE_KEY]: ClanMembersMetaState }): ClanMembersMetaState =>
	rootState[CLANMEMBERSMETA_FEATURE_KEY];

export const selectAllClanMembersMeta = createSelector(getClanMembersMetaState, selectAll);

export const selectClanMembersMetaEntities = createSelector(getClanMembersMetaState, selectEntities);

export const selectClanMemberMetaUserId = createSelector(
	[selectClanMembersMetaEntities, (_, userId: string) => userId],
	(entities, userId) => entities[userId]
);
