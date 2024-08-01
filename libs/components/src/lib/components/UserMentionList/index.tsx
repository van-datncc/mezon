import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { MentionDataProps } from '@mezon/utils';
import { useMemo } from 'react';

interface UserMentionListProps {
	channelID: string;
	channelMode?: number;
}

function UserMentionList({ channelID, channelMode }: UserMentionListProps): MentionDataProps[] {
	const { members } = useChannelMembers({ channelId: channelID });

	const newUserMentionList = useMemo(() => {
		if (!members || members.length === 0) {
			return [];
		}

		const userMentionRaw = members;
		const mentionList =
			userMentionRaw?.map((item: ChannelMembersEntity) => ({
				id: item?.user?.id ?? '',
				display: item?.user?.username ?? '',
				avatarUrl: item?.user?.avatar_url ?? '',
				displayName: item?.user?.display_name ?? '',
				clanNick: item?.clan_nick,
				clanAvatar: item?.clan_avatar,
			})) ?? [];
		const hardcodedUser: MentionDataProps = {
			id: '1775731111020111321',
			display: 'here',
			avatarUrl: '',
			clanNick: '@here',
		};
		const sortedMentionList = [...mentionList].sort((a, b) => {
			if (a.display.toLowerCase() < b.display.toLowerCase()) return -1;
			if (a.display.toLowerCase() > b.display.toLowerCase()) return 1;
			return 0;
		});
		if (channelMode === 4) {
			return [...sortedMentionList];
		} else {
			return [...sortedMentionList, hardcodedUser];
		}
	}, [channelMode, members]);

	return newUserMentionList;
}

export default UserMentionList;
