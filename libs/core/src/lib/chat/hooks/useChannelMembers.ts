import { selectAllChannelMembers, useAppSelector } from '@mezon/store';
import { useMemo } from 'react';

export type useChannelMembersOptions = {
	channelId?: string | null;
};

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
	const members = useAppSelector((state) => selectAllChannelMembers(state, channelId as string));

	return useMemo(
		() => ({
			members
		}),
		[members]
	);
}
