import { ChannelMembersEntity, selectMemberChannels, selectMembersByChannelId } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';

export type useChannelMembersOptions = {
	channelId?: string | null;
};

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
	const rawMembers = useSelector(selectMembersByChannelId(channelId));
	const memberChannels = useSelector(selectMemberChannels);

	const members = useMemo(() => {
		if (!rawMembers) {
			return [];
		}
		const roles = [
			{
				id: '',
				title: '',
			},
		];

		return roles.map((role) => {
			const categoryChannels = rawMembers.filter(
				//   (member) => member && member?.role_id === role.id
				(member) => member,
			) as ChannelMembersEntity[];
			return {
				...role,
				users: categoryChannels,
			};
		});
	}, [rawMembers]);

	const groupMembers = memberChannels?.slice(0, 5);

	const remainingMember = memberChannels?.slice(5);

	return {
		members,
		groupMembers,
		remainingMember,
	};
}
