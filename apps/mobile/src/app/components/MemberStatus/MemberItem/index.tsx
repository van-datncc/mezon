import { useMemberStatus } from '@mezon/core';
import { ChannelMembersEntity, selectCurrentClan, selectUserClanProfileByClanID } from '@mezon/store-mobile';
import { TouchableOpacity } from 'react-native-gesture-handler';
import MemberProfile from '../MemberProfile';
import { useSelector } from 'react-redux';

interface IProps {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
	onPress?: (user: ChannelMembersEntity) => void;
}

export default function MemberItem({ user, isOffline, onPress }: IProps) {
	const userStatus = useMemberStatus(user?.user?.id || '');
  const currentClan = useSelector(selectCurrentClan);
  const clanProfile = useSelector(selectUserClanProfileByClanID(currentClan?.clan_id as string, user?.user?.id as string));
	return (
		<TouchableOpacity
			activeOpacity={0.8}
			onPress={() => {
				onPress(user);
			}}
		>
			<MemberProfile
      user={user} status={userStatus}
      numCharCollapse={30}
      isHideIconStatus={userStatus ? false : true}
      isOffline={isOffline}
      nickName={clanProfile?.nick_name}
      />
		</TouchableOpacity>
	);
}
