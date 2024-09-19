import {
	ChannelMembersEntity,
	selectAllChannelMembers,
	selectAllUserClans,
	selectCurrentChannelId,
	selectDmGroupCurrentId,
	useAppSelector,
	UsersClanEntity
} from '@mezon/store';
import { ChannelStreamMode } from 'mezon-js/client';
import { useSelector } from 'react-redux';

type IMentionUser = {
	tagName: string;
	roleId: string;
	tagUserId: string;
	mode: number;
};
export const MentionUser = ({ tagName, tagUserId, roleId, mode }: IMentionUser) => {
	const usersClan = useAppSelector(selectAllUserClans);
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentDmGroupId = useSelector(selectDmGroupCurrentId);
	const usersInChannel = useAppSelector((state) => selectAllChannelMembers(state, currentDmGroupId || (currentChannelId as string)));

	if (roleId) {
		return `[${tagName}](@role${roleId})`;
	}

	if (tagName?.includes('here')) {
		return `[@here](@here)`;
	}

	const getUserMention = (mode: number, usersInChannel: ChannelMembersEntity[], usersClan: UsersClanEntity[]) => {
		if (mode === ChannelStreamMode.STREAM_MODE_DM || mode === ChannelStreamMode.STREAM_MODE_GROUP) {
			return usersInChannel?.find((channelUser) => channelUser?.user?.id === tagUserId);
		}

		return usersClan?.find((userClan) => userClan?.user?.id === tagUserId);
	};
	const userMention = getUserMention(mode, usersInChannel, usersClan);
	const { user } = userMention || {};

	if (user) {
		return userMention?.user ? `[${tagName}](@${user?.username})` : `@[${user?.username}](@${user?.username})`;
	}

	return tagName;
};
