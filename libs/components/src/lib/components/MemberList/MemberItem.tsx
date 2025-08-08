import { ChannelMembersEntity, selectDirectMemberMetaUserId, selectMemberCustomStatusById, useAppSelector } from '@mezon/store';
import { BaseMemberProfile } from '../MemberProfile/MemberProfile';
import AddedByUser from './AddedByUser';
export type MemberItemProps = {
	user: ChannelMembersEntity;

	directMessageId?: string;
	isMobile?: boolean;
	isDM?: boolean;
	index: number;
};

function MemberItem({ user, directMessageId, isDM = true, index }: MemberItemProps) {
	const userCustomStatus = useAppSelector((state) => selectMemberCustomStatusById(state, user.user?.id || '', isDM));
	const userMetaById = useAppSelector((state) => selectDirectMemberMetaUserId(state, user.user?.id || ''));

	return (
		<div>
			<BaseMemberProfile
				id={user?.user?.id || ''}
				user={user}
				avatar={user.user?.avatar_url || ''}
				username={user.user?.display_name || user.user?.avatar_url || ''}
				userMeta={{
					online: !!userMetaById.user?.online,
					status: userMetaById.user?.metadata?.status
				}}
				userStatus={userCustomStatus}
			/>
			<AddedByUser groupId={directMessageId || ''} userId={user?.id} />
		</div>
	);
}

export default MemberItem;
