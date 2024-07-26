import {
	ChannelMembersEntity,
	UsersClanEntity,
	selectAllChannelMembers,
	selectAllUserClanProfile,
	selectAllUsesClan,
	selectCurrentClanId,
} from '@mezon/store';
import { useSelector } from 'react-redux';

type IMentionUser = {
	tagName: string;
	mode: number;
};
export const MentionUser = ({ tagName, mode }: IMentionUser) => {
	const usersClan = useSelector(selectAllUsesClan);
	const usersInChannel = useSelector(selectAllChannelMembers);
	const clansProfile = useSelector(selectAllUserClanProfile);
	const currentClanId = useSelector(selectCurrentClanId);

	const getUserMention = (nameMention: string, mode: number, usersInChannel: ChannelMembersEntity[], usersClan: UsersClanEntity[]) => {
		if (mode === 4 || mode === 3) {
			return usersInChannel?.find((channelUser) => channelUser?.user?.username === nameMention);
		} else {
			return usersClan?.find((userClan) => userClan?.user?.username === nameMention);
		}
	};

	const userMention = getUserMention(tagName?.substring(1), mode, usersInChannel, usersClan);
	const { user } = userMention || {};

	const clanProfileByIdUser = clansProfile?.find((clanProfile) => clanProfile?.clan_id === currentClanId && clanProfile?.user_id === user?.id);

	if (tagName === '@here') {
		return `[@here](@here)`;
	}

	if (clanProfileByIdUser) {
		return `[@${clanProfileByIdUser?.nick_name}](@${user?.username})`;
	}

	if (userMention) {
		return user?.display_name ? `[@${user?.display_name}](@${user?.username})` : `@[${user?.username}](@${user?.username})`;
	}
};
