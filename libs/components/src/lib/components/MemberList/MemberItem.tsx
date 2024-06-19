import { useClans, useMemberStatus } from '@mezon/core';
import { ChannelMembersEntity, selectUserClanProfileByClanID } from '@mezon/store';
import { useSelector } from 'react-redux';
import MemberProfile from '../MemberProfile';
export type MemberItemProps = {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
};

function MemberItem({ user, listProfile, isOffline }: MemberItemProps) {
	const userStatus = useMemberStatus(user.user?.id || '');
	const { currentClan } = useClans();
	const clanProfile = useSelector(selectUserClanProfileByClanID(currentClan?.clan_id as string, user?.user?.id as string));

	return (
		<MemberProfile
			numberCharacterCollapse={30}
			avatar={user?.user?.avatar_url ?? ''}
			name={clanProfile?.nick_name || user?.user?.username || ''}
			status={userStatus}
			isHideStatus={true}
			isHideIconStatus={userStatus ? false : true}
			textColor="[#AEAEAE]"
			user={user}
			listProfile={listProfile}
			isOffline={isOffline}
		/>
	);
}

export default MemberItem;
