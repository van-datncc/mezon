import { directActions, friendsActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const friendsLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(friendsActions.fetchListFriends({}));
	dispatch(directActions.fetchDirectMessage({noCache: true}));
	return null;
};
