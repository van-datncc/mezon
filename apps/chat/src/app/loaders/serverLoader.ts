import { clansActions, getStoreAsync } from '@mezon/store';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

export type ServerLoaderData = {
	serverId: string;
};

export const serverLoader: LoaderFunction = async ({ params }) => {
	const { serverId } = params;
	const store = await getStoreAsync();
	if (!serverId) {
		throw new Error('Server ID null');
	}
	store.dispatch(clansActions.changeCurrentClan({ clanId: serverId }));
	return {
		serverId,
	} as ServerLoaderData;
};

export const shouldRevalidateServer: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { serverId: currentServerId } = currentParams;
	const { serverId: nextServerId } = nextParams;
	return currentServerId !== nextServerId;
};
