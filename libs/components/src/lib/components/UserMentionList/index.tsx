import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity, selectAllRolesClan } from '@mezon/store';
import { MentionDataProps } from '@mezon/utils';
import { ChannelStreamMode } from 'mezon-js';
import { ApiRole } from 'mezon-js/api.gen';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

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
		const roleMentions =
			rolesInClan?.map((item: ApiRole) => ({
				id: item.id ?? '',
				display: item.title,
				avatarUrl: '',
				clanNick: item.title,
			})) ?? [];

		if (channelMode === ChannelStreamMode.STREAM_MODE_CHANNEL) {
			return [...sortedMentionList];
		} else {
			return [...sortedMentionList, ...roleMentions, hardcodedUser];
		}
	}, [channelMode, members]);

	return newUserMentionList;
}

export default UserMentionList;
