import { clansActions, getStoreAsync } from '@mezon/store';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

export type ServerLoaderData = {
	clanId: string;
};

export const serverLoader: LoaderFunction = async ({ params }) => {
	const { clanId } = params;
	const store = await getStoreAsync();
	if (!clanId) {
		throw new Error('Server ID null');
	}
	store.dispatch(clansActions.changeCurrentClan({ clanId: clanId }));
	return {
		clanId,
	} as ServerLoaderData;
};

export const shouldRevalidateServer: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { clanId: currentServerId } = currentParams;
	const { clanId: nextServerId } = nextParams;
	return currentServerId !== nextServerId;
};
