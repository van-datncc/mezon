import { selectAllChannelMembers, selectChannelById, useAppSelector } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type useChannelMembersOptions = {
	channelId?: string | null;
};

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
	const getChannelByChannelId = useSelector(selectChannelById(channelId ?? ''));

	const membersOfParent = useAppSelector((state) => selectAllChannelMembers(state, getChannelByChannelId.parrent_id as string));
	const membersOfChild = useAppSelector((state) => selectAllChannelMembers(state, channelId as string));

	return useMemo(
		() => ({
			membersOfParent,
			membersOfChild
		}),
		[membersOfChild, membersOfParent]
	);
}
