import {
	ChannelMembersEntity,
	selectAccountCustomStatus,
	selectDirectMemberMetaUserId,
	selectMemberCustomStatusById,
	useAppSelector
} from '@mezon/store';
import { useSelector } from 'react-redux';
import { BaseMemberProfile } from '../MemberProfile/MemberProfile';
import AddedByUser from './AddedByUser';
export type MemberItemProps = {
	user: ChannelMembersEntity;

	directMessageId?: string;
	isMobile?: boolean;
	isDM?: boolean;
	isMe?: boolean;
};

function MemberItem({ user, directMessageId, isDM = true, isMe }: MemberItemProps) {
	const userCustomStatus = useAppSelector((state) => selectMemberCustomStatusById(state, user?.user?.id || '', isDM));
	const userMetaById = useAppSelector((state) => selectDirectMemberMetaUserId(state, user?.user?.id || ''));
	const currentUserCustomStatus = useSelector(selectAccountCustomStatus);

	return (
		<div>
			<BaseMemberProfile
				id={user?.user?.id || ''}
				user={user}
				avatar={user.user?.avatar_url || ''}
				username={user.user?.display_name || user.user?.avatar_url || ''}
				userMeta={{
					online: !!userMetaById?.user?.online || !!isMe,
					status: userMetaById?.user?.metadata?.status
				}}
				userStatus={isMe ? currentUserCustomStatus : userCustomStatus}
			/>
			<AddedByUser groupId={directMessageId || ''} userId={user?.id} />
		</div>
	);
}

export default MemberItem;
