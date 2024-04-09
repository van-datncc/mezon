import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { MentionDataProps } from '@mezon/utils';
import { useMemo } from 'react';

function UserMentionList(channelID: string): MentionDataProps[] {
	const { members } = useChannelMembers({ channelId: channelID });

	const newUserMentionList = useMemo(() => {
		if (!members || members.length === 0) {
			return [];
		}

		const userMentionRaw = members[0].users;
		return (
			userMentionRaw?.map((item: ChannelMembersEntity) => ({
				display: item?.user?.username ?? '',
				id: item?.user?.id ?? '',
			})) ?? []
		);
	}, [members]);

	return newUserMentionList;
}

export default UserMentionList;
