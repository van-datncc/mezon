import { size, useTheme } from '@mezon/mobile-ui';
import { ChannelMembersEntity, getStore, selectClanMemberMetaUserId } from '@mezon/store-mobile';
import { FlashList } from '@shopify/flash-list';
import { User } from 'mezon-js';
import { useCallback, useState } from 'react';
import { Keyboard, View } from 'react-native';
import { EmptySearchPage } from '../EmptySearchPage';
import { MemberItem } from '../MemberStatus/MemberItem';
import { UserInformationBottomSheet } from '../UserInformationBottomSheet';
import style from './MembersSearchTab.styles';

type MembersSearchTabProps = {
	listMemberSearch: any;
};
const MembersSearchTab = ({ listMemberSearch }: MembersSearchTabProps) => {
	const [selectedUser, setSelectedUser] = useState<ChannelMembersEntity | null>(null);
	const { themeValue } = useTheme();
	const styles = style(themeValue);
	const handleCloseUserInfoBS = () => {
		setSelectedUser(null);
	};
	const store = getStore();

	const onDetailMember = useCallback((user: ChannelMembersEntity) => {
		setSelectedUser(user);
	}, []);

	const renderItem = useCallback(
		({ item, index }) => {
			const userMeta = selectClanMemberMetaUserId(store.getState(), item.id);
			const user = {
				...item,
				metadata: {
					user_status: userMeta?.status
				}
			};
			return (
				<MemberItem
					onPress={onDetailMember}
					isHiddenStatus={!userMeta}
					isOffline={!userMeta?.online}
					user={user}
					key={`${item?.['id']}_member_search_${index}}`}
				/>
			);
		},
		[store]
	);
	return (
		<View style={[styles.container, { backgroundColor: listMemberSearch?.length > 0 ? themeValue.primary : themeValue.secondary }]}>
			{listMemberSearch?.length > 0 ? (
				<View style={styles.boxMembers}>
					<FlashList
						showsVerticalScrollIndicator={false}
						data={listMemberSearch}
						keyboardShouldPersistTaps={'handled'}
						onScrollBeginDrag={Keyboard.dismiss}
						renderItem={renderItem}
						estimatedItemSize={size.s_60}
						removeClippedSubviews={true}
					/>
				</View>
			) : (
				<EmptySearchPage />
			)}
			<UserInformationBottomSheet
				user={(selectedUser?.user || selectedUser) as User}
				userId={selectedUser?.user?.id || selectedUser?.id}
				onClose={handleCloseUserInfoBS}
			/>
		</View>
	);
};

export default MembersSearchTab;
