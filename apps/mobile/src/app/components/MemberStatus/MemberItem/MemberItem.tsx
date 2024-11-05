import { useMemberStatus } from '@mezon/core';
import {
	ChannelMembersEntity,
	DirectEntity,
	selectClanMemberMetaUserId,
	selectCurrentClan,
	selectMemberClanByUserId2,
	selectUserClanProfileByClanID,
	useAppSelector
} from '@mezon/store-mobile';
import { IChannel } from '@mezon/utils';
import { memo } from 'react';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';
import { MemberProfile } from '../MemberProfile';

interface IProps {
	user: ChannelMembersEntity;
	listProfile?: boolean;
	isOffline?: boolean;
	onPress?: (user: ChannelMembersEntity) => void;
	currentChannel?: IChannel | DirectEntity;
	isDMThread?: boolean;
}

type MemberItemProps = {
	id: string;
	isDMThread?: boolean;
	onPress?: (user: ChannelMembersEntity) => void;
	currentChannel?: IChannel | DirectEntity;
};

export const MemoizedMemberItem = memo((props: MemberItemProps) => {
	const { id, ...rest } = props;

	const user = useAppSelector((state) => selectMemberClanByUserId2(state, id));
	const userMeta = useAppSelector((state) => selectClanMemberMetaUserId(state, id));

	return <MemberItem {...rest} user={user} listProfile={true} isOffline={!userMeta?.online} />;
});

export function MemberItem({ user, isOffline, onPress, currentChannel, isDMThread }: IProps) {
	const userStatus = useMemberStatus(user?.id || '');
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
				user={user}
				status={userStatus.status}
				numCharCollapse={30}
				isHideIconStatus={userStatus ? false : true}
				isOffline={isOffline}
				nickName={clanProfile?.nick_name}
				creatorClanId={currentClan?.creator_id}
				creatorDMId={currentChannel?.creator_id}
				isDMThread={isDMThread}
			/>
		</TouchableOpacity>
	);
}
