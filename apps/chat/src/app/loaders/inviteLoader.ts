import { getStoreAsync, inviteActions } from '@mezon/store';
import { LoaderFunction, ShouldRevalidateFunction } from 'react-router-dom';

export const inviteLoader: LoaderFunction = async ({ params }) => {
	const { inviteId } = params;
	const store = await getStoreAsync();
	if (!inviteId) {
		throw new Error('inviteId ID null');
	}
	store.dispatch(
		inviteActions.getLinkInvite({ inviteId: inviteId })
	);

	return null
};
export const shouldRevalidateInvite: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { inviteId: currentInviteId } = currentParams;
	const { inviteId: nextInviteId } = nextParams;

	return currentInviteId !== nextInviteId;
};

