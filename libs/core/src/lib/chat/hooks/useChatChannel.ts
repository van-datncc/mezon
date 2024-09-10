import { useMemo } from 'react';
import { useChannelMembers } from './useChannelMembers';
import { useThreads } from './useThreads';

export function useChatChannel(channelId: string) {
	const { threads } = useThreads();

	const { membersOfChild } = useChannelMembers({ channelId });

	return useMemo(
		() => ({
			membersOfChild,
			threads
		}),
		[membersOfChild, threads]
	);
}
