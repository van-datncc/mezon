import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { getNameForPrioritize, MentionDataProps } from '@mezon/utils';
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
				display: getNameForPrioritize(item.clan_nick ?? '', item.user?.display_name ?? '', item.user?.username ?? ''),
				avatarUrl: item.clan_avatar ? item.clan_avatar : item?.user?.avatar_url ?? '',
				username: item.user?.username,
			})) ?? [];
		const hardcodedUser: MentionDataProps = {
			id: '1775731111020111321',
			display: '@here',
			avatarUrl: '',
			username: '@here',
		};
		const sortedMentionList = [...mentionList].sort((a, b) => {
			const displayA = a.display?.toLowerCase() || '';
			const displayB = b.display?.toLowerCase() || '';

			if (displayA < displayB) return -1;
			if (displayA > displayB) return 1;
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
