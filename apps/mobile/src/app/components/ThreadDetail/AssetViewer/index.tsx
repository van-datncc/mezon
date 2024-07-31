import { useAuth, useChannels, useFriends } from '@mezon/core';
import { selectAllDirectMessages, selectAllUsesClan, selectCurrentChannelId } from '@mezon/store-mobile';
import { removeDuplicatesById } from '@mezon/utils';
import { ChannelType } from 'mezon-js';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dimensions, NativeScrollEvent, NativeSyntheticEvent, ScrollView, Text, View } from 'react-native';
import { useSelector } from 'react-redux';
import ChannelsSearchTab from '../../ChannelsSearchTab';
import MediaChannel from '../../MediaChannel';
import { MemberListStatus } from '../../MemberStatus';
import MembersSearchTab from '../../MembersSearchTab';
import PinMessage from '../../PinMessage';
import AssetsHeader from '../AssetsHeader';
import { threadDetailContext } from '../MenuThreadDetail';
import styles from './style';
import { useTranslation } from 'react-i18next';

enum EPageID {
	Members,
	MembersSearch,
	Channels,
	Media,
	Pins,
	Links,
	Files,
}

export const AssetsViewer = React.memo(({ isSearchMessageChannel, searchText }: { isSearchMessageChannel: boolean; searchText: string }) => {
	const { listChannels } = useChannels();
	const [pageID, setPageID] = useState<number>(EPageID.Members);
  const { t } = useTranslation(['searchMessageChannel']);
	const ref = useRef<ScrollView>();
	const currentChannelId = useSelector(selectCurrentChannelId);
	const currentChannel = useContext(threadDetailContext);
	const dmGroupChatList = useSelector(selectAllDirectMessages);
	const listDM = dmGroupChatList.filter((groupChat) => groupChat.type === 3 && groupChat.channel_avatar);
	const { friends } = useFriends();
	const usersClan = useSelector(selectAllUsesClan);
	const { userProfile } = useAuth();
	const accountId = userProfile?.user?.id ?? '';

	function handleScroll(event: NativeSyntheticEvent<NativeScrollEvent>) {
		const currentOffsetX = event.nativeEvent.contentOffset.x;
		const windowWidth = Dimensions.get('window').width;

		const pageID_ = Math.round(currentOffsetX / windowWidth);
		if (pageID !== pageID_) {
			setPageID(pageID_);
		}
	}

	function handelHeaderTabChange(index: number) {
		const windowWidth = Dimensions.get('window').width;
		ref && ref.current && ref.current.scrollTo({ x: index * windowWidth, animated: true });
	}

	useEffect(() => {
		if (isSearchMessageChannel) {
			setPageID(EPageID.MembersSearch);
			handelHeaderTabChange(EPageID.MembersSearch);
		}
	}, [isSearchMessageChannel]);

	const listChannelSearch = useMemo(() => {
		if (!searchText?.length) return listChannels;
		return listChannels
			.filter((item) => item?.channel_label?.toUpperCase()?.indexOf(searchText?.toUpperCase()) > -1)
			.slice(0, 8)
			.sort((a: any, b: any) => {
				const indexA = a?.channel_label?.toUpperCase().indexOf(searchText?.toUpperCase());
				const indexB = b?.channel_label?.toUpperCase().indexOf(searchText?.toUpperCase());
				if (indexA === -1) return 1;
				if (indexB === -1) return -1;
				return indexA - indexB;
			});
	}, [listChannels, searchText]);

	const listMember = useMemo(() => {
		const listDMSearch = listDM?.length
			? listDM.map((itemDM: any) => {
					return {
						id: itemDM?.user_id?.[0] ?? '',
						name: itemDM?.usernames ?? '',
						avatarUser: itemDM?.channel_avatar?.[0] ?? '',
						idDM: itemDM?.id ?? '',
						displayName: '',
						typeChat: 3,
						user: {
							username: itemDM?.usernames ?? '',
							avatar_url: itemDM?.channel_avatar?.[0] ?? '',
							id: itemDM?.user_id?.[0] ?? '',
						},
					};
				})
			: [];
		const listFriendsSearch = friends.length
			? friends.map((itemFriend: any) => {
					return {
						id: itemFriend?.id ?? '',
						name: itemFriend?.user.username ?? '',
						avatarUser: itemFriend?.user.avatar_url ?? '',
						displayName: itemFriend?.user.display_name ?? '',
						idDM: '',
						user: {
							username: itemFriend?.user.username ?? '',
							avatar_url: itemFriend?.user.avatar_url ?? '',
							id: itemFriend?.id ?? '',
						},
					};
				})
			: [];
		const listUserClanSearch = usersClan.length
			? usersClan.map((itemUserClan: any) => {
					return {
						id: itemUserClan?.id ?? '',
						name: itemUserClan?.user?.username ?? '',
						avatarUser: itemUserClan?.user?.avatar_url ?? '',
						idDM: '',
						user: {
							username: itemUserClan?.user?.username ?? '',
							avatar_url: itemUserClan?.user?.avatar_url ?? '',
							id: itemUserClan?.id ?? '',
						},
					};
				})
			: [];

		const friendsMap = new Map(listFriendsSearch?.map((friend) => [friend.id, friend]));
		const listSearch = [
			...listDMSearch.map((itemDM) => {
				const friend = friendsMap.get(itemDM.id);
				return friend ? { ...itemDM, displayName: friend?.displayName || itemDM?.displayName } : itemDM;
			}),
			...listUserClanSearch,
		];
		return removeDuplicatesById(listSearch?.filter((item) => item.id !== accountId));
	}, [accountId, friends, listDM, usersClan]);

	const listMemberSearch = useMemo(() => {
		return listMember
			.filter((item: any) => item?.name?.toUpperCase().indexOf(searchText?.toUpperCase()?.substring(1)) > -1)
			.sort((a: any, b: any) => {
				const indexA = a?.name?.toUpperCase().indexOf(searchText?.slice(1).toUpperCase());
				const indexB = b?.name?.toUpperCase().indexOf(searchText?.slice(1).toUpperCase());
				if (indexA === -1) return 1;
				if (indexB === -1) return -1;
				return indexA - indexB;
			});
	}, [searchText, listMember]);

	const TabList = useMemo(() => {
		return [
			{
				title: t('members'),
				numberSearch: null,
				isDisplay: !isSearchMessageChannel,
				index: EPageID.Members,
			},
			{
				title: t('members'),
				numberSearch: searchText && listMemberSearch?.length,
				isDisplay: isSearchMessageChannel,
				index: EPageID.MembersSearch,
			},
			{
				title: t('channels'),
				numberSearch: searchText && listChannelSearch?.length,
				isDisplay: isSearchMessageChannel,
				index: EPageID.Channels,
			},
			{
				title: t('media'),
				numberSearch: null,
				isDisplay: !isSearchMessageChannel,
				index: EPageID.Media,
			},
			{
				title: t('pins'),
				numberSearch: null,
				isDisplay: !isSearchMessageChannel,
				index: EPageID.Pins,
			},
		];
	}, [listChannelSearch, listMemberSearch, searchText, isSearchMessageChannel, t]);

	return (
		<>
			<AssetsHeader pageID={pageID} onChange={handelHeaderTabChange} tabList={TabList} />
			<View style={styles.container}>
				<ScrollView horizontal pagingEnabled onScroll={handleScroll} ref={ref}>
					<View style={styles.widthTab}>{pageID === EPageID.Members ? <MemberListStatus /> : null}</View>
					<View style={styles.widthTab}>
						{pageID === EPageID.MembersSearch ? <MembersSearchTab listMemberSearch={listMemberSearch} /> : null}
					</View>
					<View style={styles.widthTab}>
						{pageID === EPageID.Channels ? <ChannelsSearchTab listChannelSearch={listChannelSearch} /> : null}
					</View>
					<View style={styles.widthTab}>{pageID === EPageID.Media ? <MediaChannel /> : null}</View>
					<View style={styles.widthTab}>
						{pageID === EPageID.Pins ? (
							<PinMessage
								currentChannelId={
									[ChannelType.CHANNEL_TYPE_DM, ChannelType.CHANNEL_TYPE_GROUP].includes(currentChannel?.type)
										? currentChannel?.channel_id
										: currentChannelId
								}
							/>
						) : null}
					</View>
					<View style={styles.widthTab}>{pageID === 5 ? <Page2 /> : null}</View>
				</ScrollView>
			</View>
		</>
	);
});

// Just for testing purposes
function Page2() {
	return (
		<View style={{ width: Dimensions.get('screen').width }}>
			<Text style={{ color: 'white' }}>tab content</Text>
		</View>
	);
}
