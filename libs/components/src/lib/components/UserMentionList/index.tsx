import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity, selectAllRolesClan } from '@mezon/store';
import { MentionDataProps, getNameForPrioritize } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiRole } from 'mezon-js/api.gen';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { ID_MENTION_HERE } from '@mezon/mobile-components';

interface UserMentionListProps {
	channelID: string;
	channelMode?: number;
}

function UserMentionList({ channelID, channelMode }: UserMentionListProps): MentionDataProps[] {
	const { members } = useChannelMembers({ channelId: channelID });
	const rolesInClan = useSelector(selectAllRolesClan);

	const newUserMentionList = useMemo(() => {
		if (!members || members.length === 0) {
			return [];
		}

		const userMentionRaw = members;
		const mentionList =
			userMentionRaw?.map((item: ChannelMembersEntity) => ({
				id: item?.user?.id ?? '',
				display: getNameForPrioritize(item.clan_nick ?? '', item.user?.display_name ?? '', item.user?.username ?? ''),
				avatarUrl: item.clan_avatar ? item.clan_avatar : (item?.user?.avatar_url ?? ''),
				username: item.user?.username,
			})) ?? [];
		const hardcodedUser: MentionDataProps = {
			id: ID_MENTION_HERE,
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
		const roleMentions =
			rolesInClan?.map((item: ApiRole) => ({
				id: item.id ?? '',
				display: item.title,
				avatarUrl: '',
				clanNick: item.title,
			})) ?? [];

		if (channelMode === ChannelStreamMode.STREAM_MODE_CHANNEL) {
			return [...sortedMentionList, ...roleMentions, hardcodedUser];
		} else {
			return [...sortedMentionList];
		}
	}, [channelMode, members]);

	return newUserMentionList;
}

export default UserMentionList;
