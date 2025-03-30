import { getStore, selectClanView, selectDmGroupCurrentId, selectEntitesUserClans, selectGroupMembersEntities } from '@mezon/store';

export function getCurrentChatData() {
	const state = getStore().getState();

	const directId = selectDmGroupCurrentId(state);
	const isClanView = selectClanView(state);
	const allClanUsersEntities = selectEntitesUserClans(state);
	const allDmUsersEntities = selectGroupMembersEntities(state, directId);

	const currentChatUsersEntities = isClanView ? allClanUsersEntities : allDmUsersEntities;

	return {
		currentChatUsersEntities
	};
}
