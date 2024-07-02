import { Icons } from '@mezon/components';
import { channelUsersActions, selectAllAccount, selectMembersByChannelId, useAppDispatch } from '@mezon/store';
import { IChannel } from '@mezon/utils';
import { useCallback, useLayoutEffect, useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
type ListMemberPermissionProps = {
	channel: IChannel;
	selectedUserIds: string[];
};

const ListMemberPermission = (props: ListMemberPermissionProps) => {
	const { channel } = props;
	const dispatch = useAppDispatch();
	const userProfile = useSelector(selectAllAccount);
	const rawMembers = useSelector(selectMembersByChannelId(channel.id));
	const [memberList, setMemberList] = useState<any[]>();

	const checkOwner = useCallback((userId: string) => userId === userProfile?.user?.google_id, [userProfile?.user?.google_id]);

	const deleteMember = async (userId: string) => {
		if (userId !== userProfile?.user?.id) {
			const body = {
				channelId: channel.id,
				userId: userId,
			};
			await dispatch(channelUsersActions.removeChannelUsers(body));
		}
	};

	const listMembersInChannel = () => {
		if (channel.channel_private === 0 || channel.channel_private === undefined) {
			const filteredMembers = rawMembers.filter((member) => 
            member.user && member.user.id && props.selectedUserIds.includes(member.user.id)
        );
		return filteredMembers.map((member) => member.user);
		}
		const filteredMembers = rawMembers.filter((member) => member.userChannelId !== '0');
		return filteredMembers.map((member) => member.user);
	};

	useLayoutEffect(() => {
		if (rawMembers) {
			listMembersInChannel();
			setMemberList(listMembersInChannel());
		}
	}, [rawMembers.length, props.selectedUserIds]);

	return memberList?.map((user) => (
		<div className={`flex justify-between py-2 rounded`} key={user?.id}>
			<div className="flex gap-x-2 items-center">
				<img src={user?.avatar_url} alt={user?.display_name} className="size-6 object-cover rounded-full" />
				<p className="text-sm">{user?.display_name}</p>
			</div>
			<div className="flex items-center gap-x-2">
				<p className="text-xs text-[#AEAEAE]">{checkOwner(user?.google_id || '') ? 'Clan Owner' : ''}</p>
				<div onClick={() => deleteMember(user?.id || '')} role="button">
					<Icons.EscIcon
						defaultSize={`${checkOwner(user?.google_id || '') ? '' : 'cursor-pointer'} size-[15px]`}
						defaultFill={`${checkOwner(user?.google_id || '') ? '#4C4D55' : '#AEAEAE'}`}
					/>
				</div>
			</div>
		</div>
	));
};

export default ListMemberPermission;