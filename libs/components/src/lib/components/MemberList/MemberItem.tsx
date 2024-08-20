import { useMemberCustomStatus, useMemberStatus } from '@mezon/core';
import { ChannelMembersEntity } from '@mezon/store';
import { getNameForPrioritize, MemberProfileType } from '@mezon/utils';
import { DataMemberCreate } from '../DmList/MemberListGroupChat';
import MemberProfile from '../MemberProfile';
export type MemberItemProps = {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
	positionType?: MemberProfileType;
	dataMemberCreate?: DataMemberCreate;
	directMessageId?: string;
	name?: string;
};

function MemberItem({ user, listProfile, isOffline, positionType, dataMemberCreate, directMessageId }: MemberItemProps) {
	const userStatus = useMemberStatus(user.user?.id || '');
	const userCustomStatus = useMemberCustomStatus(user.user?.id || '');
	const name = getNameForPrioritize(user.clan_nick, user.user?.display_name, user.user?.username);

	return (
		<MemberProfile
			numberCharacterCollapse={30}
			avatar={user.clan_avatar ? user.clan_avatar : (user?.user?.avatar_url ?? '')}
			name={name || ''}
			userNameAva={user?.user?.username}
			status={userStatus}
			customStatus={userCustomStatus}
			isHideStatus={true}
			isHideIconStatus={false}
			textColor="[#AEAEAE]"
			user={user}
			listProfile={listProfile}
			isOffline={isOffline}
			positionType={positionType}
			dataMemberCreate={dataMemberCreate}
			hideLongName={true}
		/>
	);
}

export default MemberItem;
