import { inviteActions } from '@mezon/store';
import { ShouldRevalidateFunction } from 'react-router-dom';
import { CustomLoaderFunction } from './appLoader';

export const inviteLoader: CustomLoaderFunction = async ({ params, dispatch }) => {
	const { inviteId } = params;
	if (!inviteId) {
		throw new Error('inviteId ID null');
	}
	dispatch(inviteActions.getLinkInvite({ inviteId: inviteId }));

	return null;
};
export const shouldRevalidateInvite: ShouldRevalidateFunction = (ctx) => {
	const { currentParams, nextParams } = ctx;
	const { inviteId: currentInviteId } = currentParams;
	const { inviteId: nextInviteId } = nextParams;

	return currentInviteId !== nextInviteId;
};
