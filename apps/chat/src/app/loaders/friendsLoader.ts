import { friendsActions, getStoreAsync } from '@mezon/store';

export const friendsLoader = async () => {
	const store = await getStoreAsync();
	store.dispatch(friendsActions.fetchListFriends());
	return null;
};
