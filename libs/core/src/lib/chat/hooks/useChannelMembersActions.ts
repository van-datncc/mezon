import { channelMembersActions, clansActions, useAppDispatch } from '@mezon/store';
import { RemoveChannelUsers, RemoveClanUsers } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { useCallback, useMemo } from 'react';

export type UseChannelMembersActionsOptions = {
	channelId?: string | null;
};

export function useChannelMembersActions({ channelId }: UseChannelMembersActionsOptions = {}) {
	const dispatch = useAppDispatch();

	const removeMemberChannel = useCallback(
		async ({ channelId, userIds }: RemoveChannelUsers) => {
			await dispatch(channelMembersActions.removeMemberChannel({ channelId, userIds }));
		},
		[dispatch],
	);

	const removeMemberClan = useCallback(
		async ({ clanId, channelId, userIds }: RemoveClanUsers) => {
			await dispatch(clansActions.removeClanUsers({ clanId, userIds }));
			await dispatch(
				channelMembersActions.fetchChannelMembers({
					clanId: clanId,
					channelId: channelId,
					noCache: true,
					channelType: ChannelType.CHANNEL_TYPE_TEXT,
				}),
			);
		},
		[dispatch],
	);

	return useMemo(
		() => ({
			removeMemberChannel,
			removeMemberClan,
		}),
		[removeMemberChannel, removeMemberClan],
	);
}
