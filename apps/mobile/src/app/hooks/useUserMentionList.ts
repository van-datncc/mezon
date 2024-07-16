import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity, MentionDataProps } from '@mezon/utils';
import { useMemo } from 'react';

function UseMentionList(channelID: string): MentionDataProps[] {
	const { members } = useChannelMembers({ channelId: channelID });

	const newUserMentionList = useMemo(() => {
		if (!members || members.length === 0) {
			return [];
		}

		const userMentionRaw = members;
		const mentionList =
			userMentionRaw?.map((item: ChannelMembersEntity) => ({
				...item,
				id: item?.user?.id ?? '',
				display: item?.user?.username ?? '',
				avatarUrl: item?.user?.avatar_url ?? '',
			})) ?? [];
		const hardcodedUser = {
			id: '1775731111020111321',
			display: 'here',
			avatarUrl: '',
			user: {
				id: '1775731111020111321',
				display_name: 'here',
				username: 'here',
				avatarUrl: '',
			},
		};
		return [...mentionList, hardcodedUser];
	}, [members]);

	return newUserMentionList;
}

export default UseMentionList;
