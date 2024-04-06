import { useChannelMembers } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { MentionData } from '@draft-js-plugins/mention';

function UserMentionList(channelID : string) {
	const { members } = useChannelMembers({ channelId : channelID });
	const userMentionRaw = members[0].users;
	const newUserMentionList: MentionData[] = userMentionRaw?.map((item: ChannelMembersEntity) => ({
		avatar: item?.user?.avatar_url ?? '',
		name: item?.user?.username ?? '',
		id: item?.user?.id ?? '',
	}));
	return newUserMentionList;
}

export default UserMentionList;
