import { clansActions, useAppDispatch } from '@mezon/store';
import React, { useMemo } from 'react';
import { ApiInviteUserRes, ApiLinkInviteUser } from 'vendors/mezon-js/packages/mezon-js/dist/api.gen';

export function useInvite() {
	const dispatch = useAppDispatch();

	const createLinkInviteUser = React.useCallback(
		async (clan_id: string, channel_id: string, expiry_time: number) => {
			const action = await dispatch(
				clansActions.createLinkInviteUser({
					clan_id: clan_id,
					channel_id: channel_id,
					expiry_time: expiry_time,
				}),
			);
			const payload = action.payload as ApiLinkInviteUser;
			return payload;
		},
		[dispatch],
	);

	const inviteUser = React.useCallback(
		async (invite_id: string) => {
			const action = await dispatch(clansActions.inviteUser({ inviteId: invite_id }));
			const payload = action.payload as ApiInviteUserRes;
			return payload;
		},
		[dispatch],
	);

	const getLinkInvite = React.useCallback(
		async (invite_id: string) => {
			const action = await dispatch(clansActions.getLinkInvite({ inviteId: invite_id }));
			const payload = action.payload as ApiInviteUserRes;
			return payload;
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			createLinkInviteUser,
			inviteUser,
			getLinkInvite,
		}),
		[createLinkInviteUser, inviteUser, getLinkInvite],
	);
}
