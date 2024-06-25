import { useChannelMembers } from '@mezon/core';
import { AddMemberIcon, AngleRightIcon } from '@mezon/mobile-components';
import { ChannelMembersEntity } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import { useCallback, useContext, useMemo, useRef, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import { InviteToChannel } from '../../screens/home/homedrawer/components/InviteToChannel';
import { threadDetailContext } from '../ThreadDetail/MenuThreadDetail';
import { UserInformationBottomSheet } from '../UserInformationBottomSheet';
import MemberItem from './MemberItem';
import style from './style';

enum EActionButton {
	AddMembers = 'Add Members',
	InviteMembers = 'Invite Members',
}

export default function MemberListStatus() {
	const currentChannel = useContext(threadDetailContext);
	const { onlineMembers, offlineMembers } = useChannelMembers({ channelId: currentChannel?.id });
	const [selectedUser, setSelectedUser] = useState<ChannelMembersEntity | null>(null);
	const bottomSheetRef = useRef(null);

	const isDMThread = useMemo(() => {
		return [ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type);
	}, [currentChannel]);
	const handleAddOrInviteMembers = useCallback((action: EActionButton) => {
		if (action === EActionButton.InviteMembers) bottomSheetRef?.current?.open();
	}, []);

	return (
		<ScrollView contentContainerStyle={style.container}>
			{currentChannel?.channel_avatar?.length !== 1 ? (
				<Pressable
					onPress={() => {
						handleAddOrInviteMembers(isDMThread ? EActionButton.AddMembers : EActionButton.InviteMembers);
					}}
				>
					<View style={style.inviteBtn}>
						<View style={style.iconNameWrapper}>
							<View style={style.iconWrapper}>
								<AddMemberIcon height={16} width={16} />
							</View>
							<Text style={style.text}>{isDMThread ? EActionButton.AddMembers : EActionButton.InviteMembers}</Text>
						</View>
						<View>
							<AngleRightIcon height={22} width={22} />
						</View>
					</View>
				</Pressable>
			) : null}

			<View>
				{onlineMembers.length > 0 && (
					<View>
						<Text style={style.text}>Member - {onlineMembers.length}</Text>
						<View style={style.box}>
							{onlineMembers.map((user) => (
								<MemberItem
									onPress={(user) => {
										setSelectedUser(user);
									}}
									user={user}
									key={user?.user?.id}
								/>
							))}
						</View>
					</View>
				)}
				{offlineMembers.length > 0 && (
					<View style={{ marginTop: 20 }}>
						<Text style={style.text}>Offline - {offlineMembers.length}</Text>
						<View style={style.box}>
							{offlineMembers.map((user) => (
								<MemberItem
									key={user.id}
									user={user}
									isOffline={true}
									onPress={(user) => {
										setSelectedUser(user);
									}}
								/>
							))}
						</View>
					</View>
				)}
			</View>
			<UserInformationBottomSheet userId={selectedUser?.user?.id} onClose={() => setSelectedUser(null)} />
			<InviteToChannel isUnknownChannel={false} ref={bottomSheetRef} />
		</ScrollView>
	);
}
