import { useUserMetaById } from '@mezon/core';
import { ChannelMembersEntity, selectAccountCustomStatus, selectAllAccount, selectMemberCustomStatusById, useAppSelector } from '@mezon/store';
import { MemberProfileType } from '@mezon/utils';
import { useSelector } from 'react-redux';
import { useMemberContextMenu } from '../../contexts';
import { DataMemberCreate } from '../DmList/MemberListGroupChat';
import { BaseMemberProfile } from '../MemberProfile/MemberProfile2';
import AddedByUser from './AddedByUser';
export type MemberItemProps = {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
	isMobile?: boolean;
	positionType?: MemberProfileType;
	dataMemberCreate?: DataMemberCreate;
	directMessageId?: string;
	name?: string;
	isDM: boolean;
};

function MemberItem({ user, directMessageId, isDM }: MemberItemProps) {
	const userCustomStatus = useAppSelector((state) => selectMemberCustomStatusById(state, user.user?.id || '', isDM));
	const userProfile = useSelector(selectAllAccount);
	const currentUserCustomStatus = useSelector(selectAccountCustomStatus);
	const userMetaById = useUserMetaById(user.user?.id);

	const { openProfileItem, setCurrentUser } = useMemberContextMenu();

	return (
		<div>
			<BaseMemberProfile id={user?.user?.id || ''} userDM={user} isDM={true} />
			<AddedByUser groupId={directMessageId || ''} userId={user?.id} />
		</div>
	);
}

export default MemberItem;
