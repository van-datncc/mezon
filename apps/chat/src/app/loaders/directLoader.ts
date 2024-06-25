import { directActions } from '@mezon/store';
import { CustomLoaderFunction } from './appLoader';

export const directLoader: CustomLoaderFunction = async ({ dispatch }) => {
	dispatch(directActions.fetchDirectMessage({}));

	return null;
};
