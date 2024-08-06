import { load } from '@mezon/mobile-components';
import { ChannelMembersEntity, RolesClanEntity, UsersClanEntity } from '@mezon/store';
import { ChannelStreamMode } from 'mezon-js/client';

type IMentionUser = {
	tagName: string;
	mode: number;
	usersClan: any;
	usersInChannel: any;
	clansProfile: any;
  rolesInClan: RolesClanEntity[];
};
export const MentionUser = ({ tagName, mode, usersClan, usersInChannel, clansProfile , rolesInClan}: IMentionUser) => {
	const currentClanId = load('persist:clans').currentClanId;

	const getUserMention = (nameMention: string, mode: number, usersInChannel: ChannelMembersEntity[], usersClan: UsersClanEntity[]) => {
		if (mode === ChannelStreamMode.STREAM_MODE_DM || mode === ChannelStreamMode.STREAM_MODE_GROUP) {
			return usersInChannel?.find((channelUser) => channelUser?.user?.username === nameMention);
		}

		return usersClan?.find((userClan) => userClan?.user?.username === nameMention);
	};

	const userMention = getUserMention(tagName?.substring(1), mode, usersInChannel, usersClan);
	const { user } = userMention || {};
  const roleList = rolesInClan?.map((item) => ({
    roleId: item.id ?? '',
    roleName: item.title ?? '',
  }));

	const clanProfileByIdUser = clansProfile?.find((clanProfile) => clanProfile?.clan_id === currentClanId && clanProfile?.user_id === user?.id);

  const roleMentionUser = roleList?.find((role) => `@${role.roleName}` === tagName);
  if(roleMentionUser) {
    return `[@${roleMentionUser?.roleName}](@role${roleMentionUser?.roleId})`;
  }

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
