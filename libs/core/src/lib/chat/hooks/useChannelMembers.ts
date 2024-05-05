import { ChannelMembersEntity, selectMemberByUserId, selectMemberStatus, selectMembersByChannelId } from '@mezon/store';
import { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { useAuth } from '../../auth/hooks/useAuth';

export type useChannelMembersOptions = {
	channelId?: string | null;
};

export function useChannelMembers({ channelId }: useChannelMembersOptions = {}) {
	const rawMembers = useSelector(selectMembersByChannelId(channelId));
	const onlineStatus = useSelector(selectMemberStatus);

	const { userId } = useAuth();
	const userProfile = useSelector(selectMemberByUserId(userId as string));

	const onlineMembers = useMemo(() => {
		const listMembers = rawMembers.filter((member) => member.user?.online === true && onlineStatus[member.user.id ?? ''] === true);

		const isProfile = listMembers.find((member) => member.user?.id === userProfile?.user?.id);

		if (userProfile && !isProfile) {
			listMembers.push(userProfile);
		}
		return listMembers;
	}, [onlineStatus, rawMembers, userProfile]);

	const offlineMembers = useMemo(() => {
		const listMembers = rawMembers.filter((member) => !onlineMembers.some((memberOnline) => member.user?.id === memberOnline.user?.id));
		return listMembers;
	}, [onlineMembers, rawMembers]);

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

	return {
		members,
		rawMembers,
		onlineMembers,
		offlineMembers,
	};
}
