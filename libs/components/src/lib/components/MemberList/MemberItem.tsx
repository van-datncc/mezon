import { useMemberCustomStatus, useMemberStatus } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { MemberProfileType } from '@mezon/utils';
import { DataMemberCreate } from '../DmList/MemberListGroupChat';
import MemberProfile from '../MemberProfile';
export type MemberItemProps = {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
	positionType?: MemberProfileType;
	dataMemberCreate?: DataMemberCreate;
};

function MemberItem({ user, listProfile, isOffline, positionType, dataMemberCreate }: MemberItemProps) {
	const userStatus = useMemberStatus(user.user?.id || '');
	const userCustomStatus = useMemberCustomStatus(user.user?.id || '');

	return (
		<MemberProfile
			numberCharacterCollapse={30}
			avatar={user.clan_avatar ? user.clan_avatar : (user?.user?.avatar_url ?? '')}
			name={
				positionType === MemberProfileType.DM_MEMBER_GROUP
					? user?.user?.display_name || ''
					: user.clan_nick || user?.user?.display_name || user?.user?.username || ''
			}
			userNameAva={user?.user?.username}
			status={userStatus}
			customStatus={userCustomStatus}
			isHideStatus={true}
			isHideIconStatus={userStatus ? false : true}
			textColor="[#AEAEAE]"
			user={user}
			listProfile={listProfile}
			isOffline={isOffline}
			positionType={positionType}
			dataMemberCreate={dataMemberCreate}
		/>
	);
}

export default MemberItem;
