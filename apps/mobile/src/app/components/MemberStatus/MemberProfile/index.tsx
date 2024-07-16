import { OfflineStatus, OnlineStatus, OwnerIcon } from '@mezon/mobile-components';
import { ChannelMembersEntity } from '@mezon/utils';
import { useMemo } from 'react';
import { Image, Text, View } from 'react-native';
import style from './style';
interface IProps {
	user: ChannelMembersEntity;
	status?: boolean;
	numCharCollapse?: number;
	isHideIconStatus?: boolean;
	isHideUserName?: boolean;
	isOffline?: boolean;
	nickName?: string;
	creatorClanId?: string;
	creatorDMId?: string;
	isDMThread?: boolean;
}

export default function MemberProfile({
	user,
	status,
	isHideIconStatus,
	isHideUserName,
	numCharCollapse = 6,
	isOffline,
	nickName,
	creatorClanId,
	creatorDMId,
	isDMThread,
}: IProps) {
	const name = useMemo(() => {
		if (user) {
			return nickName || user?.user?.display_name || user?.user?.username;
		}
	}, [user]);
	return (
		<View style={{ ...style.container, opacity: isOffline ? 0.5 : 1 }}>
			{/* Avatar */}
			<View style={{ padding: 0 }}>
				<View style={style.avatarContainer}>
					<Image style={style.avatar} source={{ uri: user?.user?.avatar_url }} />

					{!isHideIconStatus && <View style={style.statusWrapper}>{status ? <OnlineStatus /> : <OfflineStatus />}</View>}
				</View>
			</View>

			{/* Name */}
			<View style={{ ...style.nameContainer, borderBottomWidth: 1 }}>
				{!isHideUserName && (
					<Text style={style.textName}>
						{user?.user?.username?.length > numCharCollapse ? `${name.substring(0, numCharCollapse)}...` : name}
					</Text>
				)}
			</View>
			{(isDMThread ? creatorDMId : creatorClanId) === user?.user?.id && <OwnerIcon width={16} height={16} />}
		</View>
	);
}
