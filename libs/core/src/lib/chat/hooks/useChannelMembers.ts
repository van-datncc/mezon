import { selectAllChannelMembers, selectMentionUsers, useAppSelector } from '@mezon/store';
import { useMemo } from 'react';

export type useChannelMembersOptions = {
	channelId?: string | null;
};

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
	const membersOfParent = useAppSelector((state) => selectMentionUsers(state, channelId as string));
	const membersOfChild = useAppSelector((state) => selectAllChannelMembers(state, channelId as string));

	return useMemo(
		() => ({
			membersOfParent,
			membersOfChild
		}),
		[membersOfChild, membersOfParent]
	);
}
