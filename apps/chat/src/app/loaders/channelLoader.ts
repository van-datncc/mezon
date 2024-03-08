import { channelsActions, getStoreAsync } from '@mezon/store';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

export const channelLoader: LoaderFunction = async ({ params }) => {
	const { channelId } = params;

	const store = await getStoreAsync();
	if (!channelId) {
		throw new Error('Channel ID null');
	}

	store.dispatch(channelsActions.joinChanel({ channelId, noFetchMembers: false }));
	return null;
};

export const shouldRevalidateChannel: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { channelId: currentChannelId } = currentParams;
	const { channelId: nextChannelId } = nextParams;

	return currentChannelId !== nextChannelId;
};
