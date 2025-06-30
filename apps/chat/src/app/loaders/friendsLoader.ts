import { clansActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const friendsLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(clansActions.joinClan({ clanId: '0' }));
	return null;
};
